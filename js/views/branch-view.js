var app = app || {};

app.BranchView = Backbone.View.extend({
	className: "rTableRow",
	template: $('#branch-template').text(),
	render: function() {
		var src = this.template;
		dust.helpers.isDayChecked = function(chunk, context, bodies, params) {
			var day = params.day,
				days = context.stack.head.days;

			if(days.indexOf(day) !== -1){
				chunk.render(bodies.block, context);
				return chunk;
			}

			return chunk;
		};

		dust.helpers.getModelId = function(chunk, context, bodies, params) {
			chunk.write(this.model.get('id'));
			chunk.render(bodies.block, context);
			return chunk;
		}.bind(this);

		var compiled = dust.compile(src, 'branch-template');
		dust.loadSource(compiled);
		var context = this.model.toJSON();
		context['currencies'] = app.currencyList.map(function(currency) {
			var currencyJson = currency.toJSON();
			if(this.model.get('currency_ids').indexOf(currency.id) !== -1){
				currencyJson.selected = true;
			}
			return currencyJson;
		}.bind(this));

		context['services'] = app.serviceList.map(function(service) {
			var serviceJson = service.toJSON();
			if(this.model.get('service_ids').indexOf(service.id) !== -1){
				serviceJson.selected = true;
			}
			return serviceJson;
		}.bind(this));

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
		'click .breakcb': 'onBranchBreakChecked',
		'change .breaktm': 'onBreakTimeChanged',
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
		var name = event.target.name,
			days = [];

		$("input[name='"+name+"']:checked").each(function(index, item) {
			days.push(item.value);
		});

		this.model.setSchedule(name.substring(0, 2), "days", days);
		this.setRowEdited(true);
	},

	onScheduleTimeChanged: function(event) {
		var schedule_type = event.target.name.substring(0, 2);
			name = event.target.name.substring(3),
			value = event.target.value;

		this.model.setSchedule(schedule_type, name, value);
	},

	onBranchBreakChecked: function(event) {
		var branchBreak = this.model.get('branchBreak');
		branchBreak[event.target.name] = event.target.checked;
		this.model.update({'branchBreak': branchBreak});
		this.setRowEdited(true);
	},

	onBreakTimeChanged: function(event) {
		var branchBreak = this.model.get('branchBreak');
		branchBreak[event.target.name] = event.target.value;
		this.model.update({'branchBreak': branchBreak});
		this.setRowEdited(true);
	},

	onChecked: function(event) {
		var data = {};
		data[event.target.name] = !this.model[event.target.name];
		this.model.update(data);
		this.setRowEdited(true);
	},

	onModelFieldSelected: function(event) {
		var data = {};
		data[event.target.name] = $(event.target).find(":selected").val();
		this.model.update(data);
		this.setRowEdited(true);
	},

	onManyToManySelected: function(event){
		var name = event.target.name.split("_")[0],
			data = {};
			data[name] = [];
		$("input[name='"+event.target.name+"']:checked").each(function(index, item) {
			if(name === "currencies"){
				data[name].push(app.currencyList.get(item.value).toJSON());
			}

			if(name === "services"){
				data[name].push(app.serviceList.get(item.value).toJSON());
			}
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