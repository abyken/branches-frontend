var app = app || {};

$(function() {
    'use strict'

    function initialize() {
        new app.AppView();
    };
    
    document.addEventListener('deviceready', initialize, false);
});