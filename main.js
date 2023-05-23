//import Logic from ".Logic.js";
      // 상수 선언부
      const OBJS_START_POS_X = 400;
      const OBJS_START_POS_Y = 500;
      const OBJS_SPACE = 30;
      const REAR_IND = 19;

var time = 30;
var score = 0;
var progressValue = 0;

var config = {
    parent: 'game-container',
    type: Phaser.CANVAS,
    width: 800,
    height: 800,
    scene: {
        preload: preload,
        create : create,
        
      }
  };

  // 에셋 로드
function preload() {
  
    this.load.image('background', 'media/background/background.png');
    this.load.image('A', 'media/characters/bear.png');
    this.load.image('B', 'media/characters/duck.png');
    this.load.image('C', 'media/characters/pig.png');
    this.load.image('pigarrow', 'media/arrow/pigarrow.png');
    this.load.image('birdarrow', 'media/arrow/birdarrow.png');
    this.load.image('beararrow', 'media/arrow/beararrow.png');
    this.load.image('progressBar', 'media/progressbar/progressBar.png');
  }

  function create(){

    this.add.image(400, 400, 'background');
  
    startText = this.add.text(400, 400, 'Press Enter to start', { fontSize: '32px', fill: '#000000' }).setOrigin(0.5);
 
    startKey = this.input.keyboard.on('keydown-ENTER', startGame, this);

  }

  function startGame() {
    // 시작 문구 제거
   startText.destroy();
    this.input.keyboard.off('keydown-ENTER', startGame, this);
    
    // Add your game logic here
    

    // 게임 시작
    game.scene.add('Logic',Logic);
    game.scene.start('Logic');

  }

  var game = new Phaser.Game(config);
  

  class Logic extends Phaser.Scene{  
    constructor(){
      super("Logic");
     
      this.objs = [];
      this.characters = ['A', 'B', 'C']; // Array of character types
      this.characterIndex = 0; // Current character index
      this.KeyInput;
      this.progressBar;
      

      //오브젝트 생성 및 초기화
      this.initObjs();
   
     // 시간 측정
    
     this.interval = setInterval( setInterval(function() {
        time--;
          if (time === 0) {
          clearInterval(interval);
        }
      }, 1000));
  
    }
    
  
  
    create() {
      
      this.add.image(400, 400, 'background');
      
      this.KeyInput = this.input.keyboard.createCursorKeys();
    
      this.progressBar = this.add.image(game.config.width / 5, game.config.height / 10, 'progressBar');//크기 조정
      this.progressBar.setOrigin(0.5, 0.5);
    }

    update() {
        console.log("update 호출");
      this.add.image(400, 400, 'background');
    
      this.add.image(550, 600, 'pigarrow');
      this.add.image(250, 600, 'beararrow');
      this.add.image(400, 680, 'birdarrow');

      this.progressBar = this.add.image(game.config.width / 5, game.config.height / 10, 'progressBar');//크기 조정
      this.progressBar.setOrigin(0.5, 0.5);
      this.progressBar.setScale(progressValue, 1); 
      
      let sprite = this.objs[0];
      
      for(let i = REAR_IND ; i > -1 ; i--)
      {
          this.add.sprite(OBJS_START_POS_X, OBJS_START_POS_Y - i * OBJS_SPACE, this.objs[i]);
      }
    
    
        // 키보드 입력 1회 인식 및 갱신
      if (Phaser.Input.Keyboard.JustDown(this.KeyInput.left)) {
        if (this.isA()) {
          this.increaseProgress(0.1);
          this.invalidate();
        }
      }
      else if (Phaser.Input.Keyboard.JustDown(this.KeyInput.down)) {
        if (this.isB()) {
            this.increaseProgress(0.1);
            this.invalidate();
          }
        } 
        else if (Phaser.Input.Keyboard.JustDown(this.KeyInput.right)) {
        
          if (this.isC()) {
            this.increaseProgress(0.1);
            this.invalidate();
          }
        }
  
       
        this.add.text(30, 30, score, { font: "25px Arial", fill: "#000000" });
        this.add.text(750, 30, time, { font: "25px Arial", fill: "#000000" });

        if(this.time == 0) {
          this.add.text(320, 50, "end", { font: "100px Arial", fill: "#FF0000" }); //종료 확인용(없어도 됨)
          //종료 화면 출력하는 함수 자리!!
        }
    }

    feverTime() 
    {
      // //fever time 유지 시간 동안
      // while (fever_remain_time > 0) 
      // {
      //   if (Phaser.Input.Keyboard.JustDown())//어떤 키를 누르든
      //   {
      //     invalidate();// 패스가 된다.
      //   }
      // }
      progressValue = 0;
    } 
    increaseProgress(value) 
    {
      progressValue = Phaser.Math.Clamp(progressValue + value, 0, 1);
      this.progressBar.setScale(progressValue, 1);
      if (progressValue == 1)
        this.feverTime();
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
            if (this.objs[0] == 'A')   
            {
                score++;
                return true;
            }
            else return false;
        }
    
    isB()
        {
            if (this.objs[0] == 'B')   
            {
                score++;
                return true;
            }
            else return false;
        }
    isC()
        {
            if (this.objs[0] == 'C') 
            {
                score++;
                return true;
            }
            else return false;
        }
  
  }