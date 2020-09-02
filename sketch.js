/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


Comment for extension:
1. Create Platforms

I have created platforms in different height. Player can jump on the platform to collect items and jump over canyons. The part I found Difficult is that my logic in checkCanyons had a bug, when I jumped on the platform over the canyon, player still fell. Then I add one logic in the if statement of checkCanyon to see whether it is contacted. If it is, then isFalling won't be changed into true. Another difficulty is to check whether my character is just over the platform. Sometimes there are gaps between charater's foot and the platform. I need to test the appropriate distance when returning true on isContacted. The skills I have learnt from creating platforms is using factory function. Through this way, I can push new array items with objects that have unique variables and methods. It is useful when I would like to create numerous objects with methods.





2.Create Enemies

I have created some enemies in the game project. When players get close with the enemies, it will lose one life and go back to the start point. The bit I found difficult in this part is to check the distance between character and enemies, the distance can not be too small. At the begging, I set the distance to be 5px, if always return false. I've done some test and finally found an appropriate distance. The skills I have learnt from creating enemies is to use constructures. Same as factory, constructers can facilitate creating objects with complex methods and variables. Different from factory is that it should use new to create while factory use return objects. In the future, I would practice constructers more to create objects for time saving and code cleaning.

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var canyons;



var tree_x;
var collectables;
var clouds;
var mountains;


var game_score;
var flagpole;
var lives;

var enemies;

var platforms;


var jumpSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
}




function setup()
{
	createCanvas(1024, 576);
    
    createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    startGame();
    lives=3;

}



function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground

    push();
    translate(scrollPos,0);
	// Draw clouds.
    drawClouds();
	// Draw mountains.
    drawMountains();
	// Draw trees.
    drawTrees();
    
    //Draw Platforms
    for(var i=0;i<platforms.length;i++){
        platforms[i].draw();
    }

	// Draw canyons.
    drawCanyon();
	// Draw collectable items.
    for(var i=0;i<collectables.length;i++)
    {
        checkCollectable(collectables[i]);
        if(collectables[i].isFound==false){
            drawCollectable(collectables[i]);
        }
        
    }

    //Draw Flagpole
    renderFlagpole();
    
    //check enemies
    for(var i=0;i<enemies.length;i++){
        enemies[i].draw();
        
        var isContact=enemies[i].checkContact(gameChar_world_x,gameChar_y+6);
        if(isContact){
            if(lives>0){
                lives-=1;
                startGame();
                break;
            }
        }
    }
    
    pop();
    
    //check falling of canyons
    for(var i=0;i<canyons.length;i++)
    {
        checkCanyon(canyons[i]);
    }
    
    // Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	
    // Draw Lives
    fill(255);
    noStroke();
    textSize(20);
    text("score: "+game_score,20,20);
    text("Lives: "+lives,width-100,20);
    for(i=0;i<lives;i++){
        noStroke;
        fill(255,0,0);
        rect(width-50-50*i,40,20,20);
    }

    
    //Check Lives
    if(lives<1){
        fill(255);
        textSize(20);
        text("Game over. Press space to continue.",width/2-100,height/2);
        if(isPlummeting){
            lives=3;
            startGame();
        }
    }else if(flagpole.isReached){
        fill(255);
        textSize(20);
        text("Level complete. Press space to continue.",width/2-100,height/2);
        if(isPlummeting==true){
            lives=3
            startGame();
        }
    }else{
        drawGameChar();
        // Logic to make the game character move or the background scroll.
        if(isLeft)
        {
            if(gameChar_x > width * 0.2)
            {
                gameChar_x -= 1;
            }
            else
            {
                scrollPos += 1;
            }
        }

        if(isRight)
        {
            if(gameChar_x < width * 0.8)
            {
                gameChar_x  += 1;
            }
            else
            {
                scrollPos -= 1; // negative for moving against the background
            }
        }

        
        //    if(gameChar_x<=canyon.x_pos||gameChar_x>=(canyon.x_pos+canyon.width)){
        if(isPlummeting==true&&isFalling==false)
        {
         gameChar_y-=100;   
        }

        
	// Logic to make the game character rise and fall.

        //falling condition
    
        if(gameChar_y<floorPos_y+6)
        {
            var isContact=false;
            for(var i=0;i<platforms.length;i++){
                if(platforms[i].checkContact(gameChar_world_x,gameChar_y-9)){
                    isContact=true;

                    break;
                }
            }
            
            if(isContact==false){
                gameChar_y+=1;
                isFalling = true;
            }else{
                isFalling=false;
           
            }
            
        }
        else
        {
            isFalling=false;
        }
    
        
        if(flagpole.isReached==false)
        {
            checkFlagpole(); 
        }
        // Update real position of gameChar for collision detection.
	   gameChar_world_x = gameChar_x - scrollPos;
    }
    

}




