// See license.txt for license

//////////////////////
// DRAW BLOCK SHAPE
//////////////////////

function drawCommandBlockPath(c, color, w, h, radius, notchIndent, notchWidth, notchRadius, shiftX, shiftY){
  c.fillStyle = color;
  c.translate(shiftX,shiftY);
  c.beginPath();
  c.arc(radius, radius, radius, DEG*180, DEG*270, false);
  c.arc(radius + notchIndent + notchRadius, 0, notchRadius, DEG*180, DEG*90, true)
  c.arc(radius + notchIndent + notchWidth + notchRadius, 0, notchRadius, DEG*90, DEG*0, true);
  c.arc(w - radius, radius, radius, DEG*270, DEG*360, false);
  c.arc(w - radius, h - radius, radius, DEG*0, DEG*90, false);
  c.arc(radius + notchIndent + notchWidth + notchRadius, h, notchRadius, DEG*0, DEG*90, false);
  c.arc(radius + notchIndent + notchRadius, h, notchRadius, DEG*90, DEG*180, false);
  c.arc(radius, h - radius, radius, DEG*90, DEG*180, false);
  c.fill();
  c.closePath();
}

function drawHatBlockPath(c, color, w, h, radius, notchIndent, notchWidth, notchRadius, shiftX, shiftY){
  c.fillStyle = color;
  c.translate(shiftX,shiftY);
  c.beginPath();
  c.moveTo(0,0);
  c.bezierCurveTo(20, -13, 60, -13, 80, 0);
  c.arc(w - radius, radius, radius, DEG*270, DEG*360, false);
  c.arc(w - radius, h - radius, radius, DEG*0, DEG*90, false);
  c.arc(radius + notchIndent + notchWidth + notchRadius, h, notchRadius, DEG*0, DEG*90, false);
  c.arc(radius + notchIndent + notchRadius, h, notchRadius, DEG*90, DEG*180, false);
  c.arc(radius, h - radius, radius, DEG*90, DEG*180, false);
  c.fill();
  c.closePath();
}

function drawReporterBlockPath(c, color, w, h, shiftX, shiftY){
  c.fillStyle = color;
  c.translate(shiftX,shiftY);
  c.beginPath();
  c.arc(h/2, h/2, h/2, DEG*90, DEG*270, false);
  c.arc(w - (h/2), h/2, h/2, DEG*270, DEG*450, false);
  c.fill();
  c.closePath();
}

function drawBooleanBlockPath(c, color, w, h, shiftX, shiftY){
  c.fillStyle = color;
  c.translate(shiftX,shiftY);
  c.beginPath();
  c.moveTo(0, h/2);
  c.lineTo(h/2, 0);
  c.lineTo(w - (h/2), 0);
  c.lineTo(w, h/2);
  c.lineTo(w - (h/2), h);
  c.lineTo(h/2, h);
  c.fill();
  c.closePath();
}

function drawCBlockPath(c, color, w, h, radius, notchIndent, notchWidth, notchRadius, shiftX, shiftY, subStackHeight){
  var topHeight = h;
  var middleHeight = subStackHeight;
  var bottomHeight = Settings.block.footerHeight;
  var leftWidth = Settings.block.substackIndent;
  
  c.fillStyle = color;
  c.translate(shiftX,shiftY);
  c.beginPath();

  var row1y = 0;
  var row2y = topHeight - middleHeight;
  var row3y = topHeight - bottomHeight;
  var row4y = topHeight;
  
  
  // 1st row
  c.arc(radius, row1y + radius, radius, DEG*180, DEG*270, false);
  c.arc(radius + notchIndent + notchRadius, row1y, notchRadius, DEG*180, DEG*90, true)
  c.arc(radius + notchIndent + notchWidth + notchRadius, row1y, notchRadius, DEG*90, DEG*0, true);
  c.arc(w - radius, row1y + radius, radius, DEG*270, DEG*360, false);
  
  // 2nd row
  c.arc(w - radius, row2y - notchRadius, radius, DEG*0, DEG*90, false);
  c.arc(leftWidth + radius + notchIndent + notchWidth + notchRadius, row2y + 1, notchRadius, DEG*0, DEG*90, false);
  c.arc(leftWidth + radius + notchIndent + notchRadius, row2y + 1, notchRadius, DEG*90, DEG*180, false);
  c.arc(leftWidth + radius, row2y + 1 + radius, radius, DEG*270, DEG*180, true);

  // 3rd row
  c.arc(leftWidth + radius, row3y + radius, radius, DEG*180, DEG*90, true);
  c.arc(w - radius + 2, row3y + (radius*3), radius, DEG*270, DEG*360, false);

  // 4th row
  c.arc(w - radius, row4y - radius, radius, DEG*0, DEG*90, false);  
  c.arc(radius + notchIndent + notchWidth + notchRadius, row4y, notchRadius, DEG*0, DEG*90, false);
  c.arc(radius + notchIndent + notchRadius, row4y, notchRadius, DEG*90, DEG*180, false);
  c.arc(radius, row4y - radius, radius, DEG*90, DEG*180, false);  
  
  
  c.fill();
  c.closePath();
}

