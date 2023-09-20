<?php
/************************************CONFIG****************************************/
$ACCESSKEY = "YOUR-ACCESS-KEY";
/************************************CONFIG****************************************/

header('Cache-Control: no-cache, must-revalidate');

function respondWithErrorMessage($code, $message) {
    header("HTTP/1.0 $code");
    echo $message;
    exit;
}

if (!isset($_GET['p']) || $_GET['p'] !== $ACCESSKEY) {
    respondWithErrorMessage(400, "Access denied");
}

if (isset($_GET['download']) && $_GET['download'] === 'true') {
    // Download file
    if (!isset($_GET['filename'])) {
        respondWithErrorMessage(400, "Filename not provided.");
    }

    $filename = $_GET['filename'];

    // Prevent attacks
    if (strpos($filename, '/') !== false || strpos($filename, '\\') !== false) {
        respondWithErrorMessage(400, "Invalid filename.");
    }

    $filepath = __DIR__ . '/photos/' . $filename;

    if (file_exists($filepath)) {
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($filename) . '"');
        readfile($filepath);
    } else {
        respondWithErrorMessage(404, "File not found.");
    }
} else {
    // Upload file
    if (!isset($_GET['filename'])) {
        respondWithErrorMessage(400, "Filename not provided.");
    }

    $filename = $_GET['filename'];

    // Prevent attacks
    if (strpos($filename, '/') !== false || strpos($filename, '\\') !== false) {
        respondWithErrorMessage(400, "Invalid filename.");
    }

    $filepath = __DIR__ . '/photos/' . $filename;

    $data = file_get_contents('php://input');

    if ($data === false) {
        respondWithErrorMessage(400, "Failed to read input data.");
    }

    if (file_put_contents($filepath, $data) !== false) {
        if (filesize($filepath) !== 0) {
            echo "File transfer completed.";
        } else {
            respondWithErrorMessage(400, "File is empty.");
        }
    } else {
        respondWithErrorMessage(400, "File transfer failed.");
    }
}