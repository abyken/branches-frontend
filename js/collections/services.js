var app = app || {};

app.ServiceList = Backbone.Collection.extend({
	model: app.Service,
	url: 'http://localhost:8001/api/v1/services/',
});

app.serviceList = new app.ServiceList();