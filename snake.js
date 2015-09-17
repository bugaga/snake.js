(function() {

    function Snake(canvas, speed) {
        var canvas = document.getElementById(canvas);
        var context = canvas.getContext('2d');
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        var speed = speed;

        var CEIL_WIDTH = 20;
        var maxFoodCount = 3;

        this.isMove = false;
        var isDie = false;

        var objects = {
            barriers: (function() {
                var arr = [];
                var i;
                // up wall
                for (i = 0; i * CEIL_WIDTH < WIDTH; i++) {
                    arr.push({
                        x: i,
                        y: -1
                    });
                }
                //right wall
                for (i = 0; i * CEIL_WIDTH < HEIGHT; i++) {
                    arr.push({
                        x: WIDTH/CEIL_WIDTH,
                        y: i
                    });
                }
                // bottom wall
                for (i = 0; i * CEIL_WIDTH < WIDTH; i++) {
                    arr.push({
                        x: i,
                        y: HEIGHT/CEIL_WIDTH
                    });
                }
                // left wall
                for (i = 0; i * CEIL_WIDTH < HEIGHT; i++) {
                    arr.push({
                        x: -1,
                        y: i
                    });
                }

                return arr;
            })(),

            food : (function() {
                var arr = [];
                for (var i = 0; i < maxFoodCount; i++) {
                    arr.push({
                        x: Math.round( Math.random()*(WIDTH/CEIL_WIDTH - 1) ),
                        y: Math.round( Math.random()*(HEIGHT/CEIL_WIDTH - 1) )
                    })    ;
                }
                return arr;
            })()

        };


        var head = {
            direction: "right",
            x: Math.round(WIDTH/(2*CEIL_WIDTH)),
            y: Math.round(HEIGHT/(2*CEIL_WIDTH))
        };

        var body = (function(x, y) {
            var arr = [];
            for (var i = 1; i < 4; i++) arr.push({
                direction: "right",
                x: x - i,
                y: y
            });
            return arr;
        })(head.x, head.y);

        function checkForObjects(objcts) {
            for (var i = 0; i < objcts.length; i++) {
                if (objcts[i].x === head.x && objcts[i].y === head.y) return objcts[i];
            }
        }

        var moveSnake = function() {
            var intermediateDirection, direction = head.direction, body = body, food;

            if (isDie) return false;

            if (objects.food.length < maxFoodCount) addFood();

            updateCanvas();

            if (!this.isMove) return false;

            makeStep(head);

            for (var i = 0; i < body.length; i++) {
                intermediateDirection = body[i].direction;
                makeStep(body[i]);
                body[i].direction = direction;
                direction = intermediateDirection;
            }

            if (checkForObjects(objects.barriers) || checkForObjects(body)) {
                isDie = true;
                alert("Game over");
            } else {
                updateCanvas();
            }

            if (food = checkForObjects(objects.food)) {
                takeFood();
                deleteFood(food);
            }

            function makeStep(obj) {
                switch (obj.direction) {
                    case "right": obj.x += 1;
                        break;
                    case "down": obj.y += 1;
                        break;
                    case "left": obj.x -= 1;
                        break;
                    case "up": obj.y -= 1;
                }
            }

        };

        var checkNewDirection = function(newDirection) {
            if (body[0].direction === "right" && newDirection === "left") return false;
            if (body[0].direction === "left" && newDirection === "right") return false;
            if (body[0].direction === "up" && newDirection === "down") return false;
            if (body[0].direction === "down" && newDirection === "up") return false;
            return true;
        };

        this.changeDirection = function(newDirection) {
            if (!checkNewDirection(newDirection)) return false;

            head.direction = newDirection;
        };

        this.reset = function() {
            head = {
                direction: "right",
                x: Math.round(WIDTH/(2*CEIL_WIDTH)) - 3,
                y: Math.round(HEIGHT/(2*CEIL_WIDTH)) - 3
            };

            body = (function(x, y) {
                var arr = [];
                for (var i = 1; i < 4; i++) arr.push({
                    direction: "right",
                    x: x - i,
                    y: y
                });
                return arr;
            })(head.x, head.y);

            this.isMove = false;
            isDie = false;
            updateCanvas();
        };

        function updateCanvas() {
            drawField();
            drawSnake();
            drawFood();
        }

        function drawSnake() {
            var body = body;

            // draw head
            context.beginPath();
            context.rect(head.x * CEIL_WIDTH, head.y * CEIL_WIDTH, CEIL_WIDTH, CEIL_WIDTH);
            context.fillStyle = "blue";
            context.fill();
            context.stroke();

            // draw body
            context.beginPath();
            for (var i = 0; i < body.length; i++) {
                context.rect(body[i].x * CEIL_WIDTH, body[i].y * CEIL_WIDTH, CEIL_WIDTH, CEIL_WIDTH);
                context.fillStyle = "red";
                context.fill();
            }
            context.stroke();
        }

        function drawField() {
            context.clearRect(0, 0, WIDTH, HEIGHT);

            context.beginPath();
            context.moveTo(0,0);
            context.lineTo(WIDTH, 0);
            context.lineTo(WIDTH, HEIGHT);
            context.lineTo(0, HEIGHT);

            context.lineTo(0, 0);
            for (var i = 1; CEIL_WIDTH * i < WIDTH; i++) {
                context.moveTo( CEIL_WIDTH * i, 0 );
                context.lineTo( CEIL_WIDTH * i, HEIGHT );
            }

            for (var j = 1; CEIL_WIDTH * j < HEIGHT; j++) {
                context.moveTo( 0, CEIL_WIDTH * j );
                context.lineTo( WIDTH, CEIL_WIDTH * j );
            }

            context.lineWidth = 1;
            context.strokeStyle = '#aaa';
            context.stroke();
        }

        function takeFood() {
            var lastBodyCeil = body[body.length - 1],
                newBodyCeil = {direction: lastBodyCeil.direction};

            switch (lastBodyCeil.direction) {
                case "up" :
                    newBodyCeil.x = lastBodyCeil.x;
                    newBodyCeil.y = lastBodyCeil.y + 1;
                    break;
                case "down" :
                    newBodyCeil.x = lastBodyCeil.x;
                    newBodyCeil.y = lastBodyCeil.y - 1;
                    break;
                case "right" :
                    newBodyCeil.x = lastBodyCeil.x - 1;
                    newBodyCeil.y = lastBodyCeil.y;
                    break;
                case "left" :
                    newBodyCeil.x = lastBodyCeil.x + 1;
                    newBodyCeil.y = lastBodyCeil.y;
                    break;
            }

            body.push(newBodyCeil);
        }

        function deleteFood(food) {
            var newFoodArr = [];

            for (var i = 0; i < objects.food.length; i++) {
                if (objects.food[i].x === food.x && objects.food[i].y === food.y) continue;
                newFoodArr.push(objects.food[i]);
            }

            objects.food = newFoodArr;
        }

        function addFood() {
            objects.food.push({
                x: Math.round( Math.random()*(WIDTH/CEIL_WIDTH - 1) ),
                y: Math.round( Math.random()*(HEIGHT/CEIL_WIDTH - 1) )
            });
        }

        function drawFood() {
            var food = objects.food;

            context.beginPath();

            for (var i = 0; i < food.length; i++) {
                context.rect(food[i].x * CEIL_WIDTH, food[i].y * CEIL_WIDTH, CEIL_WIDTH, CEIL_WIDTH);
                context.fillStyle = "green";
                context.fill();
            }

            context.stroke();
        }

        setTimeout(moveSnake, speed);
    }


    window.Snake = Snake;
}());
