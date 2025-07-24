<?php
// session.php
// Fehleranzeige deaktivieren, aber Fehler in Log-Datei schreiben
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
error_reporting(E_ALL);
ini_set('log_errors', '1');
ini_set('error_log', '/var/www/html/logs/php_errors.log'); // Korrigierter Pfad

// Benutzerdefinierter Fehlerhandler
set_error_handler(function ($severity, $message, $file, $line) {
    if ($severity === E_DEPRECATED || $severity === E_USER_DEPRECATED) {
        debug_log("PHP-Fehler (ignoriert): [$severity] $message in $file on line $line");
        return true;
    }
    debug_log("PHP-Fehler: [$severity] $message in $file on line $line");
    $_SESSION['error'] = 'Ein Serverfehler ist aufgetreten.';
    header('Location: /public/login.php?error=Anmeldung+fehlgeschlagen');
    exit;
});

// Exception-Handler
set_exception_handler(function ($e) {
    debug_log("Unbehandelte Ausnahme: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    $_SESSION['error'] = 'Ein unerwarteter Fehler ist aufgetreten.';
    header('Location: /public/login.php?error=Anmeldung+fehlgeschlagen');
    exit;
});

// Zentralisiertes Sitzungsmanagement
if (session_status() === PHP_SESSION_NONE) {
    // Setze die Sitzungsparameter, bevor die Sitzung gestartet wird
    session_set_cookie_params([
        'lifetime' => 0, // Sitzungscookie endet mit Browser-Schließen
        'path' => '/',
        'domain' => '',
        'secure' => true, // Nur über HTTPS
        'httponly' => true, // Nicht über JavaScript zugänglich
        'samesite' => 'Strict' // Schützt vor CSRF
    ]);

    session_start();

    // CSRF-Token generieren (nur wenn noch nicht vorhanden)
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    // Nonce für Skripte generieren (nur wenn noch nicht vorhanden)
    if (!isset($_SESSION['script_nonce'])) {
        $_SESSION['script_nonce'] = base64_encode(random_bytes(16));
    }
}

// Sitzungs-Timeout prüfen
$timeout = 1800; // 30 Minuten
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $timeout)) {
    session_unset();
    session_destroy();
    header('Location: /public/login.php?error=Sitzung+abgelaufen');
    exit;
}
$_SESSION['last_activity'] = time();
?>