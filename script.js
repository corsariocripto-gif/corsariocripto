const canvas = document.getElementById('chartCanvas');
const ctx = canvas.getContext('2d');

// Ajustar tamaño del canvas dinámicamente
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Parámetros de las velas
const candleWidth = 12;
const spacing = 6;
let candles =[];
let currentPrice = window.innerHeight / 2;

// Generador de velas (Random Walk simulando mercado)
function generateCandles(count) {
    candles =[];
    currentPrice = canvas.height / 2;
    for (let i = 0; i < count; i++) {
        addCandle();
    }
}

function addCandle() {
    const open = currentPrice;
    const volatility = Math.random() * 40 - 20; // Variación aleatoria
    const close = open + volatility;
    
    // Mechas
    const high = Math.min(open, close) - (Math.random() * 30);
    const low = Math.max(open, close) + (Math.random() * 30);

    candles.push({ open, close, high, low });
    currentPrice = close;
}

// Bucle de animación principal
let frame = 0;
function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const maxVisible = Math.floor(canvas.width / (candleWidth + spacing)) + 2;
    
    // Mantener el array de velas optimizado
    if (candles.length > maxVisible) {
        candles.shift();
    }

    // Mover y actualizar el precio (crear nueva vela cada x frames)
    if (frame % 15 === 0) {
        addCandle();
    }

    // Dibujar cada vela
    for (let i = 0; i < candles.length; i++) {
        const c = candles[i];
        const x = i * (candleWidth + spacing);
        
        // Color: Verde si cierra más arriba (menor Y), Rojo si cierra más abajo
        const isGreen = c.close < c.open; 
        ctx.fillStyle = isGreen ? '#00ff66' : '#ff0044';
        ctx.strokeStyle = isGreen ? '#00ff66' : '#ff0044';
        
        // Efecto de resplandor neón
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;

        // Dibujar mecha (Wick)
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(x + candleWidth / 2, c.high);
        ctx.lineTo(x + candleWidth / 2, c.low);
        ctx.stroke();

        // Dibujar cuerpo (Body)
        const bodyY = Math.min(c.open, c.close);
        const bodyHeight = Math.abs(c.open - c.close) || 2;
        ctx.fillRect(x, bodyY, candleWidth, bodyHeight);
    }
    
    frame++;
    requestAnimationFrame(drawChart);
}

// Iniciar animación
generateCandles(Math.floor(window.innerWidth / (candleWidth + spacing)));
drawChart();