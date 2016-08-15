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

	},

	setSchedule: function(schedule_type, name, value) {
		var schedule_data = this.schedule_type(schedule_type),
			schedule_item = schedule_data.schedule[schedule_data.index];

		schedule_item[name] = value;

		this.update({schedule: schedule_data.schedule});
	},

	schedule_type: function(schedule_type) {
		var data = {
						schedule: this.get('schedule')
					};
		data.schedule.forEach(function(item, index) {
			if(item.type === schedule_type){
				data['index'] = index;				
			}
		});

		return data;
	}
});