<?php

namespace App\Http\Controllers\Api;

use Throwable;
use App\Models\Miembro;
use App\Models\Persona;
use App\Traits\ApiResponder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class MiembroController extends Controller
{
    use ApiResponder;

    public function listar(): JsonResponse {
        $personas = Persona::select('id','nombre','apellido')->with('miembro:fecha_registro_miembro')->where('tipo','M')->get();
        return $this->success(
            "Listado de personas",
            $personas
        );
    }

    public function registrar(Request $request): JsonResponse {
        DB::beginTransaction();
        try {
            $persona = new Persona;
            $persona->ci = $request->ci;
            $persona->nombre = $request->nombre;
            $persona->apellido = $request->apellido;
            $persona->celular = $request->celular;
            $persona->correo = $request->correo;
            $persona->direccion = $request->direccion;
            $persona->sexo = $request->sexo;
            $persona->fecha_nacimiento = $request->fecha_nacimiento;
            $persona->tipo = "M";
            $persona->password = Hash::make($request->celular); 
            $persona->save();
            $idModeloPersona = $persona->id;
            $miembro = new Miembro;
            $miembro->id = $idModeloPersona;
            $miembro->fecha_registro_miembro = $request->fecha_registro_miembro;
            $miembro->save();
            DB::commit();
        } catch (Throwable $th) {
            DB::rollback();
            return $this->error(
                "Error"
            );
        }
        return $this->success(
            "Registro guardado exitosamente",
            $persona
        );
    }

    public function editar(Request $request,$id): JsonResponse {
        DB::beginTransaction();
        try {
            $persona = Persona::findOrFail($id);
            $persona->ci = $request->ci;
            $persona->nombre = $request->nombre;
            $persona->apellido = $request->apellido;
            $persona->celular = $request->celular;
            $persona->correo = $request->correo;
            $persona->password = Hash::make($request->celular); 
            $persona->direccion = $request->direccion;
            $persona->sexo = $request->sexo;
            $persona->fecha_nacimiento = $request->fecha_nacimiento;
            $persona->tipo = "M";
            $persona->save();
            $idModeloPersona = $persona->id;
            $miembro = Miembro::findOrFail($id);
            $miembro->id = $idModeloPersona;
            $miembro->fecha_registro_miembro = $request->fecha_registro_miembro;
            $miembro->save();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error(
                "Error"
            );
        }
        return $this->success(
            "Registro actualizado exitosamente",
            $persona
        );
    }

    public function obtener($id): JsonResponse {
        $persona = Persona::with('miembro')->findOrFail($id);
        return $this->success(
            "Consulta ejecutada exitosamente",
            $persona
        );
    }

    public function eliminar($id): JsonResponse {
        $miembro = Miembro::findOrFail($id);
        $miembro->delete();
        $persona = Persona::findOrFail($id);
        $persona->delete();
        return $this->success(
            "Registro eliminado exitosamente"
        );
    }

}
