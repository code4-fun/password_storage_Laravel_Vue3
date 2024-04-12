<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\GroupRequest;
use App\Http\Resources\V1\GroupResource;
use Illuminate\Support\Facades\DB;
use App\Models\Group;

class GroupController extends Controller
{
  public function __construct()
  {
    $this->authorizeResource(Group::class, 'group');
  }

  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    return GroupResource::collection(auth()->user()->groups()->get());
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(GroupRequest $request)
  {
    $newGroup = auth()->user()->groups()->firstOrCreate([
      'name' => $request->input('name')
    ]);
    return new GroupResource($newGroup);
  }

  /**
   * Display the specified resource.
   */
  public function show(Group $group)
  {
    return new GroupResource($group);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(GroupRequest $request, Group $group)
  {
    $group->update($request->all());
    return new GroupResource($group);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Group $group)
  {
    return DB::transaction(function() use($group){
      $groupId = $group->id;
      $relatedPasswords = $group->passwords;
      $group->passwords()->detach();
      $relatedPasswords->each(function ($password) {
        $password->users()->detach();
        $password->delete();
      });
      $group->users()->detach();
      $group->delete();
      return ['data' => $groupId];
    });
  }
}
