var canvas = document.getElementById("myCanvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var imageObjects = [];
var mineArray = [];
var nowOpened = [];
var numberOfMines = 70;

//size of the board
var xSize=30;
var ySize=20;

//size of one rectangle
var oneRectX = 30;
var oneRectY = 30;

var topLeftX=canvas.width/2-xSize*oneRectX/2;
//var topLeftX=10;
var topLeftY=10;
var mouseIsOnMe = undefined;
var gameOver = false;

// var flagImg = new Image();
// flagImg.src = "Minesweeper_flag.svg";
//
// var emptyImg = new Image();
// emptyImg.src = "empty.svg";
//
//
// var mineImg = new Image();
// mineImg.src = "mine1.png";

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

	mouse.i = Math.floor((mouse.x - topLeftX) / oneRectX);
	mouse.j = Math.floor((mouse.y - topLeftY) / oneRectY);

	//console.log(mouse);
})

canvas.addEventListener("click",
	function(event) {
		if(mouse.i >= 0 && mouse.i < xSize && mouse.j >= 0 && mouse.j < ySize){
			mineArray[mouse.i][mouse.j].clicked();
		}})


canvas.addEventListener("contextmenu",
	function(event) {
		if(mouse.i >= 0 && mouse.i < xSize && mouse.j >= 0 && mouse.j < ySize){
			event.preventDefault();
			mineArray[mouse.i][mouse.j].rightclicked();
		}})

// window.addEventListener('resize', function(){
// 	canvas.width = window.innerWidth;
// 	canvas.height = window.innerHeight;
//
// 	resized();
// })
//
// function resized() {
// 	drawBoard();
// 	drawAll();
// 	animate();
// }

function loadImages(images, onComplete) {

		    var loaded = 0;

		    function onLoad() {
		        loaded++;
		        if (loaded == images.length) {
		            onComplete();
		        }
		    }

		    for (var i = 0; i < images.length; i++) {
		        var img = new Image();
		        img.addEventListener("load", onLoad);
		        img.src = images[i];
		        imageObjects.push(img);
		    }
		}


loadImages(["images/Minesweeper_flag.svg", "images/empty.svg", "images/mine1.png", "images/onMouse.svg", "images/green_flag.svg", "images/sad.png"], init);


function init() {

	initMines();
	drawBoard();
	drawAll();
	animate();
}

function myNeigh(x,y){
	this.x=x;
	this.y=y;
}

function OneMine(i,j,mine, visible)  {
	this.mine=mine;
	this.visible=visible;
	this.flagged=false;
	this.hasEmptyImage=false;

	//méret
	//this.x = x;
	//this.y = y;

	//tömbbeli helyzet
	this.i = i;
	this.j = j;

	this.spell = "";
	this.numberOfNeighborMines=0;

	//konkrét négyzetek bal felső csúcsa
	this.xPoz=topLeftX+this.i*oneRectX;
	this.yPoz=topLeftY+this.j*oneRectY;
}


OneMine.prototype.setMine = function(){
	this.mine=true;
	//this.spell="x";
}

OneMine.prototype.setVisible = function(){
	this.visible=true;
}

//empties content
OneMine.prototype.reset = function(){
		
		if(!this.flagged) c.clearRect(this.xPoz+1, this.yPoz+1, oneRectX-2, oneRectY-2);
	}

OneMine.prototype.clicked = function(){
	if (this.flagged) {
		return 0;
	}
	if (this.mine == true) {
		gameOver = true;
		openAll();
	}
	nowOpened = [];
	setBlockVisible(this.i,this.j);
	showAllVisibles(this.i,this.j);
}


OneMine.prototype.rightclicked = function(){
	if (!gameOver && !this.visible) {
	if (!this.flagged) {
	c.drawImage(imageObjects[0],this.xPoz+1,this.yPoz+1,oneRectX-2,oneRectY-2);
	this.flagged=true;
} else{
	this.flagged=false;
	//this.reset();
	this.draw();
}
}
}

