<?php
// Fehlerbehandlung aktivieren
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Früher Debug-Eintrag
require_once dirname(__DIR__) . '/config/security.php';
debug_log('setup.php wird ausgeführt.');

// Sitzungsmanagement einbinden
require_once dirname(__DIR__) . '/config/session.php';

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

// Prüfen, ob config.php bereits existiert und Daten enthält
if (!defined('CONFIG_PATH')) {
    define('CONFIG_PATH', dirname(__DIR__) . '/config/config.php');
}
if (file_exists(CONFIG_PATH)) {
    include_once CONFIG_PATH;
    if (defined('DB_HOST') && defined('DB_NAME') && defined('DB_USER') && defined('DB_PASS')) {
        try {
            $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            if (!$conn->connect_error) {
                $result = $conn->query("SHOW TABLES LIKE 'mitarbeiter'");
                if ($result && $result->num_rows > 0) {
                    debug_log('Setup abgebrochen: config.php enthält gültige Daten und die mitarbeiter-Tabelle existiert.');
                    render_error_page(
                        'Setup wurde bereits ausgeführt.',
                        'Die Konfiguration ist bereits abgeschlossen. Bitte bearbeiten Sie <code>' . htmlspecialchars(CONFIG_PATH) . '</code> manuell oder löschen Sie die Datei, um das Setup erneut zu starten.<br>' .
                        'Führen Sie auf dem Server folgenden Befehl aus, um die Datei zu löschen:<br>' .
                        '<pre>mv ' . htmlspecialchars(CONFIG_PATH) . ' ' . htmlspecialchars(CONFIG_PATH) . '.bak</pre>'
                    );
                }
                $conn->close();
            }
        } catch (Exception $e) {
            debug_log('Prüfung von config.php fehlgeschlagen: ' . $e->getMessage());
        }
    }
}

// Prüfe Verzeichnis-Berechtigungen
$dir = dirname(CONFIG_PATH);
$required_dir_perms = 0770; // Ändern auf 0770, um Schreiben während des Setups zu ermöglichen
$current_dir_perms = fileperms($dir) & 0777;
if (!is_writable($dir) || $current_dir_perms !== $required_dir_perms) {
    $instructions = 'Bitte stellen Sie sicher, dass das Verzeichnis beschreibbar ist und die Berechtigungen 0770 hat.<br><br>' .
        '<strong>Variante 1: Über den Browser</strong><br>' .
        '<pre>Sie können versuchen ob das Programm selbst die Berechtigungen ändern kann<br>' .
        'durch ein einfaches aktualisieren. Sollten Sie wieder hier landen,<br>' .
        'wählen Sie eine andere Option</pre>' .
        '<strong>Variante 2: Über die Kommandozeile (z.B. SSH)</strong><br>' .
        '<pre>sudo chown www-data:www-data ' . htmlspecialchars($dir) . '<br>' .
        'sudo chmod 770 ' . htmlspecialchars($dir) . '</pre>' .
        '<strong>Variante 3: Über ein FTP-Programm (z.B. FileZilla)</strong><br>' .
        '1. Öffnen Sie Ihr FTP-Programm und verbinden Sie sich mit dem Server.<br>' .
        '2. Navigieren Sie zum Verzeichnis: <code>' . htmlspecialchars($dir) . '</code><br>' .
        '3. Rechtsklick auf das Verzeichnis → „Dateiberechtigungen...“ (oder „Permissions...“)<br>' .
        '4. Setzen Sie die numerische Berechtigung auf <code>770</code>.<br>' .
        '5. Bestätigen Sie mit „OK“ oder „Übernehmen“.';
    // Vorübergehend Verzeichnis-Berechtigungen auf 0770 setzen
    if (!chmod($dir, 0770)) {
        $error_message = 'Fehler: Konnte Verzeichnis-Berechtigungen für ' . htmlspecialchars($dir) . ' nicht auf 0770 setzen.';
        debug_log($error_message);
        render_error_page(
            $error_message, $instructions);
    }
    $error_message = 'Fehler: Das Verzeichnis ' . htmlspecialchars($dir) . ' ist nicht korrekt konfiguriert.';
    if ($current_dir_perms !== $required_dir_perms) {
        $error_message .= ' Aktuelle Berechtigungen: ' . sprintf("0%o", $current_dir_perms) . ', benötigt: 0770.';
    }
    debug_log($error_message);
    render_error_page($error_message, $instructions);
}

