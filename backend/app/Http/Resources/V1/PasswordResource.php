<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PasswordResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'id' => $this->id,
      'name' => $this->name,
      'password' => $this->password,
      'description' => $this->description,
      'owner' => $this->whenPivotLoaded('password_user', function () {
        return $this->pivot->owner;
      }),
      'groups' => $this->when($this->groups && $this->groups->isNotEmpty(), function () {
        return GroupResource::collection($this->groups);
      }),
    ];
  }
}
