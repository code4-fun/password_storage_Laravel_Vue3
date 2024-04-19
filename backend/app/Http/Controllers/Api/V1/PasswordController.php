<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\PasswordRequest;
use App\Http\Resources\V1\PasswordResource;
use App\Models\Group;
use App\Models\Password;
use \Illuminate\Http\JsonResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use App\Services\PasswordService;
use Illuminate\Support\Facades\DB;
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
   * If the authenticated user is an admin, retrieves all passwords with associated users.
   * If the authenticated user is not an admin, retrieves passwords associated with the user's groups and permissions.
   *
   * @return array An array containing the list of passwords.
   */
  public function index(): array
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
   * Store a newly created password.
   *
   * @param  Request  $request The request object containing the password data.
   * @return array|JsonResponse An array containing the stored password data,
   * or a JSON response with an error message if the resource already exists.
   */
  public function store(Request $request): array|JsonResponse
  {
    $name = request('name');
    $group = request('group');

    $password = auth()->user()->passwords()->where('name', $name)->get();

    if(!$password->isEmpty()){
      return response()->json([
        'error' => 'Conflict',
        'message' => 'The resource already exists in the database.'
      ], 409);
    }

    $password = Password::create([
      'name' => request('name'),
      'password' => request('password'),
      'description' => request('description')
    ]);

    auth()->user()->passwords()->attach($password, [
      'owner' => 1,
      'permitted' => 1
    ]);

    if(isset($group)){
      $password->groups()->attach($group);

      return ['data' => [
        'id' => $password->id,
        'name' => $password->name,
        'password' => $password->password,
        'description' => $password->description,
        'owner' => $password->users()->withPivot('owner')->first()->pivot->owner,
        'group' => $password->groups()->first()->id
      ]];
    }

    return ['data' => [
      'id' => $password->id,
      'name' => $password->name,
      'password' => $password->password,
      'description' => $password->description,
      'owner' => $password->users()->withPivot('owner')->first()->pivot->owner
    ]];
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
   * Group values can be: -1 which means password not in group, -2 which means
   * password must be ungrouped
   *
   * @param PasswordRequest $request The HTTP request instance containing the updated password data.
   * @param Password $password The password instance to be updated.
   * @return array An array containing a success message.
   */
  public function update(PasswordRequest $request, Password $password): array
  {
    $password->update([
      'name' => $request->input('name'),
      'password' => $request->input('password'),
      'description' => $request->input('description'),
    ]);

    $passwordInDb = auth()->user()->passwords()->where('id', $password->id)->with('groups')->first();
    $targetGroupId = $request->input('toGroupId');

    if($passwordInDb && $passwordInDb->groups->isNotEmpty()) {
      $initialGroupId = $passwordInDb->groups[0]->id;
      if ($targetGroupId > 0 && $targetGroupId !== $initialGroupId) {
        $password->groups()->sync([$targetGroupId]);
      } else if ($targetGroupId === -2) {
        $password->groups()->detach([$initialGroupId]);
      }
    } else {
      if($targetGroupId > 0){
        $password->groups()->attach([$targetGroupId]);
      }
    }

    return ['data' => [
      'message' => 'success'
    ]];
  }

  /**
   * Remove the specified password from storage.
   *
   * @param Password $password The password instance to be deleted.
   */
  public function destroy(Password $password)
  {
    return DB::transaction(function() use($password){
      $passwordId = $password->id;
      $password->users()->detach();
      $password->groups()->detach();
      $password->delete();
      return ['data' => $passwordId];
    });
  }

  /**
   * Toggle status of a password for a given user.
   *
   * @return array An array containing the updated password status data.
   */
  public function togglePasswordStatus(): array
  {
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
   *
   * @throws AuthorizationException If the user is not authorized to perform the action.
   * @throws Exception If an unexpected error occurs.
   */
  public function changePasswordGroup(): array
  {
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

  /**
   * Get the list of users allowed access to the password.
   *
   * @param  Password  $password The password model.
   * @return array Array of data containing the IDs of users allowed access to the password.
   *
   * @throws AuthorizationException If the user is not authorized to perform the action.
   */
  public function getAllowedUsers(Password $password): array
  {
    $this->authorize('getAllowedUsers', [$password]);
    $currentUserId = auth()->user()->getAuthIdentifier();

    $allowedUsersIds = $password->users()->wherePivot('user_id', '!=', $currentUserId)->pluck('id');

    return [
      'data' => $allowedUsersIds
    ];
  }
}
