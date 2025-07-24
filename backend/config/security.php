<?php
// Debugging-Konfiguration
define('DEBUG_LOG', true);

function debug_log($message) {
    if (DEBUG_LOG) {
        $log_file = dirname(__DIR__) . '/logs/debug.log';
        $timestamp = date('Y-m-d H:i:s');
        file_put_contents($log_file, "[$timestamp Europe/Berlin] $message\n", FILE_APPEND);
    }
}

// Content-Security-Policy (Beispiel, an deine Anwendung anpassen)
//define('CSP_HEADER', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';");
//
//// Sicherheits-Header setzen
//header(CSP_HEADER);
//header("Cache-Control: no-store, no-cache, must-revalidate");
//header("Pragma: no-cache");
//header("Referrer-Policy: strict-origin-when-cross-origin");
//header("Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=(), xr-spatial-tracking=(), fullscreen=(self)");
//header("Cross-Origin-Opener-Policy: same-origin");

// Funktion zum Rendern einer Fehlerseite
function render_error_page($message, $instructions = '') {
    debug_log('Fehlerseite wird gerendert: ' . $message);
    $logo_path = '/images/logo.png';
    $logo_full_path = dirname(__DIR__) . '/public/images/logo.png';
    $logo_debug = [];
    if (!file_exists($logo_full_path)) {
        $logo_debug[] = 'Logo-Datei nicht gefunden: ' . $logo_full_path;
    } else {
        $logo_debug[] = 'Logo-Datei gefunden: ' . $logo_full_path;
        if (!is_readable($logo_full_path)) {
            $logo_debug[] = 'Logo-Datei nicht lesbar: ' . $logo_full_path;
            $logo_path = null; // Fallback: Kein Logo anzeigen
        }
    }
    foreach ($logo_debug as $debug_msg) {
        debug_log($debug_msg);
    }
    http_response_code(500);
    ?>
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <title>Fehler - Kita-Anwendung</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
            h1 { color: #d9534f; }
            p { margin-bottom: 15px; }
            .instructions { background: #f8f9fa; padding: 15px; border-radius: 5px; text-align: left; }
            pre { background: #e9ecef; padding: 10px; border-radius: 5px; }
            a { color: #007bff; text-decoration: none; }
            a:hover { text-decoration: underline; }
            .logo { max-width: 200px; margin-bottom: 20px; }
            .error { color: #d9534f; }
        </style>
    </head>
    <body>
    <?php if ($logo_path): ?>
        <img src="<?php echo htmlspecialchars($logo_path); ?>" alt="Kita Logo" class="logo">
    <?php else: ?>
        <p class="error">Logo konnte nicht geladen werden. Bitte überprüfen Sie den Pfad: <?php echo htmlspecialchars($logo_full_path); ?><br>
            Debugging-Info: <?php echo htmlspecialchars(implode('; ', $logo_debug)); ?></p>
    <?php endif; ?>
    <h1>Fehler</h1>
    <p><?php echo htmlspecialchars($message); ?></p>
    <?php if ($instructions): ?>
        <div class="instructions">
            <h2>Wie Sie das Problem beheben können:</h2>
            <?php echo $instructions; ?>
        </div>
    <?php endif; ?>
    <p><a href="/index.php">Der Fehler wurde behoben, neuladen...</a></p>
    </body>
    </html>
    <?php
    exit;
}
?>