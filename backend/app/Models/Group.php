<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Group extends Model
{
  use HasFactory;

  protected $fillable = ['name'];

  /**
   * Get the passwords associated with the group.
   *
   * @return BelongsToMany
   */
  public function passwords(): BelongsToMany
  {
    return $this->belongsToMany(Password::class);
  }

  /**
   * Get the users associated with the group.
   *
   * @return BelongsToMany
   */
  public function users(): BelongsToMany
  {
    return $this->belongsToMany(User::class);
  }
}
