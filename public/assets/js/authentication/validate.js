"use strict";

myStorage.set('auth');
var auth = myStorage.get();
if(auth==null){
    if(window.location != base_url && window.location != base_url+'/auth/login')
        window.location = base_url;
} else{
    if(window.location == base_url+'/auth/login'){
        auth = JSON.parse(auth);
        window.location = base_url+'/wh';
    }
}