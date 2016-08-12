var app = app || {};

$(function() {
    'use strict'

    function initialize() {
        new app.AppView();
    };

    function fetchInitialState() {
        app.currencyList.fetch({success: function() {
            app.serviceList.fetch({success: function() {
                initialize();
            }});
        }});
        
    };
    
    document.addEventListener('deviceready', fetchInitialState, false);
});