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
	this.load.image('logo', '../static/logo.png');
	this.load.image('character', '../static/character.png')
	this.load.image('playbutton', '../static/playbutton.png')
}

function create(){
	cursors = this.input.keyboard.createCursorKeys();
	logo = this.add.image(400, 100, 'logo');
	logo.setScale(0.05);
	play_button = this.add.image(400, 175, 'playbutton');
	play_button.setScale(0.10);
	play_button.setInteractive();
	play_button.on('pointerdown', () => { 
		play_button.setVisible(false);
		logo.setVisible(false);
		random = this.add.text(360, 100, 'Random World Gen');
		random.setInteractive();
		random.on('pointerdown', () => {
			cursors = this.input.keyboard.createCursorKeys();
			random.setVisible(false);
			player = this.physics.add.sprite(100, 450, 'character');
			player.setScale(0.10);
			var gameOn = "True";
			
			}
		});
	});
}
function update(){

}
