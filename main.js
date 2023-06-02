// 상수 선언부
const OBJS_START_POS_X = 400;
const OBJS_START_POS_Y = 500;
const OBJS_SPACE = 30;
const REAR_IND = 19;
const FEVER_TIME = 5;

// 전역 변수 선언부
var time = 30;
var score = 0;
var combo = 0;
var grade = ' ';
var progressValue = 0;
var finished = false;
var musicAD;
var feverAD;
var finishAD;

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
  this.load.audio('main', 'media/sound/main_music.mp3');
  this.load.audio('fever', 'media/sound/fever.mp3');
  this.load.audio('finish', 'media/sound/fininsh_music.mp3');
}

// 타이틀 화면 생성
function create() {
  titleimg = this.add.image(400, 400, 'title');
  musicAD = this.sound.add('main');
  musicAD.play(); // 배경음악 재생

  // 키 리스너 등록
  desKey = this.input.keyboard.on('keydown-ENTER', descriptionPage, this);
}


// 설명 화면 생성
function descriptionPage() {
  titleimg.destroy();  // 타이틀 화면 제거

  this.input.keyboard.off('keydown-ENTER', descriptionPage, this);
  // 설명 출력
  desText = this.add.text(400, 350, '방향키로 동물을 분류하는 게임입니다.\n\n플레이어는 왼쪽, 오른쪽, 아래 방향키를 통해 \n시간 내에 최대한 많은 동물을 분류해야 합니다.\n\n누적 20번의 분류를 성공하면\n일정 시간 동안 점수를 두 배로 주는 FEVER TIME 에 진입합니다.\nFever Time 에 진입하면 SPACEBAR 를 연타해서\n점수를 많이 획득할 수 있습니다.\n연속해서 3번 이상 틀리면 잠시 분류를 할 수 없습니다.\n\n\n왼쪽 방향키( ← ) : 곰\n\n오른쪽 방향키( → ) : 돼지\n\n아래 방향키( ↓ ) : 오리\n\n\n게임을 시작하려면 엔터 키를 누르세요. ', { fontSize: '25px', fontFamily: 'Lato', fill: '#000000' }).setOrigin(0.5);

  startKey = this.input.keyboard.on('keydown-ENTER', startGame, this);

}
function startGame() {
  // 시작 문구 제거

  desText.destroy();

  // 키보드 입력 리스너 제거
  this.input.keyboard.off('keydown-ENTER', startGame, this);

  // 게임 씬 추가
  game.scene.add('Logic', Logic);
  game.scene.add('Finish', Finish);

  // 인게임 화면 시작
  game.scene.start('Logic'); 

}

// 게임 화면 종료 및 종료 화면 시작
function finishedScreen(){
  game.scene.stop('Logic');
  game.scene.start('Finish');
}

//게임 객체 생성
var game = new Phaser.Game(config);


//종료 화면
class Finish extends Phaser.Scene{
  constructor(){
    super("Finish");

  }
  create(){
    musicAD.pause(); //배경음악 중단
    finishAD = this.sound.add('finish');
    finishAD.play(); // 종료음악 재생

    this.Score();
    this.finMsg =  this.add.text(400, 250, "!!! 게임 종료 !!!", {fontSize: '40px', fontFamily: 'Lato', fill: '#000000' }).setOrigin(0.5);
    this.scoreText = this.add.text(400, 350, "점수 : "+ score + " 점\n", { fontSize: '40px', fontFamily: 'Lato', fill: '#000000' }).setOrigin(0.5);
    this.gradeText = this.add.text(400, 400, "등급 : "+ grade , { fontSize: '40px', fontFamily: 'Lato', fill: '#000000' }).setOrigin(0.5);    
    this.prod = this.add.text(400, 600, "  -만든 사람들-\n18011688 차태관\n22011612 조준협\n18011591 김준엽", { fontSize: '20px', fontFamily: 'Lato', fill: '#000000' }).setOrigin(0.5);

  }

  update(){
    
  
  }

  // 등급 판별
  Score(){
    if(score >= 130)
      grade = 'A';  
    else if(score < 130 && score >= 100)
      grade = 'B';
    else if(score < 100 && score >= 70)
      grade = 'C';
    else if (score < 70 && score >= 40)
      grade = 'D';
    else if (score < 40)
      grade = 'F';
  }
}

// 인게임 알고리즘 클래스
class Logic extends Phaser.Scene {
  constructor() {
    super("Logic");

    this.objs = [];
    this.characters = ['A', 'B', 'C']; 
    this.characterIndex = 0; 
    this.KeyInput;
    this.progressBar;
    this.fever_remain_time = 0;
    this.penalty_sum = 0;
    this.realease_sum = 10;
    this.isPenalty = 0; // 0이면 페널티 아님, 1이면 페널티 받아야함

    // 오브젝트 생성 및 초기화
    this.initObjs();

    // 시간 측정

    const timer = setInterval(() => {
      console.log(time);
      time--;

      if (time <= 0) {
        progressValue = 0;
        this.fever_remain_time = 0;
        clearInterval(feverTimer);
        clearInterval(timer);
      }
    }, 1000);

  }



