const gameStart ={
    key: 'gameStart',
    preload: function(){
        // 載入資源
        this.load.image('bg1', '../img/bg/bg-front.svg');
        this.load.image('bg2', '../img/bg/bg-middle.svg');
        this.load.image('bg3', '../img/bg/bg-back.svg');
        this.load.image('bg4', '../img/bg/bg-color.svg');
        this.load.image('footer', '../img/bg/footer.png');

        this.load.image('logo', '../img/main/txt-title.svg')
        this.load.image('startBtn', '../img/main/btn-press-start.svg')
        this.load.image('player', '../img/items/player-end.svg')
    },
    create: function(){
        // 資源載入完成，加入遊戲物件及相關設定
        this.bg4 = this.add.tileSprite(w/2, h/2, w, h, 'bg4');
        this.bg3 = this.add.tileSprite(w/2, h/2, w, h, 'bg3');
        this.bg2 = this.add.tileSprite(w/2, h/2, w, h, 'bg2');
        this.bg1 = this.add.tileSprite(w/2, h/2, w, h, 'bg1');
        this.footer = this.add.tileSprite(w/2, h-45, w, 90, 'footer');

        let logo = this.add.image(w/2, h*0.3,'logo');
        logo.setScale(0.9);

        let startBtn = this.add.image(w/2, h*0.55,'startBtn');
        startBtn.setScale(0.8);
        startBtn.setInteractive();
        startBtn.on('pointerdown', () => this.scene.start('gamePlay'))
        
        let player = this.add.image(w/2, h-170, 'player');
        player.setScale(0.8);

    },
    update: function(){
        // 遊戲狀態更新
        this.bg1.tilePositionX += 3;
        this.bg2.tilePositionX += 2;
        this.bg3.tilePositionX += 1;
        this.footer.tilePositionX += 3;
    }
}
