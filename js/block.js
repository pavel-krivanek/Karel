// See license.txt for license

//////////////////////
// CREATE BLOCK
//////////////////////

var Settings = {
  block: {
    substackIndent: 10,
    substacksSeparatorHeight: 2,
    footerHeight: 18,
  }
}

var DEG = Math.PI/180;

var pressTimer;
var editMouseDown = false;

function makeCompositeBlock(blockDefinition, defaultColor) {
                            //prim, spec, type, color, varprocname){

	var elements = $('<div class="block"></div>');
  var block = elements[0];
  block.definition = blockDefinition;
  block.prim = blockDefinition.name;
  block.spec = blockDefinition.label;
  block.type = blockDefinition.type;
  block.color = blockDefinition.color ? blockDefinition.color : defaultColor;
  block.fcn = window[blockDefinition.name];
	elements.attr('onSelectStart','return false');
	var shape = $('<canvas onclick="void(0)" class="shape"></canvas>'); // for iPhone: onclick = "void(0)"
  elements.append(shape);
	shape.css('z-index', 0);
	
	// PARSE PROCEDURE
  if((blockDefinition.name == 'prim_procedure') || (blockDefinition.name == 'prim_proceduredef')){
    var label = $('<div class="label">'+blockDefinition.varOrProcName+'</div>');
		label.attr('onSelectStart','return false'); //avoid text selection on browser other then Mozilla
    if ((blockDefinition.name == 'prim_proceduredef')) {
      block.firstDrop = true;
      block.onDrop = function(aBlock) {
//        console.log("onDrop")
        
        if (block.firstDrop) {
          block.firstDrop = false;
     
          label.mouseup(function() {
            editMouseDown = false;
            clearTimeout(pressTimer)
            // Clear timeout
            return false;
          })
          label.mousedown(function(event) {
            // Set timeout
              editMouseDown = true;
              pressTimer = setTimeout(function() {
                  editMouseDown = false;
                  var name = prompt("Function name").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/ /g, "&nbsp;");
                  if (name) {
                    block.procname = name;
                    label.html(name)
                    blocksDefinition[2].blocks.push(
                      {
                        name: "prim_procedure",
                        type: " ",
                        label: "custom block",
                        varOrProcName: name,
                      })
                    showBlocks(2);
                  }
              }, 700)
             
            return false; 
          });
          label.mousemove(function(event) {
            if (editMouseDown) {
              editMouseDown = false;
              clearTimeout(pressTimer)
              stackMouseDown(event);
            appMouseMove(event);
            }
            return false;
          })   
        }
      }   
    }
    elements.append(label);
    block.procname = blockDefinition.varOrProcName;
	} else {
	// PARSE SPEC
	var specArray = blockDefinition.label.split(" ");
		for(s in specArray){
			var p = specArray[s];
			if((p.charAt(0) == '%') && (p.length != 1)){
				// ARGUMENT
				var arg;
				if(p.charAt(1) == 'n'){
					arg = $('<input class="arg" value="10" />');
					arg[0].type = 'text';
					arg[0].fcn = window['prim_number'];
				}
				if(p.charAt(1) == 'p'){
					arg = $('<input class="arg" value="10" />');
					arg[0].type = 'text';
					arg[0].fcn = window['prim_number'];
				}
				if(p.charAt(1) == 's'){
					arg = $('<input class="arg" value="10" />');
					arg[0].type = 'text';
					arg[0].fcn = window['prim_number'];
				}
				if(p.charAt(1) == 'b'){
					arg = $('<div class="arg"><canvas class="boolean" /></div>');
					arg.css('z-index', 1);
					arg[0].type = 'text';
					arg[0].fcn = window['prim_boolean'];
				}
				if(p.charAt(1) == 'f'){
					arg = $('<input class="arg" value="10" />');
					arg[0].type = 'text';
					arg[0].fcn = window['prim_number'];
				}
				if((p.charAt(1) == 'v') && (spec == 'set %v to %n')){
					var varLabel = $('<div class="arg">v</div>');
					varLabel.attr('onSelectStart','return false');
					elements.append(varLabel);
					block.varname = varprocname;
				}
				if((p.charAt(1) == 'v') && (spec == 'change %v by %n')){
					var varLabel = $('<div class="arg">v</div>');
					varLabel.attr('onSelectStart','return false');
					elements.append(varLabel);
					block.varname = varprocname;
				}
				if((p.charAt(1) == 'v') && (spec == '%v')){
					var varLabel = $('<div class="label">'+varprocname+'</div>');
					varLabel.attr('onSelectStart','return false');
					elements.append(varLabel);
					block.varname = varprocname;
				}
				
				if(arg != undefined){
          elements.append(arg);
					arg.keydown(function() {
						layoutArg($(this));
						layoutStack($(this).parents('.stack'));
					});
				}
			}else if(p.charAt(0) == '@'){
				// ICON
				var icon = getIcon(p.substring(1,p.length));
				if(icon!= null){
					icon.css('z-index', 5);
					elements.append(icon);
					icon.attr('onSelectStart','return false'); //avoid text selection on browser other then Mozilla
					icon.attr('onDragStart','return false'); //avoid image drag
				}else{
					var label = $('<div class="label">'+p+'</div>');
					label.attr('onSelectStart','return false'); //avoid text selection on browser other then Mozilla
          elements.append(label);
				}
			}else{
				// LABEL
				var label = $('<div class="label">'+p+'</div>');
				label.attr('onSelectStart','return false'); //avoid text selection on browser other then Mozilla
				elements.append(label);
			}
		}
	}
	
	return elements;
}