// Prüfe Datei-Berechtigungen (falls config.php bereits existiert)
if (file_exists(CONFIG_PATH)) {
    $instructions = 'Bitte stellen Sie sicher, dass die Datei beschreibbar ist und die Berechtigungen 0666 hat.<br><br>' .
        '<strong>Variante 1: Über den Browser</strong><br>' .
        '<pre>Sie können versuchen ob das Programm selbst die Berechtigungen ändern kann<br>' .
        'durch ein einfaches aktualisieren. Sollten Sie wieder hier landen,<br>' .
        'wählen Sie eine andere Option</pre>' .
        '<strong>Variante 2: Über die Kommandozeile (z.B. SSH)</strong><br>' .
        '<pre>sudo chown www-data:www-data ' . htmlspecialchars(CONFIG_PATH) . '<br>' .
        'sudo chmod 666 ' . htmlspecialchars(CONFIG_PATH) . '</pre>' .
        '<strong>Variante 3: Über ein FTP-Programm (z.B. FileZilla)</strong><br>' .
        '1. Öffnen Sie Ihr FTP-Programm und verbinden Sie sich mit dem Server.<br>' .
        '2. Navigieren Sie zur Datei: <code>' . htmlspecialchars(CONFIG_PATH) . '</code><br>' .
        '3. Rechtsklick auf die Datei → „Dateiberechtigungen...“ (oder „Permissions...“)<br>' .
        '4. Setzen Sie die numerische Berechtigung auf <code>666</code>.<br>' .
        '5. Bestätigen Sie mit „OK“ oder „Übernehmen“.';
    $required_file_perms = 0666; // Während des Setups 0666
    $current_file_perms = fileperms(CONFIG_PATH) & 0777;
    if (!is_writable(CONFIG_PATH) || $current_file_perms !== $required_file_perms) {
        // Vorübergehend Datei-Berechtigungen auf 0666 setzen
        if (!chmod(CONFIG_PATH, 0666)) {
            $error_message = 'Fehler: Konnte Berechtigungen für ' . htmlspecialchars(CONFIG_PATH) . ' nicht auf 0666 setzen.';
            debug_log($error_message);
            render_error_page(
                $error_message, $instructions);
        }
        $error_message = 'Fehler: Die Datei ' . htmlspecialchars(CONFIG_PATH) . ' ist nicht korrekt konfiguriert.';
        if ($current_file_perms !== $required_file_perms) {
            $error_message .= ' Aktuelle Berechtigungen: ' . sprintf("0%o", $current_file_perms) . ', benötigt: 0666.';
        }
        debug_log($error_message);
        render_error_page($error_message, $instructions);
    }
}

