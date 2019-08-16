const getRock = (min, max) =>{
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const gamePlay = {
    key: 'gamePlay',
    preload: function(){
        // 載入資源
        this.load.image('bg1', 'img/bg/bg-front.svg');
        this.load.image('bg2', 'img/bg/bg-middle.svg');
        this.load.image('bg3', 'img/bg/bg-back.svg');
        this.load.image('bg4', 'img/bg/bg-color.svg');
        this.load.image('footer', 'img/bg/footer.png');
        this.load.spritesheet('user', 'img/items/player2.png', {frameWidth: 144, frameHeight: 120});
        this.load.image('timeIcon','img/items/timeTxt-icon.svg');
        this.load.image('playNote','img/items/txt-countdown.svg');

        this.load.image('rock1','img/items/item-level-1-branch.svg');
        this.load.image('rock2','img/items/item-level-1-rock.svg');
        this.load.image('rock3','img/items/item-level-2-smoke-lg.svg');
        this.load.image('rock4','img/items/item-level-2-smoke-sm.svg');
        this.load.image('rock5','img/items/item-level-3-fire-lg.svg');
        this.load.image('rock6','img/items/item-level-3-fire-sm.svg');
        
        this.timeCount = '01:30';
        this.speedLv = 1;
        this.gameStop = false;
        this.iskeyJump = true;
        
        this.iRockNum1 = 5;
        this.iRockNum2 = 4;
        this.iRockNum3 = 4;
        this.vRockLv1 = [];
        this.vRockLv2 = [];
        this.vRockLv3 = [];
        this.iDistance = 1000;
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
        // 角色動畫
        this.anims.create({
            key: 'run-left',
            frames: this.anims.generateFrameNumbers('user', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1 // 無限循環
        })
        this.anims.create({
            key: 'run-right',
            frames: this.anims.generateFrameNumbers('user', { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1 // 無限循環
        })
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('user', { start: 4, end: 5 }),
            frameRate: 5,
            repeat: -1 
        })
        this.anims.create({
            key: 'speed',
            frames: this.anims.generateFrameNumbers('user', { start: 6, end: 7 }),
            frameRate: 5,
            repeat: -1 
        })
        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('user', { start: 8, end: 8 }),
            frameRate: 1,
            repeat: 1 
        })
        this.user.setBounce(1);
        this.user.setCollideWorldBounds(true); //角色邊界限制

        // 設定怪
        let vRockInfo = [
            {
                'name': 'rock1',
                'X': w+200,
                'Y': 120,
                'width': 248,
                'height': 304
            },
            {
                'name': 'rock2',
                'X': w+200,
                'Y': h-163,
                'width': 368,
                'height': 192
            },
            {
                'name': 'rock3',
                'X': w+200,
                'Y': h/2,
                'width': 368,
                'height': 192
            },
            {
                'name': 'rock4',
                'X': w+200,
                'Y': h/2,
                'width': 288,
                'height': 136
            },
            {
                'name': 'rock5',
                'X': w+200,
                'Y': h/2,
                'width': 192,
                'height': 224
            },
            {
                'name': 'rock6',
                'X': w+200,
                'Y': h-300,
                'width': 136,
                'height': 152
            },
        ];

        // 怪物出現
        // Lv1
        for(let iLv1 = 0; iLv1 < this.iRockNum1; iLv1++){
            const iRockInd = getRock(0,1);
            const vRock = vRockInfo[iRockInd];
            this.vRockLv1.push(vRockInfo[iRockInd]);
            this['rock'+ iLv1] = this.add.tileSprite(vRock['X']+ (this.iDistance * iLv1) , vRock['Y'], vRock['width'], vRock['height'], vRock['name']);
            addPhysics(this['rock'+ iLv1])
            this['rock'+ iLv1].setScale(0.8);
            // why怪從左右無法碰撞？？？
            this.physics.add.collider( this.user, this['rock'+iLv1]);
        }


        // 設定要碰撞的對象
        this.physics.add.collider(this.user, this.footer);
    },
    // 遊戲狀態更新
    update: function(){
        if(this.gameStop)return;
        // 背景滾動視差
        this.bg1.tilePositionX += 5 * this.speedLv;
        this.bg2.tilePositionX += 4 * this.speedLv;
        this.bg3.tilePositionX += 3 * this.speedLv;
        this.footer.tilePositionX += 5 * this.speedLv;

        // 監聽鍵盤事件
        const keyboard = this.input.keyboard.createCursorKeys();
        if(keyboard.right.isDown){ // 右
            this.user.flipX = false;
            this.user.setVelocityX(200);
        }else if(keyboard.left.isDown){ // 左
            // this.user.setSize(110, 120, 0);
            this.user.anims.play('run-left', true);
            this.user.flipX = false;
            this.user.setVelocityX(-200);
        }else{ // 回到原位
            this.user.anims.play('run-right', true);
            this.user.setSize(115, 120, 0);
            this.user.flipX = false;
            this.user.setVelocityX(0);
            this.iskeyJump = true;
        }

        if(keyboard.space.isDown){ // 空白鍵
            if(this.iskeyJump){
                this.user.anims.play('up', true);
                this.iskeyJump = false;
                this.user.setVelocityY(-300);
            }
        }

        for(let i = 0; i < this.vRockLv1.length; i++){
            this['rock'+ i].x -= 5 * this.speedLv;
        }
        //this.rock1.x -= 5 * this.speedLv;
    }
}