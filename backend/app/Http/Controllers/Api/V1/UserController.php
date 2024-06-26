<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\UserResource;
use App\Models\User;
use \Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Request;

class UserController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    //
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    //
  }

  /**
   * Display the specified resource.
   */
  public function show(Request $request)
  {
    return new UserResource($request->user());
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, string $id)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $id)
  {
    //
  }

  /**
   * Retrieve a collection of all users except the admin and the currently authenticated user.
   * Used for allowed users list.
   *
   * @return AnonymousResourceCollection
   */
  public function allUsersExceptAdminAndCurrentUser(): AnonymousResourceCollection
  {
    return UserResource::collection(
      User::role('user')
        ->where('id', '!=', auth()->user()->getAuthIdentifier())
        ->get()
    );
  }
}
