 // 这是我们的玩家要躲避的敌人
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.x = Math.round(Math.random()*70);
    this.y = _getRadnom(4, 84, 60);
    this.id = new Date().getTime();

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x += 100 * dt;
    if(this.x>500){
        for(var i = 0, len = allEnemies.length; i < len; i++) {
            if(allEnemies[i]&&this.id === allEnemies[i].id) {
                allEnemies.splice(i, 1);
                break;
            }
        }
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function() {
    this.x = 10;
    this.y = 400;
    this.fail = false;
    this.success = false;
    this.failNum = 0;
    this.diamond = {
        orange: 0,
        blue: 0,
        green: 0
    };
    this.sprite = 'images/char-horn-girl.png';
};

//更新玩家的位置
Player.prototype.update = function(dx, dy) {
    if(dx && ((this.x + dx) > 500 || (this.x + dx) < 0)) return;
    if(dy && ((this.y + dy) > 400 || (this.y + dy) < -85)) return;
    if(dx && this.y < 0 && (this.x + dx < 100 || this.x + dx > 400)) return;
    if(dy && this.y + dy < 0 && (this.x < 100 || this.x > 400)) return;
    if(dy && this.y + dy < 0 && (this.x > 100 || this.x < 400)){
        _DealDom('success');
        player.success = true;
    }
    if(dx && dy < 0 && (this.x + dx > 100 || this.x + dx < 400)){
        _DealDom('success');
        player.success = true;
    }
    if(dx){
        this.x += dx;
    }
    if(dy) {
        this.y += dy;
    }
};

// 用来在屏幕上面画出玩家的位置
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    if(this.fail){
        this.fail = false;
        this.y = 400;
        this.x = _getRadnom(5, 100, 10);
        if(this.failNum+1<=3){
            this.failNum += 1;
            _DealDom('blood');
        }
        this.failNum == 3 && _DealDom('fail');
    }
};

// 玩家输入的参数
Player.prototype.handleInput = function(handleType) {
    var dx,dy;
    var fixedX = 100;
    var fixedY = 85;

    switch(handleType) {
        case 'left':
            dx = -fixedX;
            break;
        case 'up':
            dy = -fixedY;
            break;
        case 'right':
            dx = fixedX;
            break;
        case 'down':
            dy = fixedY;
    }
    this.update(dx, dy);
};

// 实现diamond
var Diamond = function(type, index) {
    var random = index < 2 ? 1 : 2;
    this.x = 328 - 101*random;
    this.y = 116 + 85*index;
    this.type = type;
    this.status = '';
    this.sprites = {
        blue: 'images/Gem Blue.png',
        green: 'images/Gem Green.png',
        orange: 'images/Gem Orange.png'
    };
};

// 用来画出diamond的位置
Diamond.prototype.render = function() {
    var type = this.type;
    if(this.status === 'obtain') {
        player.diamond[type] += 1;
        _DealDom(type);
        _playMusic('bonus');
        this.status = 'hasObtain';
        return;
    }
    this.status !== 'hasObtain' && ctx.drawImage(Resources.get(this.sprites[type]), this.x, this.y, 50, 86);
};

// 随机生成敌人的位置
function _getRadnom(num, fixedData, start) {
    var random = Math.round(Math.random()*10);
    random = random % num;
    random = random===0 ? start : random*fixedData+start;
    return random;
}

// 处理dom
function _DealDom(type) {
    var ali = bonusLi;
    var li;
    if(type === 'orange') {
        li = ali[3];
    }else if(type === 'blue') {
        li = ali[1];
    }else if(type === 'green') {
        li = ali[2];
    }else if(type === 'blood'){
        li = ali[0];
        if(!player.failNum) return;
        for(var i = 0, len = player.failNum; i < len; i++){
            li && (li.getElementsByTagName('span')[2-i].className = 'lose');
        }
    }else if(type === 'fail'){
        document.getElementsByClassName('ending')[0].style.display = 'flex';
        _playMusic('fail');
    }else if(type === 'success'){
        document.getElementsByClassName('ending')[1].style.display = 'flex';
        _playMusic('success');
        uploadData();
    }
    type!== 'blood' && li && (li.getElementsByTagName('span')[0].innerHTML = '×'+player.diamond[type]);
}

// 上传数据
function uploadData() {
    var params = {
        name: sessionStorage.getItem('name'),
        blue: player.diamond['blue']*1,
        green: player.diamond['green']*1,
        orange: player.diamond['orange']*1
    };
    if (!params.name) return;
    $commonMethods.sendReq('/getScore', params, function (data) {
        if(data.code==200){
            console.log(data.message);
        }else{
            alert(data.code+':'+data.message);
        }
    }, 'PUT')
}

 /**
  * 播放音乐
  * @param type
  * @private
  */
 function _playMusic(type) {
    var music = '';
    for(var i = 0, len = musics.length; i < len; i++){
        if(type === 'bonus' && i === 0) continue;
        musics[i].pause();
        musics[i].currentTime = 0;
    }
    if(type === 'begin'){
        music = musics[0];
    }else if(type === 'bonus'){
        music = musics[1];
    }else if(type === 'success'){
        music = musics[3];
    }else if(type === 'fail'){
        music = musics[2];
    }
    music && music.play();
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
window.allEnemies = [];
setInterval(function () {
    var tmp = new Enemy();
    for(var i = 0, len = allEnemies.length;i < len;i++){
        if(tmp.y==allEnemies[i].y && tmp.x+50>allEnemies[i].x-50){
            return;
        }
    }
    window.allEnemies.push(tmp);
}, 2000);
window.player = new Player();

// 实例化diamond
window.diamonds = [];
for(var j = 0; j < 3; j++){
    var types = ['blue', 'green', 'orange'];
    diamonds.push(new Diamond(types[j], j));
}

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

 window.onload = function () {
     // 获取音乐DOM
     window.musics = document.getElementsByTagName('audio');
     // 砖石DOM
     window.bonusLi = document.getElementsByClassName('bonus')[0].getElementsByTagName('li');
 };
