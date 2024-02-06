<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\PasswordResource;
use App\Models\Group;
use App\Models\Password;
use Illuminate\Http\Request;
use App\Services\PasswordService;
use Mockery\Exception;

/**
 * Class PasswordController
 *
 * @package App\Http\Controllers
 *
 * Controller handling operations related to passwords and their permissions.
 */
class PasswordController extends Controller
{
  /**
   * @var PasswordService $passwordService The service responsible for password-related operations.
   */
  private PasswordService $passwordService;

  /**
   * PasswordController constructor.
   *
   * @param PasswordService $passwordService The injected PasswordService instance.
   */
  public function __construct(PasswordService $passwordService)
  {
    $this->passwordService = $passwordService;
    $this->authorizeResource(Password::class, 'password');
  }

  /**
   * Display a listing of the resource.
   *
   * If the user is an admin, return all passwords. For other users, return only
   * their permitted passwords (with permitted=1).
   *
   * @return array An array containing the data of passwords and groups for the user.
   */
  public function index()
  {
    if(auth()->user()->hasRole('admin')){
      $passwordsData = Password::with(['users' => function ($query) {
        $query->select('users.id', 'users.name', 'password_user.owner', 'password_user.permitted');
      }])->get();

      $passwords = [];

      foreach ($passwordsData as $password) {
        $usersData = $password->users->map(function ($user) {
          return [
            'id' => $user->id,
            'name' => $user->name,
            'owner' => $user->owner,
            'permitted' => $user->permitted
          ];
        });

        $passwords[] = [
          'id' => $password->id,
          'name' => $password->name,
          'password' => $password->password,
          'description' => $password->description,
          'users' => $usersData->toArray()
        ];
      }

      return ['data' => compact('passwords')];
    } else {
      $loggedInUser  = auth()->user();

      $groups = Group::whereHas('users', function ($query) use ($loggedInUser) {
        $query->where('user_id', $loggedInUser->id)
          ->where('permitted', true);
      })
        ->with(['passwords' => function ($query) use ($loggedInUser) {
          $query->whereHas('users', function ($query) use ($loggedInUser) {
            $query->where('user_id', $loggedInUser->id)
              ->where('permitted', true);
          })
            ->with(['users' => function ($query) use ($loggedInUser) {
              $query->where('user_id', $loggedInUser->id)
                ->withPivot('owner');
            }]);
        }])
        ->get();

      $groups = $groups->makeHidden(['created_at', 'updated_at']);

      $groups = $groups->map(function ($group) {
        $group->passwords = $group->passwords->map(function ($password) {
          $password->owner = $password->users->first()->pivot->owner;
          return $password->makeHidden(['created_at', 'updated_at', 'pivot', 'users']);
        });
        return $group;
      });

      $passwords = Password::whereHas('users', function($query) use ($loggedInUser) {
        $query->where('user_id', $loggedInUser->id)
          ->where('permitted', true);
      })->with(['users' => function($query) use ($loggedInUser){
        $query->where('user_id', $loggedInUser->id)
          ->withPivot('owner');
      }])
        ->whereDoesntHave('groups', function($query) use ($loggedInUser) {
          $query->whereDoesntHave('users', function ($query) use ($loggedInUser) {
            $query->where('user_id', '!=', $loggedInUser->id);
          });
        })
        ->get();

      $passwords = $passwords->makeHidden(['created_at', 'updated_at', 'users']);

      $passwords = $passwords->map(function ($password) {
        $password->users = $password->users->map(function ($user) use ($password) {
          $password->owner = $user->pivot->owner;
          return $user->makeHidden(['created_at', 'updated_at', 'pivot', 'users']);
        });
        return $password;
      });

      return ['data' => compact(['groups', 'passwords'])];
    }
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param Request $request The HTTP request instance.
   */
  public function store(Request $request)
  {
    //
  }

  /**
   * Display the specified resource.
   *
   * @param Password $password The password instance.
   * @return PasswordResource The resource representing the specified password.
   */
  public function show(Password $password)
  {
    return new PasswordResource($password);
  }

  /**
   * Update the specified password in storage.
   *
   * @param Request $request The HTTP request instance containing the updated password data.
   * @param Password $password The password instance to be updated.
   */
  public function update(Request $request, Password $password)
  {
    //
  }

  /**
   * Remove the specified password from storage.
   *
   * @param Password $password The password instance to be deleted.
   */
  public function destroy(Password $password)
  {
    //
  }

  /**
   * Toggle the status of a password for a given user.
   *
   * @return array An array containing the updated password status data.
   */
  public function togglePasswordStatus(){
    $passwordId = request()->route('passwordId');
    $userId = request()->route('userId');
    $permitted = request('permitted');
    $userWithPivot = $this->passwordService->getUserWithPivotByPasswordIdAndUserId($passwordId, $userId);

    if(!$userWithPivot->isEmpty()){
      $password = Password::find($passwordId);

      $updatedRowsNumber = $password->users()->updateExistingPivot($userId, [
        'permitted' => $permitted
      ]);

      if($updatedRowsNumber){
        return ['data' => [
          'password_id' => $userWithPivot[0]->pivot->password_id,
          'user_id' => $userWithPivot[0]->pivot->user_id,
          'permitted' => $permitted
        ]];
      }
    }

    return ['data' => []];
  }

  /**
   * Change the group of a password.
   *
   * @return array An array containing a success message.
   * @throws Exception If an unexpected error occurs.
   */
  public function changePasswordGroup(){
    $passwordId = request('password_id');
    $fromGroupId = request('from_group_id');
    $toGroupId = request('to_group_id');

    if(isset($passwordId)){
      $password = Password::findOrFail($passwordId);
    } else {
      throw new Exception('Unexpected error occurred');
    }

    $this->authorize('changePasswordGroup', [$password, $fromGroupId, $toGroupId]);

    if(isset($fromGroupId) && isset($toGroupId)){
      $password->groups()->detach($fromGroupId);
      $password->groups()->attach($toGroupId);
    } else if(isset($fromGroupId) && !isset($toGroupId)){
      $password->groups()->detach();
    } else if(!isset($fromGroupId) && isset($toGroupId)){
      $password->groups()->attach($toGroupId);
    }

    return ['data' => [
      'message' => 'success'
    ]];
  }
}
