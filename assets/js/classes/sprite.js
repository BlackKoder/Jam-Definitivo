//Esta clase es para el jugador, aquí está la posición velocidad etc.
//NOTA: Si no puedo pasar las propiedades del constructor como un objetos, es porque
//No las he definido como un argumento
class Sprite extends Background{
	constructor({ position, velocity, color = 'red', offset, collisionBlocks, platformCollisionBlocks, 
		imageSrc, frameRate, scale = 0.5, animations }){
		super({imageSrc, frameRate, scale})
		this.position = position;
		//Aquí se modifica la velocidad
		this.velocity = velocity;
		//Aquí el ancho de las cajas rojas de los personajes
		//NOTA:Se divide el valor entre cuatro ya que como hemos metido player
		//dentro del save y restore este también toma los valores del background, por lo tanto
		//se escala, y entonces tenemos que permanecer con los cálculos exactos de nuestro 
		//scaledCanvas
		//this.width = 50 / 4;
		//Aquí se modifica la altura del cuadro rojo del personaje
		//Nota se esconden los valores de width y height en este caso porque 
		//Es necesario para poder arreglar que el sprite no traspase el collider
		//Para eso se utilizó el método onload en la clase background
		//this.height = 150 / 4;
		//Este es para los controles
		this.lastKey;
		//Este es para el cuadro de ataque
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			offset,
			width: 100 / 4,
			height: 50 / 4
		}
		this.color = color;
		this.isAttacking;
		this.shoot;
		this.health = 100;
		this.collisionBlocks = collisionBlocks;
		this.platformCollisionBlocks = platformCollisionBlocks;
		//Esto es para hacer la caja que va a encerrar a nuestro personaje
		//Y así podremos hacer la interacción con los colliders desde él
		this.hitbox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: 10,
			height: 10,
		}
		//Esto hace referencia a las animaciones
		this.animations = animations;
		//Esto hace referencia a la última dirección en la que se encuentra nuestro personaje
		this.lastDirection = 'right';

		//Este bucle es para que las animaciones puedan usar las imagenes
		//Haciendo el llamado desde la clase de Background
		for(let key in this.animations){
			const image = new Image();
			image.src = this.animations[key].imageSrc;

			this.animations[key].image = image;
		}

		this.camerabox = {
			position:{
				x: this.position.x,
				y: this.position.y,
			},
			width: 200,
			height: 80,
		}

		this.dead = false;
		

	}

	//Con este podemos cambiar los sprites para hacer las animaciones de cada mecánica que tengamos
	switchSprite(key){
		if (this.image === this.animations[key].image || !this.loaded)return

		if (this.image === this.animations.Attack.image &&
			this.currentFrame < this.animations.Attack.frameRate -1)return

		if (this.image === this.animations.AttackLeft.image &&
			this.currentFrame < this.animations.AttackLeft.frameRate -1)return

		if (this.image === this.animations.takeHit.image &&
			this.currentFrame < this.animations.takeHit.frameRate -1)return

		if (this.image === this.animations.takeHitLeft.image &&
			this.currentFrame < this.animations.takeHitLeft.frameRate -1)return			

			
			
		this.currentFrame = 0;	
		this.image = this.animations[key].image;
		this.frameBuffer = this.animations[key].frameBuffer;
		this.frameRate = this.animations[key].frameRate;
	}

	//Aquí se dibuja el cuadro rojo, se establece sus coordenadas y dimensiones
	//draw(){
		//c.fillStyle = this.color;
		//c.fillRect(this.position.x, this.position.y, this.width, this.height);

		//Nota, la attack box ha sido movida a la clase Background por el extends del sprite
	//}

	updateCamerabox(){
		this.camerabox = {
			position:{
				x: this.position.x - 50,
				y: this.position.y,
			},
			width: 200,
			height: 80,
		}
	}

	checkForHorizontalCanvasCollisions(){
		if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
			this.hitbox.position.x + this.velocity.x <= 0) {
			this.velocity.x = 0;
		}
	}

	shouldPanCameraToTheLeft({canvas, camera}){
		const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;
		const scaledDownCanvasWidth = canvas.width / 4;

		if (cameraboxRightSide >= 576)return;

		if (cameraboxRightSide >= scaledDownCanvasWidth + Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x;
		}
	}

	shouldPanCameraToTheRight({canvas, camera}){
		if (this.camerabox.position.x <= 0) return;

		if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x;
		}
	}

	shouldPanCameraDown({canvas, camera}){
		if (this.camerabox.position.y + this.velocity.y <= 0) return;

		if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
			camera.position.y -= this.velocity.y;
		}
	}

	shouldPanCameraUp({canvas, camera}){
		if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= 432) return;

		const scaledCanvasHeight = canvas.height / 4;

		if (this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y) +
			scaledCanvasHeight) {
			camera.position.y -= this.velocity.y;
		}
	}

	//Aquí se actualiza todos los valores de draw position y velocity
	update(){
		//Hacemos el llamado de updateFrames desde la clase Background
		this.updateFrames();
		//Hacemos el llamado de hitbox
		this.updateHitbox();
		//Hacemos el llamado a la camerabox
		this.updateCamerabox();

		//Esto es para hacer la camerabox
		/*c.fillStyle = 'rgba(0, 0, 255, 0.2)';
		c.fillRect(
			this.camerabox.position.x, 
			this.camerabox.position.y, 
			this.camerabox.width, 
			this.camerabox.height);*/
		//Esto es para hacer el cropbox que nos dice cuánto espacio abarca nuestro jugador
		/*c.fillStyle = 'rgba(0, 255, 0, 0.2)';
		c.fillRect(this.position.x, this.position.y, this.width, this.height);

		//Esto es para hacer el hitbox que posiciona nuestro jugador en el cropbox
		c.fillStyle = 'rgba(255, 0, 0, 0.2)';
		c.fillRect(
			this.hitbox.position.x, 
			this.hitbox.position.y, 
			this.hitbox.width, 
			this.hitbox.height);*/
		
		this.draw();
		//Aquí tenemos los valores de nuestro attackbox
		this.attackBox.position.x = this.hitbox.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.hitbox.position.y;

		this.position.x += this.velocity.x;
		this.updateHitbox();
		this.checkForHorizontalCollisions();
		this.applyGravity();
		this.updateHitbox();
		this.checkForVerticalCollisions();

		/*if (this.position.y + this.height + this.velocity.y < canvas.height) {
		}else {
			this.velocity.y = 0;
		}*/
	}

	updateAttackBox(){
		this.attackBox = {
			position: {
				x: this.position.x - 50,
				y: this.position.y
			},
			offset,
			width: 100 / 4,
			height: 50 / 4
		}
	}

	//Se establecen las mismas propiedades desde aquí ya que así estará siendo
	//Actualizados sus valores por cada frame
	//Nota: Tenemos que hacer referencia de hitbox desde el objeto 1 de collision
	//Si queremos que interactue este precisamente con los colliders que hemos creado
	updateHitbox(){
		this.hitbox = {
			position: {
				x: this.position.x + 35,
				y: this.position.y + 26,
			},
			width: 14,
			height: 27,
		}
	}

	//Aquí manejamos la gravedad de una forma un poco más cómoda y organizada
	applyGravity(){
		this.velocity.y += gravity;
		this.position.y += this.velocity.y;
	}

	//Aquí se detectan los coliders de forma vertical
	checkForVerticalCollisions(){
		for(let i = 0; i < this.collisionBlocks.length; i++){
			const collisionBlock = this.collisionBlocks[i];

			if (collision({
				object1: this.hitbox,
				object2: collisionBlock,
			})) {
				if (this.velocity.y > 0) {
					this.velocity.y = 0;

					const offset = 
						this.hitbox.position.y - this.position.y + this.hitbox.height;

					this.position.y = collisionBlock.position.y - offset - 0.01;
					break;
				}

				if (this.velocity.y < 0) {
					this.velocity.y = 0;

					const offset = 
						this.hitbox.position.y - this.position.y;

					this.position.y = 
						collisionBlock.position.y + collisionBlock.height - offset + 0.01;
					break;
				}
			}
		}

		//Colliders de las plataformas
		for(let i = 0; i < this.platformCollisionBlocks.length; i++){
			const platformCollisionBlock = this.platformCollisionBlocks[i];

			if (platformCollision({
				object1: this.hitbox,
				object2: platformCollisionBlock,
			})) {
				if (this.velocity.y > 0) {
					this.velocity.y = 0;

					const offset = 
						this.hitbox.position.y - this.position.y + this.hitbox.height;

					this.position.y = platformCollisionBlock.position.y - offset - 0.01;
					break;
				}


				//Este if lo usamos para que el personaje no traspase desde abajo una plataforma
				/*if (this.velocity.y < 0) {
					this.velocity.y = 0;

					const offset = 
						this.hitbox.position.y - this.position.y;

					this.position.y = 
						platformCollisionBlock.position.y + platformCollisionBlock.height - offset 
						+ 0.01;
					break;
				}*/
			}
		}
	}

	//Y aquí en horizontal
	checkForHorizontalCollisions(){
		for(let i = 0; i < this.collisionBlocks.length; i++){
			const collisionBlock = this.collisionBlocks[i];

			if (collision({
				object1: this.hitbox,
				object2: collisionBlock,
			})) {
				if (this.velocity.x > 0) {
					this.velocity.x = 0;
					const offset =
						this.hitbox.position.x - this.position.x + this.hitbox.width;
					this.position.x = collisionBlock.position.x - offset - 0.01;
					break;
				}

				if (this.velocity.x < 0) {
					this.velocity.x = 0;

					const offset =
						this.hitbox.position.x - this.position.x;
					this.position.x = 
						collisionBlock.position.x + collisionBlock.width - offset + 0.01;
					break;
				}
			}
		}
	}

	takeHit(){
		this.health -= 20;
		
		if (this.LastDirection === 'right') {
			this.switchSprite('takeHit');
		}else{
			this.switchSprite('takeHitLeft');
		}
	}

	//Esto lo que hace es que los ataques se restablezcan a su valor original
	//Para que sea como un golpe que se está dando
	attack(){
		this.isAttacking = true;
		setTimeout(() => {
			this.isAttacking = false;
		}, 100)
	}

	attackEnemy(){
		this.isAttacking = true;
		
		setInterval(() => {
			projectiles.push(new Projectiles({
	position:{
		x: enemy.position.x,
		y: enemy.position.y + 35,
	},
	velocity:{
		x: -2,
		y: 0,
	},
}))
		}, 200)
		
	}
	
}
