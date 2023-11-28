<?php
namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponder {
    /**
     * Return a success JSON response.
     *
     * @param string $message
     * @param int $code
     * @param $data
     * @return JsonResponse
     */
    protected function success(string $message, $data = null, int $code = 200): JsonResponse {
        return response()->json([
            "status" => "Success",
            "message" => $message,
            "data" => $data,
        ], $code);
    }

    /**
     * Return an error JSON response.
     *
     * @param string $message
     * @param int $code
     * @param null $data
     * @return JsonResponse
     */
    protected function error(string $message, $data = null, int $code = 400): JsonResponse {
        return response()->json([
            "status" => "Error",
            "message" => $message,
            "data" => $data,
        ], $code);
    }
}
