import * as PIXI from 'pixi.js';
import { CompositeTilemap } from '@pixi/tilemap';
//import {Tween} from '@tweenjs/tween.js'

let w = (window.innerWidth - 10);
let h = (window.innerHeight - 100)/2;
if(window.innerWidth > 768){
 h = window.innerHeight;
}



let app;
let keys = {};
let keysDiv;
let character;
let characterMovement = [];
let animations;
let world;
let charMoveDirection;
let building;
let charCollision;
let modal;
let modalBody;
let mapHeight = 1000;
let mapWidth = 1350;
let arcade;
let stage;
let restaurant;
let office;
let github;


window.onload = async function () {

  app = new PIXI.Application();

  (async () => {
    await app.init({
      // application optionss
      width: w, height: h, backgroundColor: 0xccae73
    });

    // can intercat with screen events 
    app.stage.hitArea = app.screen;
    app.stage.interactive = true;

    // insert canvas into the DOM
    document.body.appendChild(app.canvas);

    const body = document.getElementById("body");
    body.insertBefore(app.canvas, body.children[0]);


    world = new PIXI.Container();
    world.height = mapHeight;
    world.width = mapWidth;
    world.x = w / 2;
    world.y = h / 2;
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
    //init modals
    initModals();
  })()
}

function initModals() {
  // Get the modal
  modal = document.getElementById("myModal");
  modalBody = document.getElementById("modalBody")

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var close = document.getElementById("closeBtn");

  // When the user clicks the button, open the modal 

  // When the user clicks on <span> (x), close the modal
  close.onclick = function () {
    modal.style.display = "none";
  }

  close.addEventListener("touchstart", (e) => {
    modal.style.display = "none";
    console.log("here");
  });
  
  close.addEventListener('touchend', function(e){
    modal.style.display = "none";
    console.log("here");
  }, false);


  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

}

////////

async function inputsMap(params) {

  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  }, false);

  let upBtn = document.getElementById("upBtn");
  upBtn.addEventListener('touchstart', (e) => {
    let interval = setInterval(() => {
      keys['87'] = true;
      charMoveDirection = "up";
    }, 1);
    upBtn.addEventListener('touchend', () => {
      clearInterval(interval);
      charMoveDirection = "";
      keys['87'] = false;
      character.stop();
    });
  });


  let downBtn = document.getElementById("downBtn");
  downBtn.addEventListener('touchstart', () => {
    let interval = setInterval(() => {
      keys['83'] = true;
      charMoveDirection = "down";
    }, 50);
    downBtn.addEventListener('touchend', () => {
      clearInterval(interval);
      charMoveDirection = "";
      keys['83'] = false;
      character.stop();
    });
  });

  let leftBtn = document.getElementById("leftBtn");
  leftBtn.addEventListener('touchstart', () => {
    let interval = setInterval(() => {
      if (character.x > 0) {
        keys['65'] = true;
        charMoveDirection = "left";
      }
    }, 1);
    leftBtn.addEventListener('touchend', () => {
      clearInterval(interval);
      charMoveDirection = "";
      keys['65'] = false;
      character.stop();
    });
  });

  let rightBtn = document.getElementById("rightBtn");
  rightBtn.addEventListener('touchstart', () => {
    let interval = setInterval(() => {
      if (character.x < world.width) {
        keys['68'] = true;
        charMoveDirection = "right";
      }
    }, 1);
    rightBtn.addEventListener('touchend', () => {
      clearInterval(interval);
      keys['68'] = false;
      charMoveDirection = "";
      character.stop();
    });
  });

  let buttonA = document.getElementById("aBtn");
  

  let buttonB = document.getElementById("bBtn");
  buttonB.addEventListener('touchend', closeModal)

}

function closeModal(){
  modal.style.display = "none";
}

