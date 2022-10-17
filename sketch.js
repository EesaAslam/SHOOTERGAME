var bg,bgImg; 
var player,shooterImg,shooter_shooting; 
var zombie,zombieImg 
var zombieGroup;
var heart1,heart2,heart3; 
var heart1Img,heart2Img,heart3Img;
var bullets = 70; 
var life = 3; 
var score = 0; 
var lose,winning,explosionSound; 
var gameState = "fight";  

function preload() {
  bgImg = loadImage("assets/bg.jpeg");   

  shooterImg = loadImage("assets/shooter_2.png"); 
  shooter_shooting = loadImage("assets/shooter_3.png") 

  zombieImg = loadImage("assets/zombie.png"); 

  heart1Img = loadImage("assets/heart_1.png"); 
  heart2Img = loadImage("assets/heart_2.png");
  heart3Img = loadImage("assets/heart_3.png"); 

  lose = loadSound("assets/lose.mp3"); 
  winning = loadSound("assets/win.mp3"); 
  explosionSound = loadSound("assets/explosion.mp3");
} 

function setup() {

  createCanvas(windowWidth,windowHeight);

  
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20); 
  bg.addImage(bgImg);   
  bg.scale = 1.1; 

  player = createSprite(displayWidth-1150,displayHeight-300,50,50);
  player.addImage(shooterImg); 
  player.scale = 0.3;  
  player.debug = true;
  player.setCollider("rectangle",0,0,300,300);  

  heart1 = createSprite(displayWidth-150,40,20,20);  
  heart1.visible = false; 
  heart1.addImage("heart1",heart1Img);  
  heart1.scale = 0.4;

  heart2 = createSprite(displayWidth-100,40,20,20);  
  heart2.visible = false; 
  heart2.addImage("heart2",heart2Img);  
  heart2.scale = 0.4;
  
  heart3 = createSprite(displayWidth-150,40,20,20);   
  heart3.addImage("heart3",heart3Img);  
  heart3.scale = 0.4;

  bulletGroup = new Group();

  zombieGroup = new Group(); 

}  



function draw() { 
    background(0); 
  if (gameState === "fight"){ 

    if (life === 3){ 
      heart3.visible = true; 
      heart2.visible = false; 
      heart1.visible = false;
    } 

    if (life === 2 ){
      heart3.visible = false; 
      heart2.visible = true; 
      heart1.visible = false; 
    } 

    if (life === 1){
      heart3.visible = false; 
      heart2.visible = false; 
      heart1.visible = true;
    } 

    if (life === 0){
      gameState = "lost"; 
    } 

    if (score == 100){
      gameState = "won"; 
      winning.play(); 
    } 
    
    //To make the game mobile compatible by using touches and also by moving the player up and down 
    if (keyDown(UP_ARROW)|| touches.length>0) {  
    player.y = player.y - 30;
  }
  
  if (keyDown(DOWN_ARROW)|| touches.length>0) {
    player.y = player.y + 30;
  } 
  // To shoot the bullets and also to change the image of the shooter to a shooting image
  if (keyWentDown("space")) {
    bullet = createSprite(displayWidth-1150,player.y - 39,20,10); 
    bullet.velocityX = 20; 

   bulletGroup.add(bullet)
    player.depth = bullet.depth; 
    player.depth = player.depth + 2;
    player.addImage(shooter_shooting);  
    bullets = bullets - 1; 
    explosionSound.play();
  }
  // player will go back to original image once we stop pressing spacebar
  else if (keyWentUp("space")) {
    player.addImage(shooterImg);
  }
    // Once the player runs out of bullets gamestate will go to bullet state
 if (bullets == 0){
  gameState = "bullet"; 
  lose.play();
 }

 // to destroy zombies when player touches it 
  if (zombieGroup.isTouching(player)) {
    lose.play();
    for (var i=0; i<zombieGroup.length; i++) {
      if (zombieGroup[i].isTouching(player)) { 
        zombieGroup[i].destroy(); 

        life = life - 1;
      }  
    }   
  }  
   // to destroy the zombie if it touches the bullet
   if  (zombieGroup.isTouching(bulletGroup)) {
    for (var i=0; i<zombieGroup.length; i++) { 

      if (zombieGroup[i].isTouching(bulletGroup)){

       zombieGroup[i].destroy(); 
       bulletGroup.destroyEach(); 
       explosionSound.play();
              

       score = score + 2; 
       
      }
    }
   }
  // calling the function to spawn the zombie
    spawnzombie();
  }
    drawSprites(); 
    textSize(20); 
    fill("white"); 

    text("Score = " + score,displayWidth-200,displayHeight/2-220); 
    text("lives = " + life,displayWidth-200,displayHeight/2-280); 
    text("bullets = " + bullets,displayWidth-200,displayHeight/2-250); 

   // to destroy zombie and player and to display a msg in gameState lost
   if (gameState == "lost"){                
    textSize(100);
    fill("red");
    text("You Lost",400,400);                                 
                                                   
                                                                 
    zombieGroup.destroyEach();                           
    player.destroy(); 
                                                                                    
   }                                                   
   else if (gameState == "won"){               
    textSize(100);  
    fill("yellow"); 
    text("You Won",400,400); 
              
                     
    zombieGroup.destroyEach();            
    player.destroy();
   } 
   else if (gameState == "bullet"){
    textSize(100);
    fill("white"); 
    text("you ran out of Bullets",470,410); 
    
    
    zombieGroup.destroyEach(); 
    bulletGroup.destroyEach();   
    player.destroy();
   }

} 

function spawnzombie() {
  if (frameCount%50 === 0){

  
    zombie = createSprite(random(400,1100),random(100,500),40,40);
    zombie.addImage(zombieImg); 
    zombie.scale = 0.15;  
    zombie.velocityX = -3; 
    zombie.debug = true; 
    zombie.setCollider("rectangle",0,0,400,400); 

    zombie.lifetime = 400; 
    zombieGroup.add(zombie); 
} 
}