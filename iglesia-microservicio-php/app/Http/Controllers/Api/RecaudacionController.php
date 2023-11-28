<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Actividad;
use App\Models\Ingreso;
use App\Traits\ApiResponder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RecaudacionController extends Controller
{
    use ApiResponder;
    public function listar($id)
    {
        $actividad = Actividad::find($id);
        if (!$actividad) {
            // Si no se encuentra la actividad, retornar un error
            return $this->error('Actividad no encontrada', [], 404);
        }
        $recaudacion = $actividad->ingresos;
        return $this->success("Listado de ingresos de la actividad", $recaudacion);
    }
    public function registrar(Request $request)
    {
        
        $validator = Validator::make($request->all(), [
            'actividad_id' => 'required|exists:actividades,id',
            'ingreso_id' => 'required|exists:ingresos,id',
            'monto' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return $this->error('Error de validación', $validator->errors(), 422); // 422 es el código de respuesta HTTP para errores de validación
        }

        $actividad = Actividad::find($request->actividad_id);
        $ingreso = Ingreso::find($request->ingreso_id);

        if ($actividad->ingresos()->where('ingreso_id', $ingreso->id)->exists()) {
            return $this->error('La recaudación ya fué registrada', [], 422);
        }

        $recaudacion = $actividad->ingresos()->attach($ingreso, ['monto' => $request->monto]);
        $actividad->actualizarMontoTotal();

        return $this->success("Recaudación registrada exitosamente");
    }
    public function mostrar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'actividad_id' => 'required|exists:actividades,id',
            'ingreso_id' => 'required|exists:ingresos,id',
        ]);

        if ($validator->fails()) {
            return $this->error('Error de validación', $validator->errors(), 422); // 422 es el código de respuesta HTTP para errores de validación
        }
        $actividad = Actividad::find($request->actividad_id);
        $ingreso = Ingreso::find($request->ingreso_id);

        $recaudacion = $actividad->ingresos()->where('ingreso_id', $ingreso->id)->first();

        if (!$recaudacion) {
            return $this->error('Recaudación no encontrada', [], 404);
        }
    
        return $this->success("Recaudación encontrada exitosamente", $recaudacion);
    
    }

    public function eliminar(Request $request)
    {
       
        $validator = Validator::make($request->all(), [
            'actividad_id' => 'required|exists:actividades,id',
            'ingreso_id' => 'required|exists:ingresos,id',
        ]);

        if ($validator->fails()) {
            return $this->error('Error de validación', $validator->errors(), 422); // 422 es el código de respuesta HTTP para errores de validación
        }

        $actividad = Actividad::find($request->actividad_id);
        $ingreso = Ingreso::find($request->ingreso_id);

        if (!$actividad->ingresos()->where('ingreso_id', $ingreso->id)->exists()) {
            return $this->error('La relación no existe', [], 422);
        }

        // Eliminar la relación
        $actividad->ingresos()->detach($ingreso->id);
        $actividad->actualizarMontoTotal();

        return $this->success("Relación eliminada exitosamente");
    }
}
