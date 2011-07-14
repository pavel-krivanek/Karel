// See license.txt for license

function TownCanvas(aTown, aCanvasElement) {
  this.town = aTown;
  this.blockSize = 32;
  this.canvas = aCanvasElement;
  // clear background
  this.canvas.height = this.blockSize * (this.town.size+1);
  this.canvas.width = this.blockSize * (this.town.size+1);
//  this.canvas.attr('onSelectStart','return false');
  this.canvas.addEventListener("touchstart", touchHandler, true);
  this.canvas.addEventListener("touchmove", touchHandler, true);
  this.canvas.addEventListener("touchend", touchHandler, true);
//  ctx = $('#townCanvas')[0].getContext('2d');
//  ctx.fillStyle = 'white';
//  ctx.fillRect(0,0,this.blockSize * this.town.size,this.blockSize * this.town.size);
}

function color(red, green, blue)
{
  var decColor = red + 256 * green + 65536 * blue;
  return "#"+decColor.toString(16);
}

TownCanvas.prototype.repaint = function() {
  var ctx = this.canvas.getContext('2d');
  ctx.save();
 
  var offsetX = this.blockSize/2;
  var offsetY = this.blockSize/2;
  
  ctx.fillStyle = '#f1e5e5';
  ctx.fillRect(offsetX+0, offsetY+0, this.blockSize * this.town.size, this.blockSize * this.town.size);
  
  ctx.lineWidth = 1;
 
  ctx.strokeStyle = '#826161';
  
  
  for (var x=0; x<this.town.size; x++) {
    ctx.beginPath();
    ctx.moveTo(offsetX+x*this.blockSize, offsetY+0);
    ctx.lineTo(offsetX+x*this.blockSize, offsetY+this.town.size*this.blockSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(offsetX+0, offsetY+x*this.blockSize);
    ctx.lineTo(offsetX+this.town.size*this.blockSize, offsetY+x*this.blockSize );
    ctx.stroke();
   }
  for (var y = 0; y<this.town.size; y++)
    for (var x = 0; x<this.town.size; x++) {
      if ((town.fields[y][x]) > 0) {
        //marks
        for (var m = 0; m<(town.fields[y][x]); m++) {
          ctx.strokeStyle = '#2333ac';
          ctx.fillStyle = '#666ea4';
            ctx.fillRect(offsetX+x*this.blockSize,offsetY+y*this.blockSize+this.blockSize-(m+1)*4,this.blockSize,4) 
            ctx.strokeRect(offsetX+x*this.blockSize,offsetY+y*this.blockSize+this.blockSize-(m+1)*4,this.blockSize,4) 
          }
        }
      if (town.fields[y][x] == -1) {
        // wall
        ctx.drawImage(images, 5*this.blockSize, 0, this.blockSize, this.blockSize, offsetX+x*this.blockSize, offsetY+y*this.blockSize, this.blockSize, this.blockSize);
      }
  }
  
  for (var x = 0; x<this.town.size+1; x++) {
    ctx.drawImage(images, 5*this.blockSize, 0, this.blockSize, this.blockSize/2, x*this.blockSize, 0, this.blockSize, this.blockSize/2);
    ctx.drawImage(images, 5*this.blockSize, 0, this.blockSize, this.blockSize/2, x*this.blockSize, offsetY+(this.town.size)*this.blockSize, this.blockSize, this.blockSize/2);
  }
  for (var y = 0; y<this.town.size; y++) {
    ctx.drawImage(images, 5*this.blockSize, 0, this.blockSize/2, this.blockSize, 0, offsetY+y*this.blockSize, this.blockSize/2, this.blockSize);
    ctx.drawImage(images, 5*this.blockSize, 0, this.blockSize/2, this.blockSize, offsetX+(this.town.size)*this.blockSize, offsetY+y*this.blockSize, this.blockSize/2, this.blockSize);
  }
  

        
  ctx.drawImage(images, 4*this.blockSize, 0, this.blockSize, this.blockSize, offsetX+town.home.x*this.blockSize, offsetY+town.home.y*this.blockSize, this.blockSize, this.blockSize);
  
  ctx.drawImage(images, town.orientation*this.blockSize, 0, this.blockSize, this.blockSize, offsetX+town.position.x*this.blockSize, offsetY+town.position.y*this.blockSize, this.blockSize, this.blockSize);
  
  ctx.restore();

}

