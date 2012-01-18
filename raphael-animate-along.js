/*

You can copy and paste the below into your codebase somewhere.
As long as Raphael is a global object, it'll just work.

USAGE (same default values for optional parameters as Raphaël's "animate" method)
=====
element.animateAlong({
	path: REQUIRED - Path data string or path element,
	rotate: OPTIONAL - Boolean whether to rotate element with the direction it is moving,
	duration: OPTIONAL - Number in milliseconds
	easing: OPTIONAL - String (see Raphaël's docs)
},
props - Object containing other properties to animate,
callback - Function where the "this" object refers to the element itself
);

EXAMPLE
=======
var rect = paper.rect(50,50,0,0);
rect.animateAlong({
	path: "M0,0L100,100",
	rotate: true,
	duration: 5000,
	easing: 'ease-out'
},
{
	transform: 's0.25',
	opacity: 0
}, function() {
	alert("Our opacity is now:" + this.attr('opacity'));
});

*/

Raphael.el.animateAlong = function(params, props, callback) {
	var element = this,
		paper = element.paper,
		path = params.path,
		rotate = params.rotate,
		duration = params.duration,
		easing = params.easing;

	element.path = 
		typeof path === 'string'
			? paper.path(path)
			: path;
	element.pathLen = element.path.getTotalLength();
	element.rotateWith = rotate;
	
	element.path.attr({
		stroke: 'rgba(0,0,0,0)',
		'stroke-width': 0
	});

	paper.customAttributes.along = function(v) {
		var point = this.path.getPointAtLength(v * this.pathLen);
		
		this.rotateWith && this.rotate(point.alpha);
		
		return {
			x: point.x,
			y: point.y
		};
	};

	if(props instanceof Function) {
		callback = props;
		props = null;
	}
	if(!props) {
		props = {
			along: 1
		};
	} else {
		props.along = 1;	
	}
	
	var startAlong = element.attr('along') || 0;
	
	element.attr({along: startAlong}).animate(props, duration, easing, function() {
		this.path.remove();
		
		callback && callback.call(this);
	});
};