var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
	physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
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
function preload (){
	this.load.spritesheet('player', '../../static/player_sprite.png', { frameWidth: 230, frameHeight: 300 });
	this.load.spritesheet("inventory", "../../static/inventory.png", { frameWidth: 96, frameHeight: 96 });
	this.load.image("map-tiles", "../../static/tileset.png");
	this.load.spritesheet('hpbar', '../../static/hpbar.png', {frameWidth: 64, frameHeight: 16});
}

function create (){
	// Variables
	centerX=game.config.width/2;
	centerY=game.config.height/2;
	grass = 0;
	dirt = 0;
	stone = 0;
	lastdirection = 'right';
	alert('Arrow Keys to move. Press 1-4 to switch items, right click to remove and left click to add. And Press I to view inventory.')
	objectToPlace = 'grass';
	grassHeld = false;
	click = 1;
	hp = 100;
	grasschest = 0;
	// World Gen
	world = [
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,-1],
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,-1],
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,-1],
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,-1],
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,-1],
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,-1],
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,-1],
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,-1],
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,-1],
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,-1],
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,-1],
		[-1,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,10,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,-1],
		[-1,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,-1],
		[-1,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,-1],
		[-1,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,-1],
		[-1,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,-1],
		[-1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,-1],
		[-1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,-1],
		[-1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,-1],
		[-1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,-1],
		[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
		
  	];
	// Main Rendering
	this.cameras.main.zoom = 0.7;
	map = this.make.tilemap({data: world, tileWidth: 142.9, tileHeight: 142.9});
	tiles = map.addTilesetImage("map-tiles");
	layer = map.createLayer(0, tiles, 0, 0);
	this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	map.setCollision([-1, 6, 7, 1, 2]);
	cursors = this.input.keyboard.createCursorKeys();
	player = this.physics.add.sprite(centerX, centerY, 'player');
	player.setScrollFactor(1);
	this.physics.add.collider(player, layer);
	player.setScale(0.7)
	player.setBounce(0.2);
	player.setCollideWorldBounds(false);
	player.body.setGravityY(0);
	this.cameras.main.startFollow(player);
	inventory1 = this.add.sprite(player.x, player.y + 300, 'inventory');
	inventory2 = this.add.sprite(player.x + 96, player.y + 300, 'inventory');
	inventory3 = this.add.sprite(player.x + 192, player.y + 300, 'inventory');
	grassint = this.add.text(player.x, player.y - 250, grass);
	dirtint = this.add.text(player.x + 96, player.y - 250, dirt);
	stoneint = this.add.text(player.x +192, player.y - 250, stone);
	hpbar = this.add.sprite(player.x, player.y + 100, 'hpbar');
	hpbar.setScale(2);
	// Animations and Some Inputing
	hpbar.anims.create({
        key: '100%',
        frames: this.anims.generateFrameNumbers('hpbar', {frames: [0, 0]} ),
        frameRate: 6,
        repeat: -1
    });
	hpbar.anims.create({
        key: '90%',
        frames: this.anims.generateFrameNumbers('hpbar', {frames: [1, 1]} ),
        frameRate: 6,
        repeat: -1
    });
	hpbar.anims.create({
        key: '80%',
        frames: this.anims.generateFrameNumbers('hpbar', {frames: [2, 2]} ),
        frameRate: 6,
        repeat: -1
    });
	hpbar.anims.create({
        key: '70%',
        frames: this.anims.generateFrameNumbers('hpbar', {frames: [3, 3]} ),
        frameRate: 6,
        repeat: -1
    });
	hpbar.anims.create({
        key: '60%',
        frames: this.anims.generateFrameNumbers('hpbar', {frames: [4, 4]} ),
        frameRate: 6,
        repeat: -1
    });
	hpbar.anims.create({
        key: '50%',
        frames: this.anims.generateFrameNumbers('hpbar', {frames: [5, 5]} ),
        frameRate: 6,
        repeat: -1
    });
	hpbar.anims.create({
        key: '40%',
        frames: this.anims.generateFrameNumbers('hpbar', {frames: [6, 6]} ),
        frameRate: 6,
        repeat: -1
    });
	hpbar.anims.create({
        key: '30%',
        frames: this.anims.generateFrameNumbers('hpbar', {frames: [7, 7]} ),
        frameRate: 6,
        repeat: -1
    });
	hpbar.anims.create({
        key: '20%',
        frames: this.anims.generateFrameNumbers('hpbar', {frames: [8, 8]} ),
        frameRate: 6,
        repeat: -1
    });
	hpbar.anims.create({
        key: '10%',
        frames: this.anims.generateFrameNumbers('hpbar', {frames: [9, 9]} ),
        frameRate: 6,
        repeat: -1
    });
	player.anims.create({
        key: 'walk-right',
        frames: this.anims.generateFrameNumbers('player', {frames: [2, 1, 0, 1]} ),
        frameRate: 6,
        repeat: -1
    });
	player.anims.create({
        key: 'walk-left',
        frames: this.anims.generateFrameNumbers('player', {frames: [3, 4, 5, 4]} ),
        frameRate: 6,
        repeat: -1
    });
	player.anims.create({
        key: 'stand-left',
        frames: this.anims.generateFrameNumbers('player', {frames: [4, 4]} ),
        frameRate: 6,
        repeat: -1
    });
	player.anims.create({
        key: 'stand-right',
        frames: this.anims.generateFrameNumbers('player', {frames: [1, 1]} ),
        frameRate: 6,
        repeat: -1
    });
	player.anims.play('stand-right', true);
	inventory1.anims.create({
		key: 'nothing',
        frames: this.anims.generateFrameNumbers('inventory', {frames: [4, 4]} ),
        frameRate: 6,
        repeat: -1
	});
	inventory1.anims.create({
		key: 'grass',
        frames: this.anims.generateFrameNumbers('inventory', {frames: [0, 0]} ),
        frameRate: 6,
        repeat: -1
	});
	inventory2.anims.create({
		key: 'nothing',
        frames: this.anims.generateFrameNumbers('inventory', {frames: [4, 4]} ),
        frameRate: 6,
        repeat: -1
	});
	inventory2.anims.create({
		key: 'dirt',
        frames: this.anims.generateFrameNumbers('inventory', {frames: [1, 1]} ),
        frameRate: 6,
        repeat: -1
	});
	inventory3.anims.create({
		key: 'nothing',
        frames: this.anims.generateFrameNumbers('inventory', {frames: [4, 4]} ),
        frameRate: 6,
        repeat: -1
	});
	inventory3.anims.create({
		key: 'stone',
        frames: this.anims.generateFrameNumbers('inventory', {frames: [3, 3]} ),
        frameRate: 6,
        repeat: -1
	});
	this.input.keyboard.on('keydown-ONE', function (event) {
        objectToPlace = 'grass';
		console.log(objectToPlace);
    });
    this.input.keyboard.on('keydown-TWO', function (event) {
        objectToPlace = 'dirt';
		console.log(objectToPlace);
    });
	this.input.keyboard.on('keydown-FOUR', function (event) {
        objectToPlace = 'stone';
		console.log(objectToPlace);
    });
	this.input.keyboard.on('keydown-W', function (event) {
        if (player.body.blocked.down) {
            player.body.setVelocityY(-420);
        }
    });
	this.input.keyboard.on('keydown-A', function (event) {
        player.setVelocityX(-320);
		player.anims.play('walk-left', true);
		lastdirection = 'left';
    });
	this.input.keyboard.on('keydown-D', function (event) {
        player.setVelocityX(320);
		player.anims.play('walk-right', true);
		lastdirection = 'right';
    });
	this.input.keyboard.on('keydown-E', function (event){
		if (click == 1) {
			console.log('Click 2');
			alert('Getting From Chests');
			click = 2;
		} else if (click == 2) {
			console.log('Click 3');
			alert('Destroying Chests');
			click = 3;
		} else if (click == 3) {
			console.log('Click 1');
			alert('Depositing To Chests');
			click = 1;
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
			if (tile.y != playertile.y + 1 && tile.x != playertile.x + 1 && tilet != 10) {
				tilet = 'Null';
				if (tile.x == playertile.x + 1 && tile.y == playertile.y - 1) {
					tile = map.getTileAt(pointerTileX, pointerTileY);
					tilet = tile.index;
				}
			} 
			if (tile == -1) {
				objectToPlace = 'Null';
				switch(objectToPlace) {
					case 'Null':
						break;
				}
			} else {
				switch(tilet) {
					case 6:
						if (grass > 20) {
							break;
						} else {
							grass += 1;
							map.putTileAt(4, pointerTileX, pointerTileY);
							break;
						}
					case 7:
						if (dirt > 20) {
							break;
						} else {
							dirt += 1;
							map.putTileAt(4, pointerTileX, pointerTileY);
							break;
						}
					case 1:
						if (stone > 20) {
							break;
						} else {
							stone += 1;
							map.putTileAt(4, pointerTileX, pointerTileY);
							break;
						}
					case 10:
						if (click == 1) {
							if (grass > 0) {
								grasschest += grass;
								grass = 0;
							} else {
								alert('You have no grass!');
							}
						} else if (click == 2) {
							if (grass > 20) {
								alert('You can not pick up more grass');
							} else {
								if (grasschest > 20) {
									grass += 21 - grass;
									grasschest -= 21 - grass;
								} else {
									grass += grasschest - grass;
									grasschest -= grass;
								}
							}
						} else if (click == 3 && grasschest < grass) {
							map.putTileAt(4, pointerTileX, pointerTileY);
							grass += grasschest;
						} else {
							alert('Can not destroy that!');
						}
				}
			}
        } else {
			tile = map.getTileAt(pointerTileX, pointerTileY).index;
			if (tile == -1) {
				objectToPlace = 'Null';
			}
			switch(objectToPlace){
				case 'grass':
					if (tile !== 4) {
						break;
					}
					if (grass > 0) {
						map.putTileAt(6, pointerTileX, pointerTileY);
						grass += -1;
					}
					break;
				case 'dirt':
					if (tile !== 4) {
						break;
					}
					if (dirt > 0) {
						map.putTileAt(7, pointerTileX, pointerTileY);
						dirt += -1;
					}
					break;
				case 'stone':
					if (tile !== 4) {
						break;
					}
					if (stone > 0) {
						map.putTileAt(1, pointerTileX, pointerTileY);
						stone += -1;
					}
					break;
				case 'Null':
					break;
			}	
        }

    }, this);
}

function update (){
	worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
	pointerTileX = map.worldToTileX(worldPoint.x);
    pointerTileY = map.worldToTileY(worldPoint.y);
	inventory1.x = player.x;
	inventory1.y = player.y + 300;
	inventory2.x = player.x + 96;
	inventory2.y = player.y + 300;
	inventory3.x = player.x + 192;
	inventory3.y = player.y + 300;
	grassint.x = player.x;
	grassint.y = player.y + 250;
	grassint.text = grass;
	dirtint.x = player.x + 96 ;
	dirtint.y = player.y + 250;
	dirtint.text = dirt;
	stoneint.x = player.x + 192;
	stoneint.y = player.y + 250;
	stoneint.text = stone;
	hpbar.x = player.x;
	hpbar.y = player.y - 150;		
	if (grass > 0) {
		inventory1.anims.play('grass', true);
	} else {
		inventory1.anims.play('nothing', true);
	}
	if (dirt > 0) {
		inventory2.anims.play('dirt', true);
	} else {
		inventory2.anims.play('nothing', true);
	}
	if (stone > 0) {
		inventory3.anims.play('stone', true);
	} else {
		inventory3.anims.play('nothing', true);
	} 
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
}
