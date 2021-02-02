var config = {
	type: Phaser.AUTO,
	width: 1000,
	height: 450,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 350 },
			debug: false
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
var blocks;
function preload() {
	this.load.spritesheet('player', '../../static/player_sprite.png', { frameWidth: 230, frameHeight: 300 });
	this.load.image("inventory", "../../static/inventorylog.png");
	this.load.image("map-tiles", "../../static/tileset1.png");
	this.load.spritesheet('hpbar', '../../static/hpbar.png', { frameWidth: 64, frameHeight: 16 });
	this.load.spritesheet('mini-tiles', '../../static/mini_inventory_tileset.png', { frameWidth: 80, frameHeigh: 80});
	this.load.image("chest", "../../static/chest.png");
}

function create() {
	// Variables
	grass = 0;
	dirt = 0;
	stone = 0;
	wood = 0;
	lastdirection = 'right';
	alert('Arrow Keys to move. Press 1-4 to switch items, right click to remove and left click to add. And Press I to view inventory.')
	objectToPlace = 'grass';
	grassHeld = false;
	click = 1;
	hp = 100;
	grass1 = 0;
	dirt1 = 0;
	stone1 = 0;
	invrow = 1;
	inv = true;
	chestrow = 1;
	movementOn = true;
	// World Gen
	world = [
		[-1, 3, 3, 3, 3, 3, 3, 3, 7, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 7, 3, 3, 3, 3, 3, 3, 3, 3, 3, -1],
		[-1, 7, 3, 3, 3, 3, 7, 3, 3, 3, 3, 7, 3, 3, 3, 7, 3, 3, 3, 3, 7, 3, 3, 3, 3, 3, 3, 3, 3, -1],
		[-1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, -1],
		[-1, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 10, 3, 5, 3, 9, 3, 3, 10, 3, 3, 3, 9, 3, 3, 3, 3, -1],
		[-1, 0, 0, 11, 11, 11, 11, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
		[-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1],
		[-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1],
		[-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1],
		[-1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, -1],
		[-1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, -1],
		[-1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
	];
	// Main Rendering
	this.cameras.main.zoom = 0.7;
	map = this.make.tilemap({ data: world, tileWidth: 159.999999999999999999999999999999999999999999999999999, tileHeight: 160 });
	tiles = map.addTilesetImage("map-tiles");
	layer = map.createLayer(0, tiles, 0, 0);
	this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	map.setCollision([-1,0, 1, 2, 9, 10]);
	cursors = this.input.keyboard.createCursorKeys();
	player = this.physics.add.sprite(500, 400, 'player');
	player.setScrollFactor(1);
	this.physics.add.collider(player, layer);
	player.setScale(0.65)
	player.setBounce(0.2);
	player.setCollideWorldBounds(false);
	player.body.setGravityY(0);
	this.cameras.main.startFollow(player);
	inventory = this.add.sprite(player.x, player.y + 250, 'inventory');
	hpbar = this.add.sprite(player.x, player.y + 100, 'hpbar');
	items = this.add.group();
	item1 = this.add.sprite(player.x, player.y + 250, 'mini-tiles');
	item2 = this.add.sprite(player.x + 160, player.y + 250, 'mini-tiles');
	item3 = this.add.sprite(player.x - 160, player.y + 250, 'mini-tiles');
	item1int = this.add.text(player.x, player.y + 200, grass);
	item2int = this.add.text(player.x + 160, player.y + 200, dirt);
	item3int = this.add.text(player.x - 160, player.y + 200, stone);
	chest = this.add.sprite(player.x, player.y, 'chest');
	chestitem1 = this.add.sprite(player.x, player.y, 'mini-tiles');
	chestitem2 = this.add.sprite(player.x - 100, player.y, 'mini-tiles');
	chestitem3 = this.add.sprite(player.x + 100, player.y, 'mini-tiles');
	chestitem1.setVisible(false);
	chestitem2.setVisible(false);
	chestitem3.setVisible(false);
	chest.setVisible(false);
	hpbar.setScale(2);
	item1.setScale(0.5);
	item2.setScale(0.5);
	item3.setScale(0.5);
	// Animations and Some Inputing
	item1.anims.create({
		key: 'grass',
		frames: this.anims.generateFrameNumbers('mini-tiles', { frames: [1, 1] }),
		frameRate: 6,
		repeat: -1
	});
	item2.anims.create({
		key: 'dirt',
		frames: this.anims.generateFrameNumbers('mini-tiles', { frames: [3, 3] }),
		frameRate: 6,
		repeat: -1
	});
	item3.anims.create({
		key: 'stone',
		frames: this.anims.generateFrameNumbers('mini-tiles', { frames: [5, 5] }),
		frameRate: 6,
		repeat: -1
	});
	item3.anims.create({
		key: 'wood',
		frames: this.anims.generateFrameNumbers('mini-tiles', { frames: [4, 4] }),
		frameRate: 6,
		repeat: -1
	});
	hpbar.anims.create({
		key: '100%',
		frames: this.anims.generateFrameNumbers('hpbar', { frames: [0, 0] }),
		frameRate: 6,
		repeat: -1
	});
	hpbar.anims.create({
		key: '90%',
		frames: this.anims.generateFrameNumbers('hpbar', { frames: [1, 1] }),
		frameRate: 6,
		repeat: -1
	});
	hpbar.anims.create({
		key: '80%',
		frames: this.anims.generateFrameNumbers('hpbar', { frames: [2, 2] }),
		frameRate: 6,
		repeat: -1
	});
	hpbar.anims.create({
		key: '70%',
		frames: this.anims.generateFrameNumbers('hpbar', { frames: [3, 3] }),
		frameRate: 6,
		repeat: -1
	});
	hpbar.anims.create({
		key: '60%',
		frames: this.anims.generateFrameNumbers('hpbar', { frames: [4, 4] }),
		frameRate: 6,
		repeat: -1
	});
	hpbar.anims.create({
		key: '50%',
		frames: this.anims.generateFrameNumbers('hpbar', { frames: [5, 5] }),
		frameRate: 6,
		repeat: -1
	});
	hpbar.anims.create({
		key: '40%',
		frames: this.anims.generateFrameNumbers('hpbar', { frames: [6, 6] }),
		frameRate: 6,
		repeat: -1
	});
	hpbar.anims.create({
		key: '30%',
		frames: this.anims.generateFrameNumbers('hpbar', { frames: [7, 7] }),
		frameRate: 6,
		repeat: -1
	});
	hpbar.anims.create({
		key: '20%',
		frames: this.anims.generateFrameNumbers('hpbar', { frames: [8, 8] }),
		frameRate: 6,
		repeat: -1
	});
	hpbar.anims.create({
		key: '10%',
		frames: this.anims.generateFrameNumbers('hpbar', { frames: [9, 9] }),
		frameRate: 6,
		repeat: -1
	});
	player.anims.create({
		key: 'walk-right',
		frames: this.anims.generateFrameNumbers('player', { frames: [2, 1, 0, 1] }),
		frameRate: 6,
		repeat: -1
	});
	player.anims.create({
		key: 'walk-left',
		frames: this.anims.generateFrameNumbers('player', { frames: [3, 4, 5, 4] }),
		frameRate: 6,
		repeat: -1
	});
	player.anims.create({
		key: 'stand-left',
		frames: this.anims.generateFrameNumbers('player', { frames: [4, 4] }),
		frameRate: 6,
		repeat: -1
	});
	player.anims.create({
		key: 'stand-right',
		frames: this.anims.generateFrameNumbers('player', { frames: [1, 1] }),
		frameRate: 6,
		repeat: -1
	});
	player.anims.play('stand-right', true);
	this.input.keyboard.on('keydown-ONE', function (event) {
		if (inv == true) {
			if (invrow == 1) {
				objectToPlace = 'stone';
				console.log(objectToPlace);
			} else if (invrow == 2) {
				objectToPlace = 'wood';
				console.log(objectToPlace);
			}
		} else if (inv == false) {
			if (chestrow == 1) {
				
			}
		}
	});
	this.input.keyboard.on('keydown-TWO', function (event) {
		objectToPlace = 'grass';
		console.log(objectToPlace);
	});
	this.input.keyboard.on('keydown-THREE', function (event) {
		objectToPlace = 'dirt';
		console.log(objectToPlace);
	});
	this.input.keyboard.on('keydown-W', function (event) {
		if (movementOn == true) {
			if (player.body.blocked.down) {
				player.body.setVelocityY(-350);
			}
		}
	});
	this.input.keyboard.on('keydown-A', function (event) {
		if (movementOn == true) {
			player.setVelocityX(-320);
			player.anims.play('walk-left', true);
			lastdirection = 'left';
		}
	});
	this.input.keyboard.on('keydown-D', function (event) {
		if (movementOn == true) {
			player.setVelocityX(320);
			player.anims.play('walk-right', true);
			lastdirection = 'right';
		}
	});
	this.input.keyboard.on('keydown-E', function (event) {
		if (invrow == 3) {
			invrow = 1;
		} else {
			invrow += 1;
		}
	});
	this.input.keyboard.on('keydown-R', function (event) {
		if (inv == false) {
			if (chestrow == 2) {
				chestrow = 1;
			} else {
				chestrow += 1;
			}
		}
	});
	this.input.keyboard.on('keyup-A', function (event) {
		player.setVelocityX(0);
		player.anims.play('stand-left', true);
	});
	this.input.keyboard.on('keyup-D', function (event) {
		player.setVelocityX(0);
		player.anims.play('stand-right', true);
	});
	this.input.mouse.disableContextMenu();
	this.input.on('pointerdown', function (pointer) {
		if (pointer.rightButtonDown()) {
			tile = map.getTileAt(pointerTileX, pointerTileY);
			tilet = tile.index;
			playertile = map.worldToTileXY(player.x, player.y);
			console.log(tile.x, playertile.x)
			console.log(tile.y, playertile.y)
			if (tile.x > playertile.x + 1) {
				tilet = 'Null';
			}
			if (tile.x < playertile.x - 1) {
				tilet = 'Null';
			}
			if (tile.y > playertile.y + 1) {
				tilet = 'Null';
			}
			if (tile.y < playertile.y - 1) {
				tilet = 'Null';
			}
			if (tile == -1) {
				objectToPlace = 'Null';
				switch (objectToPlace) {
					case 'Null':
						break;
				}
			} else {
				switch (tilet) {
					case 0:
						if (grass > 20) {
							break;
						} else {
							grass += 1;
							map.putTileAt(3, pointerTileX, pointerTileY);
							break;
						}
					case 1:
						if (dirt > 20) {
							break;
						} else {
							dirt += 1;
							map.putTileAt(3, pointerTileX, pointerTileY);
							break;
						}
					case 2:
						if (stone > 20) {
							break;
						} else {
							stone += 1;
							map.putTileAt(3, pointerTileX, pointerTileY);
							break;
						}
					case 9:
						if (stone > 20) {
							break;
						} else {
							stone += 1;
							map.putTileAt(3, pointerTileX, pointerTileY);
							break;
						}
					case 10:
						if (wood > 20) {
							break;
						} else {
							wood += 1;
							map.putTileAt(3, pointerTileX, pointerTileY);
							break;
						}
					case 5:
						if (click == 1) {
							inv = false;
							click = 2;
							break;
						} else {
							inv = true;
							click = 1;
							break;
						}
						
						
				}
			}
		} else {
			tile = map.getTileAt(pointerTileX, pointerTileY);
			tilet = tile.index;
			playertile = map.worldToTileXY(player.x, player.y);
			if (tile.x > playertile.x + 1) {
				tilet = 'Null';
			}
			if (tile.x < playertile.x - 1) {
				tilet = 'Null';
			}
			if (tile.y > playertile.y + 1) {
				tilet = 'Null';
			}
			if (tile.y < playertile.y - 1) {
				tilet = 'Null';
			}
			if (tile.y == playertile.y && tile.x == playertile.x) {
				tilet = 'Null';
			}
			if (tile == -1) {
				objectToPlace = 'Null';
			}
			switch (objectToPlace) {
				case 'grass':
					if (tilet !== 3) {
						break;
					}
					if (grass > 0) {
						map.putTileAt(0, pointerTileX, pointerTileY);
						grass += -1;
					}
					break;
				case 'dirt':
					if (tilet !== 3) {
						break;
					}
					if (dirt > 0) {
						map.putTileAt(1, pointerTileX, pointerTileY);
						dirt += -1;
					}
					break;
				case 'stone':
					if (tilet !== 3) {
						break;
					}
					if (stone > 0) {
						map.putTileAt(2, pointerTileX, pointerTileY);
						stone += -1;
					}
					break;
				case 'wood':
					if (tilet !== 3) {
						break;
					}
					if (wood > 0) {
						map.putTileAt(10, pointerTileX, pointerTileY);
						wood += -1;
					}
					break;
				case 'Null':
					break;
			}
		}

	}, this);
}

function update() {
	worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
	pointerTileX = map.worldToTileX(worldPoint.x);
	pointerTileY = map.worldToTileY(worldPoint.y);
	inventory.x = player.x;
	inventory.y = player.y + 250;
	hpbar.x = player.x;
	hpbar.y = player.y - 200;
	item1.x = player.x - 1;
	item1.y = player.y + 250;
	item2.x = player.x + 160;
	item2.y = player.y + 250;
	item3.x = player.x - 140;
	item3.y = player.y + 250;
	item1int.x = player.x;
	item1int.y = player.y + 200;
	item2int.x = player.x - 160;
	item2int.y = player.y + 200;
	item3int.x = player.x + 160;
	item3int.y = player.y + 200;
	item1int.text = grass;
	item2int.text = stone;
	item3int.text = dirt;
	chest.x = player.x;
	chest.y = player.y;
	chestitem1.x = player.x - 55;
	chestitem2.x = player.x - 175;
	chestitem3.x = player.x + 55;
	chestitem1.y = player.y - 55;
	chestitem2.y = player.y - 55;
	chestitem3.y = player.y- 55;
	if (hp == 100) {
		hpbar.anims.play('100%', true);
	} else if (hp > 89) {
		hpbar.anims.play('90%', true);
	} else if (hp > 79) {
		hpbar.anims.play('80%', true);
	} else if (hp > 69) {
		hpbar.anims.play('70%', true);
	} else if (hp > 59) {
		hpbar.anims.play('60%', true);
	} else if (hp > 49) {
		hpbar.anims.play('50%', true);
	} else if (hp > 39) {
		hpbar.anims.play('40%', true);
	} else if (hp > 39) {
		hpbar.anims.play('40%', true);
	} else if (hp > 39) {
		hpbar.anims.play('40%', true);
	} else if (hp > 29) {
		hpbar.anims.play('30%', true);
	} else if (hp > 19) {
		hpbar.anims.play('20%', true);
	} else if (hp > 9) {
		hpbar.anims.play('20%', true);
	} else if (hp == 0) {
		player.destroy();
		hpbar.destroy();
		inventory1.destroy();
		inventory2.destroy();
		inventory3.destroy();
		grassint.destroy();
		dirtint.destroy();
		stoneint.destroy();
		alert('You are dead');
	}
	if (inv == true) {
		chest.setVisible(false);
		movementOn = true;
		chestitem1.setVisible(false);
		chestitem2.setVisible(false);
		chestitem3.setVisible(false);
		if (invrow == 1) {
			item1.setVisible(true);
			item2.setVisible(true);
			item1.anims.play('grass', true);
			item2.anims.play('dirt', true);
			item3.anims.play('stone', true);
			item2int.text = stone;
			item1int.setVisible(true);
			item3int.setVisible(true);
		} else if (invrow == 2) {
			item1.setVisible(false);
			item2.setVisible(false);
			item3.anims.play('wood', true);
			item2int.text = wood;
			item1int.setVisible(false);
			item3int.setVisible(false);
		}
	} else if (inv == false) {
		movementOn = false;
		player.setVelocityX(0);
		if (invrow == 1) {
			item1.setVisible(true);
			item2.setVisible(true);
			item1.anims.play('grass', true);
			item2.anims.play('dirt', true);
			item3.anims.play('stone', true);
			item2int.text = stone;
			item1int.setVisible(true);
			item3int.setVisible(true);
		} else if (invrow == 2) {
			item1.setVisible(false);
			item2.setVisible(false);
			item3.anims.play('wood', true);
			item2int.text = wood;
			item1int.setVisible(false);
			item3int.setVisible(false);
		}
		chest.setVisible(true);
		chestitem1.setVisible(true);
		chestitem2.setVisible(true);
		chestitem3.setVisible(true);
	}
}
