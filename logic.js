var config = {
  parent: 'game-container',
  type: Phaser.CANVAS,
  width: 800,
  height: 800,
  scene: {
    preload: preload,
    create: create,
    update : update
  }
};

var game = new Phaser.Game(config);
var objs = [];

// 상수 선언부
const OBJS_START_POS_X = 400;
const OBJS_START_POS_Y = 500;
const OBJS_SPACE = 30;
const REAR_IND = 19;


// Define game variables
var characters = ['A', 'B', 'C']; // Array of character types
var characterIndex = 0; // Current character index
var score = 0; // Player's score
var time = 30; // Initial time limit in seconds

let debounceTimer;
// Preload assets
function preload() {
  
  this.load.image('background', 'media/background/background.png');
  this.load.image('A', 'media/characters/bear.png');
  this.load.image('B', 'media/characters/duck.png');
  this.load.image('C', 'media/characters/pig.png');
  initObjs();

  // Load character images or spritesheets if needed

}

// Create game elements
function create() {
  // Add background image

  this.add.image(400, 400, 'background');
  // characters[Math.floor(Math.random() * characters.length)]
  KeyInput = this.input.keyboard.createCursorKeys();

}

// Update game elements
function update() {
  this.add.image(400, 400, 'background');
  
  let sprite = objs[0];
  
  // characters[Math.floor(Math.random() * characters.length)]
  
  for(let i = REAR_IND ; i > -1 ; i--)
  {
      this.add.sprite(OBJS_START_POS_X, OBJS_START_POS_Y - i * OBJS_SPACE, objs[i]);
  }


// 키보드 입력 1회 인식 및 갱신
if (Phaser.Input.Keyboard.JustDown(KeyInput.left)) {
  if (isA()) invalidate();
}
else if (Phaser.Input.Keyboard.JustDown(KeyInput.down)) {

  if (isB())  invalidate();
} 
else if (Phaser.Input.Keyboard.JustDown(KeyInput.right)) {

  if (isC())  invalidate();
}


  
}

function initObjs() {
  for(let i = 0 ; i <= REAR_IND ; i++)
  {
      objs[i] = characters[Math.floor(Math.random() * characters.length)];
  }
}

function printObjs()
{
      document.write(objs+ "<br>");
}


function invalidate()
{
  for(let i = 0 ; i < REAR_IND ; i++)
  {
      objs[i] = objs[i+1];
  }
  objs[REAR_IND] = characters[Math.floor(Math.random() * characters.length)];
}


function isA()
{
  if (objs[0] == 'A') return true;
  else return false;
}

function isB()
{
  if (objs[0] == 'B') return true;
  else return false;
}

function isC()
{
  if (objs[0] == 'C') return true;
  else return false;
}