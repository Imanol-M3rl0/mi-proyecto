document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

// NUEVO: Recuperamos o inicializamos el historial persistente
let historialTransacciones = JSON.parse(localStorage.getItem('transacciones')) || [];

let cuentas = [
    { id: 1, nombre: "Cuenta Ahorro BISA", saldo: 1500.50 },
    { id: 2, nombre: "Cuenta Corriente", saldo: 300.00 }
];

let proximoId = 3; 
let cuentaSeleccionada = null; 

const listaPlaceholder = document.querySelector('.list-placeholder');
const botonAgregar = document.getElementById('boton-agregar');
const botonBorrar = document.getElementById('boton-borrar');
const cuentaNombreInput = document.getElementById('cuenta-nombre');
const cuentaSaldoInput = document.getElementById('cuenta-saldo');
const montoOperacionInput = document.getElementById('monto-operacion');
const panelOperacion = document.querySelector('.panel-deposito-retiro');
const textoDeposito = panelOperacion.querySelector('p:nth-child(1)'); 
const textoRetiro = panelOperacion.querySelector('p:nth-child(2)');  

function renderizarCuentas() {
    listaPlaceholder.innerHTML = ''; 
    cuentas.forEach(cuenta => {
        const elementoCuenta = document.createElement('div');
        elementoCuenta.classList.add('entrada-cuenta');
        elementoCuenta.textContent = `${cuenta.nombre} (Bs.${cuenta.saldo.toFixed(2)})`;
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
    cuentaSaldoInput.value = `Bs.${cuenta.saldo.toFixed(2)}`;
    renderizarCuentas(); 
}

function realizarOperacion(tipo) {
    if (!cuentaSeleccionada) {
        alert("Error! Debes seleccionar una cuenta primero");
        return;
    }
    const monto = parseFloat(montoOperacionInput.value);
    if (isNaN(monto) || monto <= 0) {
        alert("Error! Ingresa un monto válido y positivo");
        return;
    }
    let indice = cuentas.findIndex(c => c.id === cuentaSeleccionada.id);

    if (tipo === 'deposito') {
        cuentas[indice].saldo += monto;
        alert(`Depósito de Bs.${monto.toFixed(2)} realizado`);
    } else if (tipo === 'retiro') {
        if (cuentas[indice].saldo >= monto) {
            cuentas[indice].saldo -= monto;
            alert(`Retiro de Bs.${monto.toFixed(2)} realizado.`);
        } else {
            alert("Error! Saldo insuficiente para realizar el retiro");
            return; 
        }
    }

    // --- NUEVO: ANOTAR EN EL LOCALSTORAGE ---
    const transaccion = {
        tipo: tipo,
        monto: monto,
        cuentaNombre: cuentas[indice].nombre,
        hora: new Date().toLocaleTimeString('es-ES'), 
        fecha: new Date().toLocaleDateString('es-ES'),
        saldoFinal: cuentas[indice].saldo
    };
    historialTransacciones.push(transaccion);
    localStorage.setItem('transacciones', JSON.stringify(historialTransacciones));
    // ----------------------------------------
    
    cuentaSeleccionada = cuentas[indice]; 
    montoOperacionInput.value = '';
    seleccionarCuenta(cuentaSeleccionada);
}

botonAgregar.addEventListener('click', () => {
    const nombreCuenta = prompt("Ingresa el nombre de la nueva cuenta:");
    if (!nombreCuenta) return; 
    let saldoInicial;
    while(true) {
        let input = prompt("Ingresa el saldo inicial:");
        saldoInicial = parseFloat(input);
        if (!isNaN(saldoInicial) && saldoInicial >= 0) break;
        alert("Saldo inicial no valido. Debe ser un numero positivo");
    }
    const nuevaCuenta = {
        id: proximoId++,
        nombre: nombreCuenta,
        saldo: saldoInicial
    };
    cuentas.push(nuevaCuenta);
    renderizarCuentas();
    seleccionarCuenta(nuevaCuenta); 
    alert(`Cuenta "${nombreCuenta}" agregada con exito`);
});

botonBorrar.addEventListener('click', () => {
    if (!cuentaSeleccionada) {
        alert("Error! Selecciona la cuenta que deseas borrar");
        return;
    }
    const confirmar = confirm(`Estás seguro de borrar la cuenta "${cuentaSeleccionada.nombre}"?`);
    if (confirmar) {
        cuentas = cuentas.filter(c => c.id !== cuentaSeleccionada.id);
        alert(`Cuenta "${cuentaSeleccionada.nombre}" eliminada`);
        cuentaSeleccionada = null;
        cuentaNombreInput.value = '';
        cuentaSaldoInput.value = '';
        renderizarCuentas();
    }
});

textoDeposito.addEventListener('click', () => realizarOperacion('deposito'));
textoRetiro.addEventListener('click', () => realizarOperacion('retiro'));

renderizarCuentas();