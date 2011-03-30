/*
 * shiftenter: a jQuery plugin, version: 0.0.1 (2011-03-29)
 * tested on jQuery v1.5.0
 *
 * ShiftEnter is a jQuery plugin that makes it easy to allow submitting a form
 * with textareas using a simple press on 'Enter'. Line breaks (newlines) in
 * these input fields can then be achieved by pressing 'Shift+Enter'.
 * Additionally a hint is shown.
 *
 * For usage and examples, visit:
 * http://cburgmer.github.com/jquery-shiftenter
 *
 * Settings:
 * 
 * $('textarea').shiftenter({
 *     focusClass: 'shiftenter',
 *     inactiveClass: 'shiftenterInactive',
 *     caption: 'Shift+Enter for line break'
 * });
 * 
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2011, Christoph Burgmer (christoph -[at]- nwebs [*dot*] de)
 */
(function($) {
    $.extend({
        shiftenter: {
            settings: {
                focusClass: 'shiftenter',
                inactiveClass: 'shiftenterInactive',
                caption: 'Shift+Enter for line break'
            },
            debug: false,
            log: function(msg){
                if(!$.shiftenter.debug) return;
                msg = "[ShiftEnter] " + msg;
                $.shiftenter.hasFirebug ?
                console.log(msg) :
                $.shiftenter.hasConsoleLog ?
                    window.console.log(msg) :
                    alert(msg);
            },
            hasFirebug: "console" in window && "firebug" in window.console,
            hasConsoleLog: "console" in window && "log" in window.console
        }

    });
    // plugin code
    $.fn.shiftenter = function(opts) {
        opts = $.extend({},$.shiftenter.settings, opts);

        return this.each(function() {
            var $el = $(this);

            // Our goal only makes sense for textareas where enter does not trigger submit
            if(!$el.is('textarea')) {
                $.shiftenter.log('Ignoring non-textarea element');
                return;
            }

            // Wrap so we can apply the caption
            if (opts.caption) {
                $.shiftenter.log('Registered caption');
                $el.wrap('<span class="shiftenter-wrap ' + opts.inactiveClass + '" />');
                $el.after('<span class="shiftenter-text">' + opts.caption + '</span>');
            }

            // Show & Hide caption
            $el.bind('focus.shiftenter', function(){
                $.shiftenter.log('Gained focus');
                $(this).parent().removeClass(opts.inactiveClass).addClass(opts.focusClass);
            });
            $el.bind('blur.shiftenter', function(){
                $.shiftenter.log('Lost focus');
                $(this).parent().removeClass(opts.focusClass).addClass(opts.inactiveClass);
            });

            // Catch return key without shift to submit form
            $el.bind('keydown.shiftenter', function(event) {
                if (event.keyCode === 13 && ! event.shiftKey) {
                    $.shiftenter.log('Got Shift+Enter, submitting');
                    event.preventDefault();
                    $(this).blur();
                    $(this).parents('form').submit();
                    return false;
                }
            });

        });
    };
})(jQuery);
