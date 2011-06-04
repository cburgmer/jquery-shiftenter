$(document).ready(function(){

    module("Keystrokes");

    test("check enter submits form", function() {
        expect(1);

        $('#simplefixture textarea').shiftenter();

        $('#simplefixture form').bind('submit', function() {
            ok(true, "form gets submitted");
        });
        $('#simplefixture textarea').trigger({
            type: 'keydown',
            keyCode: 13
        });
    });

    test("check shift+enter doesn't submit form", function() {
        expect(0);

        $('#simplefixture textarea').shiftenter();

        $('#simplefixture form').bind('submit', function() {
            ok(false, "form mustn't get submitted");
        });
        $('#simplefixture textarea').trigger({
            type: 'keydown',
            keyCode: 13,
            shiftKey: true
        });
    });

    if (typeof(document.createEvent("KeyboardEvent").initKeyEvent) != 'undefined') {
        test("check shift+enter generates line breaks", function() {
            expect(1);

            $('#simplefixture textarea').shiftenter();

            $('#simplefixture form').bind('submit', function() {
                ok(false, "form mustn't get submitted");
            });

            var field = $('textarea');
            field.focus();
            var keyEvent = document.createEvent("KeyboardEvent");
            // Shift+Enter
            /*
            if (typeof(keyEvent.initKeyboardEvent) != 'undefined') {
                // https://bugs.webkit.org/show_bug.cgi?id=16735
                keyEvent.initKeyboardEvent("keypress", true, true, null, false, false, true, false, 13, 0);
            } else { */
                keyEvent.initKeyEvent("keypress", true, true, null, false, false, true, false, 13, 0);
            /*}*/
            
            var old_text = field.val();
            field[0].dispatchEvent(keyEvent);
            
            equal(field.val(), old_text + '\n', "should have a final line break");

        });
    }
    
    module("Hint");

    test("check hint visibility", function() {
        expect(2);
        
        $('#simplefixture textarea').shiftenter();

        ok(! $('#simplefixture .shiftenter-text').is(':visible'), "hint is hidden by default");

        $('#simplefixture textarea').focus();
        ok($('#simplefixture .shiftenter').is(':visible'), "hint shows on focus");

    });

    test("check hint text", function() {
        expect(1);
        
        var msg = 'test message';
        $('#simplefixture textarea').shiftenter({'hint': msg}).focus();

        equal($('#simplefixture .shiftenter').text(), msg, "hint setting should be honoured");
    });

    module("Size");

    test("check positioning is in textarea's bounds", function() {
        expect(4);
        
        $('#simplefixture textarea').shiftenter().focus();

        ok($('#simplefixture .shiftenter').position().left >= $('#simplefixture textarea').position().left, "left margin is inside textarea");
        ok($('#simplefixture .shiftenter').position().top >= $('#simplefixture textarea').position().top, "top margin is inside textarea");
        ok($('#simplefixture .shiftenter').position().left + $('#simplefixture .shiftenter').outerWidth() 
           <= $('#simplefixture textarea').position().left + $('#simplefixture textarea').outerWidth(), "right margin is inside textarea");
        ok($('#simplefixture .shiftenter').position().top + $('#simplefixture .shiftenter').outerHeight() 
           <= $('#simplefixture textarea').position().top + $('#simplefixture textarea').outerHeight(), "bottom margin is inside textarea");

    });

    asyncTest("check increasing size keeps hint position", function() {
        expect(12);
        
        $('#simplefixture textarea').shiftenter().focus();
        
        var position_right  = ($('#simplefixture textarea').position().left + $('#simplefixture textarea').outerWidth()
                              - $('#simplefixture .shiftenter').position().left + $('#simplefixture .shiftenter').outerWidth()),
            position_bottom = ($('#simplefixture textarea').position().top + $('#simplefixture textarea').outerHeight()
                               - $('#simplefixture .shiftenter').position().top + $('#simplefixture .shiftenter').outerHeight());

        $('#simplefixture textarea').width($('#simplefixture textarea').width() + 100).trigger("resize");
        setTimeout(function() {
        // Check bounds
        ok($('#simplefixture .shiftenter').position().left >= $('#simplefixture textarea').position().left, "left margin is inside textarea");
        ok($('#simplefixture .shiftenter').position().top >= $('#simplefixture textarea').position().top, "top margin is inside textarea");
        ok($('#simplefixture .shiftenter').position().left + $('#simplefixture .shiftenter').outerWidth() 
           <= $('#simplefixture textarea').position().left + $('#simplefixture textarea').outerWidth(), "right margin is inside textarea");
        ok($('#simplefixture .shiftenter').position().top + $('#simplefixture .shiftenter').outerHeight() 
           <= $('#simplefixture textarea').position().top + $('#simplefixture textarea').outerHeight(), "bottom margin is inside textarea");
        // Check position relative to bottom right corner
        equal($('#simplefixture textarea').position().left + $('#simplefixture textarea').outerWidth()
              - $('#simplefixture .shiftenter').position().left + $('#simplefixture .shiftenter').outerWidth(),
              position_right);
        equal($('#simplefixture textarea').position().top + $('#simplefixture textarea').outerHeight()
              - $('#simplefixture .shiftenter').position().top + $('#simplefixture .shiftenter').outerHeight(),
              position_bottom);

        $('#simplefixture textarea').height($('#simplefixture textarea').height() + 100).trigger("resize");
        setTimeout(function() {
        // Check bounds
        ok($('#simplefixture .shiftenter').position().left >= $('#simplefixture textarea').position().left, "left margin is inside textarea");
        ok($('#simplefixture .shiftenter').position().top >= $('#simplefixture textarea').position().top, "top margin is inside textarea");
        ok($('#simplefixture .shiftenter').position().left + $('#simplefixture .shiftenter').outerWidth() 
           <= $('#simplefixture textarea').position().left + $('#simplefixture textarea').outerWidth(), "right margin is inside textarea");
        ok($('#simplefixture .shiftenter').position().top + $('#simplefixture .shiftenter').outerHeight() 
           <= $('#simplefixture textarea').position().top + $('#simplefixture textarea').outerHeight(), "bottom margin is inside textarea");
        // Check position relative to bottom right corner
        equal($('#simplefixture textarea').position().left + $('#simplefixture textarea').outerWidth()
              - $('#simplefixture .shiftenter').position().left + $('#simplefixture .shiftenter').outerWidth(),
              position_right);
        equal($('#simplefixture textarea').position().top + $('#simplefixture textarea').outerHeight()
              - $('#simplefixture .shiftenter').position().top + $('#simplefixture .shiftenter').outerHeight(),
              position_bottom);

        start();
        }, 600 );
        }, 600 );
    });

    asyncTest("check decreasing size keeps hint position", function() {
        expect(6);
        
        $('#simplefixture textarea').shiftenter().focus();

        var position_right  = ($('#simplefixture textarea').position().left + $('#simplefixture textarea').outerWidth()
                              - $('#simplefixture .shiftenter').position().left + $('#simplefixture .shiftenter').outerWidth()),
            position_bottom = ($('#simplefixture textarea').position().top + $('#simplefixture textarea').outerHeight()
                               - $('#simplefixture .shiftenter').position().top + $('#simplefixture .shiftenter').outerHeight());

        $('#simplefixture textarea').height($('#simplefixture textarea').height() - 100).trigger("resize");
        $('#simplefixture textarea').width($('#simplefixture textarea').width() - 100).trigger("resize");

        setTimeout(function() {
        // Check bounds
        ok($('#simplefixture .shiftenter').position().left >= $('#simplefixture textarea').position().left, "left margin is inside textarea");
        ok($('#simplefixture .shiftenter').position().top >= $('#simplefixture textarea').position().top, "top margin is inside textarea");
        ok($('#simplefixture .shiftenter').position().left + $('#simplefixture .shiftenter').outerWidth() 
           <= $('#simplefixture textarea').position().left + $('#simplefixture textarea').outerWidth(), "right margin is inside textarea");
        ok($('#simplefixture .shiftenter').position().top + $('#simplefixture .shiftenter').outerHeight() 
           <= $('#simplefixture textarea').position().top + $('#simplefixture textarea').outerHeight(), "bottom margin is inside textarea");
        // Check position relative to bottom right corner
        equal($('#simplefixture textarea').position().left + $('#simplefixture textarea').outerWidth()
              - $('#simplefixture .shiftenter').position().left + $('#simplefixture .shiftenter').outerWidth(),
              position_right);
        equal($('#simplefixture textarea').position().top + $('#simplefixture textarea').outerHeight()
              - $('#simplefixture .shiftenter').position().top + $('#simplefixture .shiftenter').outerHeight(),
              position_bottom);

        start();
        }, 600 );
    });

});