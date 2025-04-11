function menuShow() {
    let menuMobile = document.querySelector('.mobile-menu');
    if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        document.querySelector('.icon').src = "assets/menu_white_36dp.svg";
    } else {
        menuMobile.classList.add('open');
        document.querySelector('.icon').src = "assets/close_white_36dp.svg";
    }
}

const parceriasLink = document.getElementById('parcerias');
const box = document.getElementById('box')

parceriasLink.addEventListener('mouseover', function() {
    box.style.display = 'block'; // Exibe a box
});

// Função para ocultar a box com transição
parceriasLink.addEventListener('mouseout', function() {
    setTimeout(() => {
        box.style.display = 'none';
    }, 5000);
});

