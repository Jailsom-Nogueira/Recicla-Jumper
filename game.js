// Configuração do Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variáveis do jogo
let score = 0;
let collectedItems = 0;
const totalItems = 30; // 30 materiais disponíveis no mapa
const minItemsToWin = 24; // Mínimo necessário para poder entregar e vencer
let gameRunning = true;
let cameraX = 0;
const worldWidth = 2900; // Mundo mais largo (expandido para caber lixeiras)
let deliveredItems = {}; // Materiais entregues nas lixeiras

// Gravidade e física
const gravity = 0.8;
const friction = 0.85;
const jumpPower = -15;
const moveSpeed = 5;

// Jogador
const player = {
    x: 100,
    y: 500,
    width: 40,
    height: 50,
    speedX: 0,
    speedY: 0,
    jumping: false,
    onGround: false,
    color: '#FF5722'
};

// Plataformas (Nível muito mais longo!)
const platforms = [
    // Seção inicial
    { x: 0, y: 550, width: 200, height: 50 },
    { x: 250, y: 480, width: 150, height: 50 },
    { x: 450, y: 420, width: 150, height: 50 },
    { x: 650, y: 360, width: 150, height: 50 },
    { x: 850, y: 300, width: 150, height: 50 },
    
    // Seção intermediária
    { x: 1050, y: 240, width: 180, height: 50 },
    { x: 1300, y: 180, width: 150, height: 50 },
    { x: 1520, y: 240, width: 150, height: 50 },
    { x: 1740, y: 300, width: 150, height: 50 },
    { x: 1960, y: 360, width: 150, height: 50 },
    
    // Seção final ascendente
    { x: 2180, y: 300, width: 150, height: 50 },
    { x: 2400, y: 240, width: 100, height: 50 },
    
    // Plataforma final para as lixeiras
    { x: 2500, y: 200, width: 400, height: 50 },
    
    // Plataformas alternativas
    { x: 120, y: 480, width: 80, height: 50 },
    { x: 600, y: 360, width: 80, height: 50 },
    { x: 1000, y: 300, width: 100, height: 50 },
    { x: 1600, y: 200, width: 100, height: 50 },
    { x: 1900, y: 320, width: 120, height: 50 },
];

// Materiais recicláveis para coletar (30 itens distribuídos - máximo 3 por plataforma)
const recyclableItems = [
    // Segunda plataforma (y: 480, x: 250-400) - 3 itens
    { x: 280, y: 440, collected: false, type: 'lata' },
    { x: 330, y: 440, collected: false, type: 'metal' },
    { x: 370, y: 440, collected: false, type: 'plastico' },
    
    // Plataforma alternativa (y: 480, x: 120-200) - 2 itens
    { x: 140, y: 440, collected: false, type: 'vidro' },
    { x: 180, y: 440, collected: false, type: 'papel' },
    
    // Terceira plataforma (y: 420, x: 450-600) - 3 itens
    { x: 480, y: 380, collected: false, type: 'plastico' },
    { x: 530, y: 380, collected: false, type: 'lata' },
    { x: 570, y: 380, collected: false, type: 'vidro' },
    
    // Quarta plataforma (y: 360, x: 650-800) - 3 itens
    { x: 680, y: 320, collected: false, type: 'vidro' },
    { x: 730, y: 320, collected: false, type: 'papel' },
    { x: 770, y: 320, collected: false, type: 'metal' },
    
    // Plataforma alternativa (y: 360, x: 600-680) - 2 itens
    { x: 620, y: 320, collected: false, type: 'metal' },
    { x: 660, y: 320, collected: false, type: 'lata' },
    
    // Quinta plataforma (y: 300, x: 850-1000) - 3 itens
    { x: 880, y: 260, collected: false, type: 'papel' },
    { x: 930, y: 260, collected: false, type: 'plastico' },
    
    // Plataforma alternativa (y: 300, x: 1000-1100) - 2 itens
    { x: 1030, y: 260, collected: false, type: 'lata' },
    { x: 1070, y: 260, collected: false, type: 'metal' },
    
    // Sexta plataforma (y: 240, x: 1050-1230) - 3 itens
    { x: 1090, y: 200, collected: false, type: 'papel' },
    { x: 1150, y: 200, collected: false, type: 'plastico' },
    { x: 1200, y: 200, collected: false, type: 'vidro' },
    
    // Sétima plataforma (y: 180, x: 1300-1450) - 3 itens
    { x: 1330, y: 140, collected: false, type: 'metal' },
    { x: 1380, y: 140, collected: false, type: 'lata' },
    { x: 1420, y: 140, collected: false, type: 'papel' },
    
    // Oitava plataforma (y: 240, x: 1520-1670) - 2 itens
    { x: 1560, y: 200, collected: false, type: 'plastico' },
    
    // Nona plataforma (y: 200, x: 1600-1700) - 3 itens
    { x: 1620, y: 160, collected: false, type: 'metal' },
    { x: 1650, y: 160, collected: false, type: 'papel' },
    { x: 1680, y: 160, collected: false, type: 'lata' },
    
    // Décima plataforma (y: 300, x: 1740-1890) - 3 itens
    { x: 1770, y: 260, collected: false, type: 'vidro' },
    { x: 1820, y: 260, collected: false, type: 'plastico' },
    { x: 1860, y: 260, collected: false, type: 'papel' },
    
    // Plataforma alternativa (y: 320, x: 1900-2020) - 2 itens
    { x: 1930, y: 280, collected: false, type: 'lata' },
    { x: 1990, y: 280, collected: false, type: 'metal' },
    
    // Décima primeira plataforma (y: 360, x: 1960-2110) - 3 itens
    { x: 2040, y: 320, collected: false, type: 'plastico' },
    { x: 2080, y: 320, collected: false, type: 'papel' },
    
    // Décima segunda plataforma (y: 300, x: 2180-2330) - 2 itens
    { x: 2210, y: 260, collected: false, type: 'lata' },
    { x: 2280, y: 260, collected: false, type: 'metal' },
    
    // Décima terceira plataforma (y: 240, x: 2400-2500) - 2 itens
    { x: 2420, y: 200, collected: false, type: 'vidro' },
    { x: 2470, y: 200, collected: false, type: 'papel' }
];

