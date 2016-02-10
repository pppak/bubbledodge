
var circleCount = 0;
var score = 0;

var playerStartingPos = new Point(80, view.center.y);
var playerLayer = new Layer();
var playerCircle = new Path.Circle(playerStartingPos, 20);
stylePlayer();

var circleLayer = new Layer();
var circleSpeeds = new Array(100);
createInitialCircles();

var scoreLayer = new Layer();
var scoreText;
styleScoreText();

var gameOverLayer = new Layer();
var finalScore;
createGameOverScreen();

var xStep = 0;
var yStep = 0;

function onFrame(event) {
    for (var i = 0; i < circleCount; i++) {
        var item = circleLayer.children[i];

        item.position.x -= circleSpeeds[i] * 5;

        if (item.bounds.right < 0) {
            var y = (Point.random() * view.size).y;
            item.position.y = y;
            item.position.x = view.size.width + 30;
            score++;
            scoreText.content = score;

            if (score % 3 == 0) {
                circleLayer.activate();
                addCircle();
            }
        }
    }

    //check keys and increase of increase player velocity
    reactToKeys();

    keepPlayerWithinView();

    movePlayer();

    if (checkCollisions()) {
        showGameOver();
    }
}

function showGameOver() {
    gameOverLayer.visible = true;
    finalScore.content = "score: " + score;
    view.pause();
}

function movePlayer() {
    playerCircle.position.x += xStep;
    playerCircle.position.y += yStep;
}

function keepPlayerWithinView() {
    if (playerCircle.position.x + xStep < 0 || playerCircle.position.x + xStep > view.size.width) {
        xStep = 0;
    }
    if (playerCircle.position.y + yStep < 0 || playerCircle.position.y + yStep > view.size.height) {
        yStep = 0;
    }
}

function reactToKeys() {
    //horizontal movement
    if (Key.isDown('d') && xStep < 50) {
        xStep++;
    }
    if (Key.isDown('a') && xStep > -50) {
        xStep--;
    }
    if (!Key.isDown('d') && xStep > 0) {
        xStep--;
    }
    if (!Key.isDown('a') && xStep < 0) {
        xStep++;
    }

    //vertical movement
    if (Key.isDown('s') && yStep < 50) {
        yStep++;
    }
    if (Key.isDown('w') && yStep > -50) {
        yStep--;
    }

    if (!Key.isDown('s') && yStep > 0) {
        yStep--;
    }
    if (!Key.isDown('w') && yStep < 0) {
        yStep++;
    }
}

function checkCollisions() {
    for (var i = 0; i < circleCount; i++) {
        if (circleLayer.children[i].intersects(playerCircle)) {
            playerCircle.strokeColor = circleLayer.children[i].fillColor;
            return true;
        }
    }
    return false;
}

function createInitialCircles() {
    circleLayer.activate();
    for (var i = 0; i < 10; i++) {
        addCircle();
    }
}

function addCircle() {
    var path = new Path.Circle({
        center: [view.size.width + 60, (Point.random() * view.size).y],
        radius: 50,
        fillColor: {
            hue: Math.random() * 360,
            saturation: 1,
            brightness: 1
        },
        blendMode: 'lighter'
    });
    circleSpeeds[circleCount] = Math.random() + 0.5;
    path.scale(Math.random() + 0.3);
    circleCount++;
}

function reset(event) {
    circleLayer.removeChildren();
    playerCircle.position = playerStartingPos;
    score = 0;
    scoreText.content = score;
    circleCount = 0;
    createInitialCircles();
    gameOverLayer.visible = false;
    view.play();
}

function stylePlayer() {
    playerCircle.strokeColor = 'blue';
    playerCircle.fillColor = 'white';
}

function styleScoreText() {
    scoreText = new PointText({
        content: score,
        point: [view.size.width - 50, 30],
        justification: 'center',
        fontSize: 20,
        fillColor: 'black'
    });
}

function createGameOverScreen() {
    var rectangle = new Path.Rectangle({
        point: [0, 0],
        size: view.size,
        fillColor: 'white'
    });
    rectangle.opacity = 0.5;
    finalScore = new PointText({
        content: 'score: ' + score,
        point: [view.center.x, view.center.y - 20],
        justification: 'center',
        fontSize: 30,
        fillColor: 'black'
    });
    var replayText = new PointText({
        content: 'click to replay',
        point: [view.center.x, view.center.y + 10],
        justification: 'center',
        fontSize: 30,
        fillColor: 'black'
    });
    gameOverLayer.onClick = reset;
    gameOverLayer.visible = false;
}