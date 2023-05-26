//import Logic from ".Logic.js";
// 상수 선언부
const OBJS_START_POS_X = 400;
const OBJS_START_POS_Y = 500;
const OBJS_SPACE = 30;
const REAR_IND = 19;
const FEVER_TIME = 5;

var time = 15;
var score = 0;
var progressValue = 0;

var config = {
  parent: 'game-container',
  type: Phaser.CANVAS,
  width: 800,
  height: 800,
  backgroundColor: "#D1F2FF",
  scene: {
    preload: preload,
    create: create,

  }
};

// 에셋 로드
function preload() {
  this.load.image('title', 'media/background/title.png');
  this.load.image('background', 'media/background/background.png');
  this.load.image('A', 'media/characters/bear.png');
  this.load.image('B', 'media/characters/duck.png');
  this.load.image('C', 'media/characters/pig.png');
  this.load.image('pigarrow', 'media/arrow/pigarrow.png');
  this.load.image('birdarrow', 'media/arrow/birdarrow.png');
  this.load.image('beararrow', 'media/arrow/beararrow.png');
  this.load.image('progressBar', 'media/progressbar/progressBar.png');
}

function create() {

  titleimg = this.add.image(400, 400, 'title');


  desKey = this.input.keyboard.on('keydown-ENTER', descriptionPage, this);

}

function descriptionPage() {
  titleimg.destroy();
  //  this.add.image(400,400,'background');
  this.input.keyboard.off('keydown-ENTER', descriptionPage, this);



  desText = this.add.text(400, 300, '방향키로 동물을 분류하는 게임입니다.\n\n플레이어는 왼쪽, 오른쪽, 아래 방향키를 통해 \n시간 내에 최대한 많은 동물을 분류해야 합니다.\n\n누적 20번의 분류를 성공하면\n일정 시간 동안 점수를 더 주는 FEVER TIME 에 진입합니다.\n연속해서 3번 이상 틀리면 잠시 분류를 할 수 없습니다.\n\n\n왼쪽 방향키(←) : 곰\n\n오른쪽 방향키(→) : 돼지\n\n아래 방향키( ↓ ) : 오리\n\n\n게임을 시작하려면 엔터를 누르세요. ', { fontSize: '25px', fontFamily: 'Lato', fill: '#000000' }).setOrigin(0.5);

  startKey = this.input.keyboard.on('keydown-ENTER', startGame, this);

}
function startGame() {
  // 시작 문구 제거

  desText.destroy();





  this.input.keyboard.off('keydown-ENTER', startGame, this);

  // Add your game logic here


  // 게임 시작
  game.scene.add('Logic', Logic);
  game.scene.start('Logic');

}

var game = new Phaser.Game(config);


class Logic extends Phaser.Scene {
  constructor() {
    super("Logic");

    this.objs = [];
    this.characters = ['A', 'B', 'C']; // Array of character types
    this.characterIndex = 0; // Current character index
    this.KeyInput;
    this.progressBar;
    this.fever_remain_time = 0;
    this.penalty_sum = 0;
    this.realease_sum = 10;
    this.isPenalty = 0; // 0이면 페널티 아님, 1이면 페널티 받아야함

    //오브젝트 생성 및 초기화
    this.initObjs();

    // 시간 측정

    const timer = setInterval(() => {
      console.log(time);
      time--;

      if (time <= 0) {
        clearInterval(timer);
      }
    }, 1000);

  }



  create() {

    this.add.image(400, 400, 'background');

    this.KeyInput = this.input.keyboard.createCursorKeys();

    this.progressBar = this.add.image(game.config.width / 5, game.config.height / 10, 'progressBar');//크기 조정
    this.progressBar.setOrigin(0.5, 0.5);

    this.border = this.add.graphics();
    var x = 13;
    var y = this.progressBar.height / 2;
    var width = this.progressBar.width / 1.5;
    var height = this.progressBar.height / 6;
    var lineWidth = 4;
    var lineColor = 0xff0000;
    this.border.lineStyle(lineWidth, lineColor);
    this.border.strokeRect(x, y, width, height);

  }

