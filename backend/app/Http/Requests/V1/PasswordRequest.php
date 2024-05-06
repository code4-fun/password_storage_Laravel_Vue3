<?php

namespace App\Http\Requests\V1;

use App\Rules\UniqueName;
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
    $currentId = $this->routeIs('passwords.update')
      ? $this->route('password')->id
      : null;

    $rules = [
      'name' => ['required', 'max:50', new UniqueName('passwords', $currentId)],
      'description' => ['max:500'],
      'group' => ['integer']
    ];

    if ($this->routeIs('passwords.store')) {
      $rules['password'] = ['required', 'max:50'];
    }

    return $rules;
  }
}
