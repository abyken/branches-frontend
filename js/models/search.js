var app = app || {};

app.Search = Backbone.Model.extend({
	update: function(data) {
		for(var key in data)
			this.set(key, data[key]);
	}
});