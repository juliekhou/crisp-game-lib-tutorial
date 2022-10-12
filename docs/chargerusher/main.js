title = "CHARGE RUSH";

description = `
Destroy enemies.
`;

// Define pixel arts of characters.
// Each letter represents a pixel color.
// (l: black, r: red, g: green, b: blue
//  y: yellow, p: purple, c: cyan
//  L: light_black, R: light_red, G: light_green, B: light_blue
//  Y: light_yellow, P: light_purple, C: light_cyan)
// Characters are assigned from 'a'.
// 'char("a", 0, 0);' draws the character
// defined by the first element of the array.

characters = [
 `
 RRRRR
 RRGGG
 RRGGG
 RRRRR
 RR  R
 RR  R
 `,
 `
 rr  rr
 rrrrrr
 rrpprr
 rrrrrr
   rr
   rr
 `,
 `
 y  y
 yyyyyy
  y  y
 yyyyyy
  y  y
`
];

const G = {
	WIDTH: 100,
	HEIGHT: 150,

	STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.5,

	PLAYER_FIRE_RATE: 4,
    PLAYER_GUN_OFFSET: 3,

    FBULLET_SPEED: 5,

	ENEMY_MIN_BASE_SPEED: 1.0,
    ENEMY_MAX_BASE_SPEED: 2.0,
	ENEMY_FIRE_RATE: 45,

    EBULLET_SPEED: 2.0,
    EBULLET_ROTATION_SPD: 0.1
};

//   theme?: "simple" | "pixel" | "shape" | "shapeDark" | "crt" | "dark";
//    // Select the appearance theme.

options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
	seed: 2,
	isPlayingBgm: true,
	isReplayEnabled: true,
	theme: "dark",
	isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 2
};

// press c keyboard while running game will record last 5 secs
// of footage, be inserted into the html page the game
// is on

/**
* @typedef {{
* pos: Vector,
* speed: number
* }} Star
*/

/**
* @type  { Star [] }
*/
let stars;

/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number,
 * isFiringLeft: boolean
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * }} FBullet
 */

/**
 * @type { FBullet [] }
 */
let fBullets;


// New property: firingCooldown
/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number
 * }} Enemy
 */

// New type
/**
 * @typedef {{
 * pos: Vector,
 * angle: number,
 * rotation: number
 * }} EBullet
 */

/**
 * @type { EBullet [] }
 */
let eBullets;

/**
 * @type { Enemy [] }
 */
let enemies;

/**
 * @type { number }
 */
let currentEnemySpeed;

/**
 * @type { number }
 */
let waveCount;

