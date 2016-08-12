var app = app || {};

app.AppView = Backbone.View.extend({
	el: '#app',
	initialize: function() {
		app.branchList.on('add', this.addAll, this);
		app.branchList.on('reset', this.addAll, this);
		app.branchList.fetch();
		this.addSearchBar();
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
	addSearchBar: function() {
		this.$('#search-bar').html('');
		var search = new app.Search({
										isFetchAll: true,
										isActive: true,
										type: "-1"
									});
		var view = new app.SearchView({model: search});
		$('#search-bar').append(view.render().el);
	},
	getBranchDefaultAttributes: function() {
		return {}
	}
});