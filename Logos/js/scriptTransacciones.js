// =========================================================
// Variables y Configuración Inicial
// =========================================================

// Estructura de datos para simular cuentas (se carga al iniciar)
let cuentas = [
    { id: 1, nombre: "Cuenta Ahorro BISA", saldo: 1500.50 },
    { id: 2, nombre: "Cuenta Corriente", saldo: 300.00 }
];

// 🚨 NUEVO: Array para guardar el historial de transacciones
// Usamos localStorage para que las transacciones persistan entre páginas
let historialTransacciones = JSON.parse(localStorage.getItem('transacciones')) || []; 

let proximoId = 3; 
let cuentaSeleccionada = null; 

// =========================================================
// Obtención de Elementos del DOM (Solo se aplica si estamos en la página de Mis Cuentas)
// =========================================================

// Usamos window.location para determinar en qué página estamos
if (document.title === "Banco BISA - Mis Cuentas") {
    // Si estamos en Mis Cuentas, inicializar los elementos de esa página
    const listaPlaceholder = document.querySelector('.list-placeholder');
    const botonAgregar = document.getElementById('boton-agregar');
    const botonBorrar = document.getElementById('boton-borrar');
    const cuentaNombreInput = document.getElementById('cuenta-nombre');
    const cuentaSaldoInput = document.getElementById('cuenta-saldo');
    const montoOperacionInput = document.getElementById('monto-operacion');
    const panelOperacion = document.querySelector('.panel-deposito-retiro');
    const textoDeposito = panelOperacion.querySelector('p:nth-child(1)');
    const textoRetiro = panelOperacion.querySelector('p:nth-child(2)');

    // Inicializar la funcionalidad de Mis Cuentas
    inicializarMisCuentas();
} else if (document.title === "Banco BISA - Transacciones") {
    // Si estamos en la página de Transacciones, inicializar la lista
    const transactionsListPlaceholder = document.querySelector('.transactions-list-placeholder');
    mostrarHistorial(transactionsListPlaceholder);
}


// =========================================================
// Funciones de Lógica Central (Comunes a ambas páginas)
// =========================================================

/**
 * 🚨 NUEVO: Registra una transacción y la guarda en localStorage.
 * @param {string} tipo - 'deposito' o 'retiro'.
 * @param {number} monto - Monto de la operación.
 * @param {Object} cuenta - La cuenta afectada.
 * @param {number} saldoFinal - El saldo después de la operación.
 */
function registrarTransaccion(tipo, monto, cuenta, saldoFinal) {
    const transaccion = {
        tipo: tipo,
        monto: monto,
        cuentaNombre: cuenta.nombre,
        hora: new Date().toLocaleTimeString('es-ES'), // Hora de la transacción
        fecha: new Date().toLocaleDateString('es-ES'),
        saldoFinal: saldoFinal
    };
    
    historialTransacciones.push(transaccion);
    // Guardar el array actualizado en el almacenamiento local
    localStorage.setItem('transacciones', JSON.stringify(historialTransacciones));
}

/**
 * Realiza una operación de depósito o retiro. (MODIFICADA para registrar)
 * @param {string} tipo - 'deposito' o 'retiro'.
 */
function realizarOperacion(tipo) {
    // ... (El código de validación de monto y cuenta es el mismo) ...

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
            return; 
        }
    }
    
    // 🚨 REGISTRO DE TRANSACCIÓN DESPUÉS DE LA OPERACIÓN
    registrarTransaccion(tipo, monto, cuentas[indice], cuentas[indice].saldo);
    
    cuentaSeleccionada = cuentas[indice]; 
    montoOperacionInput.value = '';
    seleccionarCuenta(cuentaSeleccionada);
}


/**
 * 🚨 NUEVO: Dibuja el historial de transacciones en la página de Transacciones.
 * @param {HTMLElement} contenedor - El placeholder donde se mostrará la lista.
 */
function mostrarHistorial(contenedor) {
    if (historialTransacciones.length === 0) {
        contenedor.innerHTML = '<p style="text-align: center; color: #666; padding: 50px;">Aún no hay transacciones registradas.</p>';
        return;
    }

    // Recorrer el historial y crear el HTML para cada transacción
    historialTransacciones.reverse().forEach(t => { // Revertir para mostrar lo más reciente primero
        const item = document.createElement('div');
        item.classList.add('transaction-item', t.tipo); // Añade clase 'deposito' o 'retiro'

        item.innerHTML = `
            <span class="transaction-type">
                ${t.tipo.toUpperCase()}
            </span>
            <span class="transaction-amount">
                ${t.tipo === 'deposito' ? '+' : '-'} $${t.monto.toFixed(2)}
            </span>
            <span class="transaction-detail">
                ${t.cuentaNombre} - ${t.fecha} ${t.hora}
            </span>
            <span class="transaction-final-balance">
                Saldo Final: $${t.saldoFinal.toFixed(2)}
            </span>
        `;
        contenedor.appendChild(item);
    });
}


// =========================================================
// Inicialización de la Página "Mis Cuentas"
// =========================================================

function inicializarMisCuentas() {
    // ... (el resto de las funciones de Mis Cuentas) ...
    function renderizarCuentas() {
        listaPlaceholder.innerHTML = ''; 
    
        cuentas.forEach(cuenta => {
            const elementoCuenta = document.createElement('div');
            elementoCuenta.classList.add('entrada-cuenta');
            elementoCuenta.textContent = `${cuenta.nombre} - Saldo: $${cuenta.saldo.toFixed(2)}`;
            
            if (cuentaSeleccionada && cuenta.id === cuentaSeleccionada.id) {
                elementoCuenta.classList.add('seleccionada');
            }
    
            elementoCuenta.addEventListener('click', () => {
                seleccionarCuenta(cuenta);
            });
            
            listaPlaceholder.appendChild(elementoCuenta);
        });
    }

    function seleccionarCuenta(cuenta) {
        cuentaSeleccionada = cuenta;
        cuentaNombreInput.value = cuenta.nombre;
        cuentaSaldoInput.value = `$${cuenta.saldo.toFixed(2)}`;
        renderizarCuentas(); 
    }

    // Asignación de Eventos
    botonAgregar.addEventListener('click', () => {
        // ... (Lógica de Agregar Cuenta) ...
        const nombreCuenta = prompt("Ingresa el nombre de la nueva cuenta:");
        if (!nombreCuenta) return;

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
        seleccionarCuenta(nuevaCuenta);
        alert(`Cuenta "${nombreCuenta}" agregada con éxito.`);
    });
    
    botonBorrar.addEventListener('click', () => {
        // ... (Lógica de Borrar Cuenta) ...
        if (!cuentaSeleccionada) {
            alert("¡Error! Selecciona la cuenta que deseas borrar.");
            return;
        }

        const confirmar = confirm(`¿Estás seguro de borrar la cuenta "${cuentaSeleccionada.nombre}"?`);
        if (confirmar) {
            cuentas = cuentas.filter(c => c.id !== cuentaSeleccionada.id);
            alert(`Cuenta "${cuentaSeleccionada.nombre}" eliminada.`);
            
            cuentaSeleccionada = null;
            cuentaNombreInput.value = '';
            cuentaSaldoInput.value = '';
            
            renderizarCuentas();
        }
    });

    textoDeposito.addEventListener('click', () => realizarOperacion('deposito'));
    textoRetiro.addEventListener('click', () => realizarOperacion('retiro'));

    // Inicialización
    renderizarCuentas();
}