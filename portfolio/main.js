import { Application, Sprite, Assets } from 'pixi.js';

let w = window.innerWidth;
let h = window.innerHeight;

let app;
let keys = {};
let player;
let keysDiv;

window.onload = async function () {
  // The application will create a renderer using WebGL, if possible,
  // with a fallback to a canvas render. It will also setup the ticker
  // and the root stage PIXI.Container
  app = new Application();

  // Wait for the Renderer to be available
  await app.init({ w, h });

  //this is the class _app extends PIXI.Application

  app.renderer.resize(w, h)

  // The application will create a canvas element for you that you
  // can then insert into the DOM
  document.body.appendChild(app.canvas);

  // load the texture we need
  const texture = await Assets.load('bluefront.png');

  // This creates a texture from a 'bunny.png' image
  player = new Sprite(texture);

  // Setup the position of the bunny
  player.x = app.renderer.width / 2;
  player.y = app.renderer.height / 2;


  // Add the bunny to the scene we are building
  app.stage.addChild(player);

  // Listen for window resize events
  window.addEventListener('resize', resize);

  //movement event listeners
  window.addEventListener("keydown", keysdown);
  window.addEventListener("keyup", keysup);

  app.ticker.add(gameloop);

  keysDiv = document.querySelector("#keys")
}

//let keysDiv = document.querySelector("#keys");

function keysdown(e) {
  var keyCode = (window.event) ? e.which : e.keyCode;
  console.log(keyCode);
  keys[keyCode] = true;
  //console.log(keys[e.keycode])
}

function keysup(e) {
  var keyCode = (window.event) ? e.which : e.keyCode;
  console.log(keyCode);
  keys[keyCode] = false
}

function gameloop() {
  keysDiv.innerHTML = JSON.stringify(keys)

  
  if(keys['87'] && player.y > 0){
    player.y -=5;
  }
  if(keys["65"]  && player.x > 0){
    
    player.x -=5;
  }
  if(keys["83"] && player.y < window.innerHeight - 36){
    console.log(window.innerHeight)
    console.log(player.y)
    player.y +=5;
  }
  if(keys["68"] && player.x < window.innerWidth - 64){
    
    player.x +=5;
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