async function initMap() {
  // size sprite 
  let scaleX = 2;
  let scaleY = 2;
  let TileSpriteSize = 16;

  const tilemap = new CompositeTilemap();

  const texture = await PIXI.Assets.load('WesternMap.png');
  let baseMap = new PIXI.Sprite(texture);
  // Setup the position of the building
  baseMap.x = 0;
  baseMap.y = 0;

  world.addChild(baseMap);

 /* await PIXI.Assets.load(['CliffTiles.json']).then(() => {
    
    
    // 4 is all green 
  

    //rows
    for(let i = 0 ; i < (mapSize/TileSpriteSize); i++){
      //columns
      
        tilemap.tile('CliffTile-4.png', i, 0);
      
    }
    

    tilemap.scale.set(scaleX, scaleY);

    world.addChild(tilemap);
  });
  */


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
  var scaleX = 1;
  var scaleY = 1;
  character.scale.set(scaleX, scaleY);

  // configure + start animation:
  character.animationSpeed = 1 / 10;                     // 6 fps
  //character.position.set(150, 100); // almost bottom-left corner of the canvas
  //app.stage.children[0].textures = PIXI.textures.from("map.jpg");
  //tmp

  // Setup the position of the player
  character.x = world.width / 2;
  character.y = world.height / 2;

  world.addChild(character);

  //delete
  //console.log(character.bounds)

  //buildings 
  const farmTexture = await PIXI.Assets.load('Western_Buildings/Western_Buildings-4.png');
  building = new PIXI.Sprite(farmTexture);

  // Setup the position of the building
  building.x = 200;
  building.y = 0;

  building.scale.set(scaleX, scaleY);


  world.addChild(building);

  const arcadeTexture = await PIXI.Assets.load('Western_Buildings/Western_Buildings-5.png');
  arcade = new PIXI.Sprite(arcadeTexture);

  // Setup the position of the building
  arcade.x = 600;
  arcade.y = 680;

  arcade.scale.set(scaleX, scaleY);


  world.addChild(arcade);

  const stageTexture = await PIXI.Assets.load('Western_Buildings/Western_Buildings-3.png');
  stage = new PIXI.Sprite(stageTexture);

  // Setup the position of the building
  stage.x = 950;
  stage.y = 0;

  stage.scale.set(scaleX, scaleY);


  world.addChild(stage);

  const restaurantTexture = await PIXI.Assets.load('Western_Buildings/Western_Buildings-2.png');
  restaurant = new PIXI.Sprite(restaurantTexture);

  // Setup the position of the building
  restaurant.x = 1000;
  restaurant.y = 300;

  restaurant.scale.set(scaleX, scaleY);


  world.addChild(restaurant);

  const officeTexture = await PIXI.Assets.load('Western_Buildings/Western_Buildings-1.png');
  office = new PIXI.Sprite(officeTexture);

  // Setup the position of the building
  office.x = 250;
  office.y = 650;

  office.scale.set(scaleX, scaleY);


  world.addChild(office);
  
  const githubTexture = await PIXI.Assets.load('Western_Buildings/Western_Buildings-0.png');
  github = new PIXI.Sprite(githubTexture);

  // Setup the position of the building
  github.x = 600;
  github.y = 300;

  github.scale.set(scaleX, scaleY);


  world.addChild(github);

  //console.log("building: ", building.bounds)
}

function addSpriteAsset(texture){

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

  calculateDirection(newX, newY); d

  //start character animation 
  character.play();

  //call tweenjs animations and then call movement completed function 
  createjs.Tween.get(character.position).to({ x: newX, y: newY }, timeMultiplier * time).call(movementCompleted);


}

