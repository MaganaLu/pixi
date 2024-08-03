import * as PIXI from 'pixi.js';
import { CompositeTilemap } from '@pixi/tilemap';
//import {Tween} from '@tweenjs/tween.js'

let w = window.innerWidth - 10;
let h = window.innerHeight - 100;


let app;
let keys = {};
let keysDiv;
let character;
let characterMovement = [];
let animations;
let world;
let charMoveDirection;

window.onload = async function () {

  app = new PIXI.Application();

  (async () => {
    await app.init({
      // application options
      width: w, height: h, backgroundColor: 0xffffff
    });

    // can intercat with screen events 
    app.stage.hitArea = app.screen;
    app.stage.interactive = true;

    // insert canvas into the DOM
    document.body.appendChild(app.canvas);


    world = new PIXI.Container();
    world.height = 4000;
    world.width = 4000;
    world.x = window.innerWidth / 2;
    world.y = window.innerHeight / 2;
    world.pivot.x = world.width / 2;
    world.pivot.y = world.height / 2;

    //init tilemap for game map  
    await initMap();



    //add world sprites
    await initSprites();

    // add it to the stage and render!
    app.stage.addChild(world);



    // Listen for window resize events
    window.addEventListener('resize', resize);

    //movement event listeners
    window.addEventListener("keydown", keysdown);
    window.addEventListener("keyup", keysup);

    //tickers
    app.renderer.resize(w, h);
    app.ticker.add(gameloop);

    //move screen based on player movement
    /*
    app.ticker.add((delta) => {
      let distance = 1;
      if (charMoveDirection == "left") { //Get player input however you please
        character.x -= distance;
        world.pivot.x = character.x;
        //app.stage.position.x = app.renderer.width/2;
        //app.stage.position.y = app.renderer.height/2
      }
      else if (charMoveDirection == "right") {
        character.x += distance;
        world.pivot.x = character.x;
        //app.stage.position.x = app.renderer.width/2;
        //app.stage.position.y = app.renderer.height/2
      }
    });
    */

    //controls
    keysDiv = document.querySelector("#keys")
    await inputsMap();

    //event handler for clicking movement might implement later idk 
    /*
    app.stage.on('click', function (event) {

      //variables x and y for current position data
      const x = event.data.global.x;
      const y = event.data.global.y;
      console.log("x:", x);
      console.log("y:", y);

      moveTo(character, x, y);

    });
    */

  })()



}

async function inputsMap(params) {
  let upBtn = document.getElementById("upBtn");
  //upBtn.addEventListener("mousedown", test);
  upBtn.addEventListener('mousedown', () => {
    let interval = setInterval(() => {
      character.y--;
      charMoveDirection = "up";
    }, 50);
    upBtn.addEventListener('mouseup', () => {
      clearInterval(interval);
      charMoveDirection = "";
      character.stop();
    });
  });

  let downBtn = document.getElementById("downBtn");
  //upBtn.addEventListener("mousedown", test);
  downBtn.addEventListener('mousedown', () => {
    let interval = setInterval(() => {
      character.y++;
      charMoveDirection = "down";
    }, 50);
    downBtn.addEventListener('mouseup', () => {
      clearInterval(interval);
      charMoveDirection = "";
      character.stop();
    });
  });

  let leftBtn = document.getElementById("leftBtn");
  //upBtn.addEventListener("mousedown", test);
  leftBtn.addEventListener('mousedown', () => {
    let interval = setInterval(() => {
      if (character.x > 0) {
        character.x = character.x - 1;
        charMoveDirection = "left";
        character.stop();
      }
    }, 50);
    leftBtn.addEventListener('mouseup', () => {
      clearInterval(interval);
      charMoveDirection = "";
      character.stop();
    });
  });

  let rightBtn = document.getElementById("rightBtn");
  //upBtn.addEventListener("mousedown", test);
  rightBtn.addEventListener('mousedown', () => {
    let interval = setInterval(() => {
      character.x = character.x + 1;
      charMoveDirection = "right";
    }, 50);
    rightBtn.addEventListener('mouseup', () => {
      clearInterval(interval);
      charMoveDirection = "";
      character.stop();
    });
  });
}

async function initMap() {
  await PIXI.Assets.load(['buildings.json']).then(() => {
    const tilemap = new CompositeTilemap();

    // Render your first tile at (0, 0)!
    tilemap.tile('building_3.png', 0, 0);

    world.addChild(tilemap);
  });
}

async function initSprites() {

  await PIXI.Assets.load(["player_movement.json"]);
  // player 
  animations = PIXI.Assets.cache.get('player_movement.json').data.animations;

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
  character.animationSpeed = 1 / 12;                     // 6 fps
  //character.position.set(150, 100); // almost bottom-left corner of the canvas
  //app.stage.children[0].textures = PIXI.textures.from("map.jpg");
  //tmp

  // Setup the position of the bunny
  character.x = world.width / 2;
  character.y = world.height / 2;

  world.addChild(character);

  //buildings 
  const texture = await PIXI.Assets.load('buildings/building_1.png');
  const building = new PIXI.Sprite(texture);

  // Setup the position of the building
  building.x = 0;
  building.y = 0;

  // size sprite 
  var scaleX = 1;
  var scaleY = 1;
  building.scale.set(scaleX, scaleY);


  world.addChild(building);
}