  update() {

    this.add.image(400, 400, 'background');

    this.add.image(550, 600, 'pigarrow');
    this.add.image(250, 600, 'beararrow');
    this.add.image(400, 680, 'birdarrow');

    this.progressBar = this.add.image(game.config.width / 5, game.config.height / 10, 'progressBar');//크기 조정
    this.progressBar.setOrigin(0.5, 0.5);
    this.progressBar.setScale(progressValue, 1);

    let sprite = this.objs[0];

    for (let i = REAR_IND; i > -1; i--) {
      this.add.sprite(OBJS_START_POS_X, OBJS_START_POS_Y - i * OBJS_SPACE, this.objs[i]);
    }

    this.border = this.add.graphics();
    var x = 13;
    var y = this.progressBar.height / 2;
    var width = this.progressBar.width / 1.5;
    var height = this.progressBar.height / 6;
    var lineWidth = 4;
    var lineColor = 0xff0000;
    this.border.lineStyle(lineWidth, lineColor);
    this.border.strokeRect(x, y, width, height);

    // 키보드 입력 1회 인식 및 갱신
    if (this.isPenalty == 0)
    {
      if (Phaser.Input.Keyboard.JustDown(this.KeyInput.left)) {
        if (this.isA()) {
          this.increaseProgress(0.05);
          this.invalidate();
          this.penalty_sum = 0;
        }
        else {
          this.penalty_sum++;
        }
      }
      else if (Phaser.Input.Keyboard.JustDown(this.KeyInput.down)) {
        if (this.isB()) {
          this.increaseProgress(0.05);
          this.invalidate();
          this.penalty_sum = 0;
        }
        else {
          this.penalty_sum++;
        }
      }
      else if (Phaser.Input.Keyboard.JustDown(this.KeyInput.right)) {

        if (this.isC()) {
          this.increaseProgress(0.05);
          this.invalidate();
          this.penalty_sum = 0;
        }
        else {
          this.penalty_sum++;
        }
      }
    }


    this.add.text(30, 30, score, { font: "25px Arial", fill: "#000000" });
    this.add.text(750, 30, time, { font: "25px Arial", fill: "#000000" });

    if (time <= 0) {
      this.add.text(320, 50, "end", { font: "100px Arial", fill: "#FF0000" }); //종료 확인용(없어도 됨)
      console.log('end');
      //종료 화면 출력하는 함수 자리!!
    }

    if (this.fever_remain_time > 0) {
      this.feverText = this.add.text(400, 300, 'Fevertime!!!!', { font: '32px Arial', fill: '#ff0000' });
      this.feverText.setOrigin(0.5);
      this.feverText.visible = true;
    }

    if (this.penalty_sum >= 3) {
      this.isPenalty = 1;
      this.penaltyText = this.add.text(400, 300, 'PUSH SPACEBAR!', { font: '32px Arial', fill: '#ff0000' });
      this.add.text(390, 250, this.realease_sum, { font: '32px Arial', fill: '#ff0000' });
      this.penaltyText.setOrigin(0.5);
      this.penaltyText.visible = true;
      this.penalty();
    }
  }

  feverTime() {
    //fever time 유지 시간 동안
    //score 2배씩 증가, value값 max에서 고정
    this.fever_remain_time = FEVER_TIME;
    const feverTimer = setInterval(() => {
      console.log(this.fever_remain_time);
      this.fever_remain_time--;

      if (this.fever_remain_time <= 0) {
        this.fever_remain_time = 0;
        progressValue = 0;
        clearInterval(feverTimer);
      }
    }, 1000);
  }

  penalty() {
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[32])) {
      {
        this.realease_sum--;
      }
      if (this.realease_sum == 0) {
        this.penalty_sum = 0;
        this.realease_sum = 10;
        this.isPenalty = 0;
      }
    }
  }

  increaseProgress(value) {
    if (progressValue != 1) {
      progressValue = Phaser.Math.Clamp(progressValue + value, 0, 1);
      this.progressBar.setScale(progressValue, 1);
    }
    if (progressValue == 1)
      this.feverTime();
  }

  initObjs() {
    for (let i = 0; i <= REAR_IND; i++) {
      this.objs[i] = this.characters[Math.floor(Math.random() * this.characters.length)];
    }
  }

  invalidate() {
    for (let i = 0; i < REAR_IND; i++) {
      this.objs[i] = this.objs[i + 1];
    }
    this.objs[REAR_IND] = this.characters[Math.floor(Math.random() * this.characters.length)];
  }

  isA() {
    if (this.objs[0] == 'A') {
      score++;
      if (progressValue == 1)
        score++;
      return true;
    }
    else return false;
  }

  isB() {
    if (this.objs[0] == 'B') {
      score++;
      if (progressValue == 1)
        score++;
      return true;
    }
    else return false;
  }
  isC() {
    if (this.objs[0] == 'C') {
      score++;
      if (progressValue == 1)
        score++;
      return true;
    }
    else return false;
  }

}