  create() {

    this.add.image(400, 400, 'background');

    this.KeyInput = this.input.keyboard.createCursorKeys();

    this.progressBar = this.add.image(game.config.width / 5, game.config.height / 10, 'progressBar');//크기 조정
    this.progressBar.setOrigin(0.5, 0.5);

    // 피버타임 바 그리기
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

    // 오브젝트 배치
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
    if (this.isPenalty == 0 && this.fever_remain_time <= 0)
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

    // 점수, 시간 출력
    this.add.text(30, 30, "Score : " + score, { font: "25px lato", fill: "#000000" });
    this.add.text(670, 30, "Time :  " + time, { font: "25px lato", fill: "#000000" });
    
    // 콤보 출력
    if(combo < 5) {
      this.add.text(590, 100, combo + " Combo", { font: "20px lato", fill: "#000000" });
    }
    else if(combo >= 5 && combo < 10) {
      this.add.text(590, 100, combo + " Combo", { font: "22px lato", fill: "#1E90FF" });
    }
    else if(combo >= 10 && combo < 20) {
      this.add.text(590, 100, combo + " Combo", { font: "24px lato", fill: "#8A2BE2" });
    }
    else if(combo >= 20 && combo < 30) {
      this.add.text(590, 100, combo + " Combo", { font: "26px lato", fill: "#FF69B4" });
    }
    else if(combo >= 30 && combo < 40) {
      this.add.text(590, 100, combo + " Combo", { font: "28px lato", fill: "#FFA500" });
    }
    else if(combo >= 40 && combo < 50) {
      this.add.text(590, 100, combo + " Combo", { font: "30px lato", fill: "#FF4500" });
    }
    else {
      this.add.text(590, 100, combo + " Combo", { font: "32px lato", fill: "#FFFF33" });
    }


    if (time <= 0) {
      
      // 종료 불리언 변수 갱신
      finished = true;

      // 종료 화면 출력
      finishedScreen();
    }

    // 피버 타임 동안 text 출력 및 스페이스 바 입력 받기
    if (this.fever_remain_time > 0) {
      this.feverText = this.add.text(400, 280, 'Fevertime!!!!', { font: '40px Lato', fill: '#ff0000' });
      this.add.text(200, 300, '!!!PUSH SPACEBAR!!!', { font: '40px lato', fill: '#ff0000' });
      this.feverText.setOrigin(0.5);
      if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.keys[32])) 
      {
        score++;
        combo++;
        this.invalidate();
      }
    }

    // 틀린 방향키를 3번 이상 입력했을 때
    if (this.penalty_sum >= 3) {
      this.isPenalty = 1;
      this.penaltyText = this.add.text(400, 300, '!!!PUSH SPACEBAR!!!', { font: '40px lato', fill: '#ff0000' });
      this.add.text(390, 250, this.realease_sum, { font: '40px Arial', fill: '#ff0000' });
      this.penaltyText.setOrigin(0.5);
      this.penaltyText.visible = true;
      this.penalty();
    }
  }

  // 피버타임 함수
  feverTime() {
    // fever time 유지 시간 동안
    // value값 max에서 고정
    musicAD.pause(); // 배경음악 중지
    feverAD = this.sound.add('fever');
    feverAD.play(); // 피버타임음악 실행
    this.fever_remain_time = FEVER_TIME;
    const feverTimer = setInterval(() => {
      console.log(this.fever_remain_time);
      this.fever_remain_time--;

      if (this.fever_remain_time <= 0) {
        this.fever_remain_time = 0;
        progressValue = 0;
        clearInterval(feverTimer);
        musicAD.resume(); // 배경음악 다시 재생
      }
    }, 1000);
  }

  
  // 페널티로 스파이스바를 10번 연타하게 
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

  // 옳은 키가 입력되면 progressBar가 증가하도록
  increaseProgress(value) {
    if (progressValue != 1) {
      progressValue = Phaser.Math.Clamp(progressValue + value, 0, 1);
      this.progressBar.setScale(progressValue, 1);
    }
    if (progressValue == 1)
      this.feverTime();
  }

  // 초기 오브젝트 추가
  initObjs() {
    for (let i = 0; i <= REAR_IND; i++) {
      this.objs[i] = this.characters[Math.floor(Math.random() * this.characters.length)];
    }
  }

  // 오브젝트 갱신
  invalidate() {
    for (let i = 0; i < REAR_IND; i++) {
      this.objs[i] = this.objs[i + 1];
    }

    // 오브젝트들은 맞는 방향키를 입력되었을 때 한칸씩 앞으로 밀려오며 마지막 인덱스의 오브젝트는 랜덤 함수를 이용해 세 오브젝트 중 하나가 선택되어 추가됌.
    this.objs[REAR_IND] = this.characters[Math.floor(Math.random() * this.characters.length)];
  }


  // 해당하는 키보드를 알맞게 입력 했을 때 점수 및 콤보 반영

  //A(곰) 객체일 때
  isA() {
    if (this.objs[0] == 'A') {
      score++;
      combo++;
      if (progressValue == 1) {
        score++;
        combo++;
      }
      return true;
    }
    else{
      combo = 0;
      return false;
    }
  }

  //B(오리) 객체일 때
  isB() {
    if (this.objs[0] == 'B') {
      score++;
      combo++;
      if (progressValue == 1) {
        score++;
        combo++;
      }
      return true;
    }
    else{
      combo = 0;
      return false;
    }
  }

  //C(돼지) 객체일 때
  isC() {
    if (this.objs[0] == 'C') {
      score++;
      combo++;
      if (progressValue == 1) {
        score++;
        combo++;
      }
      return true;
    }
    else{
      combo = 0;
      return false;
    }
  }

}
