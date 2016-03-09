var winW=$(window).width();
var winH=$(window).height();

Showcase = {

    init: function() {
        this.menu = $('#MENUSIDE');
        this.hiddenMenuIcons = this.menu.find('> div > span.MenuSideMainLink > .hiddenIcons');
        this.hiddenLogo = $('#BlueLogo');

        this.menu.height($(window).height());

        this.menu.perfectScrollbar({
            wheelSpeed: 40,
            suppressScrollX: true
        });

        this.bindEvents();

        this.initMenuState();
    },

    bindEvents: function() {
        var $this = this,
        hashedLinksSamples = this.menu.find('a.SubMenuLinkSamples');
        this.menu.on("mouseenter", function() {
            Showcase.highlightMenu();
        })
        .on("mouseleave", function() {
            Showcase.unhighlightMenu();
        });
        
        $('#mobilemenu').on('change', function(e) {
            Showcase.changePageWithLink('showcase/demo/' + $(this).val());
        });

        var hashedLinks = this.menu.find('a.SubMenuLink');
        hashedLinks = hashedLinks.add($('#PFTopLinksCover').children('a.hashed'));
        hashedLinks.on('click', function(e) {
            Showcase.changePageWithLink('showcase/demo/' + $(this).attr('href'));
            e.preventDefault();
        });
        
        hashedLinksSamples.on('click', function(e) {
            Showcase.changePageWithLink($(this).attr('href'));
            e.preventDefault();
        })

        $("#themeSwitcher").on("click",function(){
            $("#GlobalThemeSwitcher").slideDown(500);
        })
        .on("mouseleave",function(){
            $("#GlobalThemeSwitcher").slideUp(1);
        });

        $("#PremiumLayouts").on("click",function(){
            $("#PremiumLayoutsPanel").slideDown(500);
        })
        .on("mouseleave",function(){
            $("#PremiumLayoutsPanel").slideUp(1);
        });

        $("#GlobalThemeSwitcher > a").on("click", function(e) {
            var theme = $(this).data("theme"),
            themeLink = $('link[href$="theme.css"]'),
            newThemeURL =  'showcase/' + 'themes/' + theme + '/theme.css';

            themeLink.attr('href', newThemeURL);
            e.preventDefault();
        });

        $(window).on('hashchange', function (e) {
            if(!Showcase.hashChangeByLink) {
                var hash = window.location.hash;
                if(hash) {
                    Showcase.openPageHash(hash);
                }
            }
            else {
                Showcase.hashChangeByLink = false;
            }
        });

        $(window).on("resize", function() {
            $this.onWinResize();
        });
    },

    changePageWithLink: function(page) {
        if(page === '#') {
            window.location.href = '';
        }
        else if(page.indexOf('http') === 0) {
            window.location.href = page;
        }
        else {
            var newPageHash = page.substring(page.lastIndexOf('/'), page.indexOf('.html'));
            if('#' + newPageHash != window.location.hash) {
                Showcase.hashChangeByLink = true;
                Showcase.openPage(page);
                window.location.hash = newPageHash;
            }
        }
    },

    initMenuState: function() {
        var hash = window.location.hash;
        if(hash) {
            this.openPageHash(hash);
        }
    },

    onWinResize: function() {
        this.menu.height($(window).height());
    },

    highlightMenu: function() {
        this.hiddenMenuIcons.animate({opacity:1}, 250);
        this.hiddenLogo.animate({opacity:1}, 250);
    },

    unhighlightMenu: function() {
        this.hiddenMenuIcons.animate({opacity:0}, 250);
        this.hiddenLogo.animate({opacity:0}, 250);
    },

    openSubMenu: function(header) {
        var $this = this,
        headerJQ = $(header);

        if(this.activeMenu) {
            if(this.activeMenu === header) {
                headerJQ.removeClass('MenuSideMainLinkDark').next().slideUp(500,"easeInOutQuint", function() {
                    $this.menu.perfectScrollbar('update');
                });
                this.activeMenu = null;
            }
            else {
                $(this.activeMenu).removeClass('MenuSideMainLinkDark').next().slideUp(500,"easeInOutQuint", function() {
                    headerJQ.addClass("MenuSideMainLinkDark").next().slideDown(500,"easeInOutQuint", function() {
                        $this.menu.perfectScrollbar('update');
                    });
                });

                this.activeMenu = header;
            }
        }
        else {
            headerJQ.addClass("MenuSideMainLinkDark").next().slideDown(500,"easeInOutQuint", function() {
                    $this.menu.perfectScrollbar('update');
                });
            this.activeMenu = header;
        }
    },

    openPageHash: function(hash) {
        if(hash && hash.length > 1) {
            var plainHash = hash.substring(1),
            root = window.location.href.split('#')[0],
            url = root + 'showcase/demo/' + plainHash + '.html';
            
            this.openPage(url);

            this.menu.find('> div > span.MenuSideMainLink.MenuSideMainLinkDark').removeClass('MenuSideMainLinkDark').next().hide();
            var menuitem = this.menu.find('a.SubMenuLink[href="'+ 'showcase/demo/' + plainHash + '.html"]');
            if(menuitem.length) {
                var submenu = menuitem.parent(),
                submenuTitle = submenu.prev();

                submenu.show();
                submenuTitle.addClass('MenuSideMainLinkDark');
                this.activeMenu = submenuTitle;
            }
        }
    },

    openPage: function(url) {
        //cleanup spa
        $(document.body).children('.ui-notify,.ui-shadow,.ui-growl').remove();
        if(this.pbinterval1) {clearInterval(this.pbinterval1); this.pbinterval1 = null;}
        if(this.pbinterval2) {clearInterval(this.pbinterval2); this.pbinterval2 = null;}
        $(window).off('scroll resize');

        $.get(url, function(content) {
            $('#widgetdemo').html(content);
        });
    }
};

$(function() {
    Showcase.init();

    $.ajaxSetup({
        cache: true
    });
});

/*!
 * jQuery Mousewheel 3.1.12
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));