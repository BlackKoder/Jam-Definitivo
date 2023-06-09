//Esto hace el llamado a nuestro canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//Aquí establecemos nuestras dimensiones para nuestro canvas
canvas.width = 1024;
canvas.height = 576;

//Aquí escalamos los valores del lienzo dividiendo entre cuatro veces su tamaño, este debe de 
//concordar con el valor de scale que usamos más abajo
const scaledCanvas = {
	width: canvas.width / 4,
	height: canvas.height / 4
}

//Este bucle encierra un arreglo y toma 36 elementos del arreglo que nos da tiled de nuestro
//tilemap
const floorCollisions2D = [];
for(let i = 0; i < floorCollisions.length; i += 36){
	floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}

//Esto lo que hace es crear los bloques que hemos hecho en tiled de nuestro tilemap
//202 es el símbolo que nos ididca que ahí hay un collider (16 hace referencia al ancho y alto)
const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
	row.forEach((symbol, x) => {
		if (symbol === 202) {
			collisionBlocks.push(
				new CollisionBlock({
					position:{
						x: x * 16,
						y: y * 16,
					},
			}))
		}
	})
})

//Esto hace lo mismo de hacer el arreglo
const platformCollisions2D = [];
for(let i = 0; i < platformCollisions.length; i += 36){
	platformCollisions2D.push(platformCollisions.slice(i, i + 36));
}

//Esto crea los bloques de nuestras plataformas
const platformCollisionBlocks = [];
platformCollisions2D.forEach((row, y) => {
	row.forEach((symbol, x) => {
		if (symbol === 202) {
			platformCollisionBlocks.push(
				new CollisionBlock({
					position:{
						x: x * 16,
						y: y * 16,
					},
					height: 4,
			}))
		}
	})
})

//Este va a ser el valor para la gravedad
//La gravedad hay qu cambiarla dependiendo de 
const gravity = 0.4;

//Aquí puedo alterar la posición del jugador en el eje x y 
const player = new Sprite({
			position:{
				x: 150,
				y: 300
			},
			velocity:{
				x: 0,
				y: 1
			},
			offset:{
				x: 0,
				y: 0,
			},
			collisionBlocks,
			platformCollisionBlocks,
			imageSrc: './assets/img/hero2/Idle.png',
			frameRate: 3,
			animations: {
				Idle: {
					imageSrc: './assets/img/hero2/Idle.png',
					frameRate: 3,
					frameBuffer: 5,	
				},
				Run: {
					imageSrc: './assets/img/hero2/Run.png',
					frameRate: 3,	
					frameBuffer: 5,
				},
				Jump: {
					imageSrc: './assets/img/hero2/Jump.png',
					frameRate: 3,	
					frameBuffer: 3,
				},
				Fall: {
					imageSrc: './assets/img/hero2/Fall.png',
					frameRate: 3,	
					frameBuffer: 3,
				},
				Attack: {
					imageSrc: './assets/img/hero2/Attack1.png',
					frameRate: 3,	
					frameBuffer: 6,
				},
				takeHit: {
					imageSrc: './assets/img/hero2/TakeHit.png',
					frameRate: 3,	
					frameBuffer: 3,
				},
				Death: {
					imageSrc: './assets/img/warrior/Death.png',
					frameRate: 0,	
					frameBuffer: 4,
				},
				FallLeft: {
					imageSrc: './assets/img/hero2/FallLeft.png',
					frameRate: 3,	
					frameBuffer: 3,
				},
				RunLeft: {
					imageSrc: './assets/img/hero2/RunLeft.png',
					frameRate: 3,	
					frameBuffer: 5,
				},
				JumpLeft: {
					imageSrc: './assets/img/hero2/JumpLeft.png',
					frameRate: 3,	
					frameBuffer: 3,
				},
				IdleLeft: {
					imageSrc: './assets/img/hero2/IdleLeft.png',
					frameRate: 3,	
					frameBuffer: 5,
				},
				AttackLeft: {
					imageSrc: './assets/img/hero2/Attack1Left.png',
					frameRate: 3,	
					frameBuffer: 6,
				},
				takeHitLeft: {
					imageSrc: './assets/img/hero2/TakeHitLeft.png',
					frameRate: 3,	
					frameBuffer: 3,
				},
			}
			
		});

		player.image.width = 478;
		player.image.height = 110;