// Inimigos (posicionados nas plataformas!)
const enemies = [
    // Na segunda plataforma (y: 480, início x: 250)
    { x: 270, y: 450, width: 30, height: 30, speed: 1, direction: 1, color: '#F44336' },
    
    // Na quarta plataforma (y: 360, início x: 650)
    { x: 680, y: 330, width: 30, height: 30, speed: 1, direction: 1, color: '#FFC107' },
    
    // Na quinta plataforma (y: 300, início x: 850)
    { x: 880, y: 270, width: 30, height: 30, speed: 1, direction: 1, color: '#E91E63' },
    
    // Na sexta plataforma (y: 240, início x: 1050)
    { x: 1150, y: 210, width: 30, height: 30, speed: 1.2, direction: 1, color: '#9C27B0' },
    
    // Na sétima plataforma (y: 180, início x: 1300)
    { x: 1380, y: 150, width: 30, height: 30, speed: 1, direction: 1, color: '#FF5722' },
    
    // Na nona plataforma (y: 200, início x: 1600)
    { x: 1680, y: 170, width: 30, height: 30, speed: 0.8, direction: 1, color: '#00BCD4' },
    
    // Na décima plataforma (y: 300, início x: 1740)
    { x: 1800, y: 270, width: 30, height: 30, speed: 1, direction: 1, color: '#4CAF50' },
    
    // Na décima primeira plataforma (y: 360, início x: 1960)
    { x: 2020, y: 330, width: 30, height: 30, speed: 1, direction: 1, color: '#FF9800' },
    
    // Na décima segunda plataforma (y: 300, início x: 2180)
    { x: 2280, y: 270, width: 30, height: 30, speed: 1.3, direction: 1, color: '#795548' }
];

// Lixeiras no final da fase (5 tipos de materiais - posicionadas na plataforma final)
const trashCans = [
    { x: 2560, y: 200, type: 'lata', emoji: '🥫', label: 'Lata' },
    { x: 2630, y: 200, type: 'papel', emoji: '📄', label: 'Papel' },
    { x: 2700, y: 200, type: 'plastico', emoji: '🥤', label: 'Plástico' },
    { x: 2770, y: 200, type: 'vidro', emoji: '🍾', label: 'Vidro' },
    { x: 2840, y: 200, type: 'metal', emoji: '🔩', label: 'Metal' }
];

// Controles
const keys = {};

// Eventos de teclado
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Controles de direção
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys['a'] = true;
    if (e.key === 'ArrowRight') keys['d'] = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys['a'] = false;
    if (e.key === 'ArrowRight') keys['d'] = false;
});

// Prevenir scroll do navegador com setas e espaço
document.addEventListener('keydown', (e) => {
    // Prevenir scroll com setas ou espaço
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
});

