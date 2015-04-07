LGlobal.align = LStageAlign.BOTTOM_TOP;
LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
LSystem.screen(LStage.FULL_SCREEN);

var yMove=250;
var imgData = [  
    {name:"logo",path:"zoomin.png"}
];  
var dataList;
init(30,"legend",660,600+300,main);
var backLayer,tileLayer,ctrlLayer,overLayer,gameoverLayer,selectLayer;
var tileText,overText,gameoverText;
var col,row;
var time = 0;
var checkpoints = [
	["署","暑"],
	["我","找"],
	["春","舂"],
	["龙","尤"],
	["曰","日"]
];
var checkpointNo = 0;
var i0;
var j0;
var i,j;
var partX,partY;
var overTextContent = ["恭喜您，您过关了","进入下一关","重新开始"];
var gameoverTextContent = ["对不起，您失败了","重开关卡"];
var nowLine;
var setTimeLine;
function main(){
	i0 = Math.floor(Math.random()*5);
	j0 = Math.floor(Math.random()*5);

	loadingLayer = new LoadingSample4();  
    addChild(loadingLayer);  
    /**读取图片*/  
    LLoadManage.load(imgData,  
        function(progress){  
            loadingLayer.setProgress(progress);  
        },gameInit);  
}
function gameInit(result){
	dataList=result;
	removeChild(loadingLayer);
	initLayer();
	initCtrl();
	initTile();
}
function initLayer(){
	backLayer = new LSprite();
	addChild(backLayer);
	
	var bitmap;
	bitmap = new LBitmap(new LBitmapData(dataList["logo"]));
	bitmap.scaleX = bitmap.scaleY = 0.8;
	bitmap.x=50;
	bitmap.y=70;
	backLayer.addChild(bitmap);

	labelText = new LTextField();
	labelText.font="微软雅黑";
	labelText.color = "black";
	labelText.weight = "bold";
	labelText.size = 45;
	labelText.x = 170;
	labelText.y = 85;
	labelText.text = "解密陌生人之找不同";
	backLayer.addChild(labelText);
	
	overLayer = new LSprite();
	backLayer.addChild(overLayer);
	
	tileLayer = new LSprite();
	backLayer.addChild(tileLayer);

	ctrlLayer = new LSprite();
	backLayer.addChild(ctrlLayer);
}
function initCtrl(){
	col = 5;
	row = 5;
	addEvent();
	addTimeLine();
}
function initTile(){
	for(i=0;i<row;i++){
		for(j=0;j<col;j++){
			tile();
		}
	}
}
function tile(){
	tileLayer.graphics.drawRect(3,"#D6F1EC",[j*120,i*120+yMove,120,120],true,"#515173");

	var w = checkpoints[checkpointNo][(i==i0 && j==j0) ? 0 : 1];
	tileText = new LTextField();
	tileText.text = w;
	tileText.size = 40;
  	tileText.color = "white";
	tileText.font = "黑体";
	tileText.x = j*120+39 ;
	tileText.y = i*120+39+yMove;
	tileLayer.addChild(tileText);

}
function addEvent(event){
	overLayer = new LSprite();
	backLayer.addChild(overLayer);

	selectLayer = new LSprite();
	backLayer.addChild(selectLayer);

	gameoverLayer = new LSprite();
	backLayer.addChild(gameoverLayer);

	tileLayer.addEventListener(LMouseEvent.MOUSE_DOWN,onDown);
	selectLayer.addEventListener(LMouseEvent.MOUSE_UP,gameReStart);
	gameoverLayer.addEventListener(LMouseEvent.MOUSE_UP,reTry);
}
function gameReStart(){
	i0 = Math.floor(Math.random()*5);
	j0 = Math.floor(Math.random()*5);

	time = 0;

	tileLayer.removeAllChild();
	overLayer.removeAllChild();
	selectLayer.removeAllChild();
	backLayer.removeChild(selectLayer);
	backLayer.removeChild(overLayer);
	if(checkpointNo != checkpoints.length-1){
		checkpointNo++;
	}
	initTile();
	addEvent();
	addTimeLine();
}
function reTry(){
	i0 = Math.floor(Math.random()*5);
	j0 = Math.floor(Math.random()*5);

	time = 0;

	tileLayer.removeAllChild();
	overLayer.removeAllChild();
	gameoverLayer.removeAllChild();
	selectLayer.removeAllChild();
	backLayer.removeChild(selectLayer);
	backLayer.removeChild(overLayer);
	backLayer.removeChild(gameoverLayer);

	initTile();
	addEvent();
	addTimeLine();
}
function addTimeLine(){
	overLayer.graphics.drawRect(5,"dimgray",[610,0+yMove,20,600],true,"lightgray");
	overLayer.graphics.drawLine(15,"#E5E5D9",[620,3+yMove,620,597]);
	overLayer.graphics.drawLine(15,"red",[620,3+yMove,620,597+yMove]);
	setTimeLine = setInterval(function(){drawTimeLine();},250);
}
function drawTimeLine(){
	nowLine=3+(time*(597-3)/20);
	overLayer.graphics.drawLine(15,"lightgray",[620,3+yMove,620,597+yMove]);
	overLayer.graphics.drawLine(15,"red",[620,nowLine+yMove,620,597+yMove]);
	time++;
	if(time>20){
		clearInterval(setTimeLine);
		gameOver();
	}
}
function gameOver(){
	overLayer.graphics.drawRect(5,"dimgray",[(LGlobal.width - 420)*0.5,80+yMove,420,250],true,"#383838");
	gameoverLayer.graphics.drawRect(5,"dimgray",[(LGlobal.width - 250)*0.5,230+yMove,250,50],true,"dimgray");

	for(var i=0;i<gameoverTextContent.length;i++){
		gameoverText = new LTextField();
		gameoverText.weight = "bold";
		gameoverText.color = "white";
		gameoverText.font = "黑体";
		if(i==0){
			gameoverText.text = gameoverTextContent[i];
			gameoverText.size = 35;
			gameoverText.x = (LGlobal.width - gameoverText.getWidth())*0.5;
			gameoverText.y = 120+yMove;
			gameoverLayer.addChild(gameoverText);
		}else if(i==1){
			gameoverText.text = gameoverTextContent[i];
			gameoverText.size = 20;
			gameoverText.x = (LGlobal.width - gameoverText.getWidth())*0.5;
			gameoverText.y = 240+yMove;
			gameoverLayer.addChild(gameoverText);
		}
	}
	tileLayer.removeEventListener(LMouseEvent.MOUSE_DOWN,onDown);
}
function onDown(event){
	var mouseX,mouseY;
	mouseX = event.offsetX;
	mouseY = event.offsetY;

	partX = Math.floor((mouseX)/120);
	partY = Math.floor((mouseY-yMove)/120);
	isTure(partX,partY);
}
function isTure(x,y){
	if(x==j0 && y==i0){
		clearInterval(setTimeLine);
		overLayer.graphics.drawRect(5,"dimgray",[(LGlobal.width - 420)*0.5,80+yMove,420,250],true,"#383838");
		selectLayer.graphics.drawRect(5,"dimgray",[(LGlobal.width - 250)*0.5,230+yMove,250,50],true,"dimgray");

		for(var i=0;i<overTextContent.length;i++){
			overText = new LTextField();
			overText.weight = "bold";
			overText.color = "white";
			overText.font = "黑体";
			if(i==0){
				overText.text = overTextContent[i];
				overText.size = 35;
				overText.x = (LGlobal.width - overText.getWidth())*0.5+5;
				overText.y = 120+yMove;
				overLayer.addChild(overText);
			}else if(i==1){
				if(checkpointNo == checkpoints.length-1){
					overText.text = overTextContent[i+1];
					overText.size = 20;
					overText.x = (LGlobal.width - overText.getWidth())*0.5;
					overText.y = 242+yMove; 
					selectLayer.addChild(overText);
					checkpointNo = 0;
				}else{
					overText.text = overTextContent[i];
					overText.size = 20;
					overText.x = (LGlobal.width - overText.getWidth())*0.5;
					overText.y = 240+yMove;
					selectLayer.addChild(overText);
				}
			}
		}
		tileLayer.removeEventListener(LMouseEvent.MOUSE_DOWN,onDown);
	}
}