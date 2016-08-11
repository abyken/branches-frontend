var app = app || {};

app.Branch = Backbone.Model.extend({
	update: function(data) {
		if(!this.get("isEdited"))
			this.set("isEdited", true);

		for(var key in data)
			this.set(key, data[key]);
	}
});