<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Actividad extends Model
{
    use HasFactory;
    protected $table = "actividades";
    protected $fillable = ['nombre', 'fecha', 'horafin', 'horainicio', 'montototal'];

    public function ingresos()
    {
        return $this->belongsToMany(Ingreso::class)->withPivot('monto')->withTimestamps();
    }

    public function personas()
    {
        return $this->belongsToMany(Persona::class, 'asistencias', 'actividad_id', 'persona_id')->withPivot('horallegada')->withTimestamps();
    }
    public function actualizarMontoTotal()
    {
        $this->montototal = $this->ingresos()->sum('monto');
        $this->save();
    }
}
