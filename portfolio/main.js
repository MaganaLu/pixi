import * as PIXI from 'pixi.js';

let w = window.innerWidth;
let h = window.innerHeight;

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
      width: w, height: h, backgroundColor: 0x7a7a7a
    });

    // do pixi things
    app.renderer.resize(w, h)

    // The application will create a canvas element for you that you
    // can then insert into the DOM
    document.body.appendChild(app.canvas);

    // load the texture we need
    const texture = await PIXI.Assets.load('bluefront.png');
    const walkDownTexture = await PIXI.Assets.load([
        "player_movement.json"  
    ]);

    animations = PIXI.Assets.cache.get('player_movement.json').data.animations;

    //character = PIXI.AnimatedSprite.fromFrames(animations["walk_down/walk_down"]);
    characterMovement["walk_down"] = PIXI.AnimatedSprite.fromFrames(animations["walk_down/walk_down"]);
    characterMovement["walk_up"] = PIXI.AnimatedSprite.fromFrames(animations["walk_up/walk_up"]);
    characterMovement["walk_left"] = PIXI.AnimatedSprite.fromFrames(animations["walk_left/walk_left"]);
    characterMovement["walk_right"] = PIXI.AnimatedSprite.fromFrames(animations["walk_right/walk_right"]);

    character = characterMovement["walk_down"];
    
    // configure + start animation:
    character.animationSpeed = 1 / 6;                     // 6 fps
    //character.position.set(150, 100); // almost bottom-left corner of the canvas

    // add it to the stage and render!
    app.stage.addChild(character);
    
    //app.stage.addChild(characterMovement["walk_down"], characterMovement["walk_up"], characterMovement["walk_left"], characterMovement["walk_right"] )

    // Setup the position of the bunny
    character.x = app.renderer.width / 2;
    character.y = app.renderer.height / 2;

    // Listen for window resize events
    window.addEventListener('resize', resize);

    //movement event listeners
    window.addEventListener("keydown", keysdown);
    window.addEventListener("keyup", keysup);

    app.ticker.add(gameloop);

    keysDiv = document.querySelector("#keys")
  })()



}

//let keysDiv = document.querySelector("#keys");

function keysdown(e) {
  var keyCode = (window.event) ? e.which : e.keyCode;
  console.log(keyCode);
  keys[keyCode] = true;
}

function keysup(e) {
  var keyCode = (window.event) ? e.which : e.keyCode;
  console.log(keyCode);
  keys[keyCode] = false

  // stop all animation when keys are let go 
  character.stop();
}

function gameloop() {
  keysDiv.innerHTML = JSON.stringify(keys)
  
  //walk up
  if (keys['87'] && character.y > 0) {
    character.textures = characterMovement["walk_up"].textures;
    character.animationSpeed = 1 / 6;
    character.visible = true;
    character.y -= 5;
    character.play();
  }
  //walk left
  if (keys["65"] && character.x > 0) {
    character.textures =  characterMovement["walk_left"].textures; 
    character.x -= 5;
    character.play();
  }
  //walk down
  if (keys["83"] && character.y < window.innerHeight - 36) {
    character.textures =  characterMovement["walk_down"].textures;
    character.y += 5;
    character.play();
  }
  //walk right
  if (keys["68"] && character.x < window.innerWidth - 64) {
    character.textures =  characterMovement["walk_right"].textures;
    character.x += 5;
    character.play();
  }
}


// Resize function window
function resize() {
  // Resize the renderer
  app.renderer.resize(window.innerWidth, window.innerHeight);

  // You can use the 'screen' property as the renderer visible
  // area, this is more useful than view.width/height because
  // it handles resolution
  //player.position.set(app.screen.width / 2 , app.screen.height / 2);
}

