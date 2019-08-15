const gamePlay = {
    key: 'gamePlay',
    preload: function(){
        // 載入資源
        this.load.image('bg1', 'img/bg/bg-front.svg');
        this.load.image('bg2', 'img/bg/bg-middle.svg');
        this.load.image('bg3', 'img/bg/bg-back.svg');
        this.load.image('bg4', 'img/bg/bg-color.svg');
        this.load.image('footer', 'img/bg/footer.png');
        this.load.spritesheet('user', 'img/items/player.png', {frameWidth: 144, frameHeight: 120});

        this.load.image('rock1Top','img/items/item-level-1-branch.svg');

        this.load.image('timeIcon','img/items/timeTxt-icon.svg');
        this.load.image('playNote','img/items/txt-countdown.svg');
        
        this.timeCount = '01:30';
        this.speedLv = 1;
        this.gameStop = false;
        this.iskeyJump = true;
    },
    create: function(){
        // 加入物理效果
        const addPhysics = GameObject =>{
            this.physics.add.existing(GameObject);
            GameObject.body.immovable = true;
            GameObject.body.moves = false;
        }

        // 資源載入完成，加入遊戲物件及相關設定
        // BG
        this.bg4 = this.add.tileSprite(w/2, h/2, w, h, 'bg4');
        this.bg3 = this.add.tileSprite(w/2, h/2, w, h, 'bg3');
        this.bg2 = this.add.tileSprite(w/2, h/2, w, h, 'bg2');
        this.bg1 = this.add.tileSprite(w/2, h/2, w, h, 'bg1');
        // footer
        this.footer = this.add.tileSprite(w/2, h-45, w, 90, 'footer');
        addPhysics(this.footer);

        //文字設定
        let fontStyle = {   fontFamily: '"Roboto"',
                            fontSize: '25px', 
                            fill: '#FFFFFF',
                            fontStyle: 'bold',
                        }
        this.timeIcon = this.add.sprite(w-120, h-35, "timeIcon");
        this.playNote = this.add.sprite(100, h-38, "playNote");
        this.timeText = this.add.text(w-100, h-50, this.timeCount, fontStyle);
        this.playNote.setScale(0.9);

        let gametime = setInterval(()=>{
            // 將秒數轉換成分鐘
            let vTime = this.timeCount.split(":");
            let iTotal = parseInt(vTime[0]) * 60 + parseInt(vTime[1]);
            if(iTotal <= 0){
                this.gameStop = true;
                clearInterval(gametime);
                this.timeCount = '00:00'
            }else{
                iTotal--;
                let iMinute = Math.floor(iTotal / 60);
                let iSeconds = iTotal % 60;
                iMinute = iMinute < 10 ? '0' + iMinute : iMinute;
                iSeconds = iSeconds < 10 ? '0' + iSeconds : iSeconds;
                this.timeCount = iMinute + ':' + iSeconds;

                if(iTotal < 60 && iTotal > 40){
                    this.speedLv = 1.2;
                }else if(iTotal < 40 && iTotal >= 20){
                    this.speedLv = 2;
                }else if(iTotal < 20 && iTotal >= 0){
                    this.speedLv = 5;
                }
            }
            //重新設定文字
            this.timeText.setText(this.timeCount);
        },1000)

        //設定角色
        this.user_x = 200;
        this.user_y = 200;
        this.user = this.physics.add.sprite(this.user_x, this.user_y, 'user');
        this.user.setScale(0.7);
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('user', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1 // 無限循環
        })
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('user', { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1 
        })
        this.anims.create({
            key: 'speed',
            frames: this.anims.generateFrameNumbers('user', { start: 4, end: 5 }),
            frameRate: 5,
            repeat: -1 
        })
        this.user.setBounce(1);
        this.user.setSize(120, 120, 0);
        this.user.setCollideWorldBounds(true); //角色邊界限制

        // 設定怪
        this.rock1Top = this.add.tileSprite(100 , 120, 250, 300, 'rock1Top');
        this.physics.add.existing(this.rock1Top);
        this.rock1Top.body.immovable = true;
        this.rock1Top.body.moves = false;
        this.rock1Top.setScale(0.8);

        // 設定要碰撞的對象
        this.physics.add.collider(this.user, this.footer);
        this.physics.add.collider(this.user, this.rock1Top);

        //播放動畫
        this.user.anims.play('run', true);
    },
    update: function(){
        if(this.gameStop)return;
        // 遊戲狀態更新
        this.bg1.tilePositionX += 5 * this.speedLv;
        this.bg2.tilePositionX += 4 * this.speedLv;
        this.bg3.tilePositionX += 3 * this.speedLv;
        this.footer.tilePositionX += 5 * this.speedLv;

        const keyboard = this.input.keyboard.createCursorKeys();
        if(keyboard.right.isDown){
            this.user.setSize(145, 120, 0);
            this.user.flipX = false;
            this.user.setVelocityX(200);
        }else if(keyboard.left.isDown){
            this.user.setSize(145, 120, 0);
            this.user.flipX = true;
            this.user.setVelocityX(-200);
        }else if(keyboard.space.isDown){
            if(this.iskeyJump){
                this.user.anims.play('up', true);
                this.iskeyJump = false;
                this.user.setVelocityY(-300);
            }
        }else{
            this.user.anims.play('run', true);
            this.user.setSize(120, 120, 0);
            this.user.flipX = false;
            this.user.setVelocityX(0);
            this.iskeyJump = true;
        }
    }
}