// Função para verificar colisão
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Função para verificar se está no chão
function checkOnGround() {
    for (let platform of platforms) {
        // Verifica sobreposição horizontal
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x) {
            
            // Verifica colisão vertical (pé do jogador no topo da plataforma)
            const playerBottom = player.y + player.height;
            const platformTop = platform.y;
            const platformBottom = platform.y + 50;
            
            // Se o pé do jogador está dentro ou prestes a entrar na plataforma
            if (playerBottom >= platformTop && playerBottom < platformBottom && player.speedY >= 0) {
                player.y = platformTop - player.height;
                player.speedY = 0;
                player.jumping = false;
                player.onGround = true;
                return true;
            }
        }
    }
    return false;
}

// Função para atualizar a câmera
function updateCamera() {
    // Câmera segue o jogador
    const targetX = player.x - canvas.width / 2;
    cameraX = targetX;
    
    // Limitar movimento da câmera
    if (cameraX < 0) cameraX = 0;
    if (cameraX > worldWidth - canvas.width) cameraX = worldWidth - canvas.width;
}

// Função para atualizar o jogador
function updatePlayer() {
    // Movimento horizontal
    if (keys['a'] || keys['arrowleft']) {
        player.speedX = -moveSpeed;
    } else if (keys['d'] || keys['arrowright']) {
        player.speedX = moveSpeed;
    } else {
        player.speedX = 0;
    }
    
    // Pulo
    if ((keys[' '] || keys['arrowup']) && player.onGround && !player.jumping) {
        player.speedY = jumpPower;
        player.jumping = true;
        player.onGround = false;
    }
    
    // Aplicar gravidade
    player.speedY += gravity;
    
    // Limites do mundo
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > worldWidth) player.x = worldWidth - player.width;
    
    // Atualizar posição horizontal
    player.x += player.speedX;
    
    // Atualizar posição vertical com detecção de colisão durante queda rápida
    if (player.speedY > 0) {
        // Se está caindo, mover em pequenos incrementos para evitar passar através de plataformas
        const stepSize = Math.max(10, Math.abs(player.speedY));
        let remainingSpeed = player.speedY;
        
        while (remainingSpeed > 0) {
            const moveAmount = Math.min(stepSize, remainingSpeed);
            player.y += moveAmount;
            remainingSpeed -= moveAmount;
            
            // Verificar colisão após cada passo
            if (checkOnGround()) {
                break;
            }
        }
    } else {
        // Se está pulando, mover normalmente
        player.y += player.speedY;
    }
    
    // Verificar colisão final
    player.onGround = checkOnGround();
    
    // Caiu fora do jogo
    if (player.y > canvas.height) {
        gameOver('Você caiu!', 'Tente novamente!');
    }
    
    // Atualizar câmera
    updateCamera();
}

// Função para atualizar inimigos
function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.speed * enemy.direction;
        
        // Encontrar a plataforma onde o inimigo está
        const enemyPlatform = platforms.find(p => {
            const isOnPlatform = enemy.x + enemy.width / 2 >= p.x && 
                                 enemy.x + enemy.width / 2 <= p.x + p.width &&
                                 enemy.y >= p.y - 50 && enemy.y <= p.y;
            return isOnPlatform;
        });
        
        // Mantém o inimigo no topo da plataforma
        if (enemyPlatform) {
            enemy.y = enemyPlatform.y - enemy.height;
        }
        
        // Verificar se o inimigo chegou aos limites da plataforma ou do mundo
        let atEdge = false;
        if (enemy.x < 0) {
            atEdge = true;
            enemy.x = 0;
        } else if (enemy.x + enemy.width > worldWidth) {
            atEdge = true;
            enemy.x = worldWidth - enemy.width;
        } else if (enemyPlatform) {
            // Verificar se chegou no início ou fim da plataforma
            if (enemy.x <= enemyPlatform.x) {
                atEdge = true;
                enemy.x = enemyPlatform.x;
            } else if (enemy.x + enemy.width >= enemyPlatform.x + enemyPlatform.width) {
                atEdge = true;
                enemy.x = enemyPlatform.x + enemyPlatform.width - enemy.width;
            }
        } else {
            atEdge = true;
        }
        
        // Inverter direção se chegou na borda
        if (atEdge) {
            enemy.direction *= -1;
        }
        
        // Verificar colisão com jogador
        // DEBUG: Comente este trecho para desligar a colisão com inimigos
        // if (checkCollision(player, { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height })) {
        //     gameOver('Você foi tocado!', 'Tente novamente!');
        // }
    });
}

