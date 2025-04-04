<?php

/**
 * BarterTap.az Ana Giriş Nöqtəsi
 * 
 * Bu fayl PHP serverə icazə verir ki, əsas saytı index.html faylı vasitəsilə təqdim etsin.
 * Digər PHP skriptləri public_html qovluğunun içində yerləşdirilə bilər.
 */

// İstifadəçi agenti və URI məlumatlarını loq et (problem yarandıqda diaqnostika üçün)
$user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Unknown';
$request_uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';

$log_message = date('Y-m-d H:i:s') . " - UA: $user_agent - URI: $request_uri\n";
@file_put_contents('access.log', $log_message, FILE_APPEND);

// Əsas index.html faylı təqdim edilir
$html_file = './index.html';

if (file_exists($html_file)) {
    // MIME tipini düzgün təyin edirik
    header('Content-Type: text/html; charset=UTF-8');

    // Faylı oxuyub göndəririk
    echo file_get_contents($html_file);
} else {
    // index.html tapılmadı
    header('HTTP/1.1 500 Internal Server Error');
    echo <h1>Xəta</h1>';
    echo <p>index.html faylı tapılmadı. Zəhmət olmasa administratorla əlaqə saxlayın.</p>';

    // Xəta loqu
    $error_message = date('Y-m-d H:i:s') . " - ERROR: index.html not found\n";
    @file_put_contents('error.log', $error_message, FILE_APPEND);
}
?>