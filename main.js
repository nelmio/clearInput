/*jslint browser: true, nomen: true */
/*global $, Backbone: false, _:false, define: false */
define(function (require) {
    "use strict";

    var Backbone = require('backbone'),
        $ = require('jquery'),
        _ = require('underscore');

    return Backbone.View.extend({
        template: '<div><i class="icon-remove icon-white"></i></div>',
        tagName: 'button',
        attributes: {
            tabindex: '-1'
        },
        className: 'clear-button hidden',
        events: {
            'mousedown': 'clear'
        },
        _inputElement: null,
        overriddenEl: false,
        initialize: function (opts) {
            opts = opts || {};

            if (opts.el && opts.el.className.indexOf('hidden') === -1) {
                $(opts.el).addClass('hidden');
                this.overriddenEl = true;
            }

            if (opts.input) {
                this.setInputElement(opts.input);
            }
            this.render();
        },

        _onFocus: function (e) {
            if (this._inputElement.val()) {
                this.show();
            }
        },

        _onBlur: function (e) {
            this.hide();
        },

        _onKeyUp: function (e) {
            if (this._inputElement.val()) {
                this.show();
            }
        },

        setInputElement: function (input) {
            // remove the currently set input element if a new one is set
            if (this._inputElement && input !== this._inputElement[0]) {
                this.unbindInputElement();
                this._inputElement = null;
            }

            // we have to bind them at runtime as we _need_ the reference
            // later for unbinding, but it need to be bound to this instance,
            // not the element it's listening on
            this.onFocus = _.bind(this._onFocus, this);
            this.onBlur = _.bind(this._onBlur, this);
            this.onKeyUp = _.bind(this._onKeyUp, this);

            this._inputElement = $(input);
            this._inputElement.on({
                focus: this.onFocus,
                blur: this.onBlur,
                keyup: this.onKeyUp
            });
        },

        unbindInputElement: function () {
            this._inputElement.off({
                focus: this.onFocus,
                blur: this.onBlur,
                keyup: this.onKeyUp
            });
        },

        remove: function () {
            if (this._inputElement && this._inputElement.off) {
                this.unbindInputElement();
                delete this._inputElement;
            }
            Backbone.View.prototype.remove.apply(this, arguments);
        },

        render: function () {
            if (!this.overriddenEl) {
                this.el.innerHTML = this.template;
            }

            return this;
        },

        clear: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (this._inputElement && this._inputElement.val()) {
                this._inputElement.val('');
            }
            this.hide();
            if (this._inputElement) {
                this._inputElement.focus();
            }
            this.trigger('clear');
        },

        show: function () {
            this.$el.removeClass('hidden');
        },

        hide: function () {
            this.$el.addClass('hidden');
        }
    });
});
