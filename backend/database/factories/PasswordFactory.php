<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Password>
 */
class PasswordFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'name' => $this->faker->realText(rand(10, 30)),
      'description' => $this->faker->realText(rand(40, 50)),
      'password' => $this->faker->word().$this->faker->randomNumber(1, 50),
    ];
  }
}
