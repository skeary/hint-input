(function () {
    'use strict';

    var changeTimeout, closeTimeout;
    var redrawFix = 500;

    Polymer('hint-input', {
        focused: false,
        update: function () {
            var self = this;
            this.provider(this.input.value, function (hints, hasMore) {
                if (hints && hints.length <= 0) return;
                self.hints = hints;
                self.hasMore = hasMore;
                self.value = self.input.value;
                // Force resize of dropdown. See:
                // https://github.com/Polymer/paper-dropdown/issues/2
                self.$.dropdown.$.scroller.style.height = '';
                self.$.dropdown.$.scroller.style.width = '';
                if (self.focused)
                    setTimeout(function () {
                        self.$.dropdown.open();
                    }, redrawFix);
            });
        },
        open: function () {
            this.focused = true;
            clearTimeout(changeTimeout);
            changeTimeout = setTimeout(this.update.bind(this), this.threshold);
        },
        close: function () {
            var self = this;
            this.focused = false;
            clearTimeout(changeTimeout);
            clearTimeout(closeTimeout);
            closeTimeout = setTimeout(function () {
                self.$.dropdown.close();
            }, this.closeDelay);
        },
        useHint: function (e, v, s) {
            var hintIndex = s.getAttribute('hint-index');
            var hint = this.hints[hintIndex];
            if (this.append)
                this.input.value = this.input.value.trim() + " " + this.displayHintLabel(hint);
            else
                this.input.value = this.displayHintLabel(hint);
            this.input.focus();
            this.close();
            this.hintChosen(hint);
        },
        setup: function () {
            var self = this;
            var input = this.input = this.querySelector('paper-input').$.decorator.querySelector('input');
            this.value = input.value;
            input.addEventListener('keyup', this.open.bind(this));
            input.addEventListener('focus', this.open.bind(this));
            input.addEventListener('blur', this.close.bind(this));
        },
        domReady: function () {
            this.setup();
        },
        provider: function (v, cb) {
            cb(this.hints, false);
        },
        displayHintLabel: function(hint) {
            return hint;
        },
        hintChosen: function(hint) {
            // Do nothing.
        },
        moreSelected: function() {
            // do nothing.
        },
        hints: [],
        threshold: 400,
        value: '',
        append: true,
        closeDelay: 150,
        hasMore: false,
        hasMoreText: 'More...'
    });
})();