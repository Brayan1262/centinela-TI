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
    try {
        const response = await fetch('http://localhost:8080/api/metricas/recientes');
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

// Iniciar el fetch inmediatamente y luego cada 3 segundos
fetchMetricas();
setInterval(fetchMetricas, 3000);
