<?php
header('Content-Type: application/json');
require_once '../config/config.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $passwort = $data['passwort'] ?? '';

    if (!$email || !$passwort) {
        http_response_code(400);
        echo json_encode(['error' => 'E-Mail und Passwort erforderlich']);
        exit;
    }

    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Prüfe in mitarbeiter
        $stmt = $pdo->prepare("SELECT mitarbeiter_id, passwort_hash, rolle FROM mitarbeiter WHERE email = ? AND login_berechtigung = 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($passwort, $user['passwort_hash'])) {
            $_SESSION['user_id'] = $user['mitarbeiter_id'];
            $_SESSION['user_type'] = 'mitarbeiter';
            $_SESSION['rolle'] = $user['rolle'];
            echo json_encode(['success' => true, 'redirect' => '/public/index.html']);
            exit;
        }

        // Prüfe in eltern
        $stmt = $pdo->prepare("SELECT eltern_id, passwort_hash FROM eltern WHERE email = ? AND login_berechtigung = 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($passwort, $user['passwort_hash'])) {
            $_SESSION['user_id'] = $user['eltern_id'];
            $_SESSION['user_type'] = 'eltern';
            $_SESSION['rolle'] = 'Eltern';
            echo json_encode(['success' => true, 'redirect' => '/public/index.html']);
            exit;
        }

        http_response_code(401);
        echo json_encode(['error' => 'Ungültige Anmeldedaten']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Datenbankfehler: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Nur POST-Anfragen erlaubt']);
}
?>