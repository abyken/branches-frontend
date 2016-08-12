var app = app || {};

app.Branch = Backbone.Model.extend({
	url: function() {
		var base = "http://localhost:8001/api/v1/branches/";
		if(this.isNew()) return base;

		return base + this.id + "/";
	},
	update: function(data) {
		if(!this.get("isEdited"))
			this.set("isEdited", true);

		for(var key in data)
			this.set(key, data[key]);
	}
});