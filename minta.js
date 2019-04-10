var canvas = document.getElementById("myCanvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var mineArray = [];
var numberOfMines = 150;
var xSize=30;
var ySize=20;
var oneSqx = 30;
var oneSqy = 30;
var topLeftX=10;
var topLeftY=10;
var isGray = undefined;

var mouse = {
	x: undefined,
	y: undefined,
	i: undefined,
	j: undefined
}

c.font="20px Arial";

canvas.addEventListener("mousemove", 
        function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
		
	mouse.i = Math.floor((mouse.x - topLeftX) / oneSqx);
	mouse.j = Math.floor((mouse.y - topLeftY) / oneSqy);

	console.log(mouse);
})

canvas.addEventListener("click",
	function(event) {
		if(mouse.i >= 0 && mouse.i < xSize && mouse.j >= 0 && mouse.j < ySize){
			mineArray[mouse.i][mouse.j].clicked();
		}})


function OneMine(i,j,x,y,mine, visible)  {
	this.mine=mine;
	this.visible=visible;
	
	//méret
	this.x = x;
	this.y = y;

	//tömbbeli helyzet
	this.i = i;
	this.j = j;
	
	this.spell = "4";

	//konkrét négyzetek bal felső csúcsa
	this.xPoz=topLeftX+this.i*this.x;
	this.yPoz=topLeftY+this.j*this.y;

	this.draw = function(){
		//c.rect(Xpoz,Ypoz,Xméter,Yméret)
		c.fillStyle="black";
		c.lineWidth = 2;
		c.rect(this.xPoz, this.yPoz, this.x, this.y);
		c.stroke();
		c.textAlign="center";
		c.textBaseline="middle";
		c.fillText(this.spell, this.xPoz+(this.x)/2, topLeftY+this.j*this.y+(this.y)/2);
		
	}

	this.update = function(){
		//if(mouse.x > this.xPoz && mouse.x < this.xPoz + this.x
		//&& mouse.y > this.yPoz && mouse.y < this.yPoz + this.y){
			//az adott négyzetben vagyok

			if(isGray === this) 
		{
			return 0;
		}

			c.fillStyle = "gray";
			//c.clearRect(this.xPoz+4, this.ypoz+4, this.x-4, this.y-4);
			c.fillRect(this.xPoz, this.yPoz, this.x, this.y);
			this.draw();	
			
			if(isGray !== undefined){
				isGray.reset();
			}
			isGray = this;		

		//} 

	}

	this.reset = function(){
		c.clearRect(this.xPoz, this.yPoz, this.x, this.y);
		this.draw();
	}

	this.clicked = function(){
		c.fillStyle = "red";
		c.fillRect(this.xPoz, this.yPoz, this.x, this.y);
	}

	this.setMine = function(){
		this.mine=true;
		this.spell="x";
	}
}
	
function initMines(){

for(var i = 0;i<xSize;i++){
	//oszlopok inicializálása
	mineArray[i]=[];

	for(var j = 0;j<ySize;j++){
		mineArray[i][j]=(new OneMine(i,j,oneSqx,oneSqy,false,false));
}}

randomMine();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function randomMine(){
	
	for(var i = 0; i < numberOfMines ; i++){
		mineArray[getRandomInt(0,xSize)][getRandomInt(0,ySize)].setMine();
	}
}


function drawAll(){

for(var i = 0;i<xSize;i++){
	for(var j = 0;j<ySize;j++){
		mineArray[i][j].draw();
}}

}


function drawBoard(){
	
for(var i = 0;i<xSize+1;i++){
	c.beginPath();
	c.moveTo(topLeftX+oneSqx*i,0);
	c.lineTo(topLeftY+oneSqx*i,oneSqy*ySize);
	c.stroke();
}
	for(var j = 0;j<ySize;j++){
		
	}

}


initMines();
//drawBoard();
drawAll();

function animate(){
	

	requestAnimationFrame(animate);
	//c.clearRect(0,0,innerWidth,innerHeight);
	
	if(mouse.i >= 0 && mouse.i < xSize && mouse.j >= 0 && mouse.j < ySize){
			mineArray[mouse.i][mouse.j].update();
		} else{
			if(isGray !== undefined){
				isGray.reset();
				isGray = undefined;
			}		
		}
}

animate();
