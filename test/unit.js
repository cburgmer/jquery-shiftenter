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
        ok($('#simplefixture .shiftenter-text').is(':visible'), "hint shows on focus");

    });

    test("check hint text", function() {
        expect(1);
        
        var msg = 'test message';
        $('#simplefixture textarea').shiftenter({'hint': msg});

        equal($('#simplefixture .shiftenter-text').text(), msg, "hint setting should be honoured");
    });

    module("Size");

    test("check sizes are correct", function() {
        expect(2);
        
        $('#simplefixture textarea').shiftenter();

        ok($('#simplefixture .shiftenter-wrap').width() >= $('#simplefixture textarea').width(), "wrap is wider than textarea");
        ok($('#simplefixture .shiftenter-wrap').height() >= $('#simplefixture textarea').height(), "wrap is taller than textarea");

    });

    asyncTest("check resize keeps hint position", function() {
        expect(6);
        
        $('#simplefixture textarea').shiftenter();

        $('#simplefixture textarea').width($('#simplefixture textarea').width() + 100);
        setTimeout(function() {
        ok($('#simplefixture .shiftenter-wrap').width() >= $('#simplefixture textarea').width(), "wrap is wider than textarea");
        ok($('#simplefixture .shiftenter-wrap').height() >= $('#simplefixture textarea').height(), "wrap is taller than textarea");

        $('#simplefixture textarea').height($('#simplefixture textarea').height() + 100);
        setTimeout(function() {
        ok($('#simplefixture .shiftenter-wrap').width() >= $('#simplefixture textarea').width(), "wrap is wider than textarea");
        ok($('#simplefixture .shiftenter-wrap').height() >= $('#simplefixture textarea').height(), "wrap is taller than textarea");

        $('#simplefixture textarea').height($('#simplefixture textarea').height() - 100);
        $('#simplefixture textarea').width($('#simplefixture textarea').width() - 100);
        setTimeout(function() {
        ok($('#simplefixture .shiftenter-wrap').width() >= $('#simplefixture textarea').width(), "wrap is wider than textarea");
        ok($('#simplefixture .shiftenter-wrap').height() >= $('#simplefixture textarea').height(), "wrap is taller than textarea");
        
        start();
        }, 600 );
        }, 600 );
        }, 600 );
    });

});