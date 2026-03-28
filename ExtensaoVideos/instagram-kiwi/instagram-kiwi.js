// variável de controle (true por padrão)
let useGrayscale = true;

setTimeout(() => {

    // cria o botão
    const toggleBtn = document.createElement('div');
    toggleBtn.innerText = 'GS';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = '20px';
    toggleBtn.style.left = '20px';
    toggleBtn.style.width = '25px';
    toggleBtn.style.height = '25px';
    toggleBtn.style.borderRadius = '50%';
    toggleBtn.style.background = '#000';
    toggleBtn.style.color = '#fff';
    toggleBtn.style.display = 'flex';
    toggleBtn.style.alignItems = 'center';
    toggleBtn.style.justifyContent = 'center';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.fontWeight = 'bold';
    toggleBtn.style.zIndex = '999999';
    toggleBtn.style.opacity = '0.7';

    // efeito visual de ligado/desligado
    function updateButtonStyle() {
        toggleBtn.style.background = useGrayscale ? '#000' : '#888';
    }

    // clique do botão
    toggleBtn.addEventListener('click', () => {
        useGrayscale = !useGrayscale;
        updateButtonStyle();
    });

    // adiciona o botão à página
    document.body.appendChild(toggleBtn);
    updateButtonStyle();
}, 5000);

// interval principal
setInterval(() => {
    if (location.host === 'www.instagram.com') {
        document
            .querySelectorAll('body, [data-pagelet="IGDChatTabsRootContent"], a[href="/direct/inbox/"]')
            .forEach(el => {
                el.style.filter = useGrayscale ? 'grayscale(100%)' : '';
            });
    }
}, 1000);