OneMine.prototype.update = function(){

		if(mouseIsOnMe === this)
	{
		return 0;
	}

		if (!this.flagged && this.hasEmptyImage &&!gameOver) {
			//onMouse image
		c.drawImage(imageObjects[3],this.xPoz+1,this.yPoz+1,oneRectX-2,oneRectY-2);
	} else if (this.flagged && !gameOver) {
		return 0;
	}

		if(mouseIsOnMe !== undefined){
			mouseIsOnMe.reset();
			mouseIsOnMe.draw();
		}
		mouseIsOnMe = this;


}

	OneMine.prototype.draw = function () {
		
		if (!this.flagged) {
			
			this.reset();
			
			if (this.mine==true) {
				
				c.fillStyle = "#FF0000";
				c.fillRect(this.xPoz+1, this.yPoz+1, oneRectX-2,oneRectY-2);
				c.drawImage(imageObjects[2],this.xPoz+1,this.yPoz+1,oneRectX-2,oneRectY-2);
		}

		if (this.visible == true) {
		c.fillStyle="black";
		c.lineWidth = 2;
		//c.rect(this.xPoz, this.yPoz, this.x, this.y);
		c.stroke();
		c.textAlign="center";
		c.textBaseline="middle";

		c.fillText(this.spell, this.xPoz+(oneRectX)/2, topLeftY+this.j*oneRectY+(oneRectY)/2);
	} else {
		this.setemptyImage();
	} 
	 
	if (gameOver && this.flagged) {
				if (this.mine) {
					//happy
					this.reset();
					this.putPicture(4);
				} else if (!this.mine) {
					//sad
					//this.putPicture(5);
					this.reset;
					c.fillStyle = "#FF0000";
					this.putPicture(2);
				}
		}
}
	}

	OneMine.prototype.setemptyImage = function () {
			c.drawImage(imageObjects[1],(this.xPoz)+1,(this.yPoz)+1,oneRectX,oneRectY);
			//c.drawImage(flagImg,this.xPoz+1,this.yPoz+1,oneRectX-2,oneRectY-2);
			this.hasEmptyImage=true;
	}


	OneMine.prototype.countNeighborMines = function () {
		var numberOfNeighborMines=0;
		//megnézni, hogy a pálya szélén vagyok-e
		//pálya mérete: xSize * ySize

		for (var x = -1; x <= 1; x++ ){
			for (var y = -1; y <= 1; y++ ){
				if (x == 0 && y == 0){
					continue;
			 	}
				if ((this.i)+x>=0 && (this.j)+y>=0 && (this.i)+x<xSize && (this.j)+y<ySize) {
					if (mineArray[(this.i)+x][(this.j)+y].mine == true) {
						numberOfNeighborMines++;
					}
			}
		}
		//intet adunk vissza: a körülöttünk lévő aknák számát
		this.numberOfNeighborMines = numberOfNeighborMines;
		
		if (this.numberOfNeighborMines==0) {
				this.spell="";
		} else {
		this.spell=this.numberOfNeighborMines;
		}
		
	}
	}


function showAllVisibles(){
	for (var i = 0; i < nowOpened.length; i++) {
		myX=nowOpened[i].x;
		myY=nowOpened[i].y;

		mineArray[myX][myY].hasEmptyImage=false;
		mineArray[myX][myY].draw();
	}
}


OneMine.prototype.putPicture = function(imageNum) {
	c.drawImage(imageObjects[imageNum],(this.xPoz)+1,(this.yPoz)+1,oneRectX,oneRectY);
}


function setBlockVisible(i,j) {
		if(inBound(i,j)){

		mineArray[i][j].setVisible();

		nowOpened.push(new myNeigh(i,j));
		
		if (mineArray[i][j].numberOfNeighborMines==0) {
			for (var x = -1; x <= 1; x++ ){
				for (var y = -1; y <= 1; y++ ){
					if (x == 0 && y == 0) continue;
					if(inBound(i+x,j+y) && !mineArray[i+x][j+y].visible) setBlockVisible(i+x,j+y);
// 					mineArray[i+x][j+y].setVisible();
					//console.log(i+x,j+y) 
				}
		}} else return 0; 
	}
}


function inBound(x,y){
	if(x>=0&&y>=0&&x<xSize&&y<ySize) return true;
	return false;
}


function getNeighbors(i,j){
			var neighbors=[];
			for (var m = -1; m <= 1; m++ ){
				for (var n = -1; n <= 1; n++ ){
					if (m==0&&n==0) {
						continue;
					}
					if(inBound(i+m,j+n)){
						neighbors.push(new myNeigh(i+m,j+n));
					}
					}}
			return neighbors;
}


function openAll() {
			setAllVisible();
			updateAll();
	}


function setAllVisible() {
		for(var i = 0;i<xSize;i++){
			for(var j = 0;j<ySize;j++){
				mineArray[i][j].visible=true;
		}}

	}


function updateAllMinesNeighborMinesCount(){
	for(var i = 0;i<xSize;i++){
		for(var j = 0;j<ySize;j++){
			mineArray[i][j].countNeighborMines();
	}}
}


function updateAll(){
	for(var i = 0;i<xSize;i++){
		for(var j = 0;j<ySize;j++){
			mineArray[i][j].reset();
			mineArray[i][j].update();
	}}
}


function initMines(){

for(var i = 0;i<xSize;i++){
	//oszlopok inicializálása
	mineArray[i]=[];

	for(var j = 0;j<ySize;j++){
		mineArray[i][j]=(new OneMine(i,j,false,false));
}}

randomMine();
updateAllMinesNeighborMinesCount();
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
		//mineArray[i][j].draw();
		mineArray[i][j].setemptyImage();


}}
}


function drawBoard(){

		for(var i = 0;i<xSize+1;i++){
			c.beginPath();
			c.moveTo(topLeftX+oneRectX*i,topLeftY);
			c.lineTo(topLeftX+oneRectX*i,topLeftY+oneRectY*ySize);
			c.lineWidth = 1;
			c.stroke();
			
		}
		
		
		for(var j = 0;j<ySize+1;j++){
			c.beginPath();
			c.moveTo(topLeftX,topLeftY+oneRectY*j);
			c.lineTo(topLeftX+oneRectY*xSize,topLeftY+oneRectY*j);
			c.stroke();
		}

}



function animate(){


	requestAnimationFrame(animate);
	//c.clearRect(0,0,innerWidth,innerHeight);

	if(mouse.i >= 0 && mouse.i < xSize && mouse.j >= 0 && mouse.j < ySize){
			mineArray[mouse.i][mouse.j].update();
	} else {
		if(mouseIsOnMe !== undefined){
			mouseIsOnMe.reset();
			mouseIsOnMe.draw();
			mouseIsOnMe = undefined;
		}
	}
}
