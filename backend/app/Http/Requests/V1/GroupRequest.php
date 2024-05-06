<?php

namespace App\Http\Requests\V1;

use App\Rules\UniqueName;
use Illuminate\Foundation\Http\FormRequest;

class GroupRequest extends FormRequest
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
   * @return array
   */
  public function rules(): array
  {
    $currentId = $this->routeIs('groups.update')
      ? $this->route('group')->id
      : null;

    return [
      'name' => ['required', 'max:50', new UniqueName('groups', $currentId)]
    ];
  }
}
