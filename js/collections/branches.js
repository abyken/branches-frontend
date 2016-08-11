var app = app || {};

app.BranchList = Backbone.Collection.extend({
	model: app.Branch,
	/*localStorage: new Store("branches"),*/
	url: 'http://localhost:8000/branches',
	parse: function(response) {
		response.map(function(branch, index) {
			branch.index = index + 1;
		})

		return response;
	},
	create: function(data) {
		Backbone.Collection.prototype.create.call(this, data, {
			success: function(response) {
				
				var model = this.at(this.length - 1),
					index = 1;
				if(this.length > 1)
					index = this.at(this.length - 2).get("index") + 1;
				
				model.set("index", index);
			}.bind(this)
		});
	}
});

app.branchList = new app.BranchList();