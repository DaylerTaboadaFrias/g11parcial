<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class State extends Enum
{
    const Pendiente = 'Pendiente';
    const Aceptada = 'Aceptada';
    const Rechazada = 'Rechazada';
}
