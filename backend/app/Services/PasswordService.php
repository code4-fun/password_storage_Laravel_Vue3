<?php

namespace App\Services;

use App\Models\Password;
use Illuminate\Database\Eloquent\Collection;

class PasswordService
{
  public function getUserWithPivotByPasswordIdAndUserId($passwordId, $userId): Collection
  {
    $password = Password::query()->find($passwordId);

    if ($password) {
      return $password->users()
        ->withPivot(['permitted', 'owner'])
        ->wherePivot('user_id', $userId)
        ->get();
    }

    return new Collection();
  }
}
