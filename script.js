// ===================================================================
// 1. CONFIGURACIÓN DEL CANVAS (FONDO DE VELAS DE TRADING)
// ===================================================================
const canvas = document.getElementById('chartCanvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const candleWidth = 14;
const spacing = 8;
let candles =[];
let currentPrice = canvas.height / 2;

function generateCandles(count) {
    candles =[];
    currentPrice = canvas.height / 2;
    for (let i = 0; i < count; i++) {
        addCandle();
    }
}

function addCandle() {
    const open = currentPrice;
    const volatility = Math.random() * 50 - 25; 
    const close = open + volatility;
    
    const high = Math.min(open, close) - (Math.random() * 40);
    const low = Math.max(open, close) + (Math.random() * 40);

    candles.push({ open, close, high, low });
    currentPrice = close;
}

let frame = 0;
function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const maxVisible = Math.floor(canvas.width / (candleWidth + spacing)) + 2;
    
    if (candles.length > maxVisible) {
        candles.shift();
    }

    if (frame % 20 === 0) {
        addCandle();
    }

    for (let i = 0; i < candles.length; i++) {
        const c = candles[i];
        const x = i * (candleWidth + spacing);
        const isGreen = c.close < c.open; 
        
        // Colores de pirata: Dorado (sube) y Rojo Corsario (baja)
        ctx.fillStyle = isGreen ? '#FFD700' : '#D90429';
        ctx.strokeStyle = isGreen ? '#FFD700' : '#D90429';
        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.fillStyle;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(x + candleWidth / 2, c.high);
        ctx.lineTo(x + candleWidth / 2, c.low);
        ctx.stroke();

        const bodyY = Math.min(c.open, c.close);
        const bodyHeight = Math.abs(c.open - c.close) || 2;
        ctx.fillRect(x, bodyY, candleWidth, bodyHeight);
    }
    
    frame++;
    requestAnimationFrame(drawChart);
}

generateCandles(Math.floor(window.innerWidth / (candleWidth + spacing)));
drawChart();


// ===================================================================
// 2. ANIMACIONES AL BAJAR LA PÁGINA (SCROLL)
// ===================================================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0) translateX(0)';
        }
    });
}, { threshold: 0.1 });

// Elementos que aparecerán subiendo suavemente
document.querySelectorAll('.card, .distribution-item, .restored-text, .crew-card').forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    observer.observe(el);
});  

// Animación específica para el Roadmap (Entran por los lados)
document.querySelectorAll('.timeline-item.left').forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = 'translateX(-50px)';
    el.style.transition = 'all 0.8s ease-out';
    observer.observe(el);
});

document.querySelectorAll('.timeline-item.right').forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = 'translateX(50px)';
    el.style.transition = 'all 0.8s ease-out';
    observer.observe(el);
});


// ===================================================================
// 3. GENERADOR DE MONEDAS DE ORO FLOTANTES
// ===================================================================
function createParticles() {
    const container = document.getElementById('particles');
    if(!container) return;

    container.innerHTML = '';
    
    // Generamos 30 monedas de oro (Tesoro ascendiendo)
    for(let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 35 + 25; // Tamaño entre 25 y 60 px
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particle.style.left = Math.random() * 100 + 'vw';
        
        const duration = Math.random() * 20 + 15; // Lentas y majestuosas
        particle.style.animationDuration = duration + 's';
        
        particle.style.animationDelay = (Math.random() * 15) + 's';
        
        container.appendChild(particle);
    }
}        
createParticles();


// ===================================================================
// 4. BOTÓN DE COPIAR CONTRATO
// ===================================================================
const btnCopy = document.getElementById('copyContract');
if(btnCopy) {
    btnCopy.addEventListener('click', () => {
        const text = document.querySelector('.contract-text').innerText;
        navigator.clipboard.writeText(text).then(() => {
            const notif = document.getElementById('copyNotification');
            notif.style.display = 'block';
            setTimeout(() => {
                notif.style.display = 'none';
            }, 3000); // El aviso de copiado se borra a los 3 segundos
        });
    });
}
