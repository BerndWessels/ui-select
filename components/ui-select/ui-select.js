(function () {
    'use strict';
    // The element's implementation.
    Polymer('ui-select', {
        // An instance of the element is created. If you’re initializing an array or object,
        // do it in the created callback rather than directly on the prototype.
        created: function () {
        },
        // The <polymer-element> has been fully prepared
        // (e.g. Shadow DOM created, property observers setup, event listeners attached, etc).
        ready: function () {
            // Observe changed to options to update the popup.
            this.observer = new MutationObserver(this.updatePopup.bind(this));
            this.observer.observe(this, {childList: true});
            // Listen to the keydown event on the input.
            this.$.input.addEventListener('keydown', function (e) {
                // Prevent the cursor from jumping on cursor up/down.
                if (e.keyCode == 38 || e.keyCode == 40) {
                    e.preventDefault();
                }
                // Hide the popup on escape.
                else if (e.keyIdentifier == 'U+001B' || e.keyCode == 27) {
                    this.hidePopup();
                }
            }.bind(this));
            // Listen to the focus event on the input.
            this.$.input.addEventListener('focus', function (e) {
                this.filterFocused = true;
            }.bind(this));
            // Listen to the blur event on the input.
            this.$.input.addEventListener('blur', function (e) {
                this.hidePopup();
                this.filterFocused = false;
            }.bind(this));
        },
        // An instance of the element was inserted into the DOM.
        attached: function () {
        },
        // Called when the element’s initial set of children are guaranteed to exist.
        // This is an appropriate time to poke at the element’s parent or light DOM children.
        // Another use is when you have sibling custom elements (e.g. they're .innerHTML'd together, at the same time).
        // Before element A can use B’s API/properties, element B needs to be upgraded.
        // The domReady callback ensures both elements exist.
        domReady: function () {
        },
        // An instance was removed from the DOM.
        detached: function () {
        },
        // An attribute was added, removed, or updated.
        // Note: to observe changes to published properties, use changed watchers.
        attributeChanged: function (attrName, oldVal, newVal) {
            if (this[attrName + 'Handler']) {
                this[attrName + 'Handler'](oldVal, newVal);
            }
        },
        // When you publish a property name, you’re making that property part of the element’s “public API”.
        // Published properties have the following features:
        // Support for two-way, declarative data binding.
        // Declarative initialization using an HTML attribute with a matching name.
        // Optionally, the current value of a property can be reflected back to an attribute with a matching name.
        publish: {
            filter: '',
            filterFocused: false
        },
        // Delegate events to action handlers.
        eventDelegates: {},
        // Calculate if there are any 'option' elements without a 'selected' attribute.
        get hasUnselectedOptions() {
            return this.querySelectorAll('[option]:not([selected])').length > 0;
        },
        // Show or hide the popup.
        updatePopup: function () {
            this.hasUnselectedOptions ? this.showPopup() : this.hidePopup();
        },
        // Show the popup.
        showPopup: function () {
            // Align the width of the dropdown with the input.
            this.$.popup.style.minWidth = this.clientWidth + 'px';
            // Position the dropdown just below the input.
            var borderTopWidth = parseInt(window.getComputedStyle(this, null).getPropertyValue("border-top-width"), 10);
            this.$.popup.style.top = (this.offsetHeight - borderTopWidth) + 'px';
            // Reset the dropdown height to match the actual content height.
            this.$.popup.style.height = null;
            // Open or close the dropdown depending on the input value.
            this.$.popup.style.display = 'block';
            // Start catching element resize.
            window.requestAnimationFrame(this.animationFrame.bind(this));
        },
        // Hide the popup.
        hidePopup: function () {
            // Open or close the dropdown depending on the input value.
            this.$.popup.style.display = 'none';
        },
        // Detect a change in the client width.
        animationFrame: function (timestamp) {
            // Align the width of the dropdown with the input.
            if (this.$.popup.style.minWidth !== this.clientWidth + 'px') {
                this.$.popup.style.minWidth = this.clientWidth + 'px';
            }
            // Position the dropdown just below the input.
            var borderTopWidth = parseInt(window.getComputedStyle(this, null).getPropertyValue("border-top-width"), 10);
            if (this.$.popup.style.top !== (this.offsetHeight - borderTopWidth) + 'px') {
                this.$.popup.style.top = (this.offsetHeight - borderTopWidth) + 'px';
            }
            // Keep on observing as long as the popup is visible.
            if (this.$.popup.style.display === 'block') {
                window.requestAnimationFrame(this.animationFrame.bind(this));
            }
        }
    });
})();