//Este es el objeto del enemigo
const enemy = new Sprite({
			position:{
				x: 300,
				y: 200
			},
			velocity:{
				x: 0,
				y: 1
			},
			offset:{
				x: -12,
				y: 0
			},
			color: 'blue',
			collisionBlocks,
			platformCollisionBlocks,
			imageSrc: './assets/img/Demon/Idle.png',
			frameRate: 6,
			animations: {
				Idle: {
					imageSrc: './assets/img/Demon/Idle.png',
					frameRate: 6,
					frameBuffer: 3,	
				},
				Attack: {
					imageSrc: './assets/img/Demon/Attack.png',
					frameRate: 8,	
					frameBuffer: 2,
				},
				takeHit: {
					imageSrc: './assets/img/warrior/TakeHit.png',
					frameRate: 4,	
					frameBuffer: 3,
				},
				Death: {
					imageSrc: './assets/img/warrior/Death.png',
					frameRate: 0,	
					frameBuffer: 4,
				},
				IdleLeft: {
					imageSrc: './assets/img/Demon/Idle.png',
					frameRate: 6,	
					frameBuffer: 3,
				},
				AttackLeft: {
					imageSrc: './assets/img/warrior/Attack1Left.png',
					frameRate: 4,	
					frameBuffer: 6,
				},
				takeHitLeft: {
					imageSrc: './assets/img/warrior/TakeHitLeft.png',
					frameRate: 4,	
					frameBuffer: 3,
				},
			}
});

const projectiles = [];		

//Este es el valor por defecto de nuestras teclas de dirección

const keys = {
	d:{
		pressed: false,
	},
	a:{
		pressed: false,
	},
	ArrowRight:{
		pressed: false,
	},
	ArrowLeft:{
		pressed: false,
	}
}

//Este es el objeto donde cambiamos los valores de nuestro background
const background = new Background({
	position:{
		x: 0,
		y: 0,
	},
	imageSrc: './assets/img/background.png'
})

//Con esto detectamos las colisiones al dar un golpe
function rectangularCollision({ rectangle1, rectangle2}){
	return(rectangle1.attackBox.position.x  + rectangle1.attackBox.width >=
				rectangle2.hitbox.position.x && 
			rectangle1.attackBox.position.x <= 
				rectangle2.hitbox.position.x + rectangle2.hitbox.width && 
			rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
				rectangle2.hitbox.position.y && 
			rectangle1.attackBox.position.y <= rectangle2.hitbox.position.y + rectangle2.hitbox.height
		)
}

//Aquí determinamos el Game Over o si sigue nuestra aventura
function determineDeath({player, enemy, timerId}){
	clearTimeout(timerId);
	document.querySelector('#display-text').style.display = 'flex';
	if (player.health <= 0) {
		//const audio4 = new Audio("./assets/audio/death.wav");
		//audio4.play();
		player.switchSprite('Death');
		player.dead = true;
		document.querySelector('#display-text').innerHTML = 'Game Over';
	}else if(enemy.health <= 0 && player.health > 0){
		player.dead = true;
		enemy.switchSprite('Death');
		document.querySelector('#display-text').innerHTML = 'You Won the Adventure';
	}

}

//Con esto hacemos el contador del tiempo de la partida
let timer = 30;
let  timerId;
function decreaseTimer(){
	if (timer > 0 ) {
		timerId = setTimeout(decreaseTimer, 1000);
		timer--;
		document.querySelector('#timer').innerHTML = timer;
	}
	if (timer === 0) {
		player.dead = true;
		determineDeath({player, enemy, timerId});
	}

}


decreaseTimer();

const backgroundImageHeight = 432;

const camera = {
	position: {
		x: 0,
		y: -backgroundImageHeight + scaledCanvas.height,
	},
}

	const music = new Audio("./assets/audio/Music1.wav");

