<?php
// Fehlerbehandlung aktivieren (für Debugging)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

define('ROOT_PATH', dirname(__DIR__));
require_once ROOT_PATH . '/config/security.php';
require_once ROOT_PATH . '/config/session.php';

debug_log('index.php aufgerufen. REQUEST_URI: ' . $_SERVER['REQUEST_URI']);
debug_log('Document Root: ' . $_SERVER['DOCUMENT_ROOT']);
debug_log('Script Filename: ' . $_SERVER['SCRIPT_FILENAME']);

// URL-Parameter holen
$requestUrl = filter_input(INPUT_GET, 'url', FILTER_SANITIZE_URL) ?: '';
$requestUrl = rtrim($requestUrl, '/');
$requestPath = explode('/', $requestUrl);
$route = end($requestPath);
$route = str_replace('.php', '', $route);

debug_log("Routing: Verarbeite URL: '$requestUrl'");
debug_log("Extrahierte Route: '$route'");

// Prüfen, ob config.php existiert und Datenbank initialisiert ist
define('CONFIG_PATH', ROOT_PATH . '/config/config.php');
$config_exists = file_exists(CONFIG_PATH);
$config_has_data = false;
$db_connection_valid = false;
$db_initialized = false;

if ($config_exists) {
    try {
        debug_log('Einbinden von config.php: ' . CONFIG_PATH);
        include_once CONFIG_PATH;
        $config_has_data = defined('DB_HOST') && defined('DB_NAME') && defined('DB_USER') && defined('DB_PASS');
        if ($config_has_data) {
            try {
                debug_log('Versuche Datenbankverbindung mit Host: ' . DB_HOST);
                $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
                if ($conn->connect_error) {
                    debug_log('Datenbankverbindung fehlgeschlagen: ' . $conn->connect_error);
                } else {
                    $db_connection_valid = true;
                    $result = $conn->query("SHOW TABLES LIKE 'mitarbeiter'");
                    if ($result && $result->num_rows > 0) {
                        $db_initialized = true;
                        debug_log('Datenbank initialisiert: mitarbeiter-Tabelle existiert.');
                    } else {
                        debug_log('Datenbank nicht initialisiert: Tabelle "mitarbeiter" fehlt.');
                    }
                    $conn->close();
                }
            } catch (Exception $e) {
                debug_log('Fehler beim Herstellen der Datenbankverbindung: ' . $e->getMessage());
            }
        }
    } catch (Exception $e) {
        debug_log('Fehler beim Einbinden von config.php: ' . $e->getMessage());
        http_response_code(500);
        render_error_page(
            'Fehler beim Laden der Konfiguration: ' . htmlspecialchars($e->getMessage()),
            'Bitte überprüfen Sie die Datei <code>' . htmlspecialchars(CONFIG_PATH) . '</code> und stellen Sie sicher, dass sie korrekt formatiert ist.'
        );
    }
}

// Prüfen der config.php-Berechtigungen
if ($config_has_data && $db_connection_valid && $db_initialized) {
    $instructions = 'Bitte stellen Sie sicher, dass die Datei die Berechtigungen 0644 hat.<br><br>' .
        '<strong>Variante 1: Über den Browser</strong><br>' .
        '<pre>Sie können versuchen, ob das Programm selbst die Berechtigungen ändern kann<br>' .
        'durch ein einfaches Aktualisieren. Sollten Sie wieder hier landen,<br>' .
        'wählen Sie eine andere Option</pre>' .
        '<strong>Variante 2: Über die Kommandozeile (z. B. SSH)</strong><br>' .
        '<pre>sudo chown www-data:www-data ' . htmlspecialchars(CONFIG_PATH) . '<br>' .
        'sudo chmod 644 ' . htmlspecialchars(CONFIG_PATH) . '</pre>' .
        '<strong>Variante 3: Über ein FTP-Programm (z. B. FileZilla)</strong><br>' .
        '1. Öffnen Sie Ihr FTP-Programm und verbinden Sie sich mit dem Server.<br>' .
        '2. Navigieren Sie zur Datei: <code>' . htmlspecialchars(CONFIG_PATH) . '</code><br>' .
        '3. Rechtsklick auf die Datei → „Dateiberechtigungen...“ (oder „Permissions...“)<br>' .
        '4. Setzen Sie die numerische Berechtigung auf <code>644</code>.<br>' .
        '5. Bestätigen Sie mit „OK“ oder „Übernehmen“.';
    $current_perms = fileperms(CONFIG_PATH) & 0777;
    if ($current_perms === 0666) {
        if (!chmod(CONFIG_PATH, 0644)) {
            // Datei-Berechtigungen auf 0644 setzen
            if (!chmod(CONFIG_PATH, 0644)) {
                $error_message = 'Fehler: Konnte Berechtigungen für ' . htmlspecialchars(CONFIG_PATH) . ' nicht auf 0644 setzen.';
                debug_log($error_message);
                render_error_page($error_message, $instructions);
            }
            $error_message = 'Fehler: Konnte Berechtigungen für ' . htmlspecialchars(CONFIG_PATH) . ' nicht auf 0644 setzen.';
            debug_log($error_message);
            render_error_page($error_message, $instructions);
        } else {
            debug_log('Berechtigungen von config.php erfolgreich auf 0644 gesetzt.');
        }
    } elseif ($current_perms !== 0644) {
        debug_log('Warnung: config.php hat unerwartete Berechtigungen: ' . sprintf("0%o", $current_perms));
    } else {
        debug_log('config.php hat korrekte Berechtigungen: 0644');
    }
}

// Routing-Logik
if (!$config_has_data || !$db_connection_valid || !$db_initialized) {
    $setup_path = ROOT_PATH . '/setup/setup.php';
    if (!file_exists($setup_path)) {
        debug_log('Fehler: setup.php nicht gefunden unter ' . $setup_path);
        http_response_code(500);
        render_error_page(
            'Setup-Datei nicht gefunden.',
            'Die Datei <code>' . htmlspecialchars($setup_path) . '</code> fehlt. Bitte wenden Sie sich an den Administrator.'
        );
    }
    debug_log('Einbinden von setup.php: config.php leer, ungültige Datenbankverbindung oder Datenbank nicht initialisiert.');
    require_once $setup_path;
    exit;
} elseif (empty($requestUrl) || $route === 'index') {
    debug_log('Zeige die Startseite (index.php)');
    require_once __DIR__ . '/home.php';
    exit;
} elseif ($route === 'login') {
    debug_log('Routing: Verarbeite /login');
    header('Location: /login.php');
    exit;
} else {
    debug_log("Routing: Keine passende Route gefunden für '$requestUrl' (Route: '$route')");
    http_response_code(404);
    require_once __DIR__ . '/error-404.php';
    exit;
}
?>