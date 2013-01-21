/*jslint browser: true, nomen: true */
/*globals _, async, sinon, define, beforeEach, before, after, afterEach, mocha, dump, window: false, $: false, require: false, Backbone: false, describe, it, expect, window*/

mocha.setup({ ignoreLeaks: true });
require.config({
    baseUrl: '/base',
    paths: {
        jquery: './components/jquery/jquery',
        underscore: './components/underscore/underscore',
        backbone: './components/backbone/backbone'
    },
    shim: {
        jquery: {
            exports: 'jQuery'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        }
    }
});

require([ 'main' ], function (ClearButton) {
    "use strict";


    describe('views/ClearButton', function () {
        before(function () {
            $(document.head).append([
                '<style id="clear-button-test-css">',
                '.hidden { display: none; }',
                '</style>'
            ].join(''));
        });

        after(function () {
            $('#clear-button-test-css').remove();
        });

        beforeEach(function () {
            this.view = new ClearButton();
            this.sinon = sinon.sandbox.create();
            this.testDom = $('<div id="test-dom"></div>').appendTo(document.body);
        });

        afterEach(function () {
            this.sinon.restore();
            this.view.remove();
            delete this.sinon;
            delete this.view;
            $('#test-dom').remove();
        });

        it('should be a Backbone.View', function () {
            expect(this.view).to.be.a(Backbone.View);
        });

        it('should use the element that is passed as an option', function () {
            this.view.remove();
            this.view = new ClearButton({
                el: $('<a href="#" class="my-own-class"></a>')[0]
            });
            expect(this.view.el.tagName.toLowerCase()).to.be('a');
            expect(this.view.el.className).to.contain('hidden');
            expect(this.view.el.className).to.contain('my-own-class');
        });

        it('should create a button element', function () {
            expect(this.view.el.tagName.toLowerCase()).to.be('button');
            expect(this.view.className).to.contain('clear-button');
        });

        it('should be hidden by default', function () {
            this.view.$el.appendTo(this.testDom);
            var actual = window.getComputedStyle(this.view.el).getPropertyValue('display');

            expect(this.view.className).to.contain('hidden');
            expect(actual).to.be('none');
        });

        describe('#clear()', function () {
            beforeEach(function () {
                this.input = document.createElement('input');
                this.input.value = 'testing';
                this.view.setInputElement(this.input);
            });
            afterEach(function () {
                delete this.input;
            });

            it('should trigger the clear event', function () {
                var spy = this.sinon.spy();
                this.view.on('clear', spy);
                this.view.clear();
                expect(spy.callCount).to.be(1);
            });

            it('should clear the value of the input field', function () {
                expect(this.view._inputElement.val()).to.be('testing');
                this.view.clear();
                expect(this.view._inputElement.val()).to.be.empty();
            });

            it('should hide the button', function () {
                this.view.$el.appendTo(this.testDom);
                this.view.show();
                expect(this.view.$el.css('display')).to.not.be('none');
                this.view.clear();
                expect(this.view.$el.css('display')).to.be('none');
            });
        });

        describe('#show()', function () {
            beforeEach(function () {
                this.view.$el.appendTo(this.testDom);
            });

            it('should show the button', function () {
                expect(this.view.$el.css('display')).to.be('none');
                this.view.show();
                expect(this.view.$el.css('display')).to.not.be('none');
            });
        });

        describe('#hide()', function () {
            beforeEach(function () {
                this.view.$el.appendTo(this.testDom);
                this.view.show();
            });

            it('should hide the button', function () {
                expect(this.view.$el.css('display')).to.not.be('none');
                this.view.hide();
                expect(this.view.$el.css('display')).to.be('none');
            });
        });

        describe('#setInputElement()', function () {
            beforeEach(function () {
                this.onFocus = this.sinon.stub(ClearButton.prototype, '_onFocus');
                this.onBlur = this.sinon.stub(ClearButton.prototype, '_onBlur');
                this.input = document.createElement('input');
            });

            afterEach(function () {
                delete this.input;
                delete this.onFocus;
                delete this.onBlur;
            });

            it('should save a reference of the input element', function () {
                expect(this.view._inputElement).to.be(null);
                this.view.setInputElement(this.input);
                expect(this.view._inputElement).to.not.be(null);
            });

            it('should set up event listeners on the input', function () {
                expect(this.onFocus.callCount).to.be(0);
                expect(this.onBlur.callCount).to.be(0);
                this.view.setInputElement(this.input);
                $(this.input).focus();
                expect(this.onFocus.callCount).to.be(1);
                $(this.input).blur();
                expect(this.onBlur.callCount).to.be(1);
            });

            describe('input events', function () {
                beforeEach(function () {
                    this.onFocus.restore();
                    this.onBlur.restore();
                    delete this.onFocus;
                    delete this.onBlur;
                    this.view.setInputElement(this.input);
                    this.view.$el.appendTo(this.testDom);
                });

                it('should show the button if the input is focused and has a value', function () {
                    expect(this.view.$el.css('display')).to.be('none');
                    $(this.input).focus();
                    expect(this.view.$el.css('display')).to.be('none');
                    this.input.value = 'Hello';
                    $(this.input).focus();
                    expect(this.view.$el.css('display')).to.not.be('none');
                });

                it('should hide the button if the input is blurred', function () {
                    this.input.value = 'Hello';
                    expect(this.view.$el.css('display')).to.be('none');
                    $(this.input).focus();
                    expect(this.view.$el.css('display')).to.not.be('none');
                    $(this.input).blur();
                    expect(this.view.$el.css('display')).to.be('none');
                });

                it('should show the button if the input starts having a value', function () {
                    expect(this.view.$el.css('display')).to.be('none');

                });

            });
        });

        describe('#remove()', function () {
            beforeEach(function () {
                this.input = document.createElement('input');
                this.input.value = 'testing';
                this.view.setInputElement(this.input);
            });

            afterEach(function () {
                delete this.input;
            });

            it('should remove the event listeners on the input element', function () {
                var showSpy = this.sinon.spy(this.view, 'show'),
                    hideSpy = this.sinon.spy(this.view, 'hide');
                expect(showSpy.callCount).to.be(0);
                expect(hideSpy.callCount).to.be(0);
                $(this.input).focus();
                $(this.input).blur();
                expect(showSpy.callCount).to.be(1);
                expect(hideSpy.callCount).to.be(1);
                this.view.remove();
                $(this.input).focus();
                $(this.input).blur();
                expect(showSpy.callCount).to.be(1);
                expect(hideSpy.callCount).to.be(1);
            });
        });

    });

    window.__testacular__.start();
});
