// See license.txt for license

var thisBlock;

var stacktoloop;
var procs = new Object();
var boxes = new Object();
var wait = false;
var setupstacks;
var playstack;
var cursetupstack;


var procedures;
var mainProcedure;
var currentStackPosition = { procedure: null, position: 0 };
var stack;
var doAfterStack;

var delay = 10;

var townSize = 10;
var maxMarks = 8;

var Town = function()
{
  this.size = townSize;
  this.fields = [];
  this.home = {x: 0, y: this.size-1};
  this.position = {x: 0, y: this.size-1};
  this.orientation = 0; // east
  this.init();
};

Town.prototype.init = function() {
  this.fields = [];
  for (var y=0; y<this.size; y++) {
    var row = [];
    for (var x=0; x<this.size; x++)
      row.push(0);
   this.fields.push(row);
  }
}

Town.prototype.nextPosition = function() {
  var pos = {x: this.position.x, y: this.position.y};
  switch (this.orientation) {
    case 0: pos.x++; break; // east
    case 2: pos.x--; break; // west 
    case 1: pos.y--; break; // north
    case 3: pos.y++; break; // south
    default: break;
  }
  return pos;
}

Town.prototype.isWall = function() {
  var pos = this.nextPosition();
  if ((pos.x <0) || (pos.x>=this.size) || (pos.y <0) || (pos.y>=this.size))
    return true;
  if (this.fields[pos.y][pos.x] == -1)
    return true;
  return false;  
}

Town.prototype.isMark = function() {
  return (this.fields[this.position.y][this.position.x] > 0)  
}

Town.prototype.step = function() {
  if (this.isWall())
    throw "crash"
  this.position = this.nextPosition();
}

Town.prototype.left = function() {
  this.orientation = (this.orientation+1) % 4;
}

Town.prototype.put = function() {
  if ((this.fields[this.position.y][this.position.x]) == maxMarks)
    throw "outofrange"
  this.fields[this.position.y][this.position.x]++;
}

Town.prototype.pick = function() {
  if ((this.fields[this.position.y][this.position.x]) == 0)
    throw "outofrange"
  this.fields[this.position.y][this.position.x]--;
}


Town.prototype.repaint = function() {
  new TownCanvas(this, $("#townCanvas")[0]).repaint(); 
}



var town = new Town();
/*
town.fields = [[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [ 0,-1,-1,-1,-1,-1,-1,-1,-1, 0],
               [ 0, 0, 0,-1, 0, 0, 0,-1, 0,-1],
               [-1,-1, 0, 0, 0,-1, 0,-1, 0, 0],
               [ 0, 0, 0,-1, 0,-1, 0,-1, 0,-1],
               [ 0,-1,-1,-1, 0,-1, 0, 0, 0, 0],
               [ 0, 0, 0,-1,-1,-1, 0,-1,-1, 0],
               [ 0,-1, 0,-1, 0,-1, 0, 0,-1, 0],
               [ 0,-1,-1,-1, 0,-1, 0,-1,-1, 0],
               [ 0,-1, 0, 0, 0, 0, 0, 0,-1, 0],
]
*/
town.home = {x: 0, y: 9};

//town.fields[2][2] = 6;
//town.fields[9][9] = -1;


function resetTown() {
  stop();
  town = new Town();
  town.repaint();
}

