<!-- Arquivo PHP para processar os dados: e019732a@educacao.sp.gov.br -->
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $motivo = $_POST['motivo'];
    $assunto = $_POST['assunto'];
    $mensagem = $_POST['mensagem'];
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $contato = $_POST['contato'];

    $to = "tanziiinff@gmail.com"; 
    $subject = "Nova mensagem de Fale Conosco";
    $body = "Nome: $nome\nE-mail: $email\nMotivo: $motivo\nAssunto: $assunto\nMensagem: $mensagem\nContato telefônico: $contato";
    $headers = "From: $email";

    if (mail($to, $subject, $body, $headers)) {
        echo "<script>alert('Mensagem enviada com sucesso!'); window.location.href='/fale-conosco';</script>";
    } else {
        echo "<script>alert('Erro ao enviar a mensagem. Tente novamente.'); window.history.back();</script>";
    }
}
?>

