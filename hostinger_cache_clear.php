<?php

/**
 * Hostinger-də keşin təmizlənməsi üçün skript
 * 
 * Bu skript Hostinger host planında server keşini təmizləmək üçün istifadə olunur.
 * OPcache və digər potensial server keşlərini təmizləyir.
 */

// Skript icrasına başlama vaxtını qeyd edirik
$startTime = microtime(true);

// Təhlükəsizlik məqsədilə skripti sadəcə müəyyən IP ünvanlarından çağırmağa icazə veririk
// Bu IP ünvanlarını öz IP ünvanlarınızla əvəz edin
$allowedIps = [
    '127.0.0.1',         // localhost
    '::1',               // localhost IPv6
    // Burada öz IP ünvanlarınızı əlavə edin
];

// Cari istifadəçi IP-si
$currentIp = $_SERVER['REMOTE_ADDR'];

// İstifadəçinin IP ünvanı icazəli siyahıda deyilsə, çıxış
if (!in_array($currentIp, $allowedIps)) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized IP address: ' . $currentIp
    ]);
    exit;
}

// Keşləri təmizləməyə başlayırıq
$results = [];

// 1. OPcache varsa təmizləyirik
if (function_exists('opcache_reset')) {
    $opcacheCleared = opcache_reset();
    $results['opcache'] = $opcacheCleared ? 'cleared' : 'failed';
} else {
    $results['opcache'] = 'not available';
}

// 2. APC keşi varsa təmizləyirik
if (function_exists('apc_clear_cache')) {
    apc_clear_cache();
    $results['apc'] = 'cleared';
} else {
    $results['apc'] = 'not available';
}

// 3. Əgər Memcached istifadə olunursa
if (class_exists('Memcached')) {
    try {
        $memcached = new Memcached();
        $memcached->addServer('127.0.0.1', 11211);
        $memcached->flush();
        $results['memcached'] = 'cleared';
    } catch (Exception $e) {
        $results['memcached'] = 'error: ' . $e->getMessage();
    }
} else {
    $results['memcached'] = 'not available';
}

// 4. Əgər Redis istifadə olunursa
if (class_exists('Redis')) {
    try {
        $redis = new Redis();
        $redis->connect('127.0.0.1', 6379);
        $redis->flushAll();
        $results['redis'] = 'cleared';
    } catch (Exception $e) {
        $results['redis'] = 'error: ' . $e->getMessage();
    }
} else {
    $results['redis'] = 'not available';
}

// 5. Əl ilə temp fayllarını təmizləyirik
$tempPath = sys_get_temp_dir();
$deletedFiles = 0;
$totalFiles = 0;

// Added safety check: Verify temp directory exists and is accessible
if (!file_exists($tempPath) || !is_dir($tempPath) || !is_readable($tempPath)) {
    $results['temp_files'] = 'error: Temporary directory inaccessible';
} else {
    try {
        $dir = new DirectoryIterator($tempPath);
        foreach ($dir as $fileinfo) {
            if (!$fileinfo->isDot() && !$fileinfo->isDir()) {
                $totalFiles++;
                $filePath = $fileinfo->getPathname();
                // Only delete PHP temporary files with stricter pattern matching
                // Match php temporary files that follow php's naming convention (php[A-Za-z0-9]{6})
                if (preg_match('/php[A-Za-z0-9]{6}/', $filePath)) {
                    // Additional safety: check file age > 1 hour
                    $fileAge = time() - $fileinfo->getMTime();
                    if ($fileAge > 3600) { // Older than 1 hour
                        if (@unlink($filePath)) {
                            $deletedFiles++;
                        }
                    }
                }
            }
        }
        $results['temp_files'] = "$deletedFiles/$totalFiles deleted";
    } catch (Exception $e) {
        $results['temp_files'] = 'error: ' . $e->getMessage();
    }
}


// 6. Hostinger spesifik keş fayllarını təmizləyirik (əgər mümkünsə)
$hostingerCachePath = '/home/' . get_current_user() . '/hostinger/logs/cache';
// Added safety check: Verify hostinger cache directory exists and is accessible
if (!file_exists($hostingerCachePath) || !is_dir($hostingerCachePath) || !is_readable($hostingerCachePath)) {
    $results['hostinger_cache'] = 'path not found or inaccessible';
} else {
    try {
        $hostingerCacheFiles = 0;
        $hostingerCacheDeleted = 0;

        $dir = new DirectoryIterator($hostingerCachePath);
        foreach ($dir as $fileinfo) {
            if (!$fileinfo->isDot() && !$fileinfo->isDir()) {
                $hostingerCacheFiles++;
                $filePath = $fileinfo->getPathname();
                if (@unlink($filePath)) {
                    $hostingerCacheDeleted++;
                }
            }
        }
        $results['hostinger_cache'] = "$hostingerCacheDeleted/$hostingerCacheFiles deleted";
    } catch (Exception $e) {
        $results['hostinger_cache'] = 'error: ' . $e->getMessage();
    }
}

// Sistemi yoxlayırıq
$systemInfo = [
    'php_version' => PHP_VERSION,
    'server_software' => $_SERVER['SERVER_SOFTWARE'],
    'operating_system' => PHP_OS,
    'server_time' => date('Y-m-d H:i:s'),
    'execution_time' => round(microtime(true) - $startTime, 4) . ' seconds'
];

// Nəticələri qaytarırıq
header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'message' => 'Cache clearing operations completed',
    'cache_results' => $results,
    'system_info' => $systemInfo
], JSON_PRETTY_PRINT);
?>