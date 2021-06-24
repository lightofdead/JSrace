'use strict';

const score = document.querySelector('.score'),
  startGame = document.querySelector('.gameStart'),
  areaGame = document.querySelector('.gameArea'),
  car = document.createElement('div');

const music = document.createElement('embed');

music.src = 'Music.mp3';

car.classList.add('car');

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

const setting = {
  start: false,
  score: 0,
  speed: 6,
  traffic: 3
};

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

const getRandomEnemy = (max) => Math.floor((Math.random() * max) + 1);


function start() {
  document.body.append(music);

  music.classList.add('visually-hidden');
  
  score.style.width = 100 + '%';
  areaGame.style.height = 100 + '%';
  startGame.classList.add('hide');
  areaGame.innerHTML = '';
  areaGame.classList.remove('hide');
  car.style.left = '250px';
  car.style.top = 'auto';
  car.style.bottom = '10px';
  score.style.top = 0;
  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * 100) + 'px';
    line.y = i * 100;
    areaGame.appendChild(line);
  }

  for(let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -200 * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (areaGame.offsetWidth - 100)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `
    transparent 
    url(../img/enemy.png) 
    center / cover 
    no-repeat
    `;
    
    areaGame.appendChild(enemy);
  }
  setting.score = 0;
  setting.start = true;
  areaGame.appendChild(car);
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  setting.score += setting.speed;
  score.innerHTML = 'SCORE<br>' + setting.score;
  if(setting.start){
    moveRoad();
    moveEnemy();
    if(keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if(keys.ArrowRight && setting.x < 500) {
      setting.x += setting.speed;
    }
    if(keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }
    if(keys.ArrowDown && setting.y < (areaGame.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }

    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';

    requestAnimationFrame(playGame); 
  }
}

function startRun(e) {
  if(keys.hasOwnProperty(e.key)){
    e.preventDefault();
    keys[e.key] = true;
  }
}
  
function stopRun(e) {
  if(keys.hasOwnProperty(e.key)){
    e.preventDefault();
    keys[e.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function(line){
    line.y += setting.speed;
    line.style.top = line.y + 'px';

    if(line.y >= document.documentElement.clientHeight){
      line.y = -100; 
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(function(item){
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

      if(carRect.top <= enemyRect.bottom &&
        carRect.right >= enemyRect.left &&
        carRect.left <= enemyRect.right &&
        carRect.bottom >= enemyRect.top) {
          setting.start = false;
          console.warn('ДТП');
          startGame.classList.remove('hide');
          score.style.top = score.offsetHeight;
          music.remove('embed'); 
        }
      
    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';
    if(item.y >= document.documentElement.clientHeight){
      item.y = -100 * setting.traffic;
      item.style.left = Math.floor(Math.random() * (areaGame.offsetWidth - 100)) + 'px';
    }
  });
}

startGame.addEventListener('click', start);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);