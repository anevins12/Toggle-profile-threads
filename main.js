var $ = jQuery,
     threads = $('.user-recent li'),
     buttonClass = 'toggle-button',
     button = '<button class="' + buttonClass + '">Hide</button>',
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

/*
 * button = Required - The trigger element
 * thread = Required - The element to toggle
 * event = Optional - Identifying whether the button has been pressed
 */

function toggleThread(button, thread, event) {
    var threadId = thread.attr('id'),
          threadContent = thread.find('.' + innerClass);

    // If the thread is visible
    if (localStorage.getItem(threadId) === 'shown') {
		updateHiddenState();	
    } else if (localStorage.getItem(threadId) === 'hidden') {
		updateShownState();
    }  else {
        updateHiddenState();	
	}
	
	function updateHiddenState() {
		
		if (event) {
			// Update the button text
			button.text(textToShow);
			
			// Update local storage
			localStorage.setItem(threadId, 'hidden');

			// Hide the thread
			threadContent.hide();
		} else {
			// Update the button text
			button.text(textToHide);
			
			// Show the thread
			threadContent.show();		
		}
	}
	
	function updateShownState() {
		
		if (event) {
			// Update the button text
			button.text(textToHide);
			
			// Update local storage
			localStorage.setItem(threadId, 'shown');

			// Show the thread
			threadContent.show();
		} else {
			// Update the button text
			button.text(textToShow);
			
			// Hide the thread
			threadContent.hide();
		}
	}
}