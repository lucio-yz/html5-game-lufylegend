LGlobal.align = LStageAlign.BOTTOM_TOP;
LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
LSystem.screen(LStage.FULL_SCREEN);

var yMove=160;
var imgData = [  
    {name:"logo",path:"zoomin.png"}
];  
var dataList;
init(30,"legend",390+16,420+200,main);


var backLayer,chessLayer,overLayer,logoLayer;
var statusText = new LTextField();
var statusContent="查看陌生人信息，先赢我，点击方块开始游戏";
var matrix = [
	[0,0,0],
	[0,0,0],
	[0,0,0]
];
var usersTurn = true;
var step = 0;
var title = "解密陌生人之井字棋";
var introduction = ""
var infoArr = [title,introduction];


function main(){
	
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
	addEvent();
	
	addText();
	addLattice();	
}
function initLayer(){
	backLayer = new LSprite();
	addChild(backLayer);
	
	var bitmap;
	bitmap = new LBitmap(new LBitmapData(dataList["logo"]));
	bitmap.scaleX = bitmap.scaleY = 0.5;
	bitmap.x=30;
	bitmap.y=45;
	backLayer.addChild(bitmap);

	labelText = new LTextField();
	labelText.font="微软雅黑";
	labelText.color = "black";
	labelText.weight = "bold";
	labelText.size = 27;
	labelText.x = 110;
	labelText.y = 58;
	labelText.text = "解密陌生人之井字棋";
	backLayer.addChild(labelText);
	
	overLayer = new LSprite();
	backLayer.addChild(overLayer);
	
	chessLayer = new LSprite();
	backLayer.addChild(chessLayer);
}
function addEvent(){
	backLayer.addEventListener(LMouseEvent.MOUSE_DOWN,onDown);
}
function onDown(event){
	var mouseX,mouseY;
	mouseX = event.offsetX;
	mouseY = event.offsetY;

	var partX = Math.floor(mouseX/130);
	var partY = Math.floor((mouseY-yMove)/130);
	if(matrix[partX][partY]==0){
		usersTurn=false;
		matrix[partX][partY]=-1;//标记
		step++;
		update(partX,partY);//画图
		
		if(win(partX,partY)){
			statusContent = "帅呆了，你赢啦！点击屏幕查看陌生人信息";
			gameover();
			addText();
		}else if(isEnd()){
			statusContent = "平局啦~~点击屏幕重开游戏。";
			gameover();
			addText();
		}else{
			statusContent = "电脑正在思考中……";
			addText();
			computerThink();
		}
	}
}
function addText(){
	statusText.size = 13;	
	statusText.weight = "bold";
	statusText.color = "#383838";
	statusText.text = statusContent;
	statusText.x = (LGlobal.width-statusText.getWidth())*0.5;
	statusText.y = 390+yMove;
	
	overLayer.addChild(statusText);
}
function addLattice(){
	backLayer.graphics.drawRect(10,"#D6F1EC",[0,0+yMove,390,420],true,"#D6F1EC");
	backLayer.graphics.drawRect(10,"#D6F1EC",[0,0+yMove,390,390],true,"#515173");
	for(var i=0;i<3;i++){
		backLayer.graphics.drawLine(3,"#D6F1EC",[130*i,0+yMove,130*i,390+yMove]);
	}
	for(var i=0;i<3;i++){
		backLayer.graphics.drawLine(3,"#D6F1EC",[0,130*i+yMove,390,130*i+yMove]);
	}
}
function update(x,y){
	var v = matrix[x][y];
	if(v<0){
		LTweenLite.to(chessLayer,0.05,{alpha:1,ease:Elastic.easeIn,onComplete:function(){  
			chessLayer.graphics.drawArc(10,"#E5E5D9",[x*130+65,y*130+65+yMove,40,0,2*Math.PI]);
		}});  
	}else if(v>0){
		LTweenLite.to(chessLayer,0.08,{alpha:1,ease:Elastic.easeIn,onComplete:function(){  
			chessLayer.graphics.drawLine(20,"#EA7273",[130*x+30,130*y+30+yMove,130*(x+1)-30,130*(y+1)-30+yMove]);
			chessLayer.graphics.drawLine(20,"#EA7273",[130*(x+1)-30,130*y+30+yMove,130*x+30,130*(y+1)-30+yMove]);
		}});  
	}
}
function computerThink(){
	var b = randomXY();//获取下子方案
	var x = b.x;
	var y = b.y;
	matrix[x][y]=1;
	step++;
	update(x,y);
	
	if(win(x,y)){
		statusContent = "哈哈你输了！点击屏幕重开游戏。";
		gameover();
		addText();
	}else if(isEnd()){
		statusContent = "平局啦~~点击屏幕重开游戏。";
		gameover();
		addText();
	}else{
		statusContent = "该你了！！！";
		addText();
	}
}