// The game loop function
function update() {
    // The init function running at startup
	// Plays a sound effect.
	// play(type: "coin" | "laser" | "explosion" | "powerUp" |
	// "hit" | "jump" | "select" | "lucky");
	// play("coin");
	if (!ticks) {
        // A CrispGameLib function
        // First argument (number): number of times to run the second argument
        // Second argument (function): a function that returns an object. This
        // object is then added to an array. This array will eventually be
        // returned as output of the times() function.
		
		
		stars = times(20, () => {
            // Random number generator function
            // rnd( min, max )
            const posX = rnd(0, G.WIDTH);
            const posY = rnd(0, G.HEIGHT);
            // An object of type Star with appropriate properties
			return {
				// Creates a Vector
				pos: vec(posX, posY),
				// More RNG
				speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
			};
		});

		player = {
			pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
			firingCooldown: G.PLAYER_FIRE_RATE,
            isFiringLeft: true
		};
		fBullets = [];

		// Initalise the values:
		enemies = [];
		eBullets = [];

		waveCount = 0;
		currentEnemySpeed = 0;
	}

	if (enemies.length === 0) {
        currentEnemySpeed =
            rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
        for (let i = 0; i < 9; i++) {
            const posX = rnd(0, G.WIDTH);
            const posY = -rnd(i * G.HEIGHT * 0.1);
            enemies.push({ pos: vec(posX, posY), firingCooldown: G.ENEMY_FIRE_RATE})
        }

		waveCount ++;
    }

	// Update for Star
	stars.forEach((s) => {
		// Move the star downwards
		s.pos.y += s.speed;
		// Bring the star back to top once it's past the bottom of the screen
		s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

		// Choose a color to draw
		color("light_red");
		// Draw the star as a square of size 1
		box(s.pos, 1);
	});
	
	player.pos = vec(input.pos.x, input.pos.y);
	player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);

	// Cooling down for the next shot
    player.firingCooldown--;
    // Time to fire the next shot
    if (player.firingCooldown <= 0) {
        // Get the side from which the bullet is fired
        const offset = (player.isFiringLeft)
            ? -G.PLAYER_GUN_OFFSET
            : G.PLAYER_GUN_OFFSET;
        // Create the bullet
        fBullets.push({
            pos: vec(player.pos.x + offset, player.pos.y)
        });
        // Reset the firing cooldown
        player.firingCooldown = G.PLAYER_FIRE_RATE;
        // Switch the side of the firing gun by flipping the boolean value
        player.isFiringLeft = !player.isFiringLeft;

		color("light_green");
        // Generate particles
        particle(
            player.pos.x + offset, // x coordinate
            player.pos.y, // y coordinate
            4, // The number of particles
            1, // The speed of the particles
            -PI/2, // The emitting angle
            PI/4  // The emitting width
        );
    }
	// by setting the drawing color to black, the engine
	// will draw the sprite with the original colors
    color ("black");
    char("a", player.pos);

    // Updating and drawing bullets
    fBullets.forEach((fb) => {
        // Move the bullets upwards
        fb.pos.y -= G.FBULLET_SPEED;
        
        // Drawing
        color("yellow");
        box(fb.pos, 2);
    });

	// text(fBullets.length.toString(), 3, 10);

	// Another update loop
	// This time, with remove()
    remove(enemies, (e) => {
        e.pos.y += currentEnemySpeed;
        e.firingCooldown--;
        if (e.firingCooldown <= 0) {
            eBullets.push({
                pos: vec(e.pos.x, e.pos.y),
                angle: e.pos.angleTo(player.pos),
                rotation: rnd()
            });
            e.firingCooldown = G.ENEMY_FIRE_RATE;
            play("select");
        }

        color("black");
        // Interaction from enemies to fBullets
        // Shorthand to check for collision against another specific type
        // Also draw the sprits
        const isCollidingWithFBullets = char("b", e.pos).isColliding.rect.yellow;
        const isCollidingWithPlayer = char("b", e.pos).isColliding.char.a;
        if (isCollidingWithPlayer) {
            end();
            play("powerUp");
        }
        
        if (isCollidingWithFBullets) {
            color("yellow");
            particle(e.pos);
            play("explosion");
            addScore(10 * waveCount, e.pos);
        }
        
        // Also another condition to remove the object
        return (isCollidingWithFBullets || e.pos.y > G.HEIGHT);
    });

	remove(fBullets, (fb) => {
        // Interaction from fBullets to enemies, after enemies have been drawn
        color("light_red");
        const isCollidingWithEnemies = box(fb.pos, 2).isColliding.char.b;
        return (isCollidingWithEnemies || fb.pos.y < 0);
    });

	remove(eBullets, (eb) => {
        // Old-fashioned trigonometry to find out the velocity on each axis
        eb.pos.x += G.EBULLET_SPEED * Math.cos(eb.angle);
        eb.pos.y += G.EBULLET_SPEED * Math.sin(eb.angle);
        // The bullet also rotates around itself
        eb.rotation += G.EBULLET_ROTATION_SPD;

        color("red");
        const isCollidingWithPlayer
            = char("c", eb.pos, {rotation: eb.rotation}).isColliding.char.a;

        if (isCollidingWithPlayer) {
            // End the game
            end();
            // Sarcasm; also, unintedned audio that sounds good in actual gameplay
            play("powerUp"); 
        }
        
        // If eBullet is not onscreen, remove it
        return (!eb.pos.isInRect(0, 0, G.WIDTH, G.HEIGHT));
    });

	// text(difficulty.toString(), 3, 10);

}