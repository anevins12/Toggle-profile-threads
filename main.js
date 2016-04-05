// ==UserScript==
// @name         Toggle threads on profile page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       anevins
// @include     *://*.forums.wordpress.org/profile/*
// @include     *://*wordpress.org/support/profile/*
// @downloadURL https://github.com/anevins12/Toggle-profile-threads/blob/master/main.js
// @updateURL https://github.com/anevins12/Toggle-profile-threads/blob/master/main.js
// ==/UserScript==
/* jshint -W097 */

'use strict';

var $ = jQuery,
    target = $('#profile-menu'),
    threadButtons,
    textToShow = 'Show toggled threads',
    textToHide = 'Hide toggled threads',
    buttonClass = 'toggle-threads-button',
    button = $('<button class="' + buttonClass + '"><span>' + textToShow + '</span></button>'),
    activeClass = 'active';


// Run the toggleThreads functionality
toggleThreads();
threadButtons = $('.toggle-button');

// Add the button
target.append('<li />').append(button);

// Hide thread buttons
threadButtons.hide();

// On click of the "show toggled threads" button
button.on('click', function() {
    var text = button.find('span');

    button.toggleClass(activeClass);
    threadButtons.toggle();

    // Update text
    if (button.hasClass(activeClass)) {
        text.text(textToHide);
    } else {
        text.text(textToShow);
    }
});


function toggleThreads() {
    var threads = $('.user-recent li'),
        buttonClass = 'toggle-button',
        button = '<button class="' + buttonClass + '"><span>Hide</span></button>',
        textToShow = 'Show',
        textToHide = 'Hide',
        buttons,
        innerClass = 'thread-inner';

    threads
    // Wrap the thread content to target later
        .wrapInner('<span class="' + innerClass + '" />')
        // Add the button to each thread
        .prepend(button);

    threads.each(function(i, thread) {
        var thread = $(thread),
            threadId = thread.find('a').attr('href'),
            button = thread.find('.' + buttonClass);

		// Remove the queries from the ID
		threadId = threadId.split('?');
		threadId = threadId[0];
			
        // Add an ID
        thread.attr('id', threadId);

        if (localStorage.getItem(threadId) !== null) {
            // Check if threads have been hidden already via local storage
            toggleThread(button, thread);
        }
    });

    // Find all thread buttons
    buttons = $('body').find('.' + buttonClass);

    buttons.on('click', function(event) {
        var thread = $(this).parents('li'),
            button = $(this);

        toggleThread(button, thread, event);
    });

    // Add styles
    style();

    /*
     * button = Required - The trigger element
     * thread = Required - The element to toggle
     * event = Optional - Identifying whether the button has been pressed
     */
    function toggleThread(button, thread, event) {
        var threadId = thread.attr('id'),
            threadContent = thread.find('.' + innerClass),
            buttonText = button.find('span');

        // If the thread is visible
        if (localStorage.getItem(threadId) === 'shown') {
            updateHiddenState();
        } else if (localStorage.getItem(threadId) === 'hidden') {
            updateShownState();
        } else {
            updateHiddenState();
        }

        function updateHiddenState() {

            if (event) {
                // Update the button text
                buttonText.text(textToShow);

                // Update local storage
                localStorage.setItem(threadId, 'hidden');

                // Hide the thread
                threadContent.hide();

                // Update button class
                button.addClass(activeClass);
            } else {
                // Update the button text
                buttonText.text(textToHide);

                // Show the thread
                threadContent.show();

                // Update button class
                button.removeClass(activeClass);
            }
        }

        function updateShownState() {

            if (event) {
                // Update the button text
                buttonText.text(textToHide);

                // Update local storage
                localStorage.setItem(threadId, 'shown');

                // Show the thread
                threadContent.show();

                // Update button class
                button.removeClass(activeClass);
            } else {
                // Update the button text
                buttonText.text(textToShow);

                // Hide the thread
                threadContent.hide();

                // Update button class
                button.addClass(activeClass);
            }
        }
    }
}

function style() {
    var style,
        styles,
        head = document.getElementsByTagName('head')[0];

    style = document.createElement('style');
    style.type = 'text/css';

    styles = '.toggle-button{cursor:pointer;height:1em;margin-top:.2em;padding:0;position:relative;vertical-align:top;width:1em}.toggle-button:hover~span{outline:dotted 1px}.toggle-button:before{content:"x";display:block;line-height:10px;font-size:10px}.toggle-button.active:before{content:"show"}.toggle-button.active{width:auto}.toggle-button span{left:-999em;position:absolute}.toggle-threads-button{background:0 0;border:0;color:#4ca6cf;cursor:pointer;font-size:10px;padding:0;text-align:left}';

    style.appendChild(document.createTextNode(styles));
    head.appendChild(style);
}