// Função para coletar materiais
function checkItemCollection() {
    recyclableItems.forEach(item => {
        if (!item.collected && checkCollision(player, { x: item.x, y: item.y, width: 20, height: 20 })) {
            item.collected = true;
            collectedItems++;
            score += 100;
            updateScore();
        }
    });
}

// Função para entregar materiais nas lixeiras
function checkDelivery() {
    if (collectedItems >= minItemsToWin) {
        trashCans.forEach(trashCan => {
            const distance = Math.abs(player.x - trashCan.x);
            
            // Se está próximo da lixeira (dentro de 60 pixels)
            if (distance < 40 && Math.abs(player.y - trashCan.y) < 60) {
                // Verificar se ainda não foi entregue
                if (!deliveredItems[trashCan.type]) {
                    // Contar quantos materiais deste tipo foram coletados
                    const collectedOfThisType = recyclableItems.filter(item => 
                        item.collected && item.type === trashCan.type
                    ).length;
                    
                    if (collectedOfThisType > 0) {
                        deliveredItems[trashCan.type] = true;
                        score += 50; // Bonus por entregar
                        updateScore();
                    }
                }
            }
        });
        
        // Verificar se todos os tipos foram entregues
        const allTypes = ['lata', 'papel', 'plastico', 'vidro', 'metal'];
        const allDelivered = allTypes.every(type => deliveredItems[type] === true);
        
        if (allDelivered) {
            gameOver('Parabéns!', 'Você entregou todos os materiais nas lixeiras corretas!');
        }
    }
}

// Função para desenhar o jogador
function drawPlayer() {
    const screenX = player.x - cameraX;
    const screenY = player.y;
    
    ctx.fillStyle = player.color;
    ctx.fillRect(screenX, screenY, player.width, player.height);
    
    // Desenhar olhos
    ctx.fillStyle = 'white';
    ctx.fillRect(screenX + 8, screenY + 12, 8, 8);
    ctx.fillRect(screenX + 24, screenY + 12, 8, 8);
    
    // Desenhar nariz
    ctx.fillStyle = '#E91E63';
    ctx.fillRect(screenX + 18, screenY + 25, 4, 6);
}

// Função para desenhar plataformas
function drawPlatforms() {
    ctx.fillStyle = '#8BC34A';
    platforms.forEach(platform => {
        const screenX = platform.x - cameraX;
        ctx.fillRect(screenX, platform.y, platform.width, platform.height);
        
        // Desenhar grama no topo da plataforma
        ctx.fillStyle = '#7CB342';
        ctx.fillRect(screenX, platform.y, platform.width, 10);
        ctx.fillStyle = '#8BC34A';
    });
}

// Função para desenhar materiais recicláveis
function drawItems() {
    recyclableItems.forEach(item => {
        if (!item.collected) {
            const screenX = item.x - cameraX;
            
            // Desenhar sombra do emoji
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillText(getItemEmoji(item.type), screenX + 11, item.y + 11);
            
            // Desenhar emoji do material
            ctx.fillStyle = '#000';
            ctx.fillText(getItemEmoji(item.type), screenX + 10, item.y + 10);
        }
    });
}

// Função para obter cor do material
function getItemColor(type) {
    const colors = {
        lata: '#FFC107',
        papel: '#FFEB3B',
        plastico: '#FF9800',
        vidro: '#E3F2FD',
        metal: '#9E9E9E'
    };
    return colors[type] || '#000';
}

// Função para obter emoji do material
function getItemEmoji(type) {
    const emojis = {
        lata: '🥫',
        papel: '📄',
        plastico: '🥤',
        vidro: '🍾',
        metal: '🔩'
    };
    return emojis[type] || '❓';
}