// ---------------------
// Key control functions
// ---------------------

function keyPressed(){


    
    if(keyCode==37){

        isLeft=true;
        
    }else if(keyCode==39){
        
        isRight=true;
    }else if(keyCode==32){
        
        isPlummeting=true;
        
        jumpSound.play();
    }

}



function keyReleased()
{

    if(keyCode==37){

        isLeft=false;
        
    }else if(keyCode==39){

        isRight=false;
    }else if(keyCode=32){
        isPlummeting=false;
    }

}



// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	//the game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
		 //head

				 
        
        stroke(1);
		fill(255,69,0);
		ellipse(gameChar_x,gameChar_y-60,10,15);
		point(gameChar_x-3,gameChar_y-63);
	
		rect(gameChar_x-3,gameChar_y-60,2,4);
		
		//body
		fill(135,206,250);
		rect(gameChar_x-1,gameChar_y-53,4,20);
		
		//arm
		line(gameChar_x-2,gameChar_y-53,gameChar_x-16,gameChar_y-60);
		ellipse(gameChar_x-16,gameChar_y-60,4,4);
	
		
		//legs
		triangle(gameChar_x-1.5,gameChar_y-31,gameChar_x-16.5,gameChar_y-31,gameChar_x-16.5,gameChar_y-36);


	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code

         //head
         stroke(1);
         fill(255,69,0);
         ellipse(gameChar_x,gameChar_y-60,10,15);

         point(gameChar_x+2,gameChar_y-63);
         rect(gameChar_x,gameChar_y-60,2,4);

         //body
         fill(135,206,250);

         rect(gameChar_x-2,gameChar_y-53,4,20);

         //arm

         line(gameChar_x+2,gameChar_y-53,gameChar_x+15,gameChar_y-60);
         ellipse(gameChar_x+16,gameChar_y-60,4,4);

         //legs

         triangle(gameChar_x+2.5,gameChar_y-31,gameChar_x+17.5,gameChar_y-31,gameChar_x+17.5,gameChar_y-36);


		 
	}
	else if(isLeft)
	{
		// add your walking left code
		stroke(1);
		fill(255,160,122);
		ellipse(gameChar_x,gameChar_y-50,10,15);
		point(gameChar_x-3,gameChar_y-53);
	
		triangle(gameChar_x,gameChar_y-45,gameChar_x-3,gameChar_y-48,gameChar_x,gameChar_y-48);
		
		//body
		fill(135,206,250);
		rect(gameChar_x-2,gameChar_y-43,4,20);
		
		//arm
		line(gameChar_x-2,gameChar_y-43,gameChar_x-11,gameChar_y-33);
		ellipse(gameChar_x-12,gameChar_y-30,4,4);
	
		
		//legs
		triangle(gameChar_x,gameChar_y-21,gameChar_x,gameChar_y-6,gameChar_x-4.5,gameChar_y-6);
	}
	else if(isRight)
	{
		// add your walking right code
		//head
		stroke(1);
		fill(255,160,122);
		ellipse(gameChar_x,gameChar_y-50,10,15);
	
		point(gameChar_x+2,gameChar_y-53);
		triangle(gameChar_x,gameChar_y-45,gameChar_x,gameChar_y-48,gameChar_x+3,gameChar_y-48);
		
		//body
		fill(135,206,250);
		rect(gameChar_x-2,gameChar_y-43,4,20);
		
		//arm
	
		line(gameChar_x+2,gameChar_y-43,gameChar_x+10,gameChar_y-32);
		ellipse(gameChar_x+12,gameChar_y-30,4,4);
		
		//legs
	
		triangle(gameChar_x,gameChar_y-21,gameChar_x,gameChar_y-6,gameChar_x+4.5,gameChar_y-6);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		 //head
		 stroke(1);
		 fill(255,69,0);
		 ellipse(gameChar_x,gameChar_y-60,15,15);
		 point(gameChar_x-3,gameChar_y-63);
		 point(gameChar_x+3,gameChar_y-63);
		 rect(gameChar_x-2,gameChar_y-60,2,4);
		 
		 //body
		 fill(135,206,250);
		 rect(gameChar_x-2,gameChar_y-53,4,20);
		 
		 //arm
		 line(gameChar_x-2,gameChar_y-53,gameChar_x-16,gameChar_y-60);
		 ellipse(gameChar_x-16,gameChar_y-60,4,4);
		 line(gameChar_x+2,gameChar_y-53,gameChar_x+15,gameChar_y-60);
		 ellipse(gameChar_x+16,gameChar_y-60,4,4);
		 
		 //legs
		 triangle(gameChar_x-1.5,gameChar_y-31,gameChar_x-16.5,gameChar_y-31,gameChar_x-16.5,gameChar_y-36);
		 triangle(gameChar_x+2.5,gameChar_y-31,gameChar_x+17.5,gameChar_y-31,gameChar_x+17.5,gameChar_y-36);
	}
	else
	{
		// add your standing front facing code
		//head
		stroke(1);
		fill(255,160,122);
		ellipse(gameChar_x,gameChar_y-50,15,15);
		point(gameChar_x-3,gameChar_y-53);
		point(gameChar_x+3,gameChar_y-53);
		triangle(gameChar_x,gameChar_y-45,gameChar_x-3,gameChar_y-48,gameChar_x+3,gameChar_y-48);
		
		//body
		fill(135,206,250);
		rect(gameChar_x-2,gameChar_y-43,4,20);
		
		//arm
		line(gameChar_x-2,gameChar_y-43,gameChar_x-11,gameChar_y-33);
		ellipse(gameChar_x-12,gameChar_y-30,4,4);
		line(gameChar_x+2,gameChar_y-43,gameChar_x+10,gameChar_y-32);
		ellipse(gameChar_x+12,gameChar_y-30,4,4);
		
		//legs
		triangle(gameChar_x-1.5,gameChar_y-21,gameChar_x-1.5,gameChar_y-6,gameChar_x-6,gameChar_y-6);
		triangle(gameChar_x+2.5,gameChar_y-21,gameChar_x+2.5,gameChar_y-6,gameChar_x+7,gameChar_y-6);
		

	}

    
    
    if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 1;
		}
		else
		{
			scrollPos += 1;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 1;
		}
		else
		{
			scrollPos -= 1; // negative for moving against the background
		}

	}
    
    checkPlayerDie();
}




// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    	// Draw clouds.
    for(var i=0;i<clouds.length;i++){
    fill(255,255,255);
    ellipse(clouds[i].x,clouds[i].y,80*clouds[i].size/100,80*clouds[i].size/100);
    ellipse(clouds[i].x-40*clouds[i].size/100,clouds[i].y,60*clouds[i].size/100,60*clouds[i].size/100);
    ellipse(clouds[i].x+40*clouds[i].size/100,clouds[i].y,60*clouds[i].size/100,60*clouds[i].size/100);

    }
}



// Function to draw mountains objects.
function drawMountains()
{
    	// Draw mountains.
        for(var i=0;i<mountains.length;i++){
         
        fill(128,138,135);
        //triangle(625,150,475,432,775,432);
        triangle(mountains[i].x+mountains[i].width/2,mountains[i].y-mountains[i].height,mountains[i].x,mountains[i].y,mountains[i].x+mountains[i].width,mountains[i].y);
        fill(192,192,192);
        //triangle(675,200,550,432,800,432);
        triangle(mountains[i].x+mountains[i].width/2+50,mountains[i].y-mountains[i].height+50,mountains[i].x+75,mountains[i].y,mountains[i].x+mountains[i].width+25,mountains[i].y);
    }
}



// Function to draw trees objects.
function drawTrees()
{
    for(var i=0;i<tree_x.length;i++){
        
        fill(120,100,40);
        //rect(900,282,60,150);
        rect(tree_x[i],floorPos_y-150,60,150);
    
        //branches
        fill(0,155,0);
        //triangle(850,332,930,232,1010,332);
        triangle(tree_x[i]-50,floorPos_y-100,tree_x[i]+30,floorPos_y-200,tree_x[i]+110,floorPos_y-100);
        //triangle(850,282,930,182,1010,282);
        triangle(tree_x[i]-50,floorPos_y-150,tree_x[i]+30,floorPos_y-250,tree_x[i]+110,floorPos_y-150);
    }

}



// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    for(var i=0;i<canyons.length;i++){
         fill(100,155,255);
        noStroke();
        beginShape();
        vertex(canyons[i].x_pos,432);
        vertex(canyons[i].x_pos,1024);
        vertex(canyons[i].x_pos+canyons[i].width,1024);
        vertex(canyons[i].x_pos+canyons[i].width,432);
        endShape();
    
    fill(184,134,11);
    rect(canyons[i].x_pos-10,432,10,592);
    
    rect(canyons[i].x_pos+100,432,10,592);
    }
}


// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    var isContact=false;
    for(var i=0;i<platforms.length;i++){
                if(platforms[i].checkContact(gameChar_world_x,gameChar_y-8)){
                    isContact=true;

                    break;
                }
    }
    
    
    
    if(gameChar_world_x>t_canyon.x_pos&&gameChar_world_x<(t_canyon.x_pos+t_canyon.width)&&!isContact){
        
        if(gameChar_y>=floorPos_y+6){
            isLeft=false;
            isRight=false;
            gameChar_y+=4;
            isFalling=true
        }else if(gameChar_y<floorPos_y+6)
        {
            gameChar_y+=1;
            isFalling=true;
        }
    }
}



// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    fill(255,215,0);
        noStroke();
        beginShape();
        vertex(t_collectable.x_pos,t_collectable.y_pos);
        vertex(t_collectable.x_pos+40*t_collectable.size/100,t_collectable.y_pos);
        vertex(t_collectable.x_pos+60*t_collectable.size/100,t_collectable.y_pos-25*t_collectable.size/100);
        vertex(t_collectable.x_pos+35*t_collectable.size/100,t_collectable.y_pos-15*t_collectable.size/100);
        vertex(t_collectable.x_pos+20*t_collectable.size/100,t_collectable.y_pos-40*t_collectable.size/100);
        vertex(t_collectable.x_pos+5*t_collectable.size/100,t_collectable.y_pos-15*t_collectable.size/100);
        vertex(t_collectable.x_pos-20*t_collectable.size/100,t_collectable.y_pos-25*t_collectable.size/100);
        endShape();
}



// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x,gameChar_y,t_collectable.x_pos,t_collectable.y_pos)<20){
        if(t_collectable.isFound==false){
            game_score+=1;
        }
        t_collectable.isFound = true;
        

    }
}




function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos,floorPos_y,flagpole.x_pos,floorPos_y-250);
    fill(255,0,255);
    noStroke();
    
    if(flagpole.isReached)
    {
        rect(flagpole.x_pos,floorPos_y-250,50,50);
    }
    else
    {
        rect(flagpole.x_pos,floorPos_y-50,50,50);
    }
    

    pop();
    
    
}



function checkFlagpole()
{
    var d=abs(gameChar_world_x-flagpole.x_pos);
    
    if(d<15){
        flagpole.isReached=true;
    }
}



function checkPlayerDie()
{
    
    if(gameChar_y>height){
        lives-=1;
        if(lives>=1){
            startGame();
        }
    }
 
}




