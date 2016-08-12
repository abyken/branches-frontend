var app = app || {};

app.SearchView = Backbone.View.extend({
	className: "rTableRow",
	template: $('#search-template').text(),
	render: function() {
		var src = this.template;
		var compiled = dust.compile(src, 'search-template');
		dust.loadSource(compiled);
		var context = this.model.toJSON();
		context['currencies'] = app.currencyList.map(function(currency) {
			return currency.toJSON();
		});
		context['services'] = app.serviceList.map(function(service) {
			return service.toJSON();
		});
		dust.render('search-template', context, function(err, out) {
		      this.$el.html(out);
		}.bind(this));
		return this
	},

	initialize: function() {
		this.model.on('change', this.render, this);
	},
	
	events: {
		'click input:checkbox': 'onFieldChecked',
		'blur .field': 'onFieldChanged',
		'change select': 'onOptionSelected',
		'click .search': 'search'
	},

	onFieldChecked: function(event) {
		var data = {};
		data[event.target.name] = event.target.checked;
		this.model.update(data);
	},

	onFieldChanged: function(event) {
		var data = {};
		data[event.target.name] = event.target.value;
		this.model.update(data);
	},

	onOptionSelected: function(event) {
		var data = {};
		data[event.target.name] = $(event.target).find(':selected').val();
		this.model.update(data);
	},

	search: function(event) {
		app.branchList.search(this.model.toJSON());
	}
})