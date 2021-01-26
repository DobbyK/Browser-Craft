let config = {
	type: Phaser.AUTO,
    width: 800,
    height: 500,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: {
    	preload: preload,
      create: create,
      update: update
    }
};
const game = new Phaser.Game(config);

function preload(){
	this.load.image('logo', 'static/logo.png');
}

function create(){
	this.add.image(400, 100, 'logo');
}

function update(){
}
