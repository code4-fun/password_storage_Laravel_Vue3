<?php

use App\Http\Controllers\Api\V1\GroupController;
use App\Http\Controllers\Api\V1\PasswordController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', [UserController::class, 'show'])->name('user.show');

Route::group([
  'prefix' => 'v1',
  'namespace' => 'App\Http\Controllers\Api\V1',
  'middleware' => 'auth:sanctum'
], function(){
  Route::patch('passwords/groups', [PasswordController::class, 'changePasswordGroup']);
  Route::apiResource('users', UserController::class)/*->middleware('role:admin')*/;
  Route::apiResource('roles', RoleController::class)->middleware('role:admin');
  Route::apiResource('passwords', PasswordController::class);
  Route::apiResource('groups', GroupController::class);
  Route::patch('passwords/{passwordId}/users/{userId}', [PasswordController::class, 'togglePasswordStatus']);
  Route::get('passwords/{password}/allowed_users', [PasswordController::class, 'getAllowedUsers']);
});
