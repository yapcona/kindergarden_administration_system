<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once dirname(__DIR__) . '/config/security.php';
require_once dirname(__DIR__) . '/config/session.php';

debug_log('check_connection.php aufgerufen. REQUEST_METHOD: ' . $_SERVER['REQUEST_METHOD'] . ', POST-Daten: ' . json_encode($_POST));
debug_log('Raw POST input: ' . file_get_contents('php://input'));

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Ungültige Anfrage. Nur POST-Anfragen erlaubt.';
    debug_log('Fehler: Ungültige Anfrage. REQUEST_METHOD ist nicht POST.');
    echo json_encode($response);
    exit;
}

if (!isset($_POST['type'])) {
    $response['message'] = 'Anfragetyp fehlt.';
    debug_log('Fehler: Anfragetyp fehlt. POST[type] ist nicht gesetzt.');
    echo json_encode($response);
    exit;
}

debug_log('Erkannter Anfragetyp: ' . $_POST['type']);

if ($_POST['type'] === 'db') {
    $db_host = $_POST['db_host'] ?? '';
    $db_name = $_POST['db_name'] ?? '';
    $db_user = $_POST['db_user'] ?? '';
    $db_pass = $_POST['db_pass'] ?? '';

    if (empty($db_host) || empty($db_name) || empty($db_user)) {
        $response['message'] = 'Datenbank-Host, -Name oder -Benutzer fehlen.';
        debug_log('Fehler: Datenbank-Host, -Name oder -Benutzer fehlen.');
        echo json_encode($response);
        exit;
    }

    try {
        debug_log('Versuche Datenbankverbindung mit Host: ' . $db_host . ', DB: ' . $db_name . ', User: ' . $db_user);
        $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
        if ($conn->connect_error) {
            debug_log('Datenbankverbindung fehlgeschlagen: ' . $conn->connect_error);
            $response['message'] = 'Datenbankverbindung fehlgeschlagen: ' . $conn->connect_error;
        } else {
            debug_log('Datenbankverbindung erfolgreich.');
            $response['success'] = true;
            $response['message'] = 'Datenbankverbindung erfolgreich.';
            $conn->close();
        }
    } catch (Exception $e) {
        debug_log('Fehler beim Herstellen der Datenbankverbindung: ' . $e->getMessage());
        $response['message'] = 'Fehler beim Herstellen der Datenbankverbindung: ' . $e->getMessage();
    }
} elseif ($_POST['type'] === 'smtp') {
    $smtp_host = $_POST['smtp_host'] ?? '';
    $smtp_port = $_POST['smtp_port'] ?? '';
    $smtp_username = $_POST['smtp_username'] ?? '';
    $smtp_password = $_POST['smtp_password'] ?? '';
    $smtp_from_email = $_POST['smtp_from_email'] ?? '';
    $smtp_from_name = $_POST['smtp_from_name'] ?? '';
    $smtp_admin_email = $_POST['smtp_admin_email'] ?? '';

    if (empty($smtp_host) || empty($smtp_port) || empty($smtp_username)) {
        $response['message'] = 'SMTP-Host, -Port oder -Benutzername fehlen.';
        debug_log('Fehler: SMTP-Host, -Port oder -Benutzername fehlen.');
        echo json_encode($response);
        exit;
    }

    try {
        debug_log('Lade PHPMailer: ' . dirname(__DIR__) . '/vendor/autoload.php');
        if (!file_exists(dirname(__DIR__) . '/vendor/autoload.php')) {
            debug_log('Fehler: PHPMailer autoload.php nicht gefunden.');
            $response['message'] = 'Fehler: PHPMailer nicht installiert.';
            echo json_encode($response);
            exit;
        }
        require_once dirname(__DIR__) . '/vendor/autoload.php';
        debug_log('Versuche SMTP-Verbindung mit Host: ' . $smtp_host . ', Port: ' . $smtp_port . ', User: ' . $smtp_username);
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $smtp_host;
        $mail->Port = $smtp_port;
        $mail->SMTPAuth = true;
        $mail->Username = $smtp_username;
        $mail->Password = $smtp_password;
        $mail->SMTPSecure = $smtp_port == 465 ? 'ssl' : 'tls';
        $mail->setFrom($smtp_from_email ?: $smtp_username, $smtp_from_name ?: 'Test');
        $mail->addAddress($smtp_admin_email ?: $smtp_username);
        $mail->Subject = 'SMTP-Verbindungstest';
        $mail->Body = 'Dies ist eine Test-E-Mail von Kita-Verwaltung.';

        if ($mail->smtpConnect()) {
            debug_log('SMTP-Verbindung erfolgreich.');
            $response['success'] = true;
            $response['message'] = 'SMTP-Verbindung erfolgreich.';
            $mail->smtpClose();
        } else {
            debug_log('SMTP-Verbindung fehlgeschlagen.');
            $response['message'] = 'SMTP-Verbindung fehlgeschlagen.';
        }
    } catch (Exception $e) {
        debug_log('Fehler beim Herstellen der SMTP-Verbindung: ' . $e->getMessage());
        $response['message'] = 'Fehler beim Herstellen der SMTP-Verbindung: ' . $e->getMessage();
    }
} else {
    $response['message'] = 'Ungültiger Anfragetyp: ' . htmlspecialchars($_POST['type']);
    debug_log('Fehler: Ungültiger Anfragetyp: ' . $_POST['type']);
}

echo json_encode($response);
exit;
?>