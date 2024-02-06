<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\Password;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
  /**
   * Seed the application's database.
   */
  public function run(): void {
    $admin = User::factory()->create([
      'name' => 'John Smith',
      'email' => 'admin@domain.com',
      'password' => Hash::make('1')
    ]);

    $adminRole = Role::create(['name' => 'admin']);
    $userRole = Role::create(['name' => 'user']);

    $admin->assignRole($adminRole);

    User::factory(10)->create();

    foreach(User::all()->where('id', '!=', 1) as $user){
      $passwords = Password::factory(rand(2,5))->create();
      $user->passwords()->saveMany($passwords);

      $groups = Group::factory(rand(1,2))->create();
      $user->groups()->saveMany($groups);

      $counter = 0;
      foreach($groups as $group){
        $group->passwords()->save($passwords[$counter]);
        $counter++;
      }
      $user->assignRole($userRole);
    }
  }
}
