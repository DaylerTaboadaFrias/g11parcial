<?php

use App\Http\Controllers\Api\ActividadController;
use App\Http\Controllers\Api\AsistenciaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\IngresoController;
use App\Http\Controllers\Api\PhotoController;
use App\Http\Controllers\Api\MiembroController;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\RecaudacionController;

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

Route::get("/",function(){
   return "Bienvenido a el microservicio de la iglesia en PHP";
});

Route::prefix('miembro')->group(function () {
    Route::get("/listar", [MiembroController::class, "listar"]);
    Route::post("/registrar", [MiembroController::class, "registrar"]);
    Route::get("/obtener/{id}", [MiembroController::class, "obtener"]);
    Route::put("/editar/{id}", [MiembroController::class, "editar"]);
    Route::delete("/eliminar/{id}", [MiembroController::class, "eliminar"]);
});

Route::post("/login", [UsuarioController::class, "login"]);
Route::post("/loginMiembro", [UsuarioController::class, "loginMiembro"]);
Route::post("/usuario/register", [UsuarioController::class, "register"]);
//gestionar actividad
Route::prefix('actividad')->group(function () {
    Route::get("/listar", [ActividadController::class, "listar"]);
    Route::post("/registrar", [ActividadController::class, "registrar"]);
    Route::get("/obtener/{id}", [ActividadController::class, "obtener"]);
    Route::put("/editar/{id}", [ActividadController::class, "editar"]);
    Route::delete("/eliminar/{id}", [ActividadController::class, "eliminar"]);
});

//gestionar ingreso
Route::prefix('ingreso')->group(function () {
    Route::get("/listar", [IngresoController::class, "listar"]);
    Route::post("/registrar", [IngresoController::class, "registrar"]);
    Route::get("/obtener/{id}", [IngresoController::class, "obtener"]);
    Route::put("/editar/{id}", [IngresoController::class, "editar"]);
    Route::delete("/eliminar/{id}", [IngresoController::class, "eliminar"]);
});

Route::prefix('recaudacion')->group(function () {
    Route::get('/actividad/{id}',[RecaudacionController::class, "listar"]);
    Route::post("/registrar", [RecaudacionController::class, "registrar"]);
    Route::post("/eliminar", [RecaudacionController::class, "eliminar"]);
    Route::post("/mostrar", [RecaudacionController::class, "mostrar"]);
});
Route::prefix('asistencia')->group(function () {
    Route::get('/actividad/{id}',[AsistenciaController::class, "listar"]);
    Route::post("/registrar", [AsistenciaController::class, "registrar"]);
    Route::post("/eliminar", [AsistenciaController::class, "eliminar"]);
    Route::post("/mostrar", [AsistenciaController::class, "mostrar"]);
});

Route::get("/igualar-montototal", [UsuarioController::class, "igualar"]);