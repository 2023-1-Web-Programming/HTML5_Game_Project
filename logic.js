    // 상수 선언부
    const OBJS_START_POS_X = 400;
    const OBJS_START_POS_Y = 500;
    const OBJS_SPACE = 30;
    const REAR_IND = 19;
    
class Logic extends Phaser.Scene{
  constructor(){
    super("Logic");
   
    this.objs = [];
    this.characters = ['A', 'B', 'C']; // Array of character types
    this.characterIndex = 0; // Current character index
    this.score = 0; // Player's score
    this.time = 30; // Initial time limit in seconds
    
    this.KeyInput;
    this.initObjs();

  }

  preload() {
  
    this.load.image('background', 'media/background/background.png');
   
  }

  create() {
    // Add background image
  
    this.add.image(400, 400, 'background');
    // characters[Math.floor(Math.random() * characters.length)]
    
    this.KeyInput = this.input.keyboard.createCursorKeys();
  
  
  }

  update() {
    this.add.image(400, 400, 'background');
    
    let sprite = this.objs[0];
    
    // characters[Math.floor(Math.random() * characters.length)]
    
    for(let i = REAR_IND ; i > -1 ; i--)
    {
        this.add.sprite(OBJS_START_POS_X, OBJS_START_POS_Y - i * OBJS_SPACE, this.objs[i]);
    }
  
  
      // 키보드 입력 1회 인식 및 갱신
      if (Phaser.Input.Keyboard.JustDown(this.KeyInput.left)) {
      if (this.isA()) this.invalidate();
      }
      else if (Phaser.Input.Keyboard.JustDown(this.KeyInput.down)) {
      
      if (this.isB())  this.invalidate();
      } 
      else if (Phaser.Input.Keyboard.JustDown(this.KeyInput.right)) {
      
      if (this.isC())  this.invalidate();
      }

  }

  initObjs() 
  {
    for(let i = 0 ; i <= REAR_IND ; i++)
    {
        this.objs[i] = this.characters[Math.floor(Math.random() * this.characters.length)];
    }
  }

  invalidate()
{
  for(let i = 0 ; i < REAR_IND ; i++)
  {
      this.objs[i] = this.objs[i+1];
  }
  this.objs[REAR_IND] = this.characters[Math.floor(Math.random() * this.characters.length)];
}

isA()
{
  if (this.objs[0] == 'A') return true;
  else return false;
}

isB()
{
  if (this.objs[0] == 'B') return true;
  else return false;
}
isC()
{
  if (this.objs[0] == 'C') return true;
  else return false;
}

}