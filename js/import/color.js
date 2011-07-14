/* This script and many more are available free online at
The JavaScript Source!! http://javascript.internet.com
Created by: Joseph Myers | http://www.codelib.net/ */

function colorscale(hexstr, scalefactor) {
/* declared variables first, in order;
  afterwards, undeclared local variables */
  var r = scalefactor;
  var a, i;
  if (r < 0 || typeof(hexstr) != 'string')
    return hexstr;
    hexstr = hexstr.replace(/[^0-9a-f]+/ig, '');
    if (hexstr.length == 3) {
    a = hexstr.split('');
  } else if (hexstr.length == 6) {
    a = hexstr.match(/(\w{2})/g);
  } else
    return hexstr;
  for (i=0; i<a.length; i++) {
    if (a[i].length == 2)
      a[i] = parseInt(a[i], 16);
    else {
      a[i] = parseInt(a[i], 16);
      a[i] = a[i]*16 + a[i];
  }
}

var maxColor = parseInt('ff', 16);

function relsize(a) {
  if (a == maxColor)
  return Infinity;
  return a/(maxColor-a);
}

function relsizeinv(y) {
  if (y == Infinity)
  return maxColor;
  return maxColor*y/(1+y);
}

for (i=0; i<a.length; i++) {
  a[i] = relsizeinv(relsize(a[i])*r);
  a[i] = Math.floor(a[i]).toString(16);
  if (a[i].length == 1)
  a[i] = '0' + a[i];
}
return a.join('');
}

function showrainbow(f) {
  var colorcell, hex, i, nhex;
  hex = f.orig.value;
  hex = hex.replace(/\W/g, '');
  nhex = colorscale(hex, f.scalef.value-0);
  if (nhex != hex) {
    f.outp.value = nhex;
    colorcell = document.getElementById('origcolor');
    i = document.getElementById('newcolor');
    colorcell.style.background = '#' + hex;
    i.style.background = '#' + nhex;
    for (i=0; i<256; i++) {
      colorcell = document.getElementById('colorcell'+i);
      nhex = colorscale(hex, i/(256-i));
      colorcell.style.background = '#' + nhex;
      colorcell.nhexvalue = nhex;
    }
  }
}

