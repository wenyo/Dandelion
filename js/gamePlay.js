const getRandom = ($min, $max, $notNum) =>{
    const iResult = Math.floor(Math.random() * ($max - $min + 1)) + $min;
    if(iResult == $notNum){
        return getRandom($min, $max, $notNum);
    }else{
        return iResult;
    } 
};
const iDistance = 700;
const iDistance2 = 200;
const iDistance3 = 200;
const iRockNum1 = 10;
const iRockNum2 = 10;
const iRockNum3 = 10;

const gamePlay = {
    key: 'gamePlay',
    preload: function(){
        // 載入資源
        this.load.image('bg1', 'img/bg/bg-front.svg');
        this.load.image('bg2', 'img/bg/bg-middle.svg');
        this.load.image('bg3', 'img/bg/bg-back.svg');
        this.load.image('bg4', 'img/bg/bg-color.svg');
        this.load.image('footer', 'img/bg/footer.png');
        this.load.image('timeIcon','img/items/timeTxt-icon.svg');
        this.load.image('playNote','img/items/txt-countdown.svg');

        this.load.image('rock1','img/items/item-level-1-branch.png');
        this.load.image('rock2','img/items/item-level-1-rock.png');
        this.load.image('rock3','img/items/item-level-2-smoke-lg.png');
        this.load.image('rock4','img/items/item-level-2-smoke-sm.png');
        this.load.image('rock5','img/items/item-level-3-fire-lg.png');
        this.load.image('rock6','img/items/item-level-3-fire-sm.png');
        
        this.load.spritesheet('user', 'img/items/player2.png', {frameWidth: 144, frameHeight: 120});

        this.timeCount = '01:30';
        this.totalTime = 90;
        this.speedLv = 1;
        this.gameStop = false;
        this.iskeyJump = true;
        
        this.vRockLv1 = [];
        this.vRockLv2 = [];
        this.vRockLv3 = [];
        this.masIdx = getRandom(0, iRockNum1-1);
        this.masIdx2 = getRandom(0, iRockNum1-1, this.masIdx);
        this.masIdx3 = getRandom(0, iRockNum2-1);
        this.masIdx4 = getRandom(0, iRockNum2-1, this.masIdx3);
        this.masIdx5 = getRandom(0, iRockNum3-1);
        this.masIdx6 = getRandom(0, iRockNum3-1, this.masIdx5);
    },
    create: function(){
        // 加入物理效果
        const addPhysics = GameObject =>{
            this.physics.add.existing(GameObject);
            GameObject.body.immovable = true;
            GameObject.body.moves = false;
            GameObject.body.setGravityX(300);
            GameObject.body.setGravityY(300);
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
            this.totalTime = parseInt(vTime[0]) * 60 + parseInt(vTime[1]);
            if(this.totalTime <= 0){
                this.gameStop = true;
                clearInterval(gametime);
                this.timeCount = '00:00'
            }else{
                this.totalTime--;
                let iMinute = Math.floor(this.totalTime / 60);
                let iSeconds = this.totalTime % 60;
                iMinute = iMinute < 10 ? '0' + iMinute : iMinute;
                iSeconds = iSeconds < 10 ? '0' + iSeconds : iSeconds;
                this.timeCount = iMinute + ':' + iSeconds;

                if(this.totalTime < 60 && this.totalTime > 40){
                    this.speedLv = 1;
                }else if(this.totalTime < 40 && this.totalTime >= 20){
                    this.speedLv = 1.2;
                }else if(this.totalTime < 20 && this.totalTime >= 0){
                    this.speedLv = 2;
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
        this.user.body.setGravityY(300);
        this.user.body.setGravityX(300);

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

        // const hitRock = (user, rock) => {
        //     console.log('!!')
        // }

        // 設定怪
        let vRockInfo = [
            {
                'name': 'rock1',
                'X': w+iDistance3+150,
                'Y': 120,
                'width': 130,
                'height': 160,
                'size': 1.5
            },
            {
                'name': 'rock2',
                'X': w+iDistance3-50,
                'Y': h-150,
                'width': 160,
                'height': 83,
                'size': 1.5
            },
            {
                'name': 'rock3',
                'X': w+iDistance3+150,
                'Y': h * 0.2,
                'width': 368,
                'height': 192,
                'size': 1
            },
            {
                'name': 'rock4',
                'X': w+iDistance3-50,
                'Y': h * 0.7,
                'width': 200,
                'height': 94,
                'size': 1
            },
            {
                'name': 'rock5',
                'X': w+iDistance3+150,
                'Y': h * 0.5,
                'width': 192,
                'height': 224,
                'size': 1
            },
            {
                'name': 'rock6',
                'X': w+iDistance3-50,
                'Y': h * 0.3,
                'width': 136,
                'height': 152,
                'size': 1
            },
        ];

        // 怪物出現
        let iRockIndex = 0;
        const creatRock = ($min, $max, $vRockStanBy, $iRockNum) => {
            for(let index = 0; index < $iRockNum; index++){
                const iRockInd = getRandom($min, $max);
                const vRock = vRockInfo[iRockInd];
                this['rock'+ iRockIndex] = this.add.tileSprite(vRock['X']+ (iDistance * index) , vRock['Y'], vRock['width'], vRock['height'], vRock['name']);
                addPhysics(this['rock'+ iRockIndex])
                this['rock'+ iRockIndex].setScale(vRock['size']);
                $vRockStanBy.push(this['rock'+ iRockIndex]);
                this.physics.add.collider( this.user, this['rock'+ iRockIndex]);
                iRockIndex++;
            }
        }
        
        creatRock(0 , 1, this.vRockLv1, iRockNum1);
        creatRock(2 , 3, this.vRockLv2, iRockNum2);
        creatRock(4 , 5, this.vRockLv3, iRockNum3);

        this.vRockLv1[this.masIdx].x = w+200;
        this.vRockLv1[this.masIdx2].x = w+700;

        this.vRockLv2[this.masIdx3].x = w+300;
        this.vRockLv2[this.masIdx4].x = w+800;

        this.vRockLv3[this.masIdx5].x = w+100;
        this.vRockLv3[this.masIdx6].x = w+500;
        // 設定要碰撞的對象
        this.physics.add.collider(this.user, this.footer);
    },
    // 遊戲狀態更新
    update: function(){
        if(this.gameStop)return;
        // 背景滾動視差
        this.bg1.tilePositionX += 3 * this.speedLv;
        this.bg2.tilePositionX += 2 * this.speedLv;
        this.bg3.tilePositionX += 1 * this.speedLv;
        this.footer.tilePositionX += 3 * this.speedLv;

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

        // 控制怪的位置
        this.vRockLv1[this.masIdx].x -= 3 * this.speedLv;
        this.vRockLv1[this.masIdx2].x -= 3 * this.speedLv;

        if(this.totalTime <= 60){
            this.vRockLv2[this.masIdx3].x -= 3 * this.speedLv;
            this.vRockLv2[this.masIdx4].x -= 3 * this.speedLv;
        }
        if(this.totalTime <= 30){
            this.vRockLv3[this.masIdx5].x -= 3 * this.speedLv;
            this.vRockLv3[this.masIdx6].x -= 3 * this.speedLv;
        }

        // 檢查是否跑出畫面外
        const resetRockPos = ($ary, $key, $notNum) =>{
            if($ary[$key].x <= -iDistance3){
                $ary[$key].x = w + iDistance3;
                $key = getRandom(0, 9, $notNum);
            }
            return $key;
        }

        this.masIdx = resetRockPos(this.vRockLv1, this.masIdx, this.masIdx2);
        this.masIdx2 = resetRockPos(this.vRockLv1, this.masIdx2, this.masIdx);
        this.masIdx3 = resetRockPos(this.vRockLv2, this.masIdx3, this.masIdx4);
        this.masIdx4 = resetRockPos(this.vRockLv2, this.masIdx4, this.masIdx3);
        this.masIdx5 = resetRockPos(this.vRockLv3, this.masIdx5, this.masIdx6);
        this.masIdx6 = resetRockPos(this.vRockLv3, this.masIdx6, this.masIdx5);


        
        for(let i = 0; i < iRockNum1+iRockNum2+iRockNum3; i++){
            if(this['rock'+ i].x <= -iDistance3){
                this['rock'+ i].x = w+iDistance2;
            }
        }
        //this.rock1.x -= 5 * this.speedLv;
    }
}