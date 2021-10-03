var towerImg,tower;
var doorImg,door,doorsGroup;
var climberImg,climber,climbersGroup;
var ghost, ghostImg;
var invisibleBlockGroup,invisibleBlock;
var gameState="play";
var spookySound;
var score=0;

function preload(){
  towerImg=loadImage("tower.png");
  doorImg=loadImage("door.png");
  climberImg=loadImage("climber.png");
  ghostImg=loadImage("ghost-standing.png");
  spookySound=loadSound("spooky.wav");
}

function setup(){
  createCanvas(600,600);
  
  tower=createSprite(300,300);
  tower.addImage("tower",towerImg);
  tower.velocityY=1;
  
  //Creamos los grupos
  doorsGroup=new Group();
  climbersGroup=new Group();
  invisibleBlockGroup=new Group();
  
  ghost=createSprite(200,200,50,50);
  ghost.addImage(ghostImg);
  ghost.scale=0.3;
  
}

function draw(){
  background(0);
  
  
  //Agregamos el estado inicial del juego
  if(gameState==="play")
  {
    spookySound.play();
    //Score
    //score = score + Math.round(getFrameRate()/60);
    
    //Restablecer fondo
    if(tower.y>549){
      tower.y=300;
    }

     //Movimiento del fantasma con las flechas
    if(keyDown("left_arrow")){
      ghost.x=ghost.x-3;
    }
    if(keyDown("right_arrow")){
      ghost.x=ghost.x+3;
    }
    if(keyDown("space")){
      //Score
      score +=1;
      ghost.velocityY=-5;
    }

    //Poner la gravedad después
    ghost.velocityY=ghost.velocityY+0.6;

    //Hacemos que el fantasme pueda descansar en los barandales asignando velocidad 0
    if(climbersGroup.isTouching(ghost)){
      ghost.velocityY=0;
      
    }

    //si el fantasma toca la barandilla desde abajo o cae más allá del lienzo el fantasma se destruye
    if(invisibleBlockGroup.isTouching(ghost) || ghost.y>600){
      ghost.destroy();
      gameState="end";
    }
 
    //Llamamos la función mostrar/aparecer puertas
    spawnDoors();
    drawSprites();
    
    //Colocamos el puntaje en pantalla
    stroke("yellow");
    fill("yellow");
    text("Score: "+ score, 500,50);
   } //Aquí termina mi estado inicial del juego
   
  //Agregamos el estado final del juego
  if(gameState==="end"){
    stroke("red");
    fill("yellow");
    textSize(50);
    text("Game Over",180,250);
    spookySound.stop();
  }
}

function spawnDoors(){
  //Escribimos el código para aparecer las puertas en la torre
  if(frameCount%240===0){
    door=createSprite(200,-50);
    door.addImage(doorImg);
    
    //Barandales
    climber=createSprite(200,10);
    climber.addImage(climberImg);
    
    //Creamos los bloques invisibles debajo de los barandales
    invisibleBlock=createSprite(200,15);
    invisibleBlock.width=climber.width;
    invisibleBlock.height=2;
    
    door.x=Math.round(random(120,400));
    door.velocityY=1;
    
    climber.x=door.x;
    climber.velocityY=1;
    
    //Le damos posición igual a los barandales y velocidad a los bloques invisibles
    invisibleBlock.x=door.x;
    invisibleBlock.velocityY=1;
    
    //Le damos más profundidad al fantasma
    ghost.depth=door.depth;
    ghost.depth+=1;
    
    //Asignación de ciclo de vida a las puertas
    door.lifetime=800;
    climber.lifetime=800;
    
    //Agregar cada puerta al grupo
    doorsGroup.add(door);
    //Agregar cada barandal al grupo
    climbersGroup.add(climber);
    //Agregar cada block invisible al grupo
    invisibleBlockGroup.add(invisibleBlock);
    
    //Asemos invisible los bloques debajo de los barandales
    //Con debug activamos el radio de colisión que vimos C14
    invisibleBlock.debug=true;
    invisibleBlock.visible=false;
  }
}
