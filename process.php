<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Captura os dados do formulário
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);

    // Captura o IP do usuário
    $user_ip = $_SERVER['REMOTE_ADDR'];

    // Captura o dispositivo do usuário
    $user_agent = $_SERVER['HTTP_USER_AGENT'];

    // Data da conversão
    $conversion_date = date("d/m/Y H:i:s");

    // ID do formulário (pode ser estático ou dinâmico, conforme necessário)
    $form_id = "123456";

    // Faz a requisição para uma API de geolocalização para obter informações do IP
    $geo_url = "http://ip-api.com/json/$user_ip?fields=status,country,regionName,city";
    $geo_data = file_get_contents($geo_url);
    $geo_info = json_decode($geo_data, true);

    // Verifica se a API retornou os dados corretamente
    if ($geo_info['status'] === 'success') {
        $country = $geo_info['country'];
        $region = $geo_info['regionName'];
        $city = $geo_info['city'];
    } else {
        $country = "Desconhecido";
        $region = "Desconhecido";
        $city = "Desconhecido";
    }

    // Dados a serem enviados para a Planilha do Google
    $data = [
        "name" => $name,
        "email" => $email,
        "device" => $user_agent,
        "ip" => $user_ip,
        "conversionDate" => $conversion_date,
        "formId" => $form_id,
        "country" => $country,
        "region" => $region,
        "city" => $city
    ];

    // URL do aplicativo da web do Google Apps Script
    $google_webhook_url = "https://script.google.com/macros/s/AKfycbxA_tyTeS_h5FCAB_OYeA3aPHtWF5Px8ueXH2Hg8ImVlNY6BwQJCmvhUBRKqfKsz3fw/exec";

    // Enviar dados via POST para o Google Apps Script
    $options = [
        "http" => [
            "header" => "Content-Type: application/json\r\n",
            "method" => "POST",
            "content" => json_encode($data)
        ]
    ];
    $context = stream_context_create($options);
    $response = file_get_contents($google_webhook_url, false, $context);

    if ($response === FALSE) {
        die("Erro ao enviar os dados para o Google Sheets!");
    }

    echo "Formulário enviado com sucesso!";
}
?>
