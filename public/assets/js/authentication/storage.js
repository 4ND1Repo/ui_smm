"use strict";

var myStorage = {
    name: "default",
    set: function(n){
        self.name = n;
    },
    store: function(e){
        localStorage.setItem(self.name,e);
    },
    get: function(){
        return localStorage.getItem(self.name);
    },
    delete: function(){
        return localStorage.removeItem(self.name);
    }
};