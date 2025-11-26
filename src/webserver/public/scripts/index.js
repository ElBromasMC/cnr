function FPending(target){
    target.className="alert--warning"
    target.innerHTML = "Enviando el mensaje..."
}
function FSuccess(target){
    target.className="alert--success"
    target.innerHTML = "Enviado correctamente" 
    closeAlert(target)
}
function FError(target){
    target.className="alert--danger"
    target.innerHTML = "Error en el envio" 
    closeAlert(target)
}

function closeAlert(target){
    setTimeout(() => {
        target.className = ""
        target.innerHTML = ""
    }, 5000)
}


async function enviarFormulario(event) {
    event.preventDefault()
    if (enviarFormulario.enviando) { return; }
    enviarFormulario.enviando = true
    const form = event.target
    const result = document.getElementById("form__msg")

    FPending(result)
    try {   
        const formData = new FormData(form);

        const init = {
            method: form.method,
            body: formData,
        };

        console.log(init)

        const response = await fetch(form.action, init);
        if (response.ok) {
            const respuesta = await response.json();
            FSuccess(result)
            form.reset()
        } else {
            throw new Error(response.statusText)
        }
    } catch (err) {
        FError(result)
    }
    enviarFormulario.enviando = false;
}

function calculateVh() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
}
calculateVh();
window.addEventListener('resize', calculateVh);
window.addEventListener('orientationchange', calculateVh);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("contactForm").addEventListener("submit", enviarFormulario);
});

