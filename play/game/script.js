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
	this.load.image('background', '../../static/background.png');
	this.load.spritesheet('player', '../../static/player_sprite.png', { frameWidth: 230, frameHeight: 300 });
	this.load.spritesheet("inventory", "../../static/inventory.png", { frameWidth: 96, frameHeight: 96 });
	this.load.image("map-tiles-2", "../../static/tileset2.png");
}

function create (){
	// Variables
	grass = 0;
	water = 0;
	dirt = 0;
	stone = 0;
	chiseled_stone = 0;
	lastdirection = 'right';
	alert('Arrow Keys to move. Press 1-4 to switch items, right click to remove and left click to add. And Press I to view inventory.')
	objectToPlace = 'grass';
	grassHeld = false;
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
		[-1,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,-1],
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
	tiles = map.addTilesetImage("map-tiles-2");
	layer = map.createLayer(0, tiles, 0, 0);
	this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	map.setCollision([-1, 6, 7, 1, 2]);
	cursors = this.input.keyboard.createCursorKeys();
	player = this.physics.add.sprite(500, 300, 'player');
	player.setScrollFactor(1);
	this.physics.add.collider(player, layer);
	player.setScale(0.7)
	player.setBounce(0.2);
	player.setCollideWorldBounds(false);
	player.body.setGravityY(0);
	this.cameras.main.startFollow(player);
	inventory1 = this.add.sprite(player.x, player.y - 300, 'inventory');
	inventory2 = this.add.sprite(player.x -96, player.y - 300, 'inventory');
	inventory3 = this.add.sprite(player.x -192, player.y - 300, 'inventory');
	inventory4 = this.add.sprite(player.x -288, player.y - 300, 'inventory');
	inventory5 = this.add.sprite(player.x +96, player.y - 300, 'inventory');
	grassint = this.add.text(player.x, player.y - 275, grass);
	dirtint = this.add.text(player.x -96, player.y - 250, dirt);
	waterint = this.add.text(player.x -192, player.y - 250, water);
	stoneint = this.add.text(player.x -288, player.y - 250, stone);
	chiseled_stoneint = this.add.text(player.x +96, player.y - 250, chiseled_stone);
	// Animations and Some Inputing
	player.anims.create({
        key: 'walk-right',
        frames: this.anims.generateFrameNumbers('player', {frames: [2, 0]} ),
        frameRate: 6,
        repeat: -1
    });
	player.anims.create({
        key: 'walk-left',
        frames: this.anims.generateFrameNumbers('player', {frames: [3, 5]} ),
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
		key: 'water',
        frames: this.anims.generateFrameNumbers('inventory', {frames: [2, 2]} ),
        frameRate: 6,
        repeat: -1
	});
	inventory4.anims.create({
		key: 'nothing',
        frames: this.anims.generateFrameNumbers('inventory', {frames: [4, 4]} ),
        frameRate: 6,
        repeat: -1
	});
	inventory4.anims.create({
		key: 'stone',
        frames: this.anims.generateFrameNumbers('inventory', {frames: [3, 3]} ),
        frameRate: 6,
        repeat: -1
	});
	inventory5.anims.create({
		key: 'chiseled_stone',
        frames: this.anims.generateFrameNumbers('inventory', {frames: [3, 3]} ),
        frameRate: 6,
        repeat: -1
	});
	inventory5.anims.create({
		key: 'nothing',
        frames: this.anims.generateFrameNumbers('inventory', {frames: [4, 4]} ),
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
    this.input.keyboard.on('keydown-THREE', function (event) {
        objectToPlace = 'stone';
		console.log(objectToPlace);
    });
	this.input.keyboard.on('keydown-FOUR', function (event) {
        objectToPlace = 'water';
		console.log(objectToPlace);
    });
	cursors.up.on('down', function () {
        if (player.body.blocked.down)
        {
            player.body.setVelocityY(-420);
        }
    }, this);
	this.input.mouse.disableContextMenu();
	this.input.on('pointerdown', function (pointer) {
		if (pointer.rightButtonDown()) {
			tile = map.getTileAt(pointerTileX, pointerTileY).index;
			if (tile == -1) {
				objectToPlace = 'Null';
				switch(objectToPlace) {
					case 'Null':
						break;
				}
			} else {
				switch(tile) {
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
					case 0:
						if (water > 20) {
							break;
						} else {
							water += 1;
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
				case 'water':
					if (tile !== 4) {
						break;
					}
					if (water > 0) {
						map.putTileAt(0, pointerTileX, pointerTileY);
						water += -1;
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
	inventory1.y = player.y - 300;
	inventory2.x = player.x - 96;
	inventory2.y = player.y - 300;
	inventory3.x = player.x - 192;
	inventory3.y = player.y - 300;
	inventory4.x = player.x - 288;
	inventory4.y = player.y - 300;
	inventory5.x = player.x + 96;
	inventory5.y = player.y - 300;
	inventory2.anims.play('nothing', true);
	inventory3.anims.play('nothing', true);
	inventory4.anims.play('nothing', true);
	grassint.x = player.x;
	grassint.y = player.y - 250;
	grassint.text = grass;
	dirtint.x = player.x - 96 ;
	dirtint.y = player.y - 250;
	dirtint.text = dirt;
	waterint.x = player.x - 192;
	waterint.y = player.y - 250;
	waterint.text = water;
	stoneint.x = player.x - 288;
	stoneint.y = player.y - 250;
	stoneint.text = stone;
	chiseled_stoneint.x = player.x + 96;
	chiseled_stoneint.y = player.y - 250;
	chiseled_stoneint.text = chiseled_stone;
	if (cursors.left.isDown){
    	player.setVelocityX(-320);
		player.anims.play('walk-left', true);
		lastdirection = 'left';
	} else if (cursors.right.isDown) {
    	player.setVelocityX(320);
		player.anims.play('walk-right', true);
		lastdirection = 'right';
	} else {
   		player.setVelocityX(0);
		if (lastdirection == 'right') {
			player.anims.play('stand-right', true);
		} else if (lastdirection == 'left') {
			player.anims.play('stand-left', true);
		}
	} 
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
	if (water > 0) {
		inventory3.anims.play('water', true);
	} else {
		inventory3.anims.play('nothing', true);
	}
	if (stone > 0) {
		inventory4.anims.play('stone', true);
	} else {
		inventory4.anims.play('nothing', true);
	} 
	if (chiseled_stone > 0) {
		inventory5.anims.play('chiseled_stone', true);
	} else {
		inventory5.anims.play('nothing', true);
	}
}
