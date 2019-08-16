const config = {
    type: Phaser.AUTO,
    width: w,
    height: h,
    parent: 'app',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 700
            },
            debug: true
        },
    },
    scene: [
        gamePlay,
        gameStart
    ]
}

const game = new Phaser.Game(config);