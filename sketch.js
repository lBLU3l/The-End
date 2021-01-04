var trex, trex_running, trex_collided, ground, invisibleGround, groundImage;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOver,restart,gameOverImg,restartImg;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg= loadImage("gameOver.png");
  restartImg= loadImage("restart.png");
}

function setup() {
  canvas=createCanvas(displayWidth,displayHeight-150);

  trex = createSprite(displayWidth/7,displayHeight-320,10,40);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.8;

  ground = createSprite(displayWidth/2,displayHeight-200);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  
  invisibleGround = createSprite(displayWidth/2,displayHeight-197,width,1);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  gameOver = createSprite(displayWidth/2,displayHeight/3);
  restart = createSprite(displayWidth/2,displayHeight/2);
  
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.8;
  restart.addImage(restartImg);
  restart.scale = 0.7;

  gameOver.visible = false;
  restart.visible = false;
}

function draw() {
  background(255);
  textSize(20);
  textAlign(CENTER);
  fill(0);
  text("Score: "+ score, displayWidth/2,displayHeight/10);

  if(gameState === PLAY){
    score = score + Math.round(getFrameRate()/60);

    if(keyDown("space")&&trex.y>=528) {
      trex.velocityY = -16;
    }

    trex.velocityY = trex.velocityY + 0.9
    trex.collide(invisibleGround);
    
    ground.velocityX = -(6+score/50);
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    spawnClouds();
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided");
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)||keyDown("space")) {
      reset();
    }
  }
  drawSprites();
}


function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(displayWidth,displayHeight-200,40,10);
    cloud.y = Math.round(random(displayHeight/3,displayHeight/2));
    cloud.addImage(cloudImage);
    cloud.scale = 0.7;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = displayWidth/3;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 70 === 0) {
    var obstacle = createSprite(displayWidth,displayHeight-220,10,40);
    obstacle.velocityX = -(7+score/50)
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.7;
    obstacle.lifetime = displayWidth/obstacle.velocityX;
    
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running");
  
  score = 0;
  
}