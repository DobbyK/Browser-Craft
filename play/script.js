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
	
}

function create(){

}
function update(){

}