//let keysDiv = document.querySelector("#keys");

function moveTo(character, newX, newY) {
  // initiate variables
  let time;
  let timeMultiplier = 3;


  character.play();
  //Calculate the distance between points to determine how long should move last
  const dx = newX;
  const dy = newY;
  time = Math.sqrt(dx * dx + dy * dy);

  calculateDirection(newX, newY);

  //start character animation 
  character.play();

  //call tweenjs animations and then call movement completed function 
  createjs.Tween.get(character.position).to({ x: newX, y: newY }, timeMultiplier * time).call(movementCompleted);


}

// calculate direction and update textures
function calculateDirection(newX, newY) {
  let AB = { x: 0, y: 0, angle: 0 }
  AB.x = newX - character.x;
  AB.y = newY - character.y;
  console.log(AB.x);
  console.log(AB.y);

  AB.angle = Math.atan2(AB.x, AB.y) * 180 / Math.PI;
  if (AB.angle < 0) {
    AB.angle = AB.angle + 360;
  }

  console.log("new angle", AB.angle);
  //

  if (AB.angle > 0 && AB.angle < 90) {
    //right animation // first qudrant
    if (character.textures != characterMovement["walk_up"].textures) {
      character.textures = characterMovement["walk_up"].textures;
      charMoveDirection = "up";
    }
  }
  if (AB.angle > 90 && AB.angle < 180) {
    // right animation // second quadrant
    if (character.textures != characterMovement["walk_right"].textures) {
      character.textures = characterMovement["walk_right"].textures;
      charMoveDirection = "right";
    }
  }
  if (AB.angle > 180 && AB.angle < 270) {
    //third quadrant
    if (character.textures != characterMovement["walk_left"].textures) {
      character.textures = characterMovement["walk_left"].textures;
      charMoveDirection = "left";
    }
  }
  if (AB.angle > 270 && AB.angle < 360) {
    //fourth quadrant
    if (character.textures != characterMovement["walk_left"].textures) {
      character.textures = characterMovement["walk_left"].textures;
      charMoveDirection = "left";
    }
  }
  if (AB.angle > 170 && AB.angle < 190) {
    if (character.textures != characterMovement["walk_up"].textures) {
      character.textures = characterMovement["walk_up"].textures;
    }
  }
  if (AB.angle > 350 || AB.angle < 10) {
    if (character.textures != characterMovement["walk_down"].textures) {
      character.textures = characterMovement["walk_down"].textures;
    }
  }


}

function movementCompleted() {
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
  charMoveDirection = "";
  character.stop();
}

function gameloop() {
  keysDiv.innerHTML = JSON.stringify(keys);
  //console.log(character.playing)

  //check keyboard key press input to assign charMoveDirection
  if(keys['87']){
    charMoveDirection = "up";
  }
  else if(keys["65"]){
    charMoveDirection = "left";
  }
  else if(keys["83"]){
    charMoveDirection = "down";
  }
  else if(keys["68"]){
    charMoveDirection = "right";
  }

  //camera logic 
  let distance = 1;
  if (charMoveDirection == "left") {
    character.x -= distance;
    world.pivot.x = character.x;
  }
  else if (charMoveDirection == "right") {
    character.x += distance;
    world.pivot.x = character.x;
  }
  else if (charMoveDirection == "up") {
    character.y -= distance;
    world.pivot.y = character.y;
  }
  else if (charMoveDirection == "down") {
    character.y += distance;
    world.pivot.y = character.y;
  }

  // movement logic for keyboard
  //walk up 87
  if ((charMoveDirection == "up" || keys['87']) && character.y > 0) {
    if (character.textures != characterMovement["walk_up"].textures) {
      character.textures = characterMovement["walk_up"].textures;
    }
    character.play();
    character.y -= 1;
  }
  //walk left 65
  if ((charMoveDirection == "left" || keys["65"]) && character.x > 0) {
    if (character.textures != characterMovement["walk_left"].textures) {
      character.textures = characterMovement["walk_left"].textures;
    }
    character.play();
    character.x -= 1;
  }
  //walk down 83
  if ((charMoveDirection == "down" || keys["83"]) && character.y < window.innerHeight - 36) {
    if (character.textures != characterMovement["walk_down"].textures) {
      character.textures = characterMovement["walk_down"].textures;
    }
    character.y += 1;
    character.play();

  }
  //walk right 68
  if ((charMoveDirection == "right" || keys["68"]) && character.x < window.innerWidth - 64) {
    if (character.textures != characterMovement["walk_right"].textures) {
      character.textures = characterMovement["walk_right"].textures;
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
  character.x = world.width / 2;
  character.y = world.height / 2;

}

