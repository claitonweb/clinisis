/* Ripple effect on click functionality */
var rippleEffect = function(element, cl) {
	// Add required classes to the element
	element.css({
		'overflow': 'hidden',
		'position': 'relative'
	});

	// On element click
	element.on('click', function(e) {
		var elem = $(this),
			ripple, d, x, y;

		// If the ripple element doesn't exist in this element, add it..
		if (elem.children('.' + cl).length === 0) {
			elem.prepend('<span class="' + cl + '"></span>');
		} else { // ..else remove .animate class from ripple element
			elem.children('.' + cl).removeClass('animate');
		}

		// Get the ripple element
		var ripple = elem.children('.' + cl);

		// If the ripple element doesn't have dimensions set them accordingly
		if (!ripple.height() && !ripple.width()) {
			d = Math.max(elem.outerWidth(), elem.outerHeight());
			ripple.css({
				height: d,
				width: d
			});
		}

		// Get coordinates for our ripple element
		x = e.pageX - elem.offset().left - ripple.width() / 2;
		y = e.pageY - elem.offset().top - ripple.height() / 2;

		// Position the ripple element and add the class .animate to it
		ripple.css({
			top: y + 'px',
			left: x + 'px'
		}).addClass('animate');
	});
};