function startGame()
{

	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    tree_x = [100,300,500,1000,1300,1800,2000,2300,2700,2900,3300];
    
    collectables=[
        {x_pos:800 ,y_pos:432 ,size:50,isFound:false},
        {x_pos:1000 ,y_pos:floorPos_y-40 ,size:50,isFound:false},
        {x_pos:1100 ,y_pos:432 ,size:50,isFound:false},
        {x_pos:1400 ,y_pos:432 ,size:75,isFound:false},
        {x_pos:1800 ,y_pos:432 ,size:50,isFound:false},
        {x_pos:2000 ,y_pos:432 ,size:75,isFound:false},
        {x_pos:2300 ,y_pos:432 ,size:50,isFound:false},
        {x_pos:2900 ,y_pos:432 ,size:60,isFound:false}
        
    ];
    
    clouds=[
            {x:100,y:100,size:100},
            {x:500,y:200,size:80},
            {x:1000,y:200,size:100},
            {x:1500,y:150,size:50},
            {x:1800,y:250,size:150},
            {x:2200,y:175,size:50},
            {x:2600,y:175,size:50}
           ];
    
    mountains=[
        {x:475,y:floorPos_y,height:182,width:300},
        {x:1000,y:floorPos_y,height:282,width:400},
        {x:1800,y:floorPos_y,height:182,width:200},
        {x:2000,y:floorPos_y,height:182,width:300},
        {x:3200,y:floorPos_y,height:182,width:300}
    ];
    
    canyons=[
        {x_pos:850,width:100},
        {x_pos:1500,width:100},
        {x_pos:2500,width:100},
        {x_pos:2800,width:100}
    ];
    
    
    platforms=[];
    
    platforms.push(createPlatforms(150,floorPos_y-75,100));
    platforms.push(createPlatforms(400,floorPos_y-75,50));
    platforms.push(createPlatforms(600,floorPos_y-60,150));
    platforms.push(createPlatforms(900,floorPos_y-40,150));
    platforms.push(createPlatforms(1500,floorPos_y-60,200));
    platforms.push(createPlatforms(1800,floorPos_y-75,150));
    platforms.push(createPlatforms(2200,floorPos_y-75,100));
    platforms.push(createPlatforms(2500,floorPos_y-60,150));
    platforms.push(createPlatforms(2800,floorPos_y-75,100));
    
    
    enemies=[];
    enemies.push(new Enemy(100,floorPos_y-10,100));
    enemies.push(new Enemy(300,floorPos_y-10,100));
    enemies.push(new Enemy(800,floorPos_y-10,100));
    enemies.push(new Enemy(1200,floorPos_y-10,100));
    enemies.push(new Enemy(1800,floorPos_y-10,100));
    
    
    game_score=0;
    flagpole={isReached: false, x_pos:3500};
    

}



function createPlatforms(x,y,length){
    
    var p = {
        x:x,
        y:y,
        length:length,
        draw: function(){
            fill(255,0,255);
            rect(this.x,this.y,this.length,20);
        },
        checkContact:function(gc_x,gc_y)
        {
            if(gc_x>this.x&&gc_x<(this.x+this.length)){
                var d=this.y-gc_y;
                if(d>=0&&d<5){             
                    return true;
                }

            }
            
            return false;
    
        }
        
        
    }
    
    return p;

}




function Enemy(x,y,range)
{
    this.x=x;
    this.y=y;
    this.range=range;
    
    this.currentX=x;
    this.inc=1;
    
    this.update=function(){
        
        
        this.currentX+=this.inc;
        
        if(this.currentX>=(this.x+this.range)){
            this.inc=-1;
        }else if(this.currentX<this.x){
            this.inc=1;
        }
        
    }
    
    this.draw=function(){
        this.update()
        fill(255,0,0);
        rect(this.currentX,y-10,20,20);
        fill(255,255,0);
        ellipse(this.currentX+5,this.y-5,4);
        ellipse(this.currentX+15,this.y-5,4);
        fill(255,255,255);
        ellipse(this.currentX+10,this.y+5,8,4);

    }
    
    this.checkContact=function(gc_x,gc_y){
        var d=dist(gc_x,gc_y,this.currentX,this.y);
        
        if(d<25){
            return true;
        }
        
        return false;
    }
}