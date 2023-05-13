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





// Define game variables
var characters = ['A', 'B', 'C']; // Array of character types
var characterIndex = 0; // Current character index
var score = 0; // Player's score
var time = 30; // Initial time limit in seconds
var rearind = 19;
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
  cursors = this.input.keyboard.createCursorKeys();

}

// Update game elements
function update() {
  this.add.image(400, 400, 'background');
  
  let sprite = objs[0];
  
  // characters[Math.floor(Math.random() * characters.length)]
  
  for(let i = rearind ; i > -1 ; i--)
  {
      this.add.sprite(400, 500 - i * 30, objs[i]);
  }

//수정해야 할 사항
// 키보드 떼기 전까지 갱신 X 
// 키보드 입력과 이미지 파일이 맞는지 확인 
  if (cursors.left.isDown) 
  {
    if(objs[0] == characters[0]) {
      invalidate();
    }
    else {
      this.add.text(400, 400, "wrong");
    }
  }
  else if (cursors.right.isDown)
  {
    if(objs[0] == characters[1]) {
      invalidate();
    }
    else {
      this.add.text(400, 400, "wrong");
    }
  }
  else if (cursors.up.isDown)
  {
    if(objs[0] == characters[2]) {
      invalidate();
    }
    else {
      this.add.text(400, 400, "wrong");
    }
  }


  // Update score text
  // scoreText.setText('Score: ' + score);

  // Move to the next character when a mapped key is pressed
  // You can implement the key mapping logic here, using Phaser's keyboard input
  // For example, you can use this.input.keyboard.addKey('SPACE') to detect the spacebar press


  // When a key is pressed, increment the characterIndex and check for game over condition
}

function initObjs() {
  for(let i = 0 ; i <= rearind ; i++)
  {
      objs[i] = characters[Math.floor(Math.random() * characters.length)];
  }
}

function printObjs()
{
      document.write(objs+ "<br>");
}

// function addObjs()
// {
  
//   objs[rearind] = characters[Math.floor(Math.random() * characters.length)];
//   rearind++;
// }

function invalidate()
{
  for(let i = 0 ; i < rearind ; i++)
  {
      objs[i] = objs[i+1];
  }
  objs[rearind] = characters[Math.floor(Math.random() * characters.length)];
}