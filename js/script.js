var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// 캔버스 크기 설정
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 문장들 배열
var sentences = [
  "“미대생으로서 그림 실력을 더 키우고 싶어요.”",
  "“그림 그리는 것을 좋아하는 다양한 사람들을 만나고 싶어요.”",
  "“혼자서 그림 그리는 게 외로워요.”",
  "“그림을 어떻게 공부해야할지 잘 모르겠어요. 공부 방향성에 도움을 받고 싶어요.”",
  "“그림이 너무 좋아서 더 잘 하고 싶어요.”",
  "“색다른 방식으로 공부해보고 싶어요.”",
  "“아마추어도 부담없이 참여할 수 있는 스터디를 원해요.”",
  "“혼자서 그림을 그리다보면 시야가 좁아지고 매몰될 때가 있어요.”",
  "“여러 사람과 다같이 공부하면 의지가 생길 것 같아요.”",
  "“다른 사람들은 어떻게 공부하고 있는지 궁금해요.”",
  "“한 장씩 채워가는 성취감을 느끼고 싶어요.”",
  "“성실하게 공부할 수 있도록 관리를 받고 싶어요.”",
  "“매일 새로운 과제를 할당받고 싶어요.”",
  "“크로키 실력을 늘리고 싶어요.”",
  "“다른 사람들의 그림 실력에 자극을 받고 싶어요.”",
  "“색다른 아이디어가 궁금해요.”",
  "“그림 그리는 사람들의 커뮤니티를 접하고 싶어요.”",
  "“피드백을 받고 싶어요.”",
  "“다른 사람들의 공부 방향성이 궁금해요.”",
  "“확실한 취미를 하나 갖고 싶어요.”"
];

// 원들 생성
var circles = [];
var numCircles = 20;
var maxCircleSize = 300;
var minCircleSize = 250;
var circleSpacing = 100;
var rotationRange = 60; // 회전 각도 범위
var movementRange = 2.5; // 움직임 범위

for (var i = 0; i < numCircles; i++) {
  var x = Math.random() * (canvas.width - maxCircleSize);
  var y = Math.random() * (canvas.height - maxCircleSize);
  var size = Math.floor(Math.random() * (maxCircleSize - minCircleSize + 1)) + minCircleSize;
  var sentence = sentences[Math.floor(Math.random() * sentences.length)];
  var rotation = Math.random() * rotationRange - rotationRange / 2; // 랜덤 회전 각도

  var circle = {
    x: x,
    y: y,
    size: size,
    sentence: sentence,
    isDragging: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
    rotation: rotation,
    movementX: Math.random() * movementRange - movementRange / 2, // 랜덤 움직임 X
    movementY: Math.random() * movementRange - movementRange / 2  // 랜덤 움직임 Y
  };

  circles.push(circle);
}

// 캔버스 그리기
// 캔버스 그리기
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];

    // 원 그리기
    ctx.beginPath();
    ctx.fillStyle = circle.isHovered ? '#F5601B' : '#ffffff'; // hover 시 배경색 변경
    ctx.strokeStyle = '#000000'; // 검은색 테두리
    ctx.lineWidth = 1;
    ctx.translate(circle.x + circle.size / 2, circle.y + circle.size / 2);
    ctx.rotate((circle.rotation * Math.PI) / 180); // 회전 적용
    ctx.arc(0, 0, circle.size / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // 문장 표시
    ctx.font = '20px Noto Sans KR';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 문장 줄바꿈 처리
    var words = circle.sentence.split(' ');
    var lineHeight = 25;
    var line = '';
    var lines = [];

    for (var j = 0; j < words.length; j++) {
      var testLine = line + words[j] + ' ';
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;

      if (testWidth > circle.size * 0.8) {
        lines.push(line);
        line = words[j] + ' ';
      } else {
        line = testLine;
      }
    }

    lines.push(line);

    for (var k = 0; k < lines.length; k++) {
      ctx.fillText(lines[k], 0, (k - lines.length / 2 + 0.5) * lineHeight);
    }

    ctx.rotate((-circle.rotation * Math.PI) / 180); // 회전 원상복귀
    ctx.translate(-(circle.x + circle.size / 2), -(circle.y + circle.size / 2));
  }
}

