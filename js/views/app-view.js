var app = app || {};

app.AppView = Backbone.View.extend({
	el: '#app',
	initialize: function() {
		app.branchList.on('add', this.addAll, this);
		app.branchList.on('reset', this.addAll, this);
		app.branchList.fetch();
	},
	events: {
		'click #add-row': 'initializeRow'
	},
	initializeRow: function() {
		app.branchList.create(this.getBranchDefaultAttributes());
	},
	addOne: function(branchItem) {
		var view = new app.BranchView({model: branchItem});
		$('#branch-list').append(view.render().el);
	},
	addAll: function() {
		this.$('#branch-list').html('');
		app.branchList.each(this.addOne, this);
	},
	getBranchDefaultAttributes: function() {
		return {
					isActive: true,
					type: "branch",
					clients: "physical"
				};
	}
});