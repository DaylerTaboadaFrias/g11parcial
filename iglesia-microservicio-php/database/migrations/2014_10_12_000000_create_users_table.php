<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('surnames')->nullable($value = true);
            $table->string('phone')->nullable($value = true);
            $table->string('photo1')->nullable($value = true);
            $table->string('photo2')->nullable($value = true);
            $table->string('photo3')->nullable($value = true);
            $table->string('representative_organization')->nullable($value = true);
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['Fotografo', 'Organizacion', 'Cliente'])->default('Fotografo');
            $table->enum('suscribido', ['fb','fp','ob','op','Ninguno'])->default('Ninguno');
            $table->enum('working', ['Yes', 'No'])->default('No');
            $table->unsignedBigInteger('organizacion_id')->nullable();
            $table->foreign('organizacion_id')->references('id')->on('users');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
