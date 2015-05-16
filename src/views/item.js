var Marionette = require('marionette');

/**
 * @version 1.0.0
 * @description Item View - Display an individual todo item, and respond to changes
 * that are made to the item, including marking completed.
 * @module views/item
 * @link {http://marionettejs.com/}
 */
module.exports = Marionette.ItemView.extend({

    /** tag name */
    tagName: 'li',

    /** template */
    template: '#template-todoItemView',

    /**
     * @func className
     * @returns {string}
     */
    className: function () {
        return this.model.get('completed') ? 'completed' : 'active';
    },

    /**
     * @description UI bindings create cached attributes that
     * point to jQuery selected objects
     */
    ui: {
        edit: '.edit',
        destroy: '.destroy',
        label: 'label',
        toggle: '.toggle'
    },

    /** events */
    events: {
        'click @ui.destroy': 'deleteModel',
        'dblclick @ui.label': 'onEditClick',
        'keydown @ui.edit': 'onEditKeypress',
        'focusout @ui.edit': 'onEditFocusout',
        'click @ui.toggle': 'toggle'
    },

    /** model events */
    modelEvents: {
        change: 'render'
    },

    /**
     * @func deleteModel
     */
    deleteModel: function () {
        this.model.destroy();
    },

    /**
     * @func toggle
     */
    toggle: function () {
        this.model.toggle().save();
    },

    /**
     * @desc edit click event handler
     * @func onEditClick
     */
    onEditClick: function () {
        this.$el.addClass('editing');
        this.ui.edit.focus();
        this.ui.edit.val(this.ui.edit.val());
    },

    /**
     * @desc edit focus out event handler
     * @func onEditFocusout
     */
    onEditFocusout: function () {
        var todoText = this.ui.edit.val().trim();
        if (todoText) {
            this.model.set('title', todoText).save();
            this.$el.removeClass('editing');
        } else {
            this.destroy();
        }
    },

    /**
     * @desc edit key press event handler
     * @func onEditKeypress
     * @param e - event
     */
    onEditKeypress: function (e) {
        var ENTER_KEY = 13;
        var ESC_KEY = 27;

        if (e.which === ENTER_KEY) {
            this.onEditFocusout();
            return;
        }

        if (e.which === ESC_KEY) {
            this.ui.edit.val(this.model.get('title'));
            this.$el.removeClass('editing');
        }
    }
});