// Configuración común para las gráficas de Chart.js
Chart.defaults.color = '#8a9bb1';
Chart.defaults.font.family = "'Inter', sans-serif";

const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 0 // Desactiva la animación inicial para que las actualizaciones sean más fluidas
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 100,
            grid: {
                color: 'rgba(255, 255, 255, 0.05)'
            }
        },
        x: {
            grid: {
                display: false
            },
            ticks: {
                maxTicksLimit: 10
            }
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(18, 26, 47, 0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1
        }
    },
    elements: {
        line: {
            tension: 0.4, // Suaviza las líneas
            borderWidth: 2
        },
        point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4
        }
    }
};

// Crear gradientes
const createGradient = (ctx, colorStart, colorEnd) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
};

// --- Elementos de Sonido ---
const beepSound = document.getElementById('beepSound');
const alertSound = document.getElementById('alertSound');

function playBeep() {
    if(beepSound) { beepSound.currentTime = 0; beepSound.play().catch(e=>console.log(e)); }
}
function playAlert() {
    if(alertSound) { alertSound.currentTime = 0; alertSound.play().catch(e=>console.log(e)); }
}

// Inicializar Gráficas
const ctxCpu = document.getElementById('cpuChart').getContext('2d');
const cpuChart = new Chart(ctxCpu, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'CPU (%)',
            data: [],
            borderColor: '#00e6ff',
            backgroundColor: createGradient(ctxCpu, 'rgba(0, 230, 255, 0.5)', 'rgba(0, 230, 255, 0.0)'),
            fill: true
        }]
    },
    options: commonOptions
});

const ctxRam = document.getElementById('ramChart').getContext('2d');
const ramChart = new Chart(ctxRam, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'RAM (%)',
            data: [],
            borderColor: '#b300ff',
            backgroundColor: createGradient(ctxRam, 'rgba(179, 0, 255, 0.5)', 'rgba(179, 0, 255, 0.0)'),
            fill: true
        }]
    },
    options: commonOptions
});

const ctxDisco = document.getElementById('discoChart').getContext('2d');
const discoChart = new Chart(ctxDisco, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Disco (%)',
            data: [],
            borderColor: '#00ffaa',
            backgroundColor: createGradient(ctxDisco, 'rgba(0, 255, 170, 0.5)', 'rgba(0, 255, 170, 0.0)'),
            fill: true
        }]
    },
    options: commonOptions
});

// Función para actualizar los datos
async function fetchMetricas() {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        console.warn('No hay token JWT. Redirigiendo al login...');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:8085/api/metricas/recientes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401 || response.status === 403) {
            console.error('Token inválido o expirado. Redirigiendo al login...');
            localStorage.removeItem('jwt_token');
            window.location.href = 'login.html';
            return;
        }

        if (!response.ok) throw new Error('Error en la red');
        
        const metricas = await response.json();
        
        // Extraer datos
        const labels = metricas.map(m => {
            const date = new Date(m.timestamp);
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        });
        
        const cpuData = metricas.map(m => m.cpu);
        const ramData = metricas.map(m => m.ram);
        const discoData = metricas.map(m => m.disco);

        // Actualizar CPU
        cpuChart.data.labels = labels;
        cpuChart.data.datasets[0].data = cpuData;
        cpuChart.update();

        // Actualizar RAM
        ramChart.data.labels = labels;
        ramChart.data.datasets[0].data = ramData;
        ramChart.update();

        // Actualizar Disco
        discoChart.data.labels = labels;
        discoChart.data.datasets[0].data = discoData;
        discoChart.update();

    } catch (error) {
        console.error('Error al obtener métricas:', error);
    }
}

// --- Efectos Visuales y Ticker ---
const tickerPhrases = [
    "Sincronizando nodos...",
    "Analizando tráfico de red...",
    "Núcleo predictivo activo.",
    "Buscando anomalías...",
    "Conexión segura establecida.",
    "Monitoreo en tiempo real óptimo."
];
let currentPhraseIndex = 0;
const tickerElement = document.getElementById('tickerText');

setInterval(() => {
    if (tickerElement) {
        tickerElement.style.opacity = 0;
        setTimeout(() => {
            currentPhraseIndex = (currentPhraseIndex + 1) % tickerPhrases.length;
            tickerElement.textContent = tickerPhrases[currentPhraseIndex];
            tickerElement.style.opacity = 1;
        }, 500);
    }
}, 4000);

// --- Lógica de Sesión ---
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('jwt_token');
        window.location.href = 'login.html';
    });
}

// --- Navegación SPA ---
const navLinks = document.querySelectorAll('.nav-link');
const viewSections = document.querySelectorAll('.view-section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remover activo de todos
        navLinks.forEach(l => l.classList.remove('active'));
        viewSections.forEach(v => v.classList.remove('active'));

        // Poner activo el presionado
        link.classList.add('active');
        const targetId = link.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
        playBeep();

        // Si se cambia a Alertas, traer las alertas históricas
        if (targetId === 'view-alerts') {
            fetchAlertas();
        }
    });
});

