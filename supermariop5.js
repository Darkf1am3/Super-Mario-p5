//load images and sounds
{
var marioWalk1;
var marioWalk2;
var marioWalk3;
var marioJump1;
var marioJump2;
var marioJumpSound;
var brickImage;
var itemBlockHit;
var itemBlock1;
var itemBlock2;
var itemBlock3;
var itemBlock4;
var coinImage;
var goombaImage;
var goombaDeadImage;
var stompSound;
var oofSound;
function preload(){
  marioWalk1 = loadImage("sprites/mario/BSMW1.png");
  marioWalk2= loadImage("sprites/mario/BSMW2.png");
  marioWalk3 = loadImage("sprites/mario/BSMW3.png");
  marioJump1 = loadImage("sprites/mario/BSMW4.png");
  marioJump2 = loadImage("sprites/mario/BSMW5.png");
  brickImage = loadImage("sprites/Brick Block.PNG");
  itemBlockHit = loadImage("sprites/Item Block/Item Block Hit.png");
  itemBlock1 = loadImage("sprites/Item Block/Item Block1.png");
  itemBlock2 = loadImage("sprites/Item Block/Item Block2.png");
  itemBlock3 = loadImage("sprites/Item Block/Item Block3.png");
  itemBlock4 = loadImage("sprites/Item Block/Item Block4.png");
  coinImage = loadImage("sprites/coin.png");
  goombaImage = loadImage("sprites/goomba/Goomba.png");
  goombaDeadImage = loadImage("sprites/goomba/Dead Goomba.png");
  soundFormats('mp3', 'wav');
  marioJumpSound = loadSound("sounds/Mario_Jump.wav");
  stompSound = loadSound("sounds/Stomp.wav")
  oofSound = loadSound("sounds/Mario_Hurt.wav")
}
var walkSprite = 0;
}
//key stuff
{
var keys = {};
keyPressed = function(){
  keys[key] = true;
  keys[keyCode] = true;
};
keyReleased = function(){
  keys[key]= false;
  keys[keyCode] = false;
};
}
//mario object
{
var mario = {
  x: 400,
  y: 200,
  xvel: 0,
  yvel: 0,
  grounded: false,
  direction: "left",
  moving: false,
  hurt: false,
  health: 3,
  flicker: 0,
  run: function(){
    this.display();
    this.update();
    this.control();
    this.grounded = false;
  },
  update: function(){
    this.xvel *= 0.95;
    this.xvel = constrain(this.xvel, -4, 4);
    this.x += this.xvel;
    if(this.grounded){
      this.yvel = 0;
    } else{
      this.yvel += 0.25;
    }
    this.y += this.yvel;
  },
  control: function(){
    if(keys[39]||keys.d){
      this.direction =  "right";
      this.xvel += 0.35;
      this.moving = true;
    } else if(keys[37]||keys.a){
      this.direction = "left";
      this.xvel -= 0.35;
      this.moving = true;
    } else{
      this.moving = false;
    }
    if((keys[38]||keys.w)&&this.grounded){
      this.yvel = -9;
      this.y -= 5;
      this.grounded = false;
      marioJumpSound.play();
    }
  },
  display: function(){
    if((!this.hurt)||(this.hurt && this.flicker === 1)){
      applyMatrix();
      translate(this.x, this.y);
      if(this.direction === "left"){
        scale(-1, 1);
      }
      if(this.grounded){
        if(this.moving){
          switch(walkSprite){
            case 0: image(marioWalk1, 0, 0);break;
            case 1: image(marioWalk2, 0, 0);break;
            case 2: image(marioWalk3, 0, 0);break;
            case 3: image(marioWalk2, 0, 0);break;
          }
          if(frameCount%8===0){
            walkSprite ++;
            if(walkSprite === 4){
              walkSprite = 0;
            }
          }
        } else{
          image(marioWalk1, 0, 0)
        }
      } else{
        if(this.yvel<0){
          image(marioJump1, 0, 0);
        } else{
          image(marioJump2, 0, 0)
        }
      }
      resetMatrix();
    }
    if(this.hurt){
      if(this.flicker === 0){
        this.flicker = 1;
      } else{
        this.flicker = 0;
      }
      if(frameCount%120 === 0){
        this.hurt = false;
      }
    }
  },
}
}
//ground stuff
{
var Ground  = function(x, y, width, height){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}
Ground.prototype.run = function(){
  this.display();
  this.collide(mario);
}
Ground.prototype.collide = function(p){
  if(p.x+18>this.x&&p.x+14<this.x+15&&p.y+26>this.y&&p.y-26<this.y+this.height){
    p.xvel = constrain(p.xvel, -4, 0);
  }
  if(p.x-18<this.x+this.width&&p.x-14>this.x+this.width-15&&p.y+26>this.y&&p.y-26<this.y+this.height){
    p.xvel = constrain(p.xvel, 0, 4);
  }
  if(p.y+28>this.y&&p.y+28<this.y+20&&p.x+15>this.x&&p.x-15<this.x+this.width){
    p.grounded = true;
    p.y = this.y-27
  }
  if(p.y-28<this.y+this.height&&p.y-28>this.y+this.height-6&&p.x+15>this.x&&p.x-15<this.x+this.width){
    p.y = this.y+this.height+29;
    p.yvel = 5;
  }
}
Ground.prototype.display = function(){
  fill(209, 148, 62);
  rect(this.x, this.y, this.width, this.height)
}
var testGround = new Ground(100, 400, 500, 100);
var testGround2 = new Ground(550, 300, 250, 300);
var testGround3= new Ground(0, 300, 120, 300);
var grounds = [testGround, testGround2, testGround3];
}
//brick
{
var Brick = function(x, y){
  this.x = x;
  this.y = y;
  this.width = 32;
  this.height = 32;
}
Brick.prototype.run = function(p){
  this.display();
  this.collide(p);
}
Brick.prototype.collide = function(p){
  if(p.x+18>this.x&&p.x+14<this.x+15&&p.y+26>this.y&&p.y-26<this.y+this.height){
    p.xvel = constrain(p.xvel, -4, 0);
  }
  if(p.x-18<this.x+this.width&&p.x-14>this.x+this.width-15&&p.y+26>this.y&&p.y-26<this.y+this.height){
    p.xvel = constrain(p.xvel, 0, 4);
  }
  if(p.y+28>this.y&&p.y+28<this.y+20&&p.x+15>this.x&&p.x-15<this.x+this.width){
    p.grounded = true;
    p.y = this.y-27
  }
  if(p.y-28<this.y+this.height&&p.y-28>this.y+this.height-6&&p.x+15>this.x&&p.x-15<this.x+this.width){
    p.y = this.y+this.height+29;
    p.yvel = 5;
  }
}
Brick.prototype.display = function(){
  applyMatrix();
  translate(this.x+16, this.y+16);
  scale(0.82, 0.82);
  image(brickImage, 0, 0);
  resetMatrix();
}
var testBrick = new Brick(450, 250);
}
//item Block
{
var ItemBlock = function(x, y){
  this.x = x;
  this.y = y;
  this.width = 32;
  this.height = 32;
  this.hit = false;
  this.frame = 1;
}
ItemBlock.prototype.run = function(p){
  this.display();
  this.collide(p);
}
ItemBlock.prototype.collide = function(p){
  if(p.x+18>this.x&&p.x+14<this.x+15&&p.y+26>this.y&&p.y-26<this.y+this.height){
    p.xvel = constrain(p.xvel, -4, 0);
  }
  if(p.x-18<this.x+this.width&&p.x-14>this.x+this.width-15&&p.y+26>this.y&&p.y-26<this.y+this.height){
    p.xvel = constrain(p.xvel, 0, 4);
  }
  if(p.y+28>this.y&&p.y+28<this.y+20&&p.x+15>this.x&&p.x-15<this.x+this.width){
    p.grounded = true;
    p.y = this.y-27
  }
  if(p.y-28<this.y+this.height&&p.y-28>this.y+this.height-6&&p.x+15>this.x&&p.x-15<this.x+this.width){
    p.y = this.y+this.height+29;
    p.yvel = 5;
    this.hit = true;
  }
};
ItemBlock.prototype.display = function(){
  if(this.hit){
    image(itemBlockHit, this.x+16, this.y+16);
  } else{
    applyMatrix();
    translate(this.x+16, this.y+16);
    switch(this.frame){
      case 1: image(itemBlock1, 0, 0);break;
      case 2: image(itemBlock2, 0, 0);break;
      case 3: image(itemBlock3, 0, 0);break;
      case 4: image(itemBlock4, 0, 0);break;
    }
    resetMatrix();
    if(frameCount%6===0){
      this.frame ++;
      if(this.frame === 5){
        this.frame = 1;
      }
    }
  }
}
var testItemBlock = new ItemBlock(250, 250);
}
//coin
{
var Coin = function(x, y){
  this.x = x;
  this.y = y;
  this.width = 25.6;
  this.height = 25.6
}
Coin.prototype.display = function(){
  applyMatrix();
  translate(this.x, this.y);
  scale(0.1, 0.1);
  image(coinImage, 0, 0)
  resetMatrix();
}
}
//goomba
{
var Goomba = function(x, y){
  this.x = x;
  this.y = y;
  this.alive = 0; //will add up when dead so that it will show the dead sprite for a second before splicing
  this.yvel = 0;
  this.side = 1;
  this.canMoveLeft =true;
  this.canMoveRight = true;
  this.speed = -2;
  this.grounded = true;
  this.dead = false;
}
Goomba.prototype.run = function(){
  this.display();
  if(!this.dead){
    this.collide();
    this.x += this.speed;
    if(!this.canMoveRight){
      this.speed = -2;
    }
    if(!this.canMoveLeft){
      this.speed = 2;
    }
    if(!this.grounded){
      this.yvel += 0.25
    } else{
      this.yvel = 0;
    }
    this.y += this.yvel;
    this.canMoveLeft =true;
    this.canMoveRight = true;
    this.grounded = false;
  } else{
    this.alive ++;
  }
};
Goomba.prototype.collide = function(){
  for(var i in grounds){
    var g = grounds[i];
    if(this.y>g.y&&this.y+32<g.y+g.height&&this.x+32>g.x&&this.x+32<g.x+3){
      this.canMoveRight = false;
      this.canMoveLeft = true;
    }
    if(this.y>g.y&&this.y+32<g.y+g.height&&this.x<g.x+g.width&&this.x>g.x+3){
      this.canMoveRight = true;
      this.canMoveLeft = false;
    }
    if(this.y+32>g.y&&this.x+32>g.x+4&&this.x<g.x+g.width-4){
      this.grounded = true;
      this.y = g.y-32;
    }
  }
  var m = mario;
  if(m.y+28>this.y&&m.y+28<this.y+5&&m.x+15>this.x&&m.x-15<this.x+32&&m.yvel>0){
    this.dead = true;
    m.yvel = -9;
    stompSound.play();
  }
  if(this.y+16>m.y-28&&this.y-16<m.y+28&&this.x+32>m.x-15&&this.x<m.x+15&&m.yvel<=0&&!this.dead&&!m.hurt){
    m.hurt = true;
    m.health --;
    oofSound.play();
  }
}
Goomba.prototype.display = function(){
  applyMatrix();
  translate(this.x+16, this.y+16);
  scale(0.5, 0.5);
  if(this.alive === 0){
    if(this.side === 2){
      scale(-1, 1);
    }
    image(goombaImage, 0, 0);
    if(frameCount%15===0){
      if(this.side===1){
        this.side = 2;
      } else{
        this.side = 1;
      }
    }
  } else{
    image(goombaDeadImage, 0,16);
  }
  resetMatrix();
};
var testGoomba = new Goomba(500, 200);
var goombas = [testGoomba]
}
function setup(){
  createCanvas(800, 500);
  imageMode(CENTER);
  marioJumpSound.setVolume(1.5);
}
function draw(){
  background(106, 162, 252);
  for(var i in grounds){
    grounds[i].run();
  }
  for(var i in goombas){
    goombas[i].run();
    if(goombas[i].alive>30){
      goombas.splice(i, 1);
    }
  }
  testItemBlock.run(mario);
  mario.run();
}
