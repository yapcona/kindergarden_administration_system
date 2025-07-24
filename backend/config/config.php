<?php
// Datenbankverbindungsdaten
define('DB_HOST', 'localhost');
define('DB_NAME', 'kita_db');
define('DB_USER', 'kita_user');
define('DB_PASS', 'secure_password');

// SMTP-Einstellungen für E-Mails
define('SMTP_HOST', 'smtp.example.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'user@example.com');
define('SMTP_PASSWORD', 'smtp_password');
define('SMTP_FROM_EMAIL', 'info@kita.de');
define('SMTP_FROM_NAME', 'Kita Verwaltung');
define('SMTP_ADMIN_EMAIL', 'admin@kita.de');

// Zusätzliche Konfigurationen
define('APP_TIMEZONE', 'Europe/Berlin');
define('API_BASE_URL', '/api/');

// Setze Zeitzone
date_default_timezone_set(APP_TIMEZONE);
?>