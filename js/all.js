const x = '50';
const y = '50';
const w = '100%';
const h = '100%';

const gameStart = {
    key: 'gameStart',
    preload: function(){
        // 載入資源
        this.load.image('bg1', './img/bg/bg1.png');
        this.load.image('bg2', 'img/bg/bg-middle.svg');
        this.load.image('bg3', 'img/bg/bg-back.svg');
        this.load.image('bg4', 'img/bg/bg-color.svg');
        this.load.image('footer', 'img/bg/bg-ground.svg');
    },
    create: function(){
        // 資源載入完成，加入遊戲物件及相關設定
        this.bg1 = this.add.tileSprite(0, 0, 400, 200, 'bg1');
        // this.bg2 = this.add.tileSprite(400, 300, 800, 600, 'bg2');
        // this.bg3 = this.add.tileSprite(400, 300, 800, 600, 'bg3');
        // this.bg4 = this.add.tileSprite(400, 300, 800, 600, 'bg4');
        // this.footer = this.add.tileSprite(400, 568, 800, 100, 'footer');
    },
    update: function(){
        // 遊戲狀態更新
    }
}

const config = {
    type: Phaser.AUTO,
    width: w,
    height: h,
    parent: 'wrap',
    scene: []
}

const game = new Phaser.Game(config);
