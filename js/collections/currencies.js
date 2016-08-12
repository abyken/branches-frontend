var app = app || {};

app.CurrencyList = Backbone.Collection.extend({
	model: app.Currency,
	url: 'http://localhost:8001/api/v1/currencies/',
});

app.currencyList = new app.CurrencyList();