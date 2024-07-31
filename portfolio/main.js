import * as PIXI from 'pixi.js';
//import {Tween} from '@tweenjs/tween.js'

let w = window.innerWidth - 10;
let h = window.innerHeight- 100;


let app;
let keys = {};
let player;
let keysDiv;
let character;
let characterMovement = [];
let animations;
let loader = new PIXI.Loader();

window.onload = async function () {

  app = new PIXI.Application();

  (async () => {
    await app.init({
      // application options
      width: w, height: h, backgroundColor: 0xffffff
    });

    app.stage.hitArea = app.screen;
    app.stage.interactive = true;

    // do pixi things
    app.renderer.resize(w, h)

    // The application will create a canvas element for you that you
    // can then insert into the DOM
    document.body.appendChild(app.canvas);

    // load the texture we need
    const texture = await PIXI.Assets.load('bluefront.png');
    
    //add world sprites
    initWorld();


    const walkDownTexture = await PIXI.Assets.load([
        "player_movement.json"  
    ]);

    animations = PIXI.Assets.cache.get('player_movement.json').data.animations;

    //character = PIXI.AnimatedSprite.fromFrames(animations["walk_down/walk_down"]);
    characterMovement["walk_down"] = PIXI.AnimatedSprite.fromFrames(animations["walk_down/walk_down"]);
    characterMovement["walk_up"] = PIXI.AnimatedSprite.fromFrames(animations["walk_up/walk_up"]);
    characterMovement["walk_left"] = PIXI.AnimatedSprite.fromFrames(animations["walk_left/walk_left"]);
    characterMovement["walk_right"] = PIXI.AnimatedSprite.fromFrames(animations["walk_right/walk_right"]);

    character = PIXI.AnimatedSprite.fromFrames(animations["walk_down/walk_down"]);

    // size sprite 
    var scaleX = 2;
    var scaleY = 2;    
    character.scale.set(scaleX, scaleY);
    
    // configure + start animation:
    character.animationSpeed = 1/12;                     // 6 fps
    //character.position.set(150, 100); // almost bottom-left corner of the canvas

    // add it to the stage and render!
    app.stage.addChild(character);
    //character.play();
    
    //app.stage.addChild(characterMovement["walk_down"], characterMovement["walk_up"], characterMovement["walk_left"], characterMovement["walk_right"] )

    // Setup the position of the bunny
    character.x = app.renderer.width / 2;
    character.y = app.renderer.height / 2;

    // Listen for window resize events
    window.addEventListener('resize', resize);

    //movement event listeners
    window.addEventListener("keydown", keysdown);
    window.addEventListener("keyup", keysup);
    //window.addEventListener("click",clicked);

    app.stage.on('click', function(event) {      

      //variables x and y for current position data
      const x = event.data.global.x;
      const y = event.data.global.y;

      moveTo(character, x,y);

    });

    app.ticker.add(gameloop);

    keysDiv = document.querySelector("#keys")
  })()



}

async function initWorld(){
   const texture = await PIXI.Assets.load('buildings/building_1.png');
   const bunny = new PIXI.Sprite(texture);

  console.log(bunny);

   // Setup the position of the bunny
   bunny.x = app.renderer.width / 2;
   bunny.y = app.renderer.height / 2;

    // size sprite 
    var scaleX = 2;
    var scaleY = 2;    
    bunny.scale.set(scaleX, scaleY);
  

  app.stage.addChild(bunny);
}

//let keysDiv = document.querySelector("#keys");

function moveTo(character, newX,newY)
{
  // initiate variables
  let time;
  let timeMultiplier = 3;

  
  character.play();
  //Calculate the distance between points to determine how long should move last
  const dx = newX - character.x;
  const dy = newY - character.y;
  time = Math.sqrt(dx*dx + dy*dy);
  
  calculateDirection(newX,newY);

  //start character animation 
  character.play();

  //call tweenjs animations and then call movement completed function 
  createjs.Tween.get(character.position).to({x:newX, y:newY}, timeMultiplier * time).call(movementCompleted);
  

}

// calculate direction and update textures
function calculateDirection(newX,newY){
  let AB = {x:0,y:0, angle:0}
  AB.x = newX - character.x
  AB.y = newY - character.y
  console.log(AB.x)
  console.log(AB.y)

  AB.angle = Math.atan2(AB.x, AB.y) * 180 / Math.PI;
  if (AB.angle < 0){
    AB.angle = AB.angle + 360
  }

  console.log("new angle", AB.angle);
  //

  if(AB.angle > 0 && AB.angle < 90){
    //right animation // first qudrant
    if(character.textures != characterMovement["walk_right"].textures){
      character.textures =  characterMovement["walk_right"].textures;
    }
  }
  if(AB.angle > 90 && AB.angle < 180){
    // right animation // second quadrant
    if(character.textures != characterMovement["walk_right"].textures){
      character.textures =  characterMovement["walk_right"].textures;
    }
  }
  if(AB.angle > 180 && AB.angle < 270){
    //third quadrant
    if(character.textures != characterMovement["walk_left"].textures){
      character.textures = characterMovement["walk_left"].textures;
    }
  }
  if(AB.angle > 270 && AB.angle < 360){
    //fourth quadrant
    if(character.textures != characterMovement["walk_left"].textures){
      character.textures = characterMovement["walk_left"].textures;
    }
  }
  if(AB.angle > 170 && AB.angle < 190){
    if(character.textures != characterMovement["walk_up"].textures){
      character.textures = characterMovement["walk_up"].textures;
    }
  }
  if(AB.angle > 350 || AB.angle < 10){
    if(character.textures != characterMovement["walk_down"].textures){
      character.textures = characterMovement["walk_down"].textures;
    }
  }
  

}

function movementCompleted(){
character.stop();
}


function keysdown(e) {
  var keyCode = (window.event) ? e.which : e.keyCode;
  keys[keyCode] = true;
  character.play();
}

function keysup(e) {
  var keyCode = (window.event) ? e.which : e.keyCode;
  keys[keyCode] = false

  character.stop();
}

function gameloop() {
  keysDiv.innerHTML = JSON.stringify(keys);
  //console.log(character.playing)


  
  //walk up 87
  if (keys['87'] && character.y > 0) {
    if(character.textures != characterMovement["walk_up"].textures){
      character.textures = characterMovement["walk_up"].textures;
    }


    
    character.play();
    character.y -= 1;
  }
  //walk left 65
  if (keys["65"] && character.x > 0) {
    if(character.textures != characterMovement["walk_left"].textures){
      character.textures =  characterMovement["walk_left"].textures; 
    }
    
    character.play();
    character.x -= 1;
  }
  //walk down 83
  if (keys["83"] && character.y < window.innerHeight - 36) {
    if(character.textures != characterMovement["walk_down"].textures){
      character.textures =  characterMovement["walk_down"].textures;
    }
    
    character.y += 1;
    character.play();
    
  }
  //walk right 68
  if (keys["68"] && character.x < window.innerWidth - 64) {
    if(character.textures != characterMovement["walk_right"].textures){
      character.textures =  characterMovement["walk_right"].textures;
    }
    
    character.play();
    character.x += 1;
  }


}


// Resize function window
function resize() {
  // Resize the renderer
  app.renderer.resize(window.innerWidth, window.innerHeight);

  // You can use the 'screen' property as the renderer visible
  // area, this is more useful than view.width/height because
  // it handles resolution
  character.position.set(app.screen.width / 2 , app.screen.height / 2);
}

