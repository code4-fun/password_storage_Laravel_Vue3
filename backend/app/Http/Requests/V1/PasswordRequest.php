<?php

namespace App\Http\Requests\V1;

use App\Rules\UniquePasswordName;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PasswordRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, ValidationRule|array|string>
   */
  public function rules(): array
  {
    $passwordId = $this->route('password')->id;

    $rules = [
      'name' => ['required', 'max:50', new UniquePasswordName($passwordId)],
      'description' => ['max:500'],
      'group' => ['integer']
    ];

    if ($this->routeIs('password.store')) {
      $rules['password'] = ['required', 'max:50'];
    }

    return $rules;
  }
}
