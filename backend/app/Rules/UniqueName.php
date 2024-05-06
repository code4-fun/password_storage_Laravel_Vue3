<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * This validation rule checks if the given attribute value is unique within a specified relationship.
 * For example, it can be used to ensure that a name attribute is unique among a user's passwords or groups.
 *
 * Additionally, it allows optionally ignoring a specific record ID when performing uniqueness validation.
 * Typically, this rule is applied during update operations to prevent the updated password or group from
 * failing the uniqueness validation check against existing records. This exclusion ensures that the
 * current record being updated is not inadvertently flagged as a duplicate, preserving data integrity.
 */
class UniqueName implements ValidationRule
{
  /**
   * The name of the relationship to check uniqueness against (e.g., "passwords", "groups").
   */
  protected string $relation;

  /**
   * The ID to ignore when performing uniqueness validation.
   * This is useful when updating a record, and you want to exclude the current record from validation.
   */
  protected ?int $ignoreId;

  /**
   * Create a new rule instance.
   *
   * @param string $relation The name of the relationship to check uniqueness against.
   * @param int|null $ignoreId The ID to ignore when performing uniqueness validation.
   *                           Default is null, indicating no record ID to ignore.
   */
  public function __construct(string $relation, ?int $ignoreId = null)
  {
    $this->relation = $relation;
    $this->ignoreId = $ignoreId;
  }

  /**
   * Validate the given attribute value.
   *
   * @param string $attribute The name of the attribute being validated.
   * @param mixed $value The value of the attribute being validated.
   * @param Closure $fail The closure to call if validation fails.
   *                      It receives a message as its only parameter.
   * @return void
   */
  public function validate(string $attribute, mixed $value, Closure $fail): void
  {
    $query = auth()->user()->{$this->relation}()->where($attribute, $value);

    if ($this->ignoreId !== null) {
      $query->where('id', '!=', $this->ignoreId);
    }

    $password = $query->get();

    if (!$password->isEmpty()) {
      $fail("The $attribute has already been taken.");
    }
  }
}
