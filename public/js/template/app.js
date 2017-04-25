/*
 *  Document   : app.js
 *  Author	 : pixelcave
 *  Description: Custom scripts and plugin initializations (available to all pages)
 *
 *  Feel free to remove the plugin initilizations from uiInit() if you would like to
 *  use them only in specific pages. Also, if you remove a js plugin you won't use, make
 *  sure to remove its initialization from uiInit().
 */

var App = function() {

	/* Helper variables - set in uiInit() */
	var page		= $('#page-container'),
		pageContent = $('#page-content'),
		header	  = $('header'),
		sidebar	 = $('#sidebar'),
		sBrand	  = $('#sidebar-brand'),
		sExtraInfo  = $('#sidebar-extra-info'),
		sidebarAlt  = $('#sidebar-alt'),
		sScroll	 = $('#sidebar-scroll'),
		sScrollAlt  = $('#sidebar-scroll-alt');

	/* Sidebar Navigation functionality */
	var handleNav = function() {
		// Get all vital links
		var allLinks = $('.sidebar-nav a', sidebar);
		var menuLinks = $('.sidebar-nav-menu', sidebar);
		var submenuLinks = $('.sidebar-nav-submenu', sidebar);

		// Primary Accordion functionality
		menuLinks.on('click', function(e) {
			var link = $(this);
			var windowW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

			// If we are in mini sidebar mode
			if (page.hasClass('sidebar-visible-lg-mini') && (windowW > 991)) {
				if (link.hasClass('open')) {
					link.removeClass('open');
				} else {
					$('#sidebar .sidebar-nav-menu.open').removeClass('open');
					link.addClass('open');
				}
			} else if (!link.parent().hasClass('active')) {
				if (link.hasClass('open')) {
					link.removeClass('open');
				} else {
					$('#sidebar .sidebar-nav-menu.open').removeClass('open');
					link.addClass('open');
				}
			}

			return false;
		});
	};

	/* Sidebars Functionality */
	var handleSidebar = function(mode) {
		if (mode === 'init') {
			// Init sidebars scrolling functionality
			handleSidebar('sidebar-scroll');
			handleSidebar('sidebar-alt-scroll');

			// Handle main sidebar's scrolling functionality on resize or orientation change
			var sScrollTimeout;

			$(window).on('resize orientationchange', function() {
				clearTimeout(sScrollTimeout);

				sScrollTimeout = setTimeout(function() {
					handleSidebar('sidebar-scroll');
				}, 150);
			});
		} else {
			var windowW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

			if (mode === 'toggle-sidebar') {
				if (windowW > 991) { // Toggle main sidebar in large screens (> 991px)
					if (page.hasClass('sidebar-visible-lg-full')) {
						page.removeClass('sidebar-visible-lg-full').addClass('sidebar-visible-lg-mini');
					} else if (page.hasClass('sidebar-visible-lg-mini')) {
						page.removeClass('sidebar-visible-lg-mini').addClass('sidebar-visible-lg-full');
					} else {
						page.addClass('sidebar-visible-lg-mini');
					}
				} else { // Toggle main sidebar in small screens (< 992px)
					page.toggleClass('sidebar-visible-xs');

					if (page.hasClass('sidebar-visible-xs')) {
						handleSidebar('close-sidebar-alt');
					}
				}

				// Handle main sidebar scrolling functionality
				handleSidebar('sidebar-scroll');
			} else if (mode === 'open-sidebar') {
				if (windowW > 991) { // Open main sidebar in large screens (> 991px)
					page.removeClass('sidebar-visible-lg-mini').addClass('sidebar-visible-lg-full');
				} else { // Open main sidebar in small screens (< 992px)
					page.addClass('sidebar-visible-xs');
					handleSidebar('close-sidebar-alt');
				}
				// Handle main sidebar scrolling functionality
				handleSidebar('sidebar-scroll');
			} else if (mode === 'close-sidebar') {
				if (windowW > 991) { // Close main sidebar in large screens (> 991px)
					page.removeClass('sidebar-visible-lg-full').addClass('sidebar-visible-lg-mini');
				} else { // Close main sidebar in small screens (< 992px)
					page.removeClass('sidebar-visible-xs');
				}

				// Handle main sidebar scrolling functionality
				handleSidebar('sidebar-scroll');
			} else if (mode === 'toggle-sidebar-alt') {
				if (windowW > 991) { // Toggle alternative sidebar in large screens (> 991px)
					page.toggleClass('sidebar-alt-visible-lg');
				} else { // Toggle alternative sidebar in small screens (< 992px)
					page.toggleClass('sidebar-alt-visible-xs');

					if (page.hasClass('sidebar-alt-visible-xs')) {
						handleSidebar('close-sidebar');
					}
				}
			} else if (mode === 'open-sidebar-alt') {
				if (windowW > 991) { // Open alternative sidebar in large screens (> 991px)
					page.addClass('sidebar-alt-visible-lg');
				} else { // Open alternative sidebar in small screens (< 992px)
					page.addClass('sidebar-alt-visible-xs');
					handleSidebar('close-sidebar');
				}
			} else if (mode === 'close-sidebar-alt') {
				if (windowW > 991) { // Close alternative sidebar in large screens (> 991px)
					page.removeClass('sidebar-alt-visible-lg');
				} else { // Close alternative sidebar in small screens (< 992px)
					page.removeClass('sidebar-alt-visible-xs');
				}
			} else if (mode === 'sidebar-scroll') { // Handle main sidebar scrolling
				if (page.hasClass('sidebar-visible-lg-mini') && (windowW > 991)) { // Destroy main sidebar scrolling when in mini sidebar mode
					if (sScroll.length && sScroll.parent('.slimScrollDiv').length) {
						sScroll.slimScroll({
							destroy: true
						});
						sScroll.attr('style', '');
					}
				} else if ((header.hasClass('navbar-fixed-top') || header.hasClass('navbar-fixed-bottom'))) {
					var sHeight = $(window).height() - ((sBrand.css('display') === 'none' ? 0 : sBrand.outerHeight()) + (sExtraInfo.css('display') === 'none' ? 0 : sExtraInfo.outerHeight()));

					if (windowW < 992) {
						sHeight = sHeight - 50;
					}

					if (sScroll.length && (!sScroll.parent('.slimScrollDiv').length)) { // If scrolling does not exist init it..
						sScroll.slimScroll({
							height: sHeight,
							color: '#bbbbbb',
							size: '3px',
							touchScrollStep: 100,
							railVisible: false,
							railOpacity: 1
						});
					} else { // ..else resize scrolling height
						sScroll.add(sScroll.parent()).css('height', sHeight);
					}
				}
			} else if (mode === 'sidebar-alt-scroll') { // Init alternative sidebar scrolling
				if (sScrollAlt.length && (!sScrollAlt.parent('.slimScrollDiv').length)) { // If scrolling does not exist init it..
					sScrollAlt.slimScroll({
						height: sidebarAlt.outerHeight(),
						color: '#bbbbbb',
						size: '3px',
						touchScrollStep: 100,
						railVisible: false,
						railOpacity: 1
					});

					// Resize alternative sidebar scrolling height on window resize or orientation change
					var sScrollAltTimeout;

					$(window).on('resize orientationchange', function() {
						clearTimeout(sScrollAltTimeout);

						sScrollAltTimeout = setTimeout(function() {
							handleSidebar('sidebar-alt-scroll');
						}, 150);
					});
				} else { // ..else resize scrolling height
					sScrollAlt.add(sScrollAlt.parent()).css('height', sidebarAlt.outerHeight());
				}
			}
		}
	};

	return {
		init: function() {
			/* Initialization UI Code */
			handleSidebar('init'); // Initialize sidebars functionality
			handleNav(); // Sidebar navigation functionality

			// Resize #page-content to fill empty space if exists
			$(window).on('resize orientationchange', function() {
				/* Resize #page-content to fill empty space if exists */
				var windowH = $(window).height();
				var headerH = header.outerHeight();
				var sidebarH = sidebar.outerHeight();

				if (header.hasClass('navbar-fixed-top') || header.hasClass('navbar-fixed-bottom')) {
					pageContent.css('min-height', windowH);
				} else if (sidebarH > windowH) {
					pageContent.css('min-height', sidebarH - headerH);
				} else {
					pageContent.css('min-height', windowH - headerH);
				}
			}).resize();

			// Toggles 'open' class on toggle menu
			$('.toggle-menu .submenu').on('click', function() {
				$(this).parent('li').toggleClass('open');
			});

			// Initialize Placeholder (for IE9)
			$('input, textarea').placeholder();

			var pageWrapper = $('#page-wrapper').removeClass('page-loading');
		},

		sidebar: function(mode, extra) {
			handleSidebar(mode, extra); // Handle sidebars - access functionality from everywhere
		}
	};
}();

/* Initialize App when page loads */
$(function() {
	App.init();
});
