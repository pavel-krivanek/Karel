// See license.txt for license

var icons = [
['playIcon', 'images/playIcon.png'],
['playIconLoop', 'images/playIconLoop.png'],
['lineIcon', 'images/line.png'],
['fellipseIcon', 'images/fellipse.png'],
['tellipseIcon', 'images/tellipse.png'],
['frectIcon', 'images/frect.png'],
['trectIcon', 'images/trect.png'],
['diceIcon', 'images/dice.png'],
['flickrIcon', 'images/flickr.png'],
['colourIcon', 'images/colour.png'],
]

function getIcon(iconName){
	var img = null;
	for(var i=0; i < icons.length; i++){
		if(icons[i][0] == iconName){
			img = $(icons[i][2]).clone();
			$(img).attr('class', 'label');
		}
	}
	return $(img);
}

function preload(arrayOfImages) {
	for(i in arrayOfImages){
        var newImage = new Image();
        newImage.src = arrayOfImages[i];
        icons[i][2] = newImage;
    };
}
