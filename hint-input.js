(function () {
    'use strict';

    var changeTimeout, closeTimeout;
    var redrawFix = 500;
    var closeDealay = 300;

    Polymer('hint-input', {
        update: function () {
            var self = this;
            this.provider(this.input.value, function (hints) {
                if (hints && hints.length <= 0) return;
                self.hints = hints;
                self.value = self.input.value;
                setTimeout(function () {
                    self.$.dropdown.open();
                }, redrawFix);
            });
        },
        open: function () {
            clearTimeout(changeTimeout);
            changeTimeout = setTimeout(this.update.bind(this), this.threshold);
        },
        close: function () {
            var self = this;
            clearTimeout(changeTimeout);
            clearTimeout(closeTimeout);
            closeTimeout = setTimeout(function () {
                self.$.dropdown.close()
            }, closeDealay);
        },
        useHint: function (e, v, s) {
            this.input.value = this.input.value.trim() + " " + s.getAttribute('hint');
            this.input.focus();
            this.close();
        },
        setup: function () {
            var self = this;
            var input = this.input = this.querySelector('paper-input').$.decorator.querySelector("input");
            this.value = input.value;
            input.addEventListener('keyup', this.open.bind(this));
            input.addEventListener('focus', this.open.bind(this));
            input.addEventListener('blur', this.close.bind(this));
        },
        ready: function () {
            this.setup();
        },
        provider: function (v, cb) {
            cb(this.hints);
        },
        hints: [],
        threshold: 650,
        value: ''
    });
})();