<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class UniquePasswordName implements ValidationRule
{
  protected $ignoreId;

  public function __construct($ignoreId = null)
  {
    $this->ignoreId = $ignoreId;
  }

  /**
   * Run the validation rule.
   *
   * @param Closure(string): PotentiallyTranslatedString $fail
   */
  public function validate(string $attribute, mixed $value, Closure $fail): void
  {
    $query = auth()->user()->passwords()->where('name', $value);

    if ($this->ignoreId !== null) {
      $query->where('id', '!=', $this->ignoreId);
    }

    $password = $query->get();

    if (!$password->isEmpty()) {
      $fail("The $attribute has already been taken.");
    }
  }
}
