var app = app || {};

app.BranchList = Backbone.Collection.extend({
	model: app.Branch,
	url: 'http://localhost:8001/api/v1/branches/',
	all: [],
	parse: function(response) {

		response.map(function(branch, index) {
			branch.index = index + 1;
			branch.currencies_verbose = this.getCurrenciesVerbose(branch.currencies);
			branch.schedule_verbose = this.getScheduleVerbose(branch.schedule, branch.isAroundTheClock);
			branch.break_verbose = this.getBreakVerbose(branch.branchBreak);
			branch.services_verbose = this.getServicesVerbose(branch.services);
		}.bind(this));
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
		var query = "", first = true, data = {};
		if(attributes.isFetchAll === true){
			this.fetch()
			return;
		}

		for(var key in attributes) {
			if(key === "isFetchAll" || attributes[key] === "-1" || 
				(key === "currencies" && attributes["type"] === "branch") ||
				(key === "services" && attributes["type"] !== "branch") || 
				(key === "clients" && attributes["type"] !== "branch") )
				continue;

			data[key] = attributes[key];

			if(first){
				query += "?" + key + "=" + attributes[key];
				first = false;
				continue;
			}

			query += "&" + key + "=" + attributes[key];
		}

		this.fetch({data: data});
	},

	getCurrenciesVerbose: function(value) {
		var vals_array = value.map(function(item, index) {
			return item.code;
		});

		return vals_array.join(", ");
	},

	getScheduleVerbose: function(value, isAroundTheClock) {
		var days_list = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
		function getIntervalString(days) {
			var days_short = {
							"MON": "пн",
							"TUE": "вт",
							"WED": "ср",
							"THU": "чт",
							"FRI": "пт",
							"SAT": "сб",
							"SUN": "вс"
						},
			day_start = "",
			day_end = "";

			if(days.length === 1)
				return days_short[days[0]]

			for(var i=0; i<7; i++){
				if(days.indexOf(days_list[i]) !== -1) {
					if(!day_start)
						day_start = days_short[days_list[i]];

					day_end = days_short[days_list[i]];
				}
			}

			return day_start + "-" + day_end;
		}

		if(isAroundTheClock)
			return 'Круглосуточно'

		var unicode_string = [], 
			string_parts = "",
			working_days = [];

		for(var i=0; i<value.length; i++){
			if(value[i].days.length == 0)
				continue;

			var days_interval = getIntervalString(value[i].days);
			working_days.concat(value[i].days);

			var time = value[i].time_from + "-" + value[i].time_to;
			string_parts += days_interval + ": ";
			string_parts += time;
			unicode_string.push(string_parts);
			string_parts = "";

		}

		var days_off = _.difference(days_list, working_days)

		if(days_off){
			var days_interval = getIntervalString(days_off);
			string_parts = days_interval + ": выходной";
			unicode_string.push(string_parts);
		}

		return unicode_string.join("; ");
	},

	getBreakVerbose: function(value) {
		if(value.isWithoutBreak)
			return "Без перерыва"

		return value.time_from + "-" + value.time_to;
	},

	getServicesVerbose: function(value) {
		var vals_array = value.map(function(item, index) {
			return item.name;
		});

		return vals_array.join(", ");
	},

});

app.branchList = new app.BranchList();