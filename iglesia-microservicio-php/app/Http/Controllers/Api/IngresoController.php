<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingreso;
use App\Traits\ApiResponder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IngresoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    use ApiResponder;
    public function listar()
    {
        $ingresos = Ingreso::orderBy('updated_at', 'desc')->get();
        return $this->success("Listado de ingresos", $ingresos);
    }
    public function registrar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Error de validación', $validator->errors(), 422); // 422 es el código de respuesta HTTP para errores de validación
        }

        $ingreso = Ingreso::create($request->all());
        return $this->success('Ingreso registrado', $ingreso);
    }

    public function editar($id, Request $request)
    {
        // Validar la solicitud
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Error de validación', $validator->errors(), 422); // 422 es el código de respuesta HTTP para errores de validación
        }

        // Buscar la actividad por ID
        $ingreso = Ingreso::find($id);

        if (!$ingreso) {
            // Si no se encuentra la ingreso, retornar un error
            return $this->error('Ingreso no encontrada', [], 404);
        }

        // Actualizar los datos de la ingreso
        $ingreso->update($request->all());

        // Retornar una respuesta de éxito
        return $this->success('Ingreso actualizada correctamente', $ingreso);
    }
    public function obtener($id)
    {
        $actividad = Ingreso::find($id);
        if (!$actividad) {
            // Si no se encuentra la ingreso, retornar un error
            return $this->error('Ingreso no encontrada', [], 404);
        }
        // Retornar una respuesta de éxito
        return $this->success('Ingreso encontrado', $actividad);
    }
    public function eliminar($id)
    {
        try {
            // Encuentra la ingreso por su ID y elimínala
            $ingreso = Ingreso::findOrFail($id);
            $ingreso->delete();

            // Retorna una respuesta exitosa
            return $this->success('Ingreso eliminada correctamente', $ingreso);
        } catch (\Exception $e) {
            // En caso de error, retorna una respuesta de error
            return $this->error('Error al eliminar el ingreso', $e->getMessage(), 500);
        }
    }
}
