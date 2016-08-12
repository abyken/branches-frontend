var app = app || {};

app.BranchView = Backbone.View.extend({
	className: "rTableRow",
	template: $('#branch-template').text(),
	render: function() {
		var src = this.template;
		dust.helpers.isDayChecked = function(chunk, context, bodies, params) {
			var day = params.day,
				days = context.stack.head.days;

			for(var i=0; i<days.length; i++)
				if(days[i].name == day){
					chunk.render(bodies.block, context);
					return chunk;

				}

			return chunk;
		};

		var compiled = dust.compile(src, 'branch-template');
		dust.loadSource(compiled);
		var context = this.model.toJSON();
		context['currencies'] = app.currencyList.map(function(currency) {
			return currency.toJSON();
		});
		context['services'] = app.serviceList.map(function(service) {
			return service.toJSON();
		});
		dust.render('branch-template', context, function(err, out) {
		      this.$el.html(out);
		}.bind(this));
		return this
	},

	initialize: function() {
		this.model.on('change', this.render, this);
	},
	events: {
		'dblclick .field': 'edit',
		'keypress .edit': 'updateBranch',
		'blur .edit': 'close',
		'click .fieldCheckBox': 'onChecked',
		'click .destroy': 'destroy',
		'click .save': 'save',
		'change .model_field': 'onModelFieldSelected',
		'change .manytomany': 'onManyToManySelected',
		'click .schedulecb': 'onScheduleChecked',
		'click .scheduletm': 'onScheduleTimeChanged',
		'click .breakcb': 'onBreakChecked',
		'changed .breaktm': 'onBreakTimeChanged'
	},

	edit: function(event) {
		if($(event.target).prop("tagName") === "DIV"){
			$(event.target).addClass("editing");
			this.input = $(event.target).find('input');
		}
		else {
			var parent = $(event.target).parent();
			parent.addClass("editing");
			this.input = $(event.target).next('input');
		}
		this.input.focus().val(this.input.val());
	},

	onScheduleChecked: function(event) {
		console.log("HERE");
	},

	onScheduleTimeChanged: function(event) {
		console.log("HERE");
	},

	onChecked: function(event) {
		data = {};
		data[event.target.name] = !this.model[event.target.name];
		this.model.update(data);
		this.setRowEdited(true);
	},

	onModelFieldSelected: function(event) {
		data = {};
		data[event.target.name] = $(event.target).find(":selected").val();
		this.model.update(data);
		this.setRowEdited(true);
	},

	onManyToManySelected: function(event){
		data = {};
		data[event.target.name] = $(event.target).find(":selected").map(function(selectedItem){
			return selectedItem.val();
		});
		this.model.update(data);
		this.setRowEdited(true);
	},

	updateBranch: function(event) {
		if(event.which == 13){
	      this.close();
	    }
	},

	close: function() {
		var value = this.input.val().trim();
		var input_name = this.input.attr("name");
		var parent = $(this.input).parent();
	    parent.removeClass('editing');
	    var data = {};
	    data[input_name] = value;
	    this.model.update(data);
	    this.setRowEdited(true);
	},

	destroy: function(event) {
		this.model.destroy({
								success: function(model) { app.branchList.resetIndexes(); this.remove() }.bind(this), 
								error: function(err) { console.log("err", err) }.bind(this) 
							});
	},

	save: function() {
		this.model.set("isEdited", undefined);
		this.model.save(this.model, {error: function(){ this.model.set("isEdited", true) }.bind(this), success: function()  {this.setRowEdited(false) }.bind(this) });
	},

	setRowEdited: function(isEdited) {
		if(!this.$el.hasClass("rowEdited") && isEdited)
	    	this.$el.addClass("rowEdited");
	    else if(this.$el.hasClass("rowEdited") && !isEdited)
	    	this.$el.removeClass("rowEdited");
	}
})