// Função para desenhar lixeiras
function drawTrashCans() {
    trashCans.forEach(trash => {
        const screenX = trash.x - cameraX;
        const screenY = trash.y;
        
        // Desenhar corpo da lixeira
        ctx.fillStyle = '#795548';
        ctx.fillRect(screenX - 15, screenY - 40, 30, 40);
        
        // Desenhar tampa
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(screenX - 20, screenY - 45, 40, 5);
        
        // Desenhar símbolo de reciclagem
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.arc(screenX, screenY - 20, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Desenhar emoji do material
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000';
        ctx.fillText(trash.emoji, screenX, screenY - 20);
        
        // Indicar se já foi entregue
        if (deliveredItems[trash.type]) {
            ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
            ctx.fillRect(screenX - 20, screenY - 45, 40, 50);
        }
    });
}

// Função para desenhar inimigos
function drawEnemies() {
    enemies.forEach(enemy => {
        const screenX = enemy.x - cameraX;
        const screenY = enemy.y;
        
        // Desenhar sombra do inimigo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(screenX, screenY + enemy.height + 2, enemy.width, 5);
        
        // Corpo do inimigo
        ctx.fillStyle = enemy.color;
        ctx.fillRect(screenX, screenY, enemy.width, enemy.height);
        
        // Olhos
        ctx.fillStyle = 'white';
        ctx.fillRect(screenX + 5, screenY + 5, 6, 6);
        ctx.fillRect(screenX + 19, screenY + 5, 6, 6);
        
        // Braços
        ctx.fillStyle = enemy.color;
        ctx.fillRect(screenX - 10, screenY + 10, 10, 4);
        ctx.fillRect(screenX + enemy.width, screenY + 10, 10, 4);
    });
}

// Função para atualizar pontuação
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('collected').textContent = collectedItems;
    
    // Mostrar mensagem quando coletar materiais suficientes
    if (collectedItems >= minItemsToWin) {
        const deliveryMsg = document.getElementById('deliveryMessage');
        if (deliveryMsg) {
            deliveryMsg.textContent = '✓ Materiais suficientes coletados! Leve-os às lixeiras no final da fase!';
        }
    } else {
        const deliveryMsg = document.getElementById('deliveryMessage');
        if (deliveryMsg) {
            const remaining = minItemsToWin - collectedItems;
            deliveryMsg.textContent = `Colete mais ${remaining} ${remaining === 1 ? 'material' : 'materiais'} para poder entregar!`;
        }
    }
}

// Função Game Over
function gameOver(title, message) {
    gameRunning = false;
    document.getElementById('gameOverTitle').textContent = title;
    document.getElementById('gameOverMessage').textContent = message;
    document.getElementById('gameOverScreen').classList.add('show');
}

// Função para reiniciar o jogo
function restartGame() {
    location.reload();
}
window.restartGame = restartGame;

// --- Dificuldade ---
const DIFFICULTY_SPEED_MULT = {
    easy: 0.75,
    normal: 1,
    hard: 1.25
};

// Persiste a dificuldade escolhida ou pega do localStorage
let currentDifficulty = localStorage.getItem('difficulty') || 'normal';

// Salva velocidade base de cada inimigo
const baseEnemySpeeds = enemies.map(enemy => enemy.speed);

function applyDifficultyToEnemies() {
    enemies.forEach((enemy, idx) => {
        enemy.speed = baseEnemySpeeds[idx] * DIFFICULTY_SPEED_MULT[currentDifficulty];
    });
}

function changeDifficulty(event) {
    currentDifficulty = event.target.value;
    localStorage.setItem('difficulty', currentDifficulty);
    applyDifficultyToEnemies();
    restartGame();
}

// Loop principal do jogo
function gameLoop() {
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar fundo com gradiente
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98D8C8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar nuvens no fundo (efeito de profundidade)
    drawClouds();
    
    if (gameRunning) {
        // Atualizar jogador
        updatePlayer();
        
        // Atualizar inimigos
        updateEnemies();
        
        // Verificar coleta de itens
        checkItemCollection();
        
        // Verificar entrega de materiais nas lixeiras
        checkDelivery();
    }
    
    // Desenhar elementos do jogo
    drawPlatforms();
    drawItems();
    drawTrashCans();
    drawEnemies();
    drawPlayer();
    
    requestAnimationFrame(gameLoop);
}

// Função para desenhar nuvens
function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const clouds = [
        { x: 100 - cameraX * 0.3, y: 50 },
        { x: 500 - cameraX * 0.3, y: 80 },
        { x: 900 - cameraX * 0.3, y: 40 },
        { x: 1300 - cameraX * 0.3, y: 70 },
        { x: 1700 - cameraX * 0.3, y: 60 },
        { x: 2100 - cameraX * 0.3, y: 45 }
    ];
    
    clouds.forEach(cloud => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, 30, 0, Math.PI * 2);
        ctx.arc(cloud.x + 35, cloud.y, 35, 0, Math.PI * 2);
        ctx.arc(cloud.x + 70, cloud.y, 30, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Iniciar o jogo
document.addEventListener('DOMContentLoaded', () => {
    // Ajusta o select da dificuldade para a opção salva
    const select = document.getElementById('difficulty');
    if (select) select.value = currentDifficulty;
    // Aplica a dificuldade aos inimigos
    applyDifficultyToEnemies();
});
gameLoop();
updateScore();