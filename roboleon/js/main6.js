// source code of the game "Roboleon"

// Phaser.Game(width, height
// Phaser.AUTO doesn't work on mobile, use Phaser.CANVAS instead
var game = new Phaser.Game(640, 480, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

var turnButton, jumpButtonTs, fireButtonTs;
var gameOnR, checkJump;
var player, levelB, ground, bullet, basicEnemy;
var stageNumberCheck;
var gameOn;
var levelGeneratorOn, lBgOn;
var enemySpawnY, enemySpawnX;
var canSpawnEnemy;
var spawnTimer;
var gameOverText, scoreText;
var score;

gameOnR = true;
checkJump = false;
stageNumberCheck = 0;
gameOn = true;
levelGeneratorOn = true;
lBgOn = true;
canSpawnEnemy = false;
score = 0;

function preload() {
	//Loads all of the game's parts to RAM

	game.load.image('red1','res/red1.png');
	game.load.image('button','res/button_turn.png');
	game.load.image('brick','res/bricks.png');
	game.load.image('jumpButton','res/button_up.png');
	game.load.image('beginning','res/beginning.png');
	game.load.image('fireButton','res/button_fire.png');
	game.load.image('fireball','res/fireball.png');
	game.load.image('enemy1','res/enemy1.png');
}

function create() {
	//Loads when the game begins (levels etc.)

	game.physics.startSystem(Phaser.Physics.ARCADE);
	//Starts arcade physics engine

	loadBasicButtons();
	createGroups();
}

function update() {
	//loops certain commands through the game

	//here are some functions to execute
	createLevels();
	playerUpdate();
	bulletsUpdate();
	enemyUpdate();
	enemySpawnY = Math.floor((Math.random()*410)+38);
	enemySpawnX = Math.floor((Math.random()*10)+1);
	spawnEnemy();
}

function createPlayer(x,y) {
			
	/* players.create creates a new object inside the group "players" (defined in the 
	function "create") */
	player = players.create(x,y, 'red1');

	/*.body.bounce.y makes the sprite it's assigned to bounce on the y axis (up and down)*/
	player.body.bounce.y = 0.2;

	//.body.gravity.y enables gravity on the y axis for the sprite it's assigned to
	player.body.gravity.y = 300;

	//.body.collideWorldBounds prevents the assigned sprite from leaving the game area
	player.body.collideWorldBounds = true;
}

function playerUpdate(){
	//.physics.arcade.collide makes two given groups collide with each other
	game.physics.arcade.collide(players, platforms);
	game.physics.arcade.collide(players, enemies);

	players.forEach(function(p){
		/*.body.velocity.x is the value of a sprites (p = all the sprites in the 
		group players (defined in function create)) movement*/
		p.body.velocity.x = 0;
		
		/*the following lines of code make the assiged sprites move*/
		if(gameOnR == true ){
			p.body.velocity.x = 150;
		} else {
			p.body.velocity.x = -150;	
		}
		if(checkJump == true){
			checkJump = false;
			p.body.velocity.y = -245;
		}
		if(p.body.touching.up || p.body.touching.right || p.body.touching.left){
			stageNumberCheck++
		}
	});
	
}

function actionOnClick(){
	if(stageNumberCheck == 0){
		stageNumberCheck++
	} else{
		if(gameOnR == true ){
			gameOnR = false;
		} else {
			gameOnR = true;
		}
	}
}

function createPlatform(){
	//game.world.width checks the width of the world
	for(i=0;i<game.world.width;i+=32){
		/*creates an object in the group platforms.Seethe function createPlayer for more 
		information*/
		//game.world.height checks the height of the world
		ground = platforms.create(i,game.world.height - 32, 'brick')

		//.body.immovable makes sprites impossible to move
		ground.body.immovable = true;
	}
}

function actionOnClickJbts(){
	if(stageNumberCheck == 0){
		stageNumberCheck++
	} else{
		checkJump = true;
	}
}

function createLevels(){
	if(stageNumberCheck == 0 && lBgOn == true){
		lBgOn = false;
		levelB = lBg.create(80, 0,'beginning')
	} else if(stageNumberCheck == 1 && levelGeneratorOn == true){
		levelGeneratorOn = false;
		lBg.remove(levelB);
		
		loadFireButton();
		
		//.stage.backgroundColor = "color_code" to change background color. The default is black
		game.stage.backgroundColor = "#00ffff";

		//executes functions defined in the code with given coordinates
		createPlayer(320, 416);
		createPlatform();

		//executes function spawnEnemy after waiting 3000 milliseconds (3s)
		setTimeout(mIpTsE, 3000);
	} else if(stageNumberCheck == 2){
		game.world.removeAll();
		game.stage.backgroundColor = "#000000";
		createGroups();
		gameOverText = game.add.text(128, 128, 'Game over Your score is:',{
			font: "32px Gabriella",
			fill: "#ffffff",
			allign: "center"
		});
		scoreText = game.add.text(320, 192, score,{
			font: "32px Gabriella",
			fill: "#ffffff",
			allign: "center"
		});
	}
}

function loadBasicButtons(){
	/*.add.button adds button using given image (loaded in preload) and executes given 
	function*/
	turnButton = game.add.button(60, 360,'button', actionOnClick);
	jumpButtonTs = game.add.button(520, 360,'jumpButton', actionOnClickJbts);	
}

function loadFireButton(){
	fireButtonTs = game.add.button(60, 60, 'fireButton', shoot)
}

function createGroups(){
	//.add.group creates a new group
	players = game.add.group();
	platforms = game.add.group();
	lBg = game.add.group();
	bulletsLtype = game.add.group();
	bulletsRtype = game.add.group();
	enemies = game.add.group();

	//.enableBody turns physics on
	players.enableBody = true;
	platforms.enableBody = true;
	lBg.enableBody = true;
	bulletsLtype.enableBody = true;
	bulletsRtype.enableBody = true;
	enemies.enableBody = true;
}

function shoot(){
	if(gameOnR == true){
		bullet = bulletsRtype.create(player.x, player.y, 'fireball')
	} else{
		bullet = bulletsLtype.create(player.x, player.y, 'fireball')
	}
}

function bulletsUpdate(){
	bulletsRtype.forEach(function(br){
		br.body.velocity.x = 0;
		
		/*the following lines of code make the assiged sprites move*/
		br.body.velocity.x = 300;
	});
	bulletsLtype.forEach(function(bl){
		bl.body.velocity.x = 0;
		
		/*the following lines of code make the assiged sprites move*/
		bl.body.velocity.x = -300;
	});
}

function spawnEnemy(){
	if (canSpawnEnemy == true){
		canSpawnEnemy = false
		if (enemySpawnX<=5){
			basicEnemy = enemies.create(584, enemySpawnY, 'enemy1')
		} else{
			basicEnemy = enemies.create(0, enemySpawnY, 'enemy1')
		}
	spawnTimerOn();
	}
}

function mIpTsE(){
	canSpawnEnemy = true;
}

function spawnTimerOn(){
	game.time.events.add(Phaser.Timer.SECOND * 15, mIpTsE)
}

function enemyUpdate(){
	game.physics.arcade.collide(enemies, bulletsLtype);
	game.physics.arcade.collide(enemies, bulletsRtype);
	enemies.forEach(function(e){
		if(e.body.touching.right || e.body.touching.down || e.body.touching.left){
			enemies.remove(e);
			score+=10;
		}else if(e.body.touching.up){
			stageNumberCheck++
		}
		game.physics.arcade.moveToObject(e, player,50);
	});
}

//by Botond Ortutay
