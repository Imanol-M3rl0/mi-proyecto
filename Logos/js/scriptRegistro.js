document.addEventListener('DOMContentLoaded', () => { /* asegura que el código JavaScript solo se ejecute una vez que toda la estructura HTML del documento se haya cargado y parseado. */
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');

    if (menuToggle && sidebar) /* El código verifica que ambos elementos hayan sido encontrados (if (menuToggle && sidebar) */{
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            /* Si la clase open NO está presente, la añade (abriendo la barra)
Si la clase open SÍ está presente, la elimina (cerrando la barra) */
            if (sidebar.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
            /* Cuando la barra lateral se abre (tiene la clase open), Esto desactiva el scroll vertical del cuerpo principal de la página
                Cuando se cierra, se vuelve a establecer a auto (o su valor predeterminado), reactivando el scroll. */
            
        });

        document.addEventListener('click', (event) => {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            /* !isClickInsideSidebar = No hice clic dentro de la barra lateral
             !isClickOnToggle = No hice clic en el botón.
             sidebar.classList.contains('open') = La barra lateral está abierta. */

            if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                document.body.style.overflow = 'auto';
            }
            /* Se elimina la clase open (cerrando la barra).
            Se reactiva el desplazamiento vertical ( */
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registro-form'); 
    const mensajeRegistro = document.getElementById('mensaje-registro');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const contrasenaValor = document.getElementById('Contraseña').value.trim(); 
            
            if (!nombre || !email || !contrasenaValor) {
                mostrarMensaje("Debe llenar todos los campos obligatorios.", 'error');
                return;
            }

            const nuevoUsuario = {
                nombre: nombre,
                email: email,
                contrasena: contrasenaValor, 
            };

            localStorage.setItem('usuarioBisa', JSON.stringify(nuevoUsuario));

            mostrarMensaje("¡Registro exitoso! Redirigiendo a Iniciar Sesión...", 'success');
            
            setTimeout(() => {
                window.location.href = "BancoBisaInicio.html";
            }, 1500); 
        });
    }

    function mostrarMensaje(texto, tipo) {
        if (mensajeRegistro) {
            mensajeRegistro.textContent = texto;
            mensajeRegistro.className = `mensaje-registro ${tipo}`;
        }
    }
});