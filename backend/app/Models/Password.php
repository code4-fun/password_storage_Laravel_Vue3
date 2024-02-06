<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class Password
 *
 * The Password class represents a model for managing passwords in the application.
 *
 * @package App\Models
 */
class Password extends Model
{
  use HasFactory;

  /**
   * Get the users associated with the password.
   *
   * @return BelongsToMany
   */
  public function users(): BelongsToMany
  {
    return $this->belongsToMany(User::class);
  }

  /**
   * Get the groups associated with the password.
   *
   * @return BelongsToMany
   */
  public function groups(): BelongsToMany
  {
    return $this->belongsToMany(Group::class);
  }
}
