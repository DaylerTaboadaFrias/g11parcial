<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingreso extends Model
{
    use HasFactory;
    protected $table = "ingresos";
    protected $fillable = ['nombre'];

    public function actividades()
    {
        return $this->belongsToMany(Actividad::class)->withPivot('monto')->withTimestamps();
    }
}