// --- Pantalla Completa ---
const fullscreenBtn = document.getElementById('fullscreenBtn');
if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error al intentar modo pantalla completa: ${err.message}`);
            });
            fullscreenBtn.textContent = '🗗';
        } else {
            document.exitFullscreen();
            fullscreenBtn.textContent = '📺';
        }
        playBeep();
    });
}

// --- Exportación PDF ---
const exportPdfBtn = document.getElementById('exportPdfBtn');
if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', () => {
        playBeep();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.text("CENTINELA TI - Reporte de Alertas IA", 14, 15);
        doc.autoTable({ html: '.cyber-table', startY: 25 });
        doc.save("Reporte_Alertas.pdf");
    });
}

// --- Lógica de Alertas (Histórico) ---
async function fetchAlertas() {
    const token = localStorage.getItem('jwt_token');
    const tableBody = document.getElementById('alertsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Cargando registros...</td></tr>';

    try {
        const response = await fetch('http://localhost:8085/api/alertas', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Error al obtener alertas');
        
        const alertas = await response.json();
        tableBody.innerHTML = ''; // Limpiar
        
        if (alertas.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: #00ffaa;">SISTEMA LIMPIO: No se encontraron anomalías.</td></tr>';
            return;
        }

        alertas.forEach(alerta => {
            const tr = document.createElement('tr');
            
            // Format fecha
            const fecha = new Date(alerta.timestamp);
            const fechaStr = fecha.toLocaleString('es-ES', { hour12: false });
            
            // Format Badge Criticidad
            let critClass = 'badge-pendiente';
            if (alerta.nivelCriticidad === 'CRITICO' || alerta.nivelCriticidad === 'ALTO') critClass = 'badge-critico';
            
            // Format Badge Estado
            let estadoClass = alerta.estado === 'RESUELTA' ? 'badge-resuelta' : 'badge-pendiente';

            tr.innerHTML = `
                <td style="font-family: monospace; color: var(--text-secondary);">${alerta.id.split('-')[0]}</td>
                <td>${alerta.mensaje}</td>
                <td><span class="${critClass}">${alerta.nivelCriticidad}</span></td>
                <td>${fechaStr}</td>
                <td><span class="${estadoClass}">${alerta.estado}</span></td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error('Error fetching alertas:', error);
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: #ff3366;">Error de comunicación con la Base de Datos.</td></tr>';
    }
}

const refreshBtn = document.getElementById('refreshAlertsBtn');
if (refreshBtn) refreshBtn.addEventListener('click', () => { playBeep(); fetchAlertas(); });

// --- CONEXIÓN EN TIEMPO REAL (WebSockets) ---
let stompClient = null;

function connectWebSocket() {
    const token = localStorage.getItem('jwt_token');
    if (!token) return;

    // Conectar a SockJS
const socket = new SockJS('http://localhost:8085/ws');
    stompClient = Stomp.over(socket);
    // Desactivar logs de consola si quieres
    stompClient.debug = null;

    stompClient.connect({}, function (frame) {
        console.log('Conectado a WebSocket STOMP');
        
        // Suscripción a Métricas en tiempo real
        stompClient.subscribe('/topic/metricas', function (mensaje) {
            const metrica = JSON.parse(mensaje.body);
            actualizarGraficasConDato(metrica);
        });

        // Suscripción a Alertas en tiempo real
        stompClient.subscribe('/topic/alertas', function (mensaje) {
            const alerta = JSON.parse(mensaje.body);
            playAlert();
            // Si estamos en la pestaña de alertas, refrescar
            if (document.getElementById('view-alerts').classList.contains('active')) {
                fetchAlertas();
            } else {
                // Si estamos en otra pestaña, mostrar una notificación visual temporal
                const ticker = document.getElementById('tickerText');
                if(ticker) {
                    ticker.textContent = "🚨 ¡NUEVA ALERTA CRÍTICA RECIBIDA!";
                    ticker.style.color = "#ff3366";
                    setTimeout(() => { ticker.style.color = "var(--text-primary)"; }, 5000);
                }
            }
        });
    }, function(error) {
        console.error('STOMP error:', error);
        // Reconectar si falla
        setTimeout(connectWebSocket, 5000);
    });
}

// Función auxiliar para actualizar gráficas individualmente sin borrar todo el array
function actualizarGraficasConDato(metrica) {
    const fecha = new Date(metrica.timestamp);
    const timeString = fecha.toLocaleTimeString('es-ES', { hour12: false });

    // CPU
    if (cpuChart.data.labels.length > 20) { cpuChart.data.labels.shift(); cpuChart.data.datasets[0].data.shift(); }
    cpuChart.data.labels.push(timeString);
    cpuChart.data.datasets[0].data.push(metrica.cpu);
    cpuChart.update('none'); // Update sin animacion pesada para que fluya

    // RAM
    if (ramChart.data.labels.length > 20) { ramChart.data.labels.shift(); ramChart.data.datasets[0].data.shift(); }
    ramChart.data.labels.push(timeString);
    ramChart.data.datasets[0].data.push(metrica.ram);
    ramChart.update('none');

    // Disco
    if (discoChart.data.labels.length > 20) { discoChart.data.labels.shift(); discoChart.data.datasets[0].data.shift(); }
    discoChart.data.labels.push(timeString);
    discoChart.data.datasets[0].data.push(metrica.disco);
    discoChart.update('none');
}

// Iniciar
fetchMetricas(); // Traer historial inicial
connectWebSocket(); // Empezar a escuchar en tiempo real sin usar setInterval