// Verarbeitung des Formulars
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $db_host = filter_input(INPUT_POST, 'db_host', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $db_name = filter_input(INPUT_POST, 'db_name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $db_user = filter_input(INPUT_POST, 'db_user', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $db_pass = $_POST['db_pass'];
    $admin_vorname = filter_input(INPUT_POST, 'admin_vorname', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $admin_nachname = filter_input(INPUT_POST, 'admin_nachname', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $admin_email = filter_input(INPUT_POST, 'admin_email', FILTER_SANITIZE_EMAIL);
    $admin_pass = $_POST['admin_pass'];
    $standort_id = filter_input(INPUT_POST, 'standort_id', FILTER_VALIDATE_INT);
    $smtp_host = filter_input(INPUT_POST, 'smtp_host', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $smtp_port = filter_input(INPUT_POST, 'smtp_port', FILTER_VALIDATE_INT);
    $smtp_username = filter_input(INPUT_POST, 'smtp_username', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $smtp_password = $_POST['smtp_password'];
    $smtp_from_email = filter_input(INPUT_POST, 'smtp_from_email', FILTER_SANITIZE_EMAIL);
    $smtp_from_name = filter_input(INPUT_POST, 'smtp_from_name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $smtp_admin_email = filter_input(INPUT_POST, 'smtp_admin_email', FILTER_SANITIZE_EMAIL);
    $fill_example_data = isset($_POST['fill_example_data']) && $_POST['fill_example_data'] === '1';

    if (!$db_host || !$db_name || !$db_user || !$admin_vorname || !$admin_nachname || !$admin_email || !$admin_pass || !$standort_id ||
        !$smtp_host || !$smtp_port || !$smtp_username || !$smtp_from_email || !$smtp_from_name || !$smtp_admin_email) {
        debug_log('Validierungsfehler: Nicht alle Felder ausgefüllt.');
        render_error_page(
            'Bitte füllen Sie alle Felder aus.',
            'Alle Formularfelder sind erforderlich. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.'
        );
    }

    if (!filter_var($admin_email, FILTER_VALIDATE_EMAIL) || !filter_var($smtp_from_email, FILTER_VALIDATE_EMAIL) || !filter_var($smtp_admin_email, FILTER_VALIDATE_EMAIL)) {
        debug_log('Validierungsfehler: Ungültige E-Mail-Adresse.');
        render_error_page(
            'Bitte geben Sie gültige E-Mail-Adressen ein.',
            'Stellen Sie sicher, dass die E-Mail-Adressen korrekt formatiert sind (z. B. user@example.com).'
        );
    }

    if ($smtp_port < 1 || $smtp_port > 65535) {
        debug_log('Validierungsfehler: Ungültiger SMTP-Port.');
        render_error_page(
            'Bitte geben Sie einen gültigen SMTP-Port (1-65535) ein.',
            'Der SMTP-Port muss eine Zahl zwischen 1 und 65535 sein. Häufig verwendete Ports sind 25, 587 oder 465.'
        );
    }

    try {
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec("SET time_zone = '+00:00'");
        debug_log('Datenbankverbindung erfolgreich.');

        // Tabellen einzeln erstellen
        $tables = [
            'standorte' => "
                CREATE TABLE IF NOT EXISTS standorte (
                    standort_id INT NOT NULL AUTO_INCREMENT,
                    name VARCHAR(100) NOT NULL,
                    adresse VARCHAR(255) NOT NULL,
                    plz VARCHAR(10) NOT NULL,
                    ort VARCHAR(100) NOT NULL,
                    telefon VARCHAR(20) DEFAULT NULL,
                    email VARCHAR(100) DEFAULT NULL,
                    PRIMARY KEY (standort_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;",
            'gruppen' => "
                CREATE TABLE IF NOT EXISTS gruppen (
                    gruppen_id INT NOT NULL AUTO_INCREMENT,
                    name VARCHAR(100) NOT NULL,
                    standort_id INT NOT NULL,
                    beschreibung TEXT NOT NULL,
                    kapazitaet INT NOT NULL DEFAULT 10,
                    PRIMARY KEY (gruppen_id),
                    FOREIGN KEY (standort_id) REFERENCES standorte(standort_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;",
            'eltern' => "
                CREATE TABLE IF NOT EXISTS eltern (
                    eltern_id INT NOT NULL AUTO_INCREMENT,
                    vorname VARCHAR(50) NOT NULL,
                    nachname VARCHAR(50) NOT NULL,
                    telefon VARCHAR(20) NOT NULL,
                    email VARCHAR(100) NOT NULL,
                    adresse VARCHAR(255) NOT NULL,
                    login_berechtigung TINYINT(1) NOT NULL DEFAULT 0,
                    passwort_hash VARCHAR(255) DEFAULT NULL,
                    PRIMARY KEY (eltern_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;",
            'kinder' => "
                CREATE TABLE IF NOT EXISTS kinder (
                    kind_id INT NOT NULL AUTO_INCREMENT,
                    vorname VARCHAR(50) NOT NULL,
                    nachname VARCHAR(50) NOT NULL,
                    geburtsdatum DATE NOT NULL,
                    standort_id INT NOT NULL,
                    anwesenheit TEXT NOT NULL,
                    entwicklungsangaben TEXT DEFAULT NULL,
                    gruppen_id INT NOT NULL,
                    PRIMARY KEY (kind_id),
                    FOREIGN KEY (standort_id) REFERENCES standorte(standort_id),
                    FOREIGN KEY (gruppen_id) REFERENCES gruppen(gruppen_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;",
            'kinder_eltern' => "
                CREATE TABLE IF NOT EXISTS kinder_eltern (
                    kind_id INT NOT NULL,
                    eltern_id INT NOT NULL,
                    PRIMARY KEY (kind_id, eltern_id),
                    FOREIGN KEY (kind_id) REFERENCES kinder(kind_id),
                    FOREIGN KEY (eltern_id) REFERENCES eltern(eltern_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;",
            'mitarbeiter' => "
                CREATE TABLE IF NOT EXISTS mitarbeiter (
                    mitarbeiter_id INT NOT NULL AUTO_INCREMENT,
                    vorname VARCHAR(50) NOT NULL,
                    nachname VARCHAR(50) NOT NULL,
                    standort_id INT NOT NULL,
                    email VARCHAR(100) NOT NULL,
                    telefon VARCHAR(20) NOT NULL,
                    rolle VARCHAR(50) NOT NULL,
                    login_berechtigung TINYINT(1) NOT NULL DEFAULT 0,
                    passwort_hash VARCHAR(255) DEFAULT NULL,
                    PRIMARY KEY (mitarbeiter_id),
                    FOREIGN KEY (standort_id) REFERENCES standorte(standort_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;",
            'mitarbeiter_planung' => "
                CREATE TABLE IF NOT EXISTS mitarbeiter_planung (
                    planung_id INT NOT NULL AUTO_INCREMENT,
                    mitarbeiter_id INT NOT NULL,
                    gruppen_id INT DEFAULT NULL,
                    start_zeit DATETIME NOT NULL,
                    end_zeit DATETIME NOT NULL,
                    urlaubszeit TINYINT(1) NOT NULL,
                    status ENUM('ENTWURF','GEBUCHT','FEHLER','WARNUNG') NOT NULL,
                    kommentar TEXT DEFAULT NULL,
                    PRIMARY KEY (planung_id),
                    FOREIGN KEY (mitarbeiter_id) REFERENCES mitarbeiter(mitarbeiter_id),
                    FOREIGN KEY (gruppen_id) REFERENCES gruppen(gruppen_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;",
            'zahlungshistorie' => "
                CREATE TABLE IF NOT EXISTS zahlungshistorie (
                    zahlung_id INT NOT NULL AUTO_INCREMENT,
                    eltern_id INT NOT NULL,
                    betrag DECIMAL(20,0) NOT NULL,
                    datum DATE NOT NULL,
                    zweck VARCHAR(100) NOT NULL,
                    status ENUM('OFFEN','BEZAHLT','STORNIERT') NOT NULL,
                    PRIMARY KEY (zahlung_id),
                    FOREIGN KEY (eltern_id) REFERENCES eltern(eltern_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;",
            'setup_log' => "
                CREATE TABLE IF NOT EXISTS setup_log (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    aktion VARCHAR(255) NOT NULL,
                    details TEXT,
                    zeitstempel TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;",
            'protokoll' => "
                CREATE TABLE IF NOT EXISTS protokoll (
                    protokoll_id INT NOT NULL AUTO_INCREMENT,
                    standort_id INT NOT NULL,
                    mitarbeiter_id INT NOT NULL,
                    tabellenname VARCHAR(50) NOT NULL,
                    datensatz_id INT NOT NULL,
                    aktionstyp ENUM('INSERT','UPDATE','DELETE') NOT NULL,
                    feldname VARCHAR(50) NOT NULL,
                    alter_wert TEXT NOT NULL,
                    neuer_wert TEXT NOT NULL,
                    zeitpunkt DATETIME NOT NULL,
                    PRIMARY KEY (protokoll_id),
                    FOREIGN KEY (mitarbeiter_id) REFERENCES mitarbeiter(mitarbeiter_id),
                    FOREIGN KEY (standort_id) REFERENCES standorte(standort_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;"
        ];

        foreach ($tables as $table_name => $sql) {
            try {
                $pdo->exec($sql);
                debug_log("Tabelle $table_name erfolgreich erstellt.");
            } catch (PDOException $e) {
                debug_log("Fehler beim Erstellen der Tabelle $table_name: " . $e->getMessage());
                render_error_page(
                    "Fehler beim Erstellen der Tabelle $table_name: " . htmlspecialchars($e->getMessage()),
                    'Bitte überprüfen Sie die SQL-Anweisung und die Datenbankeinstellungen. Stellen Sie sicher, dass der Benutzer die erforderlichen Berechtigungen hat.'
                );
            }
        }

        // Standorte-Daten vor Admin-Benutzer einfügen
        if ($fill_example_data) {
            try {
                $pdo->exec("
                    INSERT INTO standorte (standort_id, name, adresse, plz, ort, telefon, email) VALUES
                    (1, 'Kita Sonnenstrahl', 'Hauptstraße 10', '10115', 'Berlin', '0301234567', 'info@sonnenstrahl.de'),
                    (2, 'Kita Regenbogen', 'Schillerstraße 5', '80331', 'München', '0897654321', 'kontakt@regenbogen.de');
                ");
                debug_log('Standorte-Daten erfolgreich eingefügt.');
            } catch (PDOException $e) {
                debug_log('Fehler beim Einfügen der Standorte-Daten: ' . $e->getMessage());
                render_error_page(
                    'Fehler beim Einfügen der Standorte-Daten: ' . htmlspecialchars($e->getMessage()),
                    'Bitte überprüfen Sie die Datenbankeinstellungen und versuchen Sie es erneut.'
                );
            }
        }

        // Admin-Benutzer erstellen
        try {
            $passwort_hash = password_hash($admin_pass, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO mitarbeiter (vorname, nachname, standort_id, email, telefon, rolle, login_berechtigung, passwort_hash) VALUES (?, ?, ?, ?, ?, 'Admin', 1, ?)");
            $stmt->execute([$admin_vorname, $admin_nachname, $standort_id, $admin_email, '0300000000', $passwort_hash]);
            debug_log('Admin-Benutzer erfolgreich erstellt: ' . $admin_email);
        } catch (PDOException $e) {
            debug_log('Fehler beim Erstellen des Admin-Benutzers: ' . $e->getMessage());
            render_error_page(
                'Fehler beim Erstellen des Admin-Benutzers: ' . htmlspecialchars($e->getMessage()),
                'Bitte überprüfen Sie den Standort-ID-Wert (muss in der standorte-Tabelle existieren) und die Datenbankeinstellungen.'
            );
        }

        // Restliche Beispieldaten einfügen
        if ($fill_example_data) {
            try {
                $example_data_sql = file_get_contents(dirname(__DIR__) . '/config/example_data.sql');
                $pdo->exec($example_data_sql);
                debug_log('Beispieldaten erfolgreich eingefügt.');
            } catch (PDOException $e) {
                debug_log('Fehler beim Einfügen der Beispieldaten: ' . $e->getMessage());
                render_error_page(
                    'Fehler beim Einfügen der Beispieldaten: ' . htmlspecialchars($e->getMessage()),
                    'Bitte überprüfen Sie die Datenbankeinstellungen und versuchen Sie es erneut.'
                );
            }
        }

        // config.php schreiben
        $config_content = "<?php\n";
        $config_content .= "// Datenbankverbindungsdaten\n";
        $config_content .= "define('DB_HOST', '$db_host');\n";
        $config_content .= "define('DB_NAME', '$db_name');\n";
        $config_content .= "define('DB_USER', '$db_user');\n";
        $config_content .= "define('DB_PASS', '$db_pass');\n";
        $config_content .= "\n// SMTP-Einstellungen für E-Mails\n";
        $config_content .= "define('SMTP_HOST', '$smtp_host');\n";
        $config_content .= "define('SMTP_PORT', $smtp_port);\n";
        $config_content .= "define('SMTP_USERNAME', '$smtp_username');\n";
        $config_content .= "define('SMTP_PASSWORD', '$smtp_password');\n";
        $config_content .= "define('SMTP_FROM_EMAIL', '$smtp_from_email');\n";
        $config_content .= "define('SMTP_FROM_NAME', '$smtp_from_name');\n";
        $config_content .= "define('SMTP_ADMIN_EMAIL', '$smtp_admin_email');\n";
        $config_content .= "\n// Zusätzliche Konfigurationen\n";
        $config_content .= "define('APP_TIMEZONE', 'Europe/Berlin');\n";
        $config_content .= "define('API_BASE_URL', '/api/');\n";
        $config_content .= "\n// Setze Zeitzone\n";
        $config_content .= "date_default_timezone_set(APP_TIMEZONE);\n";
        $config_content .= "?>\n";

        // config.php mit 0666 schreiben
        if (file_exists(CONFIG_PATH)) {
            if (!chmod(CONFIG_PATH, 0666)) {
                debug_log('Fehler: Konnte Berechtigungen von config.php auf 0666 setzen.');
                render_error_page(
                    'Fehler beim Setzen der Berechtigungen für config.php.',
                    'Bitte stellen Sie sicher, dass die Datei <code>' . htmlspecialchars(CONFIG_PATH) . '</code> beschreibbar ist. Führen Sie auf dem Server folgenden Befehl aus:<br>' .
                    '<pre>sudo chmod 666 ' . htmlspecialchars(CONFIG_PATH) . '</pre>'
                );
            }
        }

        if (file_put_contents(CONFIG_PATH, $config_content) === false) {
            debug_log('Fehler: Konnte config.php nicht schreiben.');
            render_error_page(
                'Fehler beim Erstellen der config.php.',
                'Bitte stellen Sie sicher, dass das Verzeichnis <code>' . htmlspecialchars(dirname(CONFIG_PATH)) . '</code> beschreibbar ist. Führen Sie auf dem Server folgenden Befehl aus:<br>' .
                '<pre>sudo chown www-data:www-data ' . htmlspecialchars(dirname(CONFIG_PATH)) . '<br>sudo chmod 770 ' . htmlspecialchars(dirname(CONFIG_PATH)) . '</pre>'
            );
        }

        // Berechtigungen von config.php auf 0644 setzen
        if (!chmod(CONFIG_PATH, 0644)) {
            debug_log('Fehler: Konnte Berechtigungen von config.php auf 0644 setzen.');
            render_error_page(
                'Fehler beim Setzen der Berechtigungen für config.php.',
                'Die Datei <code>' . htmlspecialchars(CONFIG_PATH) . '</code> wurde erstellt, aber die Berechtigungen konnten nicht auf 0644 gesetzt werden. Bitte führen Sie auf dem Server folgenden Befehl aus:<br>' .
                '<pre>sudo chmod 644 ' . htmlspecialchars(CONFIG_PATH) . '</pre>'
            );
        }
        debug_log('config.php erfolgreich geschrieben und Berechtigungen auf 0644 gesetzt.');

        // Verzeichnis-Berechtigungen auf 0755 setzen
        if (!chmod($dir, 0755)) {
            debug_log('Warnung: Konnte Verzeichnis-Berechtigungen von ' . $dir . ' auf 0755 setzen.');
        } else {
            debug_log('Verzeichnis-Berechtigungen von ' . $dir . ' auf 0755 gesetzt.');
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO setup_log (aktion, details) VALUES ('Setup ausgeführt', ?)");
            $details = "Admin $admin_email erstellt, config.php generiert" . ($fill_example_data ? ", Beispieldaten eingefügt" : "");
            $stmt->execute([$details]);
            debug_log("Setup erfolgreich: $details");
        } catch (PDOException $e) {
            debug_log("Warnung: setup_log-Tabelle nicht vorhanden oder Fehler: " . $e->getMessage());
        }

        header('Location: /login.php');
        exit;
    } catch (PDOException $e) {
        debug_log('Datenbankverbindung fehlgeschlagen: ' . $e->getMessage());
        render_error_page(
            'Datenbankverbindung fehlgeschlagen: ' . htmlspecialchars($e->getMessage()),
            'Bitte überprüfen Sie die Datenbankeinstellungen (Host, Datenbankname, Benutzername, Passwort). Stellen Sie sicher, dass die Datenbank existiert und der Benutzer die erforderlichen Berechtigungen hat. Beispiel zum Erstellen eines Benutzers:<br>' .
            '<pre>mysql -u root -p<br>CREATE DATABASE kiga;<br>CREATE USER \'kigadbaccount\'@\'localhost\' IDENTIFIED BY \'secure_password\';<br>GRANT ALL PRIVILEGES ON kiga.* TO \'kigadbaccount\'@\'localhost\';<br>FLUSH PRIVILEGES;</pre>'
        );
    }
}

debug_log('Setup-Seite wird gerendert.');

?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kita-Verwaltung - Setup</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
        .setup-container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .form-label {
            font-weight: bold;
        }
        .section-divider {
            margin: 30px 0;
        }
        .alert {
            display: none;
            margin-top: 10px;
        }
        .logo { max-width: 200px; margin-bottom: 20px; }
    </style>
</head>
<body>
<?php if ($logo_path): ?>
    <img src="<?php echo htmlspecialchars($logo_path); ?>" alt="Kita Logo" class="logo">
<?php else: ?>
    <p class="error">Logo konnte nicht geladen werden. Bitte überprüfen Sie den Pfad: <?php echo htmlspecialchars($logo_full_path); ?><br>
        Debugging-Info: <?php echo htmlspecialchars(implode('; ', $logo_debug)); ?></p>
<?php endif; ?>
<div class="setup-container">
    <h1 class="text-center mb-4">Kita-Verwaltung Setup</h1>
    <form method="POST" action="setup.php" id="setupForm">
        <h4>Datenbankeinstellungen</h4>
        <div class="mb-3">
            <label for="db_host" class="form-label">Datenbank-Host</label>
            <input type="text" class="form-control" id="db_host" name="db_host" value="localhost" required>
        </div>
        <div class="mb-3">
            <label for="db_name" class="form-label">Datenbankname</label>
            <input type="text" class="form-control" id="db_name" name="db_name" value="kiga" required>
        </div>
        <div class="mb-3">
            <label for="db_user" class="form-label">Datenbank-Benutzer</label>
            <input type="text" class="form-control" id="db_user" name="db_user" required>
        </div>
        <div class="mb-3">
            <label for="db_pass" class="form-label">Datenbank-Passwort</label>
            <input type="password" class="form-control" id="db_pass" name="db_pass" required>
        </div>
        <button type="button" class="btn btn-outline-secondary w-100 mb-3" id="testDbConnection">Datenbankverbindung testen</button>
        <div id="dbConnectionResult" class="alert"></div>
        <hr class="section-divider">

        <h4>Admin-Benutzer</h4>
        <div class="mb-3">
            <label for="admin_vorname" class="form-label">Vorname</label>
            <input type="text" class="form-control" id="admin_vorname" name="admin_vorname" required>
        </div>
        <div class="mb-3">
            <label for="admin_nachname" class="form-label">Nachname</label>
            <input type="text" class="form-control" id="admin_nachname" name="admin_nachname" required>
        </div>
        <div class="mb-3">
            <label for="admin_email" class="form-label">E-Mail</label>
            <input type="email" class="form-control" id="admin_email" name="admin_email" required>
        </div>
        <div class="mb-3">
            <label for="admin_pass" class="form-label">Passwort</label>
            <input type="password" class="form-control" id="admin_pass" name="admin_pass" required>
        </div>
        <div class="mb-3">
            <label for="standort_id" class="form-label">Standort-ID</label>
            <input type="number" class="form-control" id="standort_id" name="standort_id" value="1" required>
        </div>
        <hr class="section-divider">

        <h4>SMTP-Einstellungen</h4>
        <div class="mb-3">
            <label for="smtp_host" class="form-label">SMTP-Host</label>
            <input type="text" class="form-control" id="smtp_host" name="smtp_host" required>
        </div>
        <div class="mb-3">
            <label for="smtp_port" class="form-label">SMTP-Port</label>
            <input type="number" class="form-control" id="smtp_port" name="smtp_port" value="587" required>
        </div>
        <div class="mb-3">
            <label for="smtp_username" class="form-label">SMTP-Benutzername</label>
            <input type="text" class="form-control" id="smtp_username" name="smtp_username" required>
        </div>
        <div class="mb-3">
            <label for="smtp_password" class="form-label">SMTP-Passwort</label>
            <input type="password" class="form-control" id="smtp_password" name="smtp_password" required>
        </div>
        <div class="mb-3">
            <label for="smtp_from_email" class="form-label">Absender-E-Mail</label>
            <input type="email" class="form-control" id="smtp_from_email" name="smtp_from_email" required>
        </div>
        <div class="mb-3">
            <label for="smtp_from_name" class="form-label">Absender-Name</label>
            <input type="text" class="form-control" id="smtp_from_name" name="smtp_from_name" required>
        </div>
        <div class="mb-3">
            <label for="smtp_admin_email" class="form-label">Admin-E-Mail</label>
            <input type="email" class="form-control" id="smtp_admin_email" name="smtp_admin_email" required>
        </div>
        <button type="button" class="btn btn-outline-secondary w-100 mb-3" id="testSmtpConnection">SMTP-Verbindung testen</button>
        <div id="smtpConnectionResult" class="alert"></div>
        <hr class="section-divider">

        <h4>Beispieldaten</h4>
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="fill_example_data" name="fill_example_data" value="1">
            <label class="form-check-label" for="fill_example_data">Datenbank mit Beispieldaten füllen</label>
        </div>
        <hr class="section-divider">

        <button type="submit" class="btn btn-primary w-100">Setup ausführen</button>
    </form>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM vollständig geladen.');

        const testDbButton = document.getElementById('testDbConnection');
        if (!testDbButton) {
            console.error('Fehler: Element #testDbConnection nicht gefunden.');
        } else {
            console.log('Event-Listener für testDbConnection wird hinzugefügt.');
            testDbButton.addEventListener('click', function() {
                console.log('testDbConnection Button geklickt.');
                const db_host = document.getElementById('db_host').value;
                const db_name = document.getElementById('db_name').value;
                const db_user = document.getElementById('db_user').value;
                const db_pass = document.getElementById('db_pass').value;
                const resultDiv = document.getElementById('dbConnectionResult');

                console.log('Sende Daten:', { type: 'db', db_host, db_name, db_user, db_pass });

                fetch('/setup/check_connection.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `type=db&db_host=${encodeURIComponent(db_host)}&db_name=${encodeURIComponent(db_name)}&db_user=${encodeURIComponent(db_user)}&db_pass=${encodeURIComponent(db_pass)}`
                })
                    .then(response => {
                        console.log('Antwort-Status:', response.status, response.statusText);
                        return response.text();
                    })
                    .then(text => {
                        console.log('Rohantwort:', text);
                        try {
                            const data = JSON.parse(text);
                            resultDiv.style.display = 'block';
                            resultDiv.className = `alert ${data.success ? 'alert-success' : 'alert-danger'}`;
                            resultDiv.innerText = data.message;
                        } catch (e) {
                            console.error('Fehler beim Parsen der Antwort:', e.message);
                            resultDiv.style.display = 'block';
                            resultDiv.className = 'alert alert-danger';
                            resultDiv.innerText = 'Fehler beim Parsen der Antwort: ' + e.message + '\nRohantwort: ' + text;
                        }
                    })
                    .catch(error => {
                        console.error('Fetch-Fehler:', error);
                        resultDiv.style.display = 'block';
                        resultDiv.className = 'alert alert-danger';
                        resultDiv.innerText = 'Fehler beim Testen der Verbindung: ' + error.message;
                    });
            });
        }

        const testSmtpButton = document.getElementById('testSmtpConnection');
        if (!testSmtpButton) {
            console.error('Fehler: Element #testSmtpConnection nicht gefunden.');
        } else {
            console.log('Event-Listener für testSmtpConnection wird hinzugefügt.');
            testSmtpButton.addEventListener('click', function() {
                console.log('testSmtpConnection Button geklickt.');
                const smtp_host = document.getElementById('smtp_host').value;
                const smtp_port = document.getElementById('smtp_port').value;
                const smtp_username = document.getElementById('smtp_username').value;
                const smtp_password = document.getElementById('smtp_password').value;
                const smtp_from_email = document.getElementById('smtp_from_email').value;
                const smtp_from_name = document.getElementById('smtp_from_name').value;
                const smtp_admin_email = document.getElementById('smtp_admin_email').value;
                const resultDiv = document.getElementById('smtpConnectionResult');

                console.log('Sende Daten:', { type: 'smtp', smtp_host, smtp_port, smtp_username, smtp_password, smtp_from_email, smtp_from_name, smtp_admin_email });

                fetch('/setup/check_connection.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `type=smtp&smtp_host=${encodeURIComponent(smtp_host)}&smtp_port=${encodeURIComponent(smtp_port)}&smtp_username=${encodeURIComponent(smtp_username)}&smtp_password=${encodeURIComponent(smtp_password)}&smtp_from_email=${encodeURIComponent(smtp_from_email)}&smtp_from_name=${encodeURIComponent(smtp_from_name)}&smtp_admin_email=${encodeURIComponent(smtp_admin_email)}`
                })
                    .then(response => {
                        console.log('Antwort-Status:', response.status, response.statusText);
                        return response.text();
                    })
                    .then(text => {
                        console.log('Rohantwort:', text);
                        try {
                            const data = JSON.parse(text);
                            resultDiv.style.display = 'block';
                            resultDiv.className = `alert ${data.success ? 'alert-success' : 'alert-danger'}`;
                            resultDiv.innerText = data.message;
                        } catch (e) {
                            console.error('Fehler beim Parsen der Antwort:', e.message);
                            resultDiv.style.display = 'block';
                            resultDiv.className = 'alert alert-danger';
                            resultDiv.innerText = 'Fehler beim Parsen der Antwort: ' + e.message + '\nRohantwort: ' + text;
                        }
                    })
                    .catch(error => {
                        console.error('Fetch-Fehler:', error);
                        resultDiv.style.display = 'block';
                        resultDiv.className = 'alert alert-danger';
                        resultDiv.innerText = 'Fehler beim Testen der Verbindung: ' + error.message;
                    });
            });
        }
    });
</script>
</body>
</html>