function isEnd(){
	return step>=9;
}
function win(x,y){
	if(Math.abs(matrix[x][0]+matrix[x][1]+matrix[x][2])==3){
		return true;
	}
	if(Math.abs(matrix[0][y]+matrix[1][y]+matrix[2][y])==3){
		return true;
	}
	if(Math.abs(matrix[0][0]+matrix[1][1]+matrix[2][2])==3){
		return true;
	}
	if(Math.abs(matrix[2][0]+matrix[1][1]+matrix[0][2])==3){
		return true;
	}
	return false;
}
function randomXY(){
	var x,y;
	//检查是否有制胜棋
	for( var x=0;x<3;x++ ){
		for( var y=0;y<3;y++ ){
			if( matrix[x][y]==0 ){//模拟人放子
				matrix[x][y]=-1;
				if( win(x,y) ){//人可以经这一步获胜
					matrix[x][y]=0;
					return {'x':x,'y':y,'v':1000};
				}
				matrix[x][y]=0;
			}
		} 
	}
	//随机下一棋
	while( 1 ){
		x=Math.floor(Math.random()*3);//结果为0-1间的一个随机数(包括0,不包括1)|参数num为一个数值，函数结果为num的整数部分。
		y=Math.floor(Math.random()*3);
		if( matrix[x][y]==0 ){//可以放子
			return {'x':x,'y':y,'v':1000};
		}
	}
}
function best(){
	var bestx;
	var besty;
	var bestv=0;
	for(var x=0;x<3;x++){
		for(var y=0;y<3;y++){
			if(matrix[x][y]==0){//模拟放子
				matrix[x][y] = 1;
				step++;
				if(win(x,y)){
					step--;
					matrix[x][y] = 0;	
					return {'x':x,'y':y,'v':1000};
				}else if(isEnd()){
					step--;
					matrix[x][y]=0;	
					return {'x':x,'y':y,'v':0};
				}else{
					var v=worst().v;//找到没有办法赢的最好的情况
					step--;
					matrix[x][y]=0;
					if(bestx==null || v>=bestv){
						bestx=x;
						besty=y;
						bestv=v;
					}
				}
			}
		}
	}
	return {'x':bestx,'y':besty,'v':bestv};
}
function worst(){
	var bestx;
	var besty;
	var bestv = 0;
	for(var x=0;x<3;x++){
		for(var y=0;y<3;y++){
			if(matrix[x][y] == 0){
				matrix[x][y] = -1;//模仿对方下
				step++;
				if(win(x,y)){
					step--;
					matrix[x][y] = 0;	
					return {'x':x,'y':y,'v':-1000};
				}else if(isEnd()){
					step--;
					matrix[x][y]=0;	
					return {'x':x,'y':y,'v':0};;
				}else{
					var v=best().v;
					step--;
					matrix[x][y]=0;
					if(bestx==null || v<=bestv){//找到没有办法赢的最好的情况，就是尽量不让他赢的情况
						bestx=x;
						besty=y;
						bestv=v;
					}
				}
				
			}
		}
	}
	return {'x':bestx,'y':besty,'v':bestv};
}
function gameover(){
	backLayer.removeEventListener(LMouseEvent.MOUSE_DOWN,onDown);
	backLayer.addEventListener(LMouseEvent.MOUSE_DOWN,function(){
		chessLayer.removeAllChild();
		backLayer.removeChild(chessLayer);
		backLayer.removeChild(overLayer);
		removeChild(backLayer);
		matrix = [
			[0,0,0],
			[0,0,0],
			[0,0,0]
		];
		step = 0;
		main();
		statusContent = "您先请吧……";
		addText();
	});
}