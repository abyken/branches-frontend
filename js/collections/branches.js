var app = app || {};

app.BranchList = Backbone.Collection.extend({
	model: app.Branch,
	url: 'http://localhost:8001/api/v1/branches/',
	all: [],
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
	},
	resetIndexes: function(){
		this.map(function(branch, index) {
			branch.set('index', index + 1);
		})
	},
	search: function(attributes) {
		var query = "", first = true;
		if(attributes.isFetchAll){
			this.fetch()
			return;
		}

		for(var key in attributes) {
			if(key == "isFetchAll" || attributes[key] == "-1")
				continue;

			if(first){
				query += "?" + key + "=" + attributes[key];
				first = false;
				continue;
			}

			query += "&" + key + "=" + attributes[key];

			console.log(query);
		}
	}
});

app.branchList = new app.BranchList();