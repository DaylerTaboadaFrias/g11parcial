<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Actividad;
use App\Traits\ApiResponder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ActividadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    use ApiResponder;
    public function listar()
    {
        $actividades = Actividad::orderBy('fecha', 'desc')->get();
        return $this->success("Listado de actividades", $actividades);
    }

    public function registrar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string',
            'fecha' => 'required|date',
            'horainicio' => 'required|date_format:H:i',
            'horafin' => 'required|date_format:H:i',
            'montototal' => 'required|numeric', // Ajuste para validar que sea numérico
        ]);

        if ($validator->fails()) {
            return $this->error('Error de validación', $validator->errors(), 422); // 422 es el código de respuesta HTTP para errores de validación
        }

        $actividad = Actividad::create($request->all());
        return $this->success('actividad registrada', $actividad);
    }

    public function editar($id, Request $request)
    {
        // Validar la solicitud
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string',
            'fecha' => 'required|date',
            'horainicio' => 'required|date_format:H:i',
            'horafin' => 'required|date_format:H:i',
            'montototal' => 'required|numeric', // Ajuste para validar que sea numérico
        ]);

        if ($validator->fails()) {
            return $this->error('Error de validación', $validator->errors(), 422); // 422 es el código de respuesta HTTP para errores de validación
        }
        
        // Buscar la actividad por ID
        $actividad = Actividad::find($id);

        if (!$actividad) {
            // Si no se encuentra la actividad, retornar un error
            return $this->error('Actividad no encontrada', [], 404);
        }

        // Actualizar los datos de la actividad
        $actividad->update($request->all());

        // Retornar una respuesta de éxito
        return $this->success('Actividad actualizada correctamente', $actividad);
    }
    public function obtener($id)
    {
        $actividad = Actividad::find($id);
        if (!$actividad) {
            // Si no se encuentra la actividad, retornar un error
            return $this->error('Actividad no encontrada', [], 404);
        }
        // Retornar una respuesta de éxito
        return $this->success('Actividad encontrada', $actividad);
    }
    public function eliminar($id)
    {
        try {
            // Encuentra la actividad por su ID y elimínala
            $actividad = Actividad::findOrFail($id);
            $actividad->delete();

            // Retorna una respuesta exitosa
            return $this->success('Actividad eliminada correctamente', $actividad);
        } catch (\Exception $e) {
            // En caso de error, retorna una respuesta de error
            return $this->error('Error al eliminar la actividad', $e->getMessage(), 500);
        }
    }

}
