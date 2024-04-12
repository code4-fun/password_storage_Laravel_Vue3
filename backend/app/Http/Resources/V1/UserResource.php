<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    $isSingleUserRequest = $request->route()->named('users.show') || $request->route()->named('user.show');

    $data = [
      'id' => $this->id,
      'name' => $this->name,
    ];

    if($isSingleUserRequest){
      $data['roles'] = $this->getRoleNames();
    }

    return $data;
  }
}