//Esta función lo que hace es dibujar en nuestro liezo varios cuadros por segundo
//Se mantiene activo todo el tiempo
function animate(){
	window.requestAnimationFrame(animate);
	music.play();
	c.fillStyle = "white";
	c.fillRect(0, 0, canvas.width, canvas.height);
	
	//Con este guardamos los valores que están dentro de él
	c.save();
	//Con este manejamos el escalado del background
	c.scale(4, 4);
	//Con este hacemos la transición de la vista del background
	c.translate(camera.position.x, camera.position.y);
	background.update();
	//Con esto pintamos los colliders para visualizar
	/*collisionBlocks.forEach((collisionBlock) => {
		collisionBlock.update();
	})
	//Con esto pintamos los colliders para visualizar las plataformas
	platformCollisionBlocks.forEach((platformCollisionBlock) => {
		platformCollisionBlock.update();
	})*/

	projectiles.forEach((projectil) => {
		projectil.update();
		if (projectil.position.x - projectil.radius <=
			player.hitbox.position.x + player.hitbox.width &&
			projectil.position.y + projectil.radius <=
			player.hitbox.position.y + player.hitbox.height &&
			player.hitbox.position.x == projectil.position.x &&
			projectil.position.x > player.velocity.x) {
			player.takeHit();
		}
	})
	player.checkForHorizontalCanvasCollisions();
	//Encerramos los parametros de player y enemy dentro de save y restore para que 
	//se acople a las proporciones de los colliders y nuestro tilemap
	player.update();
	enemy.update();

	
	//Aquí altero la velocidad del personaje y el desplazamiento del jugador
	player.velocity.x = 0;
	enemy.velocity.x = 0;
	//Aquí hago que se muestren los sprite dependiendo de las teclas que he presionado,
	//Y de la dirección que esté nuestro personaje
	if (keys.d.pressed && player.lastKey === 'd') {
		player.switchSprite('Run');
		player.velocity.x = 3;
		player.LastDirection = 'right';
		player.shouldPanCameraToTheLeft({canvas, camera});
	}else if(keys.a.pressed && player.lastKey === 'a'){
		player.switchSprite('RunLeft');
		player.velocity.x = -3;
		player.LastDirection = 'left';
		player.shouldPanCameraToTheRight({canvas, camera});
	}else if(player.velocity.y === 0){
		if (player.LastDirection === 'right') {
			player.switchSprite('Idle');
		}else{
			player.switchSprite('IdleLeft');
		}
	}

	//Con esto controlamos la dirección de la animación del ataque y efectivamente ejecutamos
	//La animación
	if (player.isAttacking === true) {
		if (player.LastDirection === 'right') {
			player.switchSprite('Attack');			
		}else{
			player.switchSprite('AttackLeft');
		}
	}

	if (enemy.isAttacking === true) {
		enemy.switchSprite('Attack');
	}


	//Igualmente para la animación de salto y caída
	if (player.velocity.y < 0) {
		player.shouldPanCameraDown({canvas, camera});
		if (player.LastDirection === 'right') {
			player.switchSprite('Jump');
		}else{
			player.switchSprite('JumpLeft');
		}
	}else if (player.velocity.y > 0){
		player.shouldPanCameraUp({canvas, camera});
		if (player.LastDirection === 'right') {
			player.switchSprite('Fall');
		}else{
			player.switchSprite('FallLeft');
		}
	}

	//Aquí altero la velocidad del personaje y el desplazamiento del enemigo

	if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 3;
		enemy.LastDirection = 'right';
	}else if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
		enemy.velocity.x = -3;
		enemy.LastDirection = 'left';
	}else if(enemy.velocity.y === 0){
		if (enemy.LastDirection === 'right') {
			enemy.switchSprite('Idle');
		}else{
			enemy.switchSprite('IdleLeft');
		}
	}

	if (player.position.x === enemy.position.x && player.position.y === enemy.position.y) {
		enemy.switchSprite('Attack');
		enemy.isAttacking = true;

	}   

	//Detección de colisiones
	if (
		rectangularCollision({
			rectangle1: player,
			rectangle2: enemy
		}) && 
		player.isAttacking
		) {
		player.isAttacking = false;
		enemy.health -= 20;
		document.querySelector('#enemyHealth').style.width = enemy.health + "%";
	}

	if (
		rectangularCollision({
			rectangle1: enemy,
			rectangle2: player
		}) && 
		enemy.isAttacking
		) {
		player.takeHit();
		const audio3 = new Audio("./assets/audio/takehit.wav");
			audio3.play();
		enemy.isAttacking = false;
		//document.querySelector('#playerHealth').style.width = player.health + "%";
		gsap.to('#playerHealth', {
			width: player.health + "%",
		})
	}
	//Con este restaura los valores para mostrarnoslo constantemente en pantalla
	c.restore();


	//Terminar el juego basado en la vida
	if (player.health <= 0 || enemy.health <= 0) {
		determineDeath({player, enemy, timerId});
	}


}

enemy.attackEnemy();

animate();


//Aquí están los controles, se mantiene en escucha en un evento por si presiono una
//tecla en el teclado
window.addEventListener('keydown', (event) =>{
	if (player.dead === false) {
	switch(event.key){
		case 'd':
			keys.d.pressed = true;
			player.lastKey = 'd';
		break;	

		case 'a':
			keys.a.pressed = true;
			player.lastKey = 'a';
		break; 

		case 'w':
			const audio2 = new Audio("./assets/audio/jump.wav");
			audio2.play();
			player.velocity.y = -7;
		break; 

		case 'k':
			const audio1 = new Audio("./assets/audio/attack.wav");
			audio1.play();
			player.attack();
		break;

		/*case 'ArrowRight':
			keys.ArrowRight.pressed = true;
			enemy.lastKey = 'ArrowRight';
		break;	

		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true;
			enemy.lastKey = 'ArrowLeft';
		break; 

		case 'ArrowUp':
			enemy.velocity.y = -8;
		break;*/ 

		case 'p':
			
		
		break;
	}

	}else{

	}
	//console.log(event.key);
});

//Este es el contrario de la dirección a donde establecimos que vaya el personje
//Para que se mantenga en un solo sitio y no se mueva a lo loco

window.addEventListener('keyup', (event) =>{
	switch(event.key){
		case 'd':
			keys.d.pressed = false;
		break;	

		case 'a':
			keys.a.pressed = false;
		break; 
	}

	/*switch(event.key){
		case 'ArrowRight':
			keys.ArrowRight.pressed = false;
		break;
		
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false;
		break;		
	}*/
});
