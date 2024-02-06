<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('password_user', function (Blueprint $table) {
      $table->foreignId('password_id')->constrained('passwords');
      $table->foreignId('user_id')->constrained('users');
      $table->boolean('permitted')->default(1);  // 0 - user does not have access to password, 1 - has access
      $table->boolean('owner')->default(1);      // 0 - user is not the owner of the password, 1 - user is the owner
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('password_user');
  }
};
