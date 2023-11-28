<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Persona extends Model
{
    use HasFactory;
    protected $table = "personas";
    /**
     * Get the miembro associated with the Persona
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function miembro(): HasOne
    {
        return $this->hasOne(Miembro::class, 'id', 'id');
    }

    public function actividades()
    {
        return $this->belongsToMany(Actividad::class,'asistencias', 'persona_id', 'actividad_id')->withPivot('horallegada')->withTimestamps();
    }

}
