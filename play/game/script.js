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
	this.load.image("map-tiles", "../../static/tileset.png");
	this.load.image("map-tiles-2", "../../static/tileset2.png");
}

function create (){
	grass = 0;
	water = 0;
	dirt = 0;
	stone = 0;
	lastdirection = 'right';
	inv = ['Grass:' + grass, 'Dirt:' + dirt, 'Water:' + water, 'Stone:' + stone];
	alert('Arrow Keys to move. Press 1-4 to switch items, right click to remove and left click to add. And Press I to view inventory.')
	world = [
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
		[-1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
		[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
		[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
		[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
		[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
		[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
		[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
		[7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
		[7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
		[7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
		[7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		
  	];
	this.cameras.main.zoom = 0.7;
	map = this.make.tilemap({data: world, tileWidth: 142.9, tileHeight: 142.9});
	tiles = map.addTilesetImage("map-tiles-2");
	layer = map.createLayer(0, tiles, 0, 0);
	this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	map.setCollision([6, 7, 1, 2]);
	cursors = this.input.keyboard.createCursorKeys();
	player = this.physics.add.sprite(500, 300, 'player');
	player.setScrollFactor(1);
	this.physics.add.collider(player, layer);
	player.setScale(0.7)
	player.setBounce(0.2);
	player.setCollideWorldBounds(false);
	player.body.setGravityY(0);
	this.cameras.main.startFollow(player);
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
	objectToPlace = 'grass';
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
	this.input.keyboard.on('keydown-I', function (event) {	
		alert(inv);
	});
	cursors.up.on('down', function () {
        if (player.body.blocked.down)
        {
            player.body.setVelocityY(-420);
        }
    }, this);
	this.input.mouse.disableContextMenu();
	this.input.on('pointerdown', function (pointer) {
		if (pointer.rightButtonDown())
        {
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
						grass += 1;
						break;
					case 7:
						dirt += 1;
						break;
					case 0:
						water += 1;
						break;
					case 1:
						stone += 1;
						break;
				}
			}
            map.putTileAt(4, pointerTileX, pointerTileY);
        }
        else
        {
			tile = map.getTileAt(pointerTileX, pointerTileY).index;
			if (tile == -1) {
				objectToPlace = 'Null';
			}
			switch(objectToPlace){
				case 'grass':
					if (grass > 0) {
						map.putTileAt(6, pointerTileX, pointerTileY);
						grass += -1;
					}
					break;
				case 'dirt':
					if (dirt > 0) {
						map.putTileAt(7, pointerTileX, pointerTileY);
						dirt += -1;
					}
					break;
				case 'water':
					if (water > 0) {
						map.putTileAt(0, pointerTileX, pointerTileY);
						water += -1;
					}
					break;
				case 'stone':
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
	inv = ['Grass:' + grass, 'Dirt:' + dirt, 'Water:' + water, 'Stone:' + stone];
	worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
	pointerTileX = map.worldToTileX(worldPoint.x);
    pointerTileY = map.worldToTileY(worldPoint.y);
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
}
