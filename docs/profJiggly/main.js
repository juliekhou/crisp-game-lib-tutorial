title = "Catch Professor Jiggly";

description = `
[Click] to Turn
`;

// a = border
// b = player head
// c = item

characters = [
`
rr  rr
rrrrrr
rrrrrr
rrrrrr
  rr
  rr
`, `
RRR   
RRRRR 
RRRRR 
 R RR 
 R  R 
      
`,`
      
   Y y
   yyy
y  Yyy
Y Yyy
 yYyy
`
];

const G = {
  WIDTH: 150,
  HEIGHT: 150,
}

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  theme: "simple",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 4,
  isCapturing: true,
  isCapturingGameCanvasOnly: true,
  captureCanvasScale: 2,
};

/** @type { Color[] } */
let colors = [
	"red",
	"green",
	"yellow", 
	"blue", 
	"purple",
	"cyan", 
	"black",
	"light_red",
	"light_green",
	"light_yellow",
	"light_blue",
	"light_purple",
	"light_cyan",
	"light_black"
];


/** @type { {pos: Vector, angle: number, rotation: number} } */
let head;
let headMoveTicks;
let isHeadGettingDollar;
let isHeadTurning;
/** @type { Vector[] } */
let bodies;
/** @type { Vector[] } */
let dollars;
const angleOfs = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];
// const headChar = [">", "v", "<", "^"];

function update() {
  if (!ticks) {
    // color(colors[rndi(colors.length)]);
	  color("black");
    head = { pos: vec(8, 8), angle: 0, rotation: 1 };
    headMoveTicks = 0;
    isHeadGettingDollar = false;
    isHeadTurning = false;
    bodies = times(4, (i) => vec(4 + i, 8));
    dollars = [vec(12, 8)];
  }

  // ************************* border *************************

  // left border
  for (let y = 1; y <= 18; y++) {
    // text(edgeWallChars, 3, 9 + y * 6);
  // color(colors[rndi(colors.length)]);
  char("a", 4, 11 + y * 7);
  }

  // right border
  for (let y = 1; y <= 18; y++) {
    // text(edgeWallChars, 3, 9 + y * 6);
  // color(colors[rndi(colors.length)]);
	char("a", 146, 11 + y * 7);
  }

  // top border
  for (let y = 0; y <= 17; y++) {
    // text(edgeWallChars, 3, 9 + y * 6);
  // color(colors[rndi(colors.length)]);
	char("a", 6 + y * 8, 11);
  }

  // bottom border
  for (let y = 0; y <= 17; y++) {
    // text(edgeWallChars, 3, 9 + y * 6);
  // color(colors[rndi(colors.length)]);
	char("a", 6 + y * 8, 145);
  }

  // all
//   for (let y = 0; y <= 11; y++) {
//     // text(edgeWallChars, 3, 9 + y * 6);
// 	color(colors[rndi(colors.length)]);
// 	char("a", 4, 11 + y * 7);
// 	char("a", 96, 11 + y * 7);
// 	char("a", 6 + y * 8, 11);
// 	char("a", 6 + y * 8, 95);
//   }

  // ************************* button *************************

  if (!isHeadTurning && input.isJustPressed) {
    play("select");
    isHeadTurning = true;
  }

  headMoveTicks--;
  if (headMoveTicks < 0) {
    play("laser");
    // if (!isHeadGettingDollar) {
    //   bodies.shift();
    // } else {
    //   isHeadGettingDollar = false;
    // }
    bodies.push(vec(head.pos));
    if (isHeadTurning) {
      head.angle = wrap(head.angle + head.rotation, 0, 4);
      isHeadTurning = false;
    }
    const ao = angleOfs[head.angle];
    head.pos.add(ao[0], ao[1]);
    headMoveTicks = 20 / difficulty;
  }
//   color(colors[rndi(colors.length)]);
  bodies.forEach((b) => {
    text(".", b.x * 6 + 3, b.y * 6 + 3);
  });
//   const c = text(
//     headChar[wrap(head.angle + head.rotation, 0, 4)],
//     head.pos.x * 6 + 3,
//     head.pos.y * 6 + 3
//   ).isColliding.text;

//   char("b", head.pos.x * 6 + 3, head.pos.y * 6 + 3).isColliding.char.a;
  const c = char("b", head.pos.x * 6 + 3, head.pos.y * 6 + 3).isColliding.text;
  if (char("b", head.pos.x * 6 + 3, head.pos.y * 6 + 3).isColliding.char.a || c["."]) {
    play("explosion");
    // color("green");
    // rect(head.pos.x * 6, head.pos.y * 6, 6, 6);
    color(colors[rndi(colors.length)]);
    text("X", head.pos.x * 6 + 3, head.pos.y * 6 + 3);
    end();
  }
  

//   if (c.o || c["#"]) {
//     play("explosion");
//     color("white");
//     rect(head.pos.x * 6, head.pos.y * 6, 6, 6);
//     color(colors[rndi(colors.length)]);
//     text("X", head.pos.x * 6 + 3, head.pos.y * 6 + 3);
//     end();
//   }
  let ig = false;
  dollars = dollars.filter((d) => {
    // const c = text("$", d.x * 6 + 3, d.y * 6 + 3).isColliding.text;
	// char("b", d.x * 6 + 3, d.y * 6 + 3).isColliding.char.b;
    // if (c.v || c[">"] || c["<"] || c["^"]) {
	if(char("c", d.x * 6 + 3, d.y * 6 + 3).isColliding.char.b){
      ig = true;
      return false;
    }
    return true;
  });
  if (ig) {
    play("coin");
    addScore(1);
    isHeadGettingDollar = true;
    head.rotation *= -1;
    color("black");
	// color("cyan");
	// color(colors[rndi(colors.length)]);
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 99; j++) {
        let x = rndi(2, 14);
        let y = rndi(3, 14);
        // const c = text("$", x * 6 + 3, y * 6 + 3).isColliding.text;
		const c = char("c", x * 6 + 3, y * 6 + 3).isColliding.text;
        if (char("c", x * 6 + 3, y * 6 + 3).isColliding.char.b
		|| c["."]) {
        } else {
          dollars.push(vec(x, y));
          break;
        }
      }
    }
    // color(colors[rndi(colors.length)]);
  }
}

// http://localhost:4000/?tryThree