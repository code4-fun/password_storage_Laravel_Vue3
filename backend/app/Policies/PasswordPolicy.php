<?php

namespace App\Policies;

use App\Models\Password;
use App\Models\User;

class PasswordPolicy
{
  /**
   * Determine whether the user can view any models.
   */
  public function viewAny(?User $user): bool
  {
    return true;
  }

  /**
   * Determine whether the user can view the model.
   */
  public function view(User $user, Password $password): bool
  {
    return true;
  }

  /**
   * Determine whether the user can create models.
   */
  public function create(User $user): bool
  {
    return true;
  }

  /**
   * Determine whether the user can update the model.
   */
  public function update(User $user, Password $password): bool
  {
    return $user->passwords()->where('passwords.id', $password->id)->exists();
  }

  /**
   * Determine whether the user can delete the model.
   */
  public function delete(User $user, Password $password): bool
  {
    return $user->passwords()->where('passwords.id', $password->id)->exists();
  }

  /**
   * Determine whether the user can restore the model.
   */
  public function restore(User $user, Password $password): bool
  {
    //
  }

  /**
   * Determine whether the user can permanently delete the model.
   */
  public function forceDelete(User $user, Password $password): bool
  {
    //
  }

  public function changePasswordGroup(
    User $user,
    Password $password,
    string | null $fromGroupId,
    string | null $toGroupId): bool
  {
    $hasFromGroup = true;
    if (!is_null($fromGroupId)) {
      $hasFromGroup = $user->groups()->where('groups.id', $fromGroupId)->exists();
    }

    $hasToGroup = true;
    if (!is_null($toGroupId)) {
      $hasToGroup = $user->groups()->where('groups.id', $toGroupId)->exists();
    }

    $hasPassword = $user->passwords()->where('passwords.id', $password->id)->exists();

    return $hasPassword && $hasFromGroup && $hasToGroup;
  }

  public function getAllowedUsers(User $user, Password $password,)
  {
    return $user->passwords()->where('passwords.id', $password->id)->exists();
  }
}
