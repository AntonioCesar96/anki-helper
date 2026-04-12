if (location.host === 'web.whatsapp.com') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMWhatsapp);
    } else {
        afterDOMWhatsapp();
    }
}

function afterDOMWhatsapp() {

    setTimeout(() => {

        addstyleElementWhatsapp();
    
    }, 5000);

}

var styleElementWhatsapp;

function addstyleElementWhatsapp() {
    if (styleElementWhatsapp) {
        styleElementWhatsapp.parentElement.removeChild(styleElementWhatsapp);
    }

    styleElementWhatsapp = document.createElement('style');

    styleElementWhatsapp.innerHTML += `.message-in ._amkd, .message-out ._amkd {max-width: 90%; !important;} `;

    document.head.appendChild(styleElementWhatsapp);
}