//////////////////////
// LAYOUT BLOCK
//////////////////////

function layoutBlock(block){ 
	// recurse first
	block.children('.block').each(function(i) {
		layoutBlock($(this));
	});
	
	var curh = 14; 									// block min height
	var top = (block[0].type == 'h') ? 9 : 0;		// block top padding
	var curw = 5;  									// block left padding
	switch(block[0].type) {       
        case 'r': curw = 7; break;
        case 'b': curw = 8; break;
        default: curw = 5;
	}
	
	// measure all args
	block.children('.arg').each(function(i) {
		layoutArg($(this));
	});

	// DRAW BOOLEAN ARG SHAPE
	block.children('[class!=shape]').each(function(i) {
		if($(this).hasClass('arg') && ($(this).children().length > 0)){
			var child = $(this).children()[0];
			$(this).width = 26;
			if(child.tagName == 'CANVAS'){
				child.width = 26;
				child.height = 15;
				var w = 24;
				var h = 12;
				var ctx = child.getContext('2d');
				var color = '#DDDDDD';
				drawBooleanBlockPath(ctx, '#'+colorscale(color, 0.1), w, h, 0, 0);
				drawBooleanBlockPath(ctx, color, w, h, 2, 2);
			}
		}
	});

	// layout horizontally
	block.children('[class!=shape][class!=substack]').each(function(i) {
		var w = $(this)[0].clientWidth;
		var h = $(this)[0].clientHeight;
		if($(this)[0].tagName == 'INPUT'){
			w += 2;
			h += 2;
		}
		// measure height
		if(h > curh){
			curh = h;
		}
		
		$(this).css('left', curw);
		if($(this).hasClass('arg')){
			curw += (w + 6);
		}else{
			curw += (w + 3);
		}
	});
	curh += 4;
	
	// layout vertically
	block.children('[class!=shape]').each(function(i) {
		var h = $(this)[0].clientHeight;
		$(this).css('top', top + (curh/2) - (h/2) + 2);
		if($(this).hasClass('arg')){
			$(this).css('top', top + parseInt($(this).css('top')) - 2);
		}
	});
	if(block[0].type == 'b'){
		curw += 3;
	}
	if(block[0].type == 'h'){
		if(curh < 18){
			curh = 18;
		}else{
			curh -= 1;
		}
	}
	
	var subStackHeight = 25;
  var elseSubStackHeight = 25;
  // substack for c shape
  
  var firstBranch = block.children('.substack')[0];
  var secondBranch = block.children('.substack')[1];
  if (firstBranch) {
    $(firstBranch).css('left', Settings.block.substackIndent + 1);
    $(firstBranch).css('top', curh + 4);
    layoutStack($(firstBranch));
    subStackHeight = Math.max($(firstBranch)[0].clientHeight + 12, 25);
  }
  if (secondBranch) {
    $(secondBranch).css('left', Settings.block.substackIndent + 1);
    $(secondBranch).css('top', curh + 4 +subStackHeight + Settings.block.substacksSeparatorHeight);
    layoutStack($(secondBranch));
    elseSubStackHeight = Math.max($(secondBranch)[0].clientHeight + 12, 25);
  }  
/*	block.children('.substack').each(function(i) {
		$(this).css('left', Settings.block.substackIndent + 1);
    $(this).css('top', curh + 4);
		layoutStack($(this));
		subStackHeight = Math.max($(this)[0].clientHeight + 12, 25);
		//subStackHeight = Math.max($(this).height() + 12, 25);
	})*/
	
	if(block[0].type == 'c'){
		block[0].topHeight = curh;
	}
	if(block[0].type == 'e'){
    block[0].topHeight = curh;
    block[0].elseHeight = curh+subStackHeight+Settings.block.substacksSeparatorHeight;
  }	
	// DRAW SHAPE
	var shape = block.children('.shape')[0];
	var context = shape.getContext('2d');	// label
	var color = block[0].color;
	
	// DIMENSIONS TO USE
	var w = curw;
	var h = curh;
	var radius = 4;
	var notchIndent = 5;
	var notchWidth = 6;
	var notchRadius = 3;
	if(block[0].type == 'r'){
		notchRadius = 0;
	}
	if(block[0].type == 'c'){
		h += subStackHeight;
	}
	if(block[0].type == 'e'){
    h += subStackHeight + elseSubStackHeight + Settings.block.substacksSeparatorHeight;
  }	shape.width = w + 2;
	shape.height = h + notchRadius + 3;
	block.css('width', w + 2);
	block.css('height', h + notchRadius + 3);
	if(block[0].type == 'h'){
		shape.height += 10;
		block.css('height', parseInt(block.css('height')) + 10);
		if(w < 100){
			w = 100;
			shape.width = w + 2;
			block.css('width', w + 2);
		}
	}
	
	// DEBUGGING
	//context.fillStyle = '#00F';
	//context.fillRect(0,0, shape.width, shape.height);
	
	// DRAW BLOCK SHAPE
	if(block[0].type == ' '){
		drawCommandBlockPath(context, '#'+colorscale(color, 3), w + 1, h + 2, radius, notchIndent, notchWidth, notchRadius, 0, 0);
		drawCommandBlockPath(context, '#'+colorscale(color, 1.5), w, h, radius, notchIndent, notchWidth, notchRadius, 0, 1);
		drawCommandBlockPath(context, '#'+colorscale(color, 0.3), w + 1, h + 1, radius, notchIndent, notchWidth, notchRadius, 1, 1);
		drawCommandBlockPath(context, color, w, h, radius, notchIndent, notchWidth, notchRadius, 0, 0);
	} else if(block[0].type == 'r'){
		drawReporterBlockPath(context, '#'+colorscale(color, 3), w + 1, h + 2, 0, 0);
		drawReporterBlockPath(context, '#'+colorscale(color, 1.5), w, h, 0, 1);
		drawReporterBlockPath(context, '#'+colorscale(color, 0.3), w + 1, h + 1, 1, 1);
		drawReporterBlockPath(context, color, w, h, 0, 0);
	} else if(block[0].type == 'b'){
		drawBooleanBlockPath(context, '#'+colorscale(color, 3), w + 1, h + 2, 0, 0);
		drawBooleanBlockPath(context, '#'+colorscale(color, 1.5), w, h, 0, 1);
		drawBooleanBlockPath(context, '#'+colorscale(color, 0.3), w + 1, h + 1, 1, 1);
		drawBooleanBlockPath(context, color, w, h, 0, 0);
	} else if(block[0].type == 'h'){
		drawHatBlockPath(context, '#'+colorscale(color, 3), w + 1, h + 2, radius, notchIndent, notchWidth, notchRadius, 0, 10);
		drawHatBlockPath(context, '#'+colorscale(color, 1.5), w, h, radius, notchIndent, notchWidth, notchRadius, 0, 1);
		drawHatBlockPath(context, '#'+colorscale(color, 0.3), w + 1, h + 1, radius, notchIndent, notchWidth, notchRadius, 1, 1);
		drawHatBlockPath(context, color, w, h, radius, notchIndent, notchWidth, notchRadius, 0, 0);
	} else if(block[0].type == 'c'){
		drawCBlockPath(context, '#'+colorscale(color, 3), w + 1, h + 2, radius, notchIndent, notchWidth, notchRadius, 0, 0, subStackHeight);
		drawCBlockPath(context, '#'+colorscale(color, 1.5), w, h, radius, notchIndent, notchWidth, notchRadius, 0, 1, subStackHeight);
		drawCBlockPath(context, '#'+colorscale(color, 0.3), w + 1, h + 1, radius, notchIndent, notchWidth, notchRadius, 1, 1, subStackHeight);
  	drawCBlockPath(context, color, w, h, radius, notchIndent, notchWidth, notchRadius, 0, 0, subStackHeight);
	} else if(block[0].type == 'e'){
    drawCEBlockPath(context, '#'+colorscale(color, 3), w + 1, h + 2, radius, notchIndent, notchWidth, notchRadius, 0, 0, subStackHeight, elseSubStackHeight);
    drawCEBlockPath(context, '#'+colorscale(color, 1.5), w, h, radius, notchIndent, notchWidth, notchRadius, 0, 1, subStackHeight, elseSubStackHeight);
    drawCEBlockPath(context, '#'+colorscale(color, 0.3), w + 1, h + 1, radius, notchIndent, notchWidth, notchRadius, 1, 1, subStackHeight, elseSubStackHeight);
    drawCEBlockPath(context, color, w, h, radius, notchIndent, notchWidth, notchRadius, 0, 0, subStackHeight, elseSubStackHeight);
  }	
}

function layoutArg(arg){
	var mt = $('#measureText');
	mt.html(arg.val());
	mt[0].style.fontSize = 10;
	var width = (mt[0].clientWidth + 8) + "px";
	if(parseInt(width) > 14){
		arg.css('width', width);
	}else{
		//arg.css('width', 14 + "px");
	}
}

