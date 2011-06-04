/*
 * shiftenter: a jQuery plugin, version: 0.0.2 (2011-05-04)
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
 *     hint: 'Shift+Enter for line break'
 * });
 *
 * Optional dependencies:
 *
 *   - needs jquery-resize (http://benalman.com/projects/jquery-resize-plugin/)
 *     to adjust the hint text on textarea resizes (especially for webkit
 *     browsers)
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
                hint: 'Shift+Enter for line break'
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

            // Wrap so we can apply the hint
            if (opts.hint) {
                $.shiftenter.log('Registered hint');
                var $hint = $('<div class="' + opts.inactiveClass + '">' + opts.hint + '</div>').insertAfter($el),
                    reposition = function() {
                        var position = $el.position();

                        // Position hint, relative right bottom corner of textarea
                        $hint.css("left", position.left + $el.outerWidth() - $hint.outerWidth())
                            .css("top", position.top + $el.outerHeight() - $hint.outerHeight());
                    };
                    
                reposition();

                // Show & Hide hint
                $el.bind('focus.shiftenter', function(){
                    $.shiftenter.log('Gained focus');
                    $hint.removeClass(opts.inactiveClass).addClass(opts.focusClass);
                });
                $el.bind('blur.shiftenter', function(){
                    $.shiftenter.log('Lost focus');
                    $hint.removeClass(opts.focusClass).addClass(opts.inactiveClass);
                });
                // Resize wrap (needs jquery-resize)
                $el.bind('resize', function(){
                    reposition();
                });
            }

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