// 캔버스 업데이트
function updateCanvas() {
  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];

    // 원 위치 업데이트
    circle.x += circle.movementX;
    circle.y += circle.movementY;

    // 벽과 충돌 시 반대 방향으로 움직임
    if (circle.x <= 0 || circle.x >= canvas.width - circle.size) {
      circle.movementX *= -1;
    }
    if (circle.y <= 0 || circle.y >= canvas.height - circle.size) {
      circle.movementY *= -1;
    }
  }

  drawCanvas();
}

var isDragging = false;
var selectedCircle = null;


// 마우스 이벤트 처리
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

function handleMouseDown(event) {
  var mouseX = event.clientX;
  var mouseY = event.clientY;

  // 마우스 위치와 가장 가까운 원 찾기
  for (var i = circles.length - 1; i >= 0; i--) {
    var circle = circles[i];
    var circleCenterX = circle.x + circle.size / 2;
    var circleCenterY = circle.y + circle.size / 2;

    var distance = Math.sqrt(Math.pow(mouseX - circleCenterX, 2) + Math.pow(mouseY - circleCenterY, 2));

    if (distance <= circle.size / 2) {
      isDragging = true;
      selectedCircle = circle;
      break;
    }
  }
}

// 마우스 클릭 이벤트 처리
canvas.addEventListener('click', handleMouseClick);

function handleMouseClick(event) {
  var mouseX = event.clientX;
  var mouseY = event.clientY;
  var isInsideCircle = false;

  // 마우스 위치와 이미 생성된 원들과의 충돌 체크
  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];
    var circleCenterX = circle.x + circle.size / 2;
    var circleCenterY = circle.y + circle.size / 2;

    var distance = Math.sqrt(Math.pow(mouseX - circleCenterX, 2) + Math.pow(mouseY - circleCenterY, 2));

    if (distance <= circle.size / 2) {
      isInsideCircle = true;
      break;
    }
  }

  // 이미 생성된 원 내부가 아닌 경우 새로운 원 추가
  if (!isInsideCircle) {
    var x = mouseX - minCircleSize / 2;
    var y = mouseY - minCircleSize / 2;
    var size = Math.floor(Math.random() * (maxCircleSize - minCircleSize + 1)) + minCircleSize;
    var sentence = sentences[Math.floor(Math.random() * sentences.length)];
    var rotation = Math.random() * rotationRange - rotationRange / 2; // 랜덤 회전 각도

    var newCircle = {
      x: x,
      y: y,
      size: size,
      sentence: sentence,
      isDragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      rotation: rotation,
      movementX: Math.random() * movementRange - movementRange / 2, // 랜덤 움직임 X
      movementY: Math.random() * movementRange - movementRange / 2 // 랜덤 움직임 Y
    };

    circles.push(newCircle);
  }
}

function handleMouseMove(event) {
  var mouseX = event.clientX;
  var mouseY = event.clientY;

  if (isDragging && selectedCircle) {
    selectedCircle.x = mouseX - selectedCircle.size / 2;
    selectedCircle.y = mouseY - selectedCircle.size / 2;
  } else {
    // 마우스 위치와 가장 가까운 원 찾기
    for (var i = circles.length - 1; i >= 0; i--) {
      var circle = circles[i];
      var circleCenterX = circle.x + circle.size / 2;
      var circleCenterY = circle.y + circle.size / 2;

      var distance = Math.sqrt(Math.pow(mouseX - circleCenterX, 2) + Math.pow(mouseY - circleCenterY, 2));

      if (distance <= circle.size / 2) {
        circle.isHovered = true; // hover된 원만 isHovered를 true로 설정
        break;
      } else {
        circle.isHovered = false;
      }
    }
  }
}

function handleMouseUp() {
  isDragging = false;
  selectedCircle = null;

  // 모든 원의 움직임 재개
  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];
    circle.movementX = Math.random() * movementRange - movementRange / 2;
    circle.movementY = Math.random() * movementRange - movementRange / 2;
  }
}

// 애니메이션 프레임 업데이트
function animate() {
  // 회전 각도 업데이트
  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];

    if (!circle.isHovered) {
      circle.rotation += Math.random() * 1;
    } else {
      circle.rotation = 0; // hover된 원의 회전 각도를 0으로 설정
    }
  }
  updateCanvas();
  requestAnimationFrame(animate);
}

// 애니메이션 시작
animate();