// returns boolean if intersecetd
function boxesIntersect(a, b) {
  var ab = a.getBounds();
  var bb = b.getBounds();

  if (ab.x + ab.width > bb.x) {
    console.log("ab.x + ab.width > bb.x", ab.x + ab.width > bb.x)
  }
  //player x coordinate is less than the
  if (ab.x < bb.x + bb.width) {
    console.log("ab.x < bb.x + bb.width", ab.x < bb.x + bb.width)
  }
  if (ab.y + ab.height > bb.y) {
    console.log("ab.y + ab.height > bb.y", ab.y + ab.height > bb.y)
  }
  if (ab.y < bb.y + bb.height) {
    console.log("ab.y < bb.y + bb.height", ab.y < bb.y + bb.height)
  }
  //console.log("ab.x + ab.width > bb.x: ",ab.x + ab.width > bb.x)
  //console.log("ab.x < bb.x + bb.width: ",ab.x < bb.x + bb.width)
  //console.log("ab.y + ab.height > bb.y : ",ab.y + ab.height > bb.y )
  //console.log("ab.y < bb.y + bb.height: ",ab.y < bb.y + bb.height)
  return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

// return true if the 2 rectangles are colliding

function RectsColliding(obj1, obj2) {
  return !(obj1.x > obj2.x + obj2.width || obj1.x + obj1.width < obj2.x || obj1.y > obj2.y + obj2.height || obj1.y + obj1.height < obj2.y);
}

function HandleCollision(character, building, modalText) {
  //charCollision = RectsColliding(character, building);
  if (RectsColliding(character, building)) {
    var characterHalfW = character.width / 2
    var characterHalfH = character.height / 2
    var buildingHalfW = building.width / 2
    var buildingHalfH = building.height / 2
    var characterCenterX = character.x + character.width / 2
    var characterCenterY = character.y + character.height / 2
    var buildingCenterX = building.x + building.width / 2
    var buildingCenterY = building.y + building.height / 2

    // Calculate the distance between centers
    var diffX = characterCenterX - buildingCenterX
    var diffY = characterCenterY - buildingCenterY

    // Calculate the minimum distance to separate along X and Y
    var minXDist = characterHalfW + buildingHalfW
    var minYDist = characterHalfH + buildingHalfH

    // Calculate the depth of collision for both the X and Y axis
    var depthX = diffX > 0 ? minXDist - diffX : -minXDist - diffX
    var depthY = diffY > 0 ? minYDist - diffY : -minYDist - diffY

    // distance to move char back 
    let pushBackDist = 5;



    // Now that you have the depth, you can pick the smaller depth and move
    // along that axis.
    if (depthX != 0 && depthY != 0) {
      if (Math.abs(depthX) < Math.abs(depthY)) {
        // Collision along the X axis. React accordingly
        if (depthX > 0) {
          //console.log("left side collision");
          character.x = character.x + pushBackDist;
        } else {
          //console.log("right side collision");
          character.x = character.x - pushBackDist;
        }
      } else {
        // Collision along the Y axis.
        if (depthY > 0) {
          console.log("in here keys 87 is", keys['87']);
          // 87,65,83,68

          //stop movement 


          //console.log("top side collision");
          modalBody.innerText = modalText;
          modal.style.display = "block";
          modalText = 
          character.y = character.y + pushBackDist;
          console.log("in here keys 87 is", keys['87']);

        } else {
          //console.log("bottom side collision");
          character.y = character.y - pushBackDist;
        }
      }
    }
    // open modal here
  } else {
    //console.log("No collision");
  }
  //console.log("charCollision: ", charCollision)
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
  console.log(keyCode);
}

function keysup(e) {
  var keyCode = (window.event) ? e.which : e.keyCode;
  keys[keyCode] = false
  charMoveDirection = "";
  character.stop();
}

function checkOutOfBounds(){
  console.log(character.x);
  if(character.x > mapWidth ){
      character.x =  mapWidth;
  }
  if(character.y > mapHeight ){
    character.y =  mapHeight;
  }
  if(character.y < 0 ){
    character.y =  0;
  }
  if(character.x < 0){
    character.x = 0;
  }

  console.log(character.x);
}

function gameloop() {
  //keysDiv.innerHTML = JSON.stringify(keys);
  //console.log(character.playing)

  checkOutOfBounds();

 

  // test 
  //charCollision = boxesIntersect(character, building);
  //charCollision = RectsColliding(character, building);
  HandleCollision(character, building, "Safilog");
  HandleCollision(character, arcade, "arcade");
  HandleCollision(character, stage, "stage");
  HandleCollision(character, restaurant, "restaurant");
  HandleCollision(character, github, "github");
  HandleCollision(character, office, "LinkedIn");

  //close modal with escape key
  if(keys['27']){
    modal.style.display = "none";
  }

  //text
  //check keyboard key press input to assign charMoveDirection
  if (keys['87']) {
    charMoveDirection = "up";
  }
  else if (keys["65"]) {
    charMoveDirection = "left";
  }
  else if (keys["83"]) {
    charMoveDirection = "down";
  }
  else if (keys["68"]) {
    charMoveDirection = "right";
  }

  if (!charCollision) {
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
    if ((charMoveDirection == "down" || keys["83"]) && character.y < mapHeight - 36) {
      if (character.textures != characterMovement["walk_down"].textures) {
        character.textures = characterMovement["walk_down"].textures;
      }
      character.y += 1;
      character.play();

    }
    //walk right 68
    if ((charMoveDirection == "right" || keys["68"]) && character.x < mapWidth - 64) {
      if (character.textures != characterMovement["walk_right"].textures) {
        character.textures = characterMovement["walk_right"].textures;
      }
      character.play();
      character.x += 1;
    }
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

