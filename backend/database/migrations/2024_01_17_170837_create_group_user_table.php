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
    Schema::create('group_user', function (Blueprint $table) {
      $table->foreignId('group_id')->constrained('groups');
      $table->foreignId('user_id')->constrained('users');
      $table->boolean('permitted')->default(1);  // 0 - user does not have access to group, 1 - has access
      $table->boolean('owner')->default(1);      // 0 - user is not the owner of the group, 1 - user is the owner
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('group_user');
  }
};
