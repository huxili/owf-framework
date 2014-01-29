;(function(Backbone, _, Handlebars, moment, Ozone) {
    'use strict';

    var Superclass = Ozone.views.notifications.NotificationView;

    var template = Handlebars.compile(
        '<span class="message">{{body}}</span>' +
        '<span class="time">{{relativeTime}}</span>' +
        '<button class="close"></button>'
    );

    var NotificationDetailsView = Superclass.extend({
        events: _.extend({
            'click .close': 'dismiss'
        }, Superclass.prototype.events),

        className: 'notification-details',

        render: function() {
            //for the template, use the model attributes plus a fuzzy time string
            var attrs = _.extend({
                relativeTime: moment(this.model.get('timestamp')).fromNow()
            }, this.model.attributes);

            this.$el.html(template(attrs));

            return this;
        },

        dismiss: function(e) {
            var collection = this.model.collection;

            if (collection) {
                collection.remove(this.model);
            }

            this.stopListening(this.model);
            this.model = null;

            e.stopPropagation();
        }
    });

    $.extend(true, Ozone, { views: { notifications: {
        NotificationDetailsView: NotificationDetailsView}}});
})(window.Backbone, window._, window.Handlebars, window.moment, window.Ozone);