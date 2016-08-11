var app = app || {};

app.BranchView = Backbone.View.extend({
	className: "rTableRow",
	template: $('#branch-template').text(),
	render: function() {
		var src = this.template;
		var compiled = dust.compile(src, 'branch-template');
		dust.loadSource(compiled);
		dust.render('branch-template', this.model.toJSON(), function(err, out) {
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
		'click input:checkbox': 'onChecked',
		'click .destroy': 'destroy',
		'click .save': 'save',
		'change select': 'onSelected'
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

	onChecked: function(event) {
		data = {};
		data[event.target.name] = !this.model[event.target.name];
		this.model.update(data);
		this.setRowEdited(true);
	},

	onSelected: function(event) {
		data = {};
		data[event.target.name] = $(event.target).find(":selected").val();
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
		this.model.destroy();
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