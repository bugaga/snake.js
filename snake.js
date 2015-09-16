(function() {

    function Snake() {
        var canvas = document.getElementById("snake");
        var context = canvas.getContext('2d');
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;

        var CEIL_WIDTH = 20;
        var maxFoodCount = 3;

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
                // down wall
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

        function checkForObjects(objcts, head) {
            for (var i = 0; i < objcts.length; i++) {
                if (objcts[i].x === head.x && objcts[i].y === head.y) return objcts[i];
            }
        }

        this.stopMove = true;
        this.die = false;

        this.head = {
            direction: "right",
            x: Math.round(WIDTH/(2*CEIL_WIDTH)),
            y: Math.round(HEIGHT/(2*CEIL_WIDTH))
        };

        this.body = (function(x, y) {
            var arr = [];
            for (var i = 1; i < 4; i++) arr.push({
                direction: "right",
                x: x - i,
                y: y
            });
            return arr;
        })(this.head.x, this.head.y);

        this.moveSnake = function() {
            var intermediateDirection, direction = this.head.direction, body = this.body, food;

            if (this.die) return false;

            if (objects.food.length < maxFoodCount) addFood();

            update(this);

            if (this.stopMove) return false;

            makeStep(this.head);

            for (var i = 0; i < body.length; i++) {
                intermediateDirection = body[i].direction;
                makeStep(body[i]);
                body[i].direction = direction;
                direction = intermediateDirection;
            }

            if (checkForObjects(objects.barriers, this.head) || checkForObjects(this.body, this.head)) {
                this.die = true;
                alert("Game over");
            } else {
                update(this);
            }

            if (food = checkForObjects(objects.food, this.head)) {
                takeFood(this);
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

        this.checkNewDirection = function(newDirection) {
            if (this.body[0].direction === "right" && newDirection === "left") return false;
            if (this.body[0].direction === "left" && newDirection === "right") return false;
            if (this.body[0].direction === "up" && newDirection === "down") return false;
            if (this.body[0].direction === "down" && newDirection === "up") return false;
            return true;
        };

        this.changeDirection = function(newDirection) {
            if (!this.checkNewDirection(newDirection)) return false;

            this.head.direction = newDirection;
        };

        this.reset = function() {
            this.head = {
                direction: "right",
                x: Math.round(WIDTH/(2*CEIL_WIDTH)) - 3,
                y: Math.round(HEIGHT/(2*CEIL_WIDTH)) - 3
            };

            this.body = (function(x, y) {
                var arr = [];
                for (var i = 1; i < 4; i++) arr.push({
                    direction: "right",
                    x: x - i,
                    y: y
                });
                return arr;
            })(this.head.x, this.head.y);

            this.stopMove = true;
            this.die = false;
            update(this);
        };

        function update(snake) {
            drawField();
            drawSnake(snake);
            drawFood();
        }

        function drawSnake(snake) {
            var body = snake.body;

            // draw head
            context.beginPath();
            context.rect(snake.head.x * CEIL_WIDTH, snake.head.y * CEIL_WIDTH, CEIL_WIDTH, CEIL_WIDTH);
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

        function takeFood(snake) {
            var lastBodyCeil = snake.body[snake.body.length - 1],
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

            snake.body.push(newBodyCeil);
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
    }

    window.Snake = Snake;
}());
