const gameStart = {
    key: 'gameStart',
    preload: function(){
        // 載入資源
    },
    create: function(){
        // 資源載入完成，加入遊戲物件及相關設定
    },
    update: function(){
        // 遊戲狀態更新
    }
}

const config = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    parent: 'wrap',
    scene: []
}
const game = new Phaser.Game(config);