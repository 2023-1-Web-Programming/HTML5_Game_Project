
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
  var isKeyPressed = false;


  // Define game variables
  var characters = ['A', 'B', 'C']; // Array of character types
  var characterIndex = 0; // Current character index
  var score = 0; // Player's score
  var time = 30; // Initial time limit in seconds
  var rearind = 19;
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
    
    for(let i = rearind ; i > -1 ; i--)
    {
        this.add.sprite(400, 500 - i * 30, objs[i]);
    }

//수정해야 할 사항
// 키보드 떼기 전까지 갱신 X 
// 키보드 입력과 이미지 파일이 맞는지 확인 

// 'A' bear.png -> 왼쪽 방향키
// 'B' duck.png -> 아래 방향키
// 'C' pig.png -> 오른쪽 방향키

  
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
    for(let i = 0 ; i < rearind +1 ; i++)
    {
        objs[i] = characters[Math.floor(Math.random() * characters.length)];
    }
  }

  function invalidate()
  {
    for(let i = 0 ; i < rearind ; i++)
    {
        objs[i] = objs[i+1];
    }
    objs[rearind] = characters[Math.floor(Math.random() * characters.length)];
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
  