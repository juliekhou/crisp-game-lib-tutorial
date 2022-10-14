title = "Zoomies";

description = `

`;

characters = [
	`
P BB P
PPBBPP
P BB P
	`
];


const G = {
	WIDTH: 300,
	HEIGHT: 300,
};

options = {
	viewSize: {x:G.WIDTH, y: G.HEIGHT},
	theme: "simple",
	seed: 34,
	isShowingScore: false,
	isPlayingBgm: true,
	isReplayEnabled: true,
	isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 2
};


let sec;
let num;

let start;
let dir;
let play;
let timer;
let redRin;
let greenWin;

function update() {
	if (!ticks) {
		sec = 0;
		timer = 0;

		gameDir = [];
		gameDir[0] = "player 1 is Green";
		gameDir[1] = "player 2 is Pink";
		gameDir[2] = "if your color is shown: click the button";
		gameDir[3] = "the other player must stop you";
		gameDir[4] = "-- any way they can";
		gameDir[5] = "-- till the timer reaches zero";
		gameDir[6] = "the victor gets a candy!!!!";

		start = false;
		dir = false;
		play = false;
		// play = true;
		redWin = false;
		greenWin = false;

		num = rndi(3);
	}
	
	if (start == false){
		sec++;

		color("light_green");
		rect(150, 150, -300, -150);
		rect(150, 150, 300, -150);

		color("light_red");
		rect(150, 150, 300, 150);
		rect(150, 150, -300, 150);

		color("white");
		text(gameDir[0], 100, 80);
		text(gameDir[1], 105, 230);

		if (sec == 150){
			start = true;
			dir = true;
			sec = 0;
		}
		// if (dir == false && input.isPressed == true){
		// 	start = true;
		// 	dir = true;
		// }
	}

	if (dir == true && start == true){
		// color("purple");
		// rect(300, 300, -300, -300);
		sec ++;

		color("black");
		text(gameDir[2], 30, 70);

		color("light_black");
		text(gameDir[3], 60, 100);
		text(gameDir[4], 90, 130);
		text(gameDir[5], 90, 160);

		color("light_purple");
		text(gameDir[6], 70, 220);

		if (sec < 300){
			color("red");
			text("ready?", 190, 270);
		} else {
			color("green");
			text("here we go!", 170, 270);
		}
		// text("ready?", 190, 270);

		if (sec == 400){
			dir = false;
			play = true;
			sec = 0;
		}
	}

	text(sec.toString(), 3, 10);
	text(num.toString(), 3, 40);
	
	if (num == 0 && play == true){
		if (redWin == false && greenWin == false){
			sec++;
			color("light_red");
			rect(300, 300, -300, -300);
			if (sec%60 == 0){
				timer++;
			}
			color("white");
			text(timer.toString(), 150, 150);
		}

		if(input.isPressed){
			redWin = true;
			play = false;
			play("powerUp");
			sec = 0;
		}

		if (timer > 5 && redWin == false){
			greenWin = true;
			play = false;
			play("lucky");
			sec = 0;
		}

	} else if (num != 0 && play == true){
		if (redWin == false && greenWin == false){
			sec++;
			color("light_green");
			rect(300, 300, -300, -300);
			if (sec%60 == 0){
				timer++;
			}
			color("white");
			text(timer.toString(), 150, 150);

		}

		if(input.isPressed){
			greenWin = true;
			play = false;
			play("powerUp");
			sec = 0;
		}

		if (timer > 5 && greenWin == false){
			redWin = true;
			play = false;
			play("lucky");
			sec = 0;
		}
	}
	if (redWin == true){
		sec ++;
		color("light_red");
		rect(300, 300, -300, -300);
		color("white");
		text("player 2 wins!!!", 110, 120);
		color("black");
		char("a", 150, 180);
		if (sec == 200){
			end();
		}
	}

	if (greenWin == true){
		sec++;
		color("light_green");
		rect(300, 300, -300, -300);

		color("white");
		text("player 1 wins!!!", 110, 120);
		color("black");
		char("a", 150, 180);
		if (sec == 200){
			end();
		}
	}
}