function mazeTown() {
  stop();
  town = new Town();
  
  
  
  town.fields = [[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [ 0,-1,-1,-1,-1,-1,-1,-1,-1, 0],
  [ 0, 0, 0,-1, 0, 0, 0,-1, 0,-1],
  [-1,-1, 0, 0, 0,-1, 0,-1, 0, 0],
  [ 0, 0, 0,-1, 0,-1, 0,-1, 0,-1],
  [ 0,-1,-1,-1, 0,-1, 0, 0, 0, 0],
  [ 0, 0, 0,-1,-1,-1, 0,-1,-1, 0],
  [ 0,-1, 0,-1, 0,-1, 0, 0,-1, 0],
  [ 0,-1,-1,-1, 0,-1, 0,-1,-1, 0],
  [ 0,-1, 0, 0, 0, 0, 0, 0,-1, 0],
  ];
  
  town.home = {x: 9, y: 9};
  
  town.repaint();
}


/////////////////////////
// CONNECTIONS
/////////////////////////


function parse(b) {
  var result = [];
  var blocks = [];

  if (b == undefined) return result;

  if ((b.attr('class') == 'stack') || (b.attr('class') == 'substack')) {
    b.children('.block').each(function(i) {
      blocks[i] = this;
    });
  } else {
    blocks[0] = b[0];
  }
  
  result = blocks.map(function(each) {
    var substacks = []
    $(each).children('.substack').each(function(i) {
      substacks[i] = parse($(this));
    });
    var args = []
    $(each).children('.arg, .block').each(function(i) { 
      args[i] = parse($(this));
    });  
    
    return {
      block: each,
      function: each.fcn, 
      arguments: args, 
      substacks: substacks,
      procname: each.procname,
    }
  });
  
//  console.info(result)
    
  return result;
  
  
}

function setupConnections(b){
	if (b == undefined) {return;}
	var blockArray = [];
	if (b.attr('class') == 'stack'){
		b.children('.block').each(function(i) {
			blockArray[i] = this;
		});
	} else {
		blockArray[0] = b[0];
	}
	$(blockArray).each(function(i) {
		var curArg = 1;
		var block = this;
		block.connections = [];
		
		// previous block
		block.connections[0] = $(this).prev()[0];
		
		// arg connections
		if ($(block).children('.arg, .block').length > 0){
			$(block).children('.arg, .block').each(function(i) {
				var arg = this;
				block.connections[curArg] = arg;
				if($(this).hasClass('arg')){
					arg.connections = [];
				}
				if($(this).hasClass('block')){
					setupConnections($(arg));
				}
				curArg++;
			});
		}
		
		// sub stack connections
		if($(block).children('.substack').length > 0){
			$(block).children('.substack').each(function(i){
				var substack = this;
				block.connections[curArg] = $(substack).children()[0];
				setupConnections($(substack));
				curArg++;
			});
		}
		
		// next block
		if($(block).next().attr('class') == 'block'){
			block.connections[curArg] = $(block).next()[0];
		}else{
			block.connections[curArg] = undefined;
		}
	});
}

function findProcsAndBoxes(){
	$('.block').each(function (i){
		var block = $(this)[0];
    if(block.prim=='prim_proceduredef'){
			procs[block.procname] = block; 
		}
		if((block.prim=='prim_setvar') ||
		   (block.prim=='prim_changevar') ||
		   (block.prim=='prim_getvar')){
			boxes[block.varname] = 0;
		}
	});
}

/////////////////////////
// STATE MACHINE
/////////////////////////

function play(){
//	setup();

	$('#playButton').attr('src', 'images/playGreen.png');
	  
	var procStacks = findProcStacks()
 
  procedures = [];
	$(procStacks).each(function(i){
    procedures[i] = parse($(this));
	});  
  
//  console.log("procedures")
//  console.info($(procStacks))
//  console.info(procedures);
	
	// find all setup stacks
	setupstacks = findSetupStacks();
    
  // run first setupstack
	if (setupstacks.length < 1) {
    throw "noStart"
  }

  if (setupstacks.length > 1) {
    throw "moreThanOneStart"
  }
  
  mainProcedure = parse($(setupstacks)[0]);
  
//  console.log("main procedure:")
//  console.info(mainProcedure)  
  
  currentStackPosition = {procedure: mainProcedure, position: 0};
  stack = [];
  doAfterStack = [];
  run()
}

function stop(){
	$('#playButton').attr('src', 'images/playGray.png');
	stacktoloop = undefined;
	thisBlock = undefined;
	if(stack != undefined) while((stack.length>0)&&(stack[stack.length-1]!=procDone)) stack.pop();
}

function runStack(b){
  
  var proc = parse(b);
  
  currentStackPosition = {procedure: proc, position: 0};
  stack = [];
  doAfterStack = [];
  run()  
  
/*  
	if(b == undefined){return;}
	setupConnections(b);
	stack = new Array();
	thisBlock = b.children()[0];
	stacktoloop = b;
	if(b.children('.block')[0].spec == '@playIconLoop'){
		loopSome();
	}else{
		runSome();
	}
	*/
}



function runSome() {
  

    
  var step = function() {
    if (thisBlock != undefined) {
      var b = thisBlock;
      if (thisBlock.connections)
        thisBlock = thisBlock.connections[thisBlock.connections.length-1]
        else thisBlock = undefined;
      $(b).effect("highlight", {color:"#333"}, delay);
      
      b.fcn(b);
      town.repaint();
      
      if (thisBlock == undefined)
        thisBlock = stack.pop();
      setTimeout(step, delay);      
    } else {
      if (stack.length > 0) {
        thisBlock = stack.pop();
        setTimeout(step, delay);      
      }
    }
  }
  
  if (thisBlock != undefined) { step()  };  
  
/*
  var step = function() {
    if (thisBlock != undefined) {
      console.info(thisBlock.connections);
      var b = thisBlock;
      if (thisBlock.connections)
        thisBlock = thisBlock.connections[thisBlock.connections.length-1]
      else thisBloc = undefined;
      $(b).effect("highlight", {color:"#333"}, delay);
      
      b.fcn(b);
      town.repaint();
      
      if (thisBlock == undefined)
        thisBlock = stack.pop();
      setTimeout(step, delay);      
    } else {
      if (stack.length > 0) {
        thisBlock = stack.pop();
        setTimeout(step, delay);      
      }
    }
  }

*/
 /* 
	for(var i=0;i<200;i++){
		if(wait) break;
		while(thisBlock!=undefined){
			var b = thisBlock;
			thisBlock = thisBlock.connections[thisBlock.connections.length-1];
      if (lastBlock) 
        lastBlock.style.border = "0px solid red";
      b.style.border = "1px solid red";
      lastBlock = b;
      
      b.fcn(b);
      town.repaint();
			if(wait) break;
		};
		if(!wait){
      if (stack.length != 0)
        thisBlock = stack.pop();
      if(stack.length==0) break;
			stack.pop()();
		}
	}
	
	if (stack.length>0||thisBlock!=undefined) setTimeout(runSome, 20);
	if((thisBlock == undefined) && (stack.length == 0)){
		cursetupstack += 1;
		if(cursetupstack < setupstacks.length){
			runStack($(setupstacks)[cursetupstack]);
		}else{
			if(playstack != undefined){
				runStack(playstack);
			}else{
				// nothing more to run
				$('#playButton').attr('src', 'images/playGray.png');
			}
		}
	}
*/	
	
}

function loopSome(){
	if(stacktoloop == undefined){return;}
	for(var i=0;i<200;i++){
		if(wait) break;
		while(thisBlock!=undefined){
			var b = thisBlock;
			thisBlock = thisBlock.connections[thisBlock.connections.length-1];
			b.fcn(b);
			if(wait) break;
		};
		if(!wait){
			if(stack.length==0) break;
			stack.pop()();
		}
	}
	//if (stack.length==0||thisBlock==undefined){
	if (thisBlock==undefined){
		thisBlock = stacktoloop.children()[0];
	}
	setTimeout(loopSome, 10);
}

function prim_wait(b){
	wait = true;
	setTimeout(clearWait, getarg(b,1)*1000);
}

function clearWait(){
	wait = false;
}

function getarg(p,dockn){
	var block = p.connections[dockn];
	return block.fcn(block);
}


function prim_stop(b){
	stop();
}

function push() {
  stack.push(currentStackPosition);
  currentStackPosition = {procedure: currentStackPosition.procedure, position: currentStackPosition.position};
  return currentStackPosition
}
 
function pop() {
  currentStackPosition = stack.pop();
  return currentStackPosition;
}

 
 
function processCommand(aCommand) {
  if (!aCommand) return;
  
  ($(aCommand.block)).effect("highlight", {color:"#333"}, delay);
  
  var result = aCommand.function.call(this, aCommand)
  town.repaint();
  return result;
}
 
function run() {
  var command = currentStackPosition.procedure[currentStackPosition.position];
  
/*  
  if (!command && (doAfterStack.length != 0)) {
    doAfterStack.pop().call(this);
    command = currentStackPosition.procedure[currentStackPosition.position];
  }
*/
  
  if (!command && (doAfterStack.length != 0)) {
    do {
      doAfterStack.pop().call(this);
      command = currentStackPosition.procedure[currentStackPosition.position];
    } while (!command)
  }

  if (!command && (stack.length == 0)) 
    return;
  
  processCommand(command);
  
  currentStackPosition.position++;
  
  setTimeout(function(){run();}, delay);
} 

function popAndMove() {
  pop();
  currentStackPosition.position++;
}

function prim_if(c) {
  var bool = processCommand(c.arguments[0][0]);
//  var bool = processCommand(getarg(b,1));

  push();
  if (bool) {
    currentStackPosition.position = -1
    currentStackPosition.procedure = c.substacks[0];
    doAfterStack.push(popAndMove);
  } else {
    pop();
  }
}

function prim_if_else(c) {
  var bool = processCommand(c.arguments[0][0]);
  push();
  if (bool) {
    currentStackPosition.position = -1
    currentStackPosition.procedure = c.substacks[0];
    doAfterStack.push(popAndMove);
  } else {
    currentStackPosition.position = -1
    currentStackPosition.procedure = c.substacks[1];
    doAfterStack.push(popAndMove);
  }
}


function prim_while(c) {
  var bool = processCommand(c.arguments[0][0]);
  push();
  if (bool) {
    currentStackPosition.position = -1
    currentStackPosition.procedure = c.substacks[0];
    doAfterStack.push(pop);
  } else {
    pop();
  }
}

function getProcedure(aName) {
  for (var i=0; i<procedures.length; i++)
    if (procedures[i][0].procname == aName) return procedures[i];
  throw "procedureNotFound"
}
  
function prim_procedure(c) {
  var procedure = getProcedure(c.procname);
//  console.log("procedure:"); console.info(procedure);
  push();
  currentStackPosition.position = -1;
  currentStackPosition.procedure = procedure;
  doAfterStack.push(popAndMove);
}

function prim_proceduredef(c) {  
}

function ifDone(){thisBlock=stack.pop();}

/////////////////////////
// NUMBERS
/////////////////////////

function prim_not(c){
  var bool = processCommand(c.arguments[0][0]);
  return !bool;
}


function prim_step(c) { town.step(); }
function prim_turnleft(c) { town.left(); }
function prim_put(c) { town.put(); }
function prim_pick(c) { town.pick(); }
function prim_iswall(c) { return town.isWall();}
function prim_ismark(c) { return town.isMark();}
function prim_iseast(c) { return town.orientation == 0; }
function prim_isnorth(c) { return town.orientation == 1; }
function prim_iswest(c) { return town.orientation == 2; }
function prim_issouth(c) { return town.orientation == 3; }
function prim_ishome(c) { return (town.position.x == town.home.x) && (town.position.y == town.home.y);}
function prim_stop(c) { stop();}

function procDone(){thisBlock=stack.pop();}

/////////////////////////
// DESIGN BLOCKS
/////////////////////////

function prim_runonce(b){
}



