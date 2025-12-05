// =========================================================
// Variables y Configuración Inicial
// =========================================================

// Estructura de datos para simular cuentas (se carga al iniciar)
let cuentas = [
    { id: 1, nombre: "Cuenta Ahorro BISA", saldo: 1500.50 },
    { id: 2, nombre: "Cuenta Corriente", saldo: 300.00 }
];

// Contador para asignar IDs únicos a las nuevas cuentas
let proximoId = 3; 

// Almacena el objeto de la cuenta actualmente seleccionada por el usuario
let cuentaSeleccionada = null; 

// =========================================================
// Obtención de Elementos del DOM
// =========================================================
const listaPlaceholder = document.querySelector('.list-placeholder');
const botonAgregar = document.getElementById('boton-agregar');
const botonBorrar = document.getElementById('boton-borrar');

const cuentaNombreInput = document.getElementById('cuenta-nombre');
const cuentaSaldoInput = document.getElementById('cuenta-saldo');

const montoOperacionInput = document.getElementById('monto-operacion');

// Elementos de operación (para manejar Depósito/Retiro)
const panelOperacion = document.querySelector('.panel-deposito-retiro');
const textoDeposito = panelOperacion.querySelector('p:nth-child(1)'); // Primer <p> es Deposito
const textoRetiro = panelOperacion.querySelector('p:nth-child(2)');  // Segundo <p> es Retiro

// =========================================================
// Funciones de Lógica Central
// =========================================================

/**
 * Muestra las cuentas en la lista lateral y les añade el evento click.
 */
function renderizarCuentas() {
    listaPlaceholder.innerHTML = ''; // Limpia el contenedor

    cuentas.forEach(cuenta => {
        const elementoCuenta = document.createElement('div');
        elementoCuenta.classList.add('entrada-cuenta');
        elementoCuenta.textContent = `${cuenta.nombre} ($${cuenta.saldo.toFixed(2)})`;
        
        // Resaltar la cuenta si está seleccionada
        if (cuentaSeleccionada && cuenta.id === cuentaSeleccionada.id) {
            elementoCuenta.classList.add('seleccionada');
        }

        // 1. Evento para SELECCIONAR la cuenta
        elementoCuenta.addEventListener('click', () => {
            seleccionarCuenta(cuenta);
        });
        
        listaPlaceholder.appendChild(elementoCuenta);
    });
}

/**
 * Establece la cuenta activa y actualiza los campos de saldo y nombre.
 * @param {Object} cuenta - La cuenta seleccionada.
 */
function seleccionarCuenta(cuenta) {
    cuentaSeleccionada = cuenta;
    
    // 1. Actualiza los inputs de solo lectura
    cuentaNombreInput.value = cuenta.nombre;
    cuentaSaldoInput.value = `$${cuenta.saldo.toFixed(2)}`;

    // 2. Vuelve a renderizar para aplicar el estilo 'seleccionada'
    renderizarCuentas(); 
}

/**
 * Realiza una operación de depósito o retiro.
 * @param {string} tipo - 'deposito' o 'retiro'.
 */
function realizarOperacion(tipo) {
    if (!cuentaSeleccionada) {
        alert("¡Error! Debes seleccionar una cuenta primero.");
        return;
    }

    const monto = parseFloat(montoOperacionInput.value);

    if (isNaN(monto) || monto <= 0) {
        alert("¡Error! Ingresa un monto válido y positivo.");
        return;
    }

    let indice = cuentas.findIndex(c => c.id === cuentaSeleccionada.id);

    if (tipo === 'deposito') {
        cuentas[indice].saldo += monto;
        alert(`Depósito de $${monto.toFixed(2)} realizado.`);
    } else if (tipo === 'retiro') {
        if (cuentas[indice].saldo >= monto) {
            cuentas[indice].saldo -= monto;
            alert(`Retiro de $${monto.toFixed(2)} realizado.`);
        } else {
            alert("¡Error! Saldo insuficiente para realizar el retiro.");
            return; // Detiene la función sin actualizar
        }
    }
    
    // Actualiza la cuenta seleccionada con el nuevo saldo (por referencia)
    cuentaSeleccionada = cuentas[indice]; 
    
    // Limpia el monto y actualiza la vista
    montoOperacionInput.value = '';
    seleccionarCuenta(cuentaSeleccionada);
}

// =========================================================
// Asignación de Eventos (Listeners)
// =========================================================

// 1. Botón AGREGAR CUENTA
botonAgregar.addEventListener('click', () => {
    const nombreCuenta = prompt("Ingresa el nombre de la nueva cuenta:");
    if (!nombreCuenta) return; // Si el usuario cancela o no ingresa nombre

    let saldoInicial;
    while(true) {
        let input = prompt("Ingresa el saldo inicial:");
        saldoInicial = parseFloat(input);
        if (!isNaN(saldoInicial) && saldoInicial >= 0) break;
        alert("Saldo inicial no válido. Debe ser un número positivo.");
    }

    const nuevaCuenta = {
        id: proximoId++,
        nombre: nombreCuenta,
        saldo: saldoInicial
    };
    
    cuentas.push(nuevaCuenta);
    renderizarCuentas();
    seleccionarCuenta(nuevaCuenta); // Selecciona la nueva cuenta automáticamente
    alert(`Cuenta "${nombreCuenta}" agregada con éxito.`);
});

// 2. Botón BORRAR CUENTA
botonBorrar.addEventListener('click', () => {
    if (!cuentaSeleccionada) {
        alert("¡Error! Selecciona la cuenta que deseas borrar.");
        return;
    }

    const confirmar = confirm(`¿Estás seguro de borrar la cuenta "${cuentaSeleccionada.nombre}"?`);
    if (confirmar) {
        // Filtra el array, manteniendo solo las cuentas con un ID diferente al de la seleccionada
        cuentas = cuentas.filter(c => c.id !== cuentaSeleccionada.id);
        
        alert(`Cuenta "${cuentaSeleccionada.nombre}" eliminada.`);
        
        // Limpia la selección y los inputs
        cuentaSeleccionada = null;
        cuentaNombreInput.value = '';
        cuentaSaldoInput.value = '';
        
        renderizarCuentas();
    }
});

// 3. Botones DEPÓSITO y RETIRO
textoDeposito.addEventListener('click', () => realizarOperacion('deposito'));
textoRetiro.addEventListener('click', () => realizarOperacion('retiro'));


// =========================================================
// Inicialización
// =========================================================

// Al cargar la página, dibuja la lista de cuentas inicial
renderizarCuentas();