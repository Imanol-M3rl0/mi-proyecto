document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

let historialTransacciones = JSON.parse(localStorage.getItem('transacciones')) || []; 

document.addEventListener('DOMContentLoaded', () => {
    if (document.title === "Banco BISA - Transacciones") {
        const transactionsListPlaceholder = document.querySelector('.transactions-list-placeholder');
        mostrarHistorial(transactionsListPlaceholder);
    }
});

function mostrarHistorial(contenedor) {
    if (historialTransacciones.length === 0) {
        contenedor.innerHTML = '<p style="text-align: center; color: #666; padding: 50px;">Aún no hay transacciones registradas.</p>';
        return;
    }

    contenedor.innerHTML = ''; // Limpia el cargando/contenido previo

    [...historialTransacciones].reverse().forEach(t => { 
        const item = document.createElement('div');
        item.classList.add('transaction-item', t.tipo); 

        item.innerHTML = `
            <span class="transaction-type">
                ${t.tipo === 'deposito' ? '<i class="fas fa-plus-circle"></i> DEPÓSITO' : '<i class="fas fa-minus-circle"></i> RETIRO'}
            </span>
            <span class="transaction-amount">
                ${t.tipo === 'deposito' ? '+' : '-'} Bs. ${t.monto.toFixed(2)}
            </span>
            <span class="transaction-detail">
                ${t.cuentaNombre} | <small>${t.fecha} ${t.hora}</small>
            </span>
            <span class="transaction-final-balance">
                Saldo: Bs. ${t.saldoFinal.toFixed(2)}
            </span>
        `;
        contenedor.appendChild(item);
    });
}