function drawCEBlockPath(c, color, w, h, radius, notchIndent, notchWidth, notchRadius, shiftX, shiftY, subStack1Height, subStack2Height){
  var topHeight = h;
  var middleHeight = subStack1Height;
  var elseHeight = subStack2Height;
  var bottomHeight = Settings.block.footerHeight;
  var separatorHeight = Settings.block.substacksSeparatorHeight;
  var leftWidth = Settings.block.substackIndent;
  
  
  var row1y = 0;
  var row2y = topHeight - elseHeight - separatorHeight - middleHeight ;
  var row3y = topHeight - bottomHeight - elseHeight - separatorHeight;
  var row4y = topHeight - elseHeight;
  var row5y = topHeight - bottomHeight;
  var row6y = topHeight;
  
  c.fillStyle = color;
  c.translate(shiftX,shiftY);
  c.beginPath();

  // 1st row
  c.arc(radius, row1y + radius, radius, DEG*180, DEG*270, false);
  c.arc(radius + notchIndent + notchRadius, row1y, notchRadius, DEG*180, DEG*90, true)
  c.arc(radius + notchIndent + notchWidth + notchRadius, row1y, notchRadius, DEG*90, DEG*0, true);
  c.arc(w - radius, row1y + radius, radius, DEG*270, DEG*360, false);

  // 2nd row
  c.arc(w - radius, row2y - notchRadius, radius, DEG*0, DEG*90, false);
  c.arc(leftWidth + radius + notchIndent + notchWidth + notchRadius, row2y + 1, notchRadius, DEG*0, DEG*90, false);
  c.arc(leftWidth + radius + notchIndent + notchRadius, row2y + 1 , notchRadius, DEG*90, DEG*180, false);
  c.arc(leftWidth + radius, row2y + 1 + radius , radius, DEG*270, DEG*180, true);

  // 3rd row
  c.arc(leftWidth + radius, row3y + radius, radius, DEG*180, DEG*90, true);
  c.arc(w - radius + 2,  row3y + (radius*3), radius, DEG*270, DEG*360, false);
  
  // 4nd row
  c.arc(w - radius, row4y - notchRadius, radius, DEG*0, DEG*90, false);
  c.arc(leftWidth + radius + notchIndent + notchWidth + notchRadius, row4y + 1, notchRadius, DEG*0, DEG*90, false);
  c.arc(leftWidth + radius + notchIndent + notchRadius, row4y + 1, notchRadius, DEG*90, DEG*180, false);
  c.arc(leftWidth + radius, row4y + 1 + radius, radius, DEG*270, DEG*180, true);

  // 5th row
  c.arc(leftWidth + radius, row5y + radius, radius, DEG*180, DEG*90, true);
  c.arc(w - radius + 2, row5y + (radius*3), radius, DEG*270, DEG*360, false);
  
  // 6th row
  c.arc(w - radius, row6y - radius, radius, DEG*0, DEG*90, false);  
  c.arc(radius + notchIndent + notchWidth + notchRadius, row6y, notchRadius, DEG*0, DEG*90, false);
  c.arc(radius + notchIndent + notchRadius, row6y, notchRadius, DEG*90, DEG*180, false);
  c.arc(radius, row6y - radius, radius, DEG*90, DEG*180, false);  
  
  c.fill();
//  c.stroke();
  c.closePath();
}
