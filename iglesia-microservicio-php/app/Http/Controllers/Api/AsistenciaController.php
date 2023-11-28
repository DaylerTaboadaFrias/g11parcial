<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Actividad;
use App\Models\Persona;
use App\Traits\ApiResponder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AsistenciaController extends Controller
{
    use ApiResponder;
    public function listar($id)
    {
        $actividad = Actividad::find($id);
        if (!$actividad) {
            // Si no se encuentra la actividad, retornar un error
            return $this->error('Actividad no encontrada', [], 404);
        }
        $asistencias = $actividad->personas;
        return $this->success("Listado de asistencias de la actividad", $asistencias);
    }
    public function registrar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'actividad_id' => 'required|exists:actividades,id',
            'persona_id' => 'required|exists:miembros,id',
            'horallegada' => 'required|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return $this->error('Error de validación', $validator->errors(), 422); // 422 es el código de respuesta HTTP para errores de validación
        }

        $actividad = Actividad::find($request->actividad_id);
        $persona = Persona::find($request->persona_id);

        if ($actividad->personas()->where('persona_id', $persona->id)->exists()) {
            return $this->error('La asistencia ya fué registrada', [], 422);
        }
        $asistencia = $actividad->personas()->attach($persona, ['horallegada' => $request->horallegada]);

        return $this->success("Asistencia registrada exitosamente");
    }
    
    public function mostrar(Request $request){
        $validator = Validator::make($request->all(), [
            'actividad_id' => 'required|exists:actividades,id',
            'persona_id' => 'required|exists:miembros,id',
        ]);

        if ($validator->fails()) {
            return $this->error('Error de validación', $validator->errors(), 422); // 422 es el código de respuesta HTTP para errores de validación
        }
        $actividad = Actividad::find($request->actividad_id);
        $persona = Persona::find($request->persona_id);

        $asistencia = $actividad->personas()->where('persona_id', $persona->id)->first();

        if (!$asistencia) {
            return $this->error('Asistencia no encontrada', [], 404);
        }
    
        return $this->success("Asistencia encontrada exitosamente", $asistencia);
    }

    public function eliminar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'actividad_id' => 'required|exists:actividades,id',
            'persona_id' => 'required|exists:miembros,id',
        ]);

        if ($validator->fails()) {
            return $this->error('Error de validación', $validator->errors(), 422); // 422 es el código de respuesta HTTP para errores de validación
        }

        $actividad = Actividad::find($request->actividad_id);
        $persona = Persona::find($request->persona_id);

        if (!$actividad->personas()->where('persona_id', $persona->id)->exists()) {
            return $this->error('La relación no existe', [], 422);
        }

        // Eliminar la relación
        $actividad->personas()->detach($persona->id);

        return $this->success("Relación eliminada exitosamente");
    }
}
