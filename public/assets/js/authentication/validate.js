"use strict";

myStorage.set('auth');
var auth = myStorage.get();


// function get all menu are exists
var KTAccessMenu = function(){
  var data = [];
  var generate = function(d){
    d.forEach(function(v,k){
      if(data.indexOf(v.menu_url) == -1)
        data.push(v.menu_url);

      if(typeof v.children !== 'undefined')
        data.concat(KTAccessMenu.get(v.children));
    });
    return data;
  }

  return {
    get: function(d){
      return generate(d);
    }
  };
}();


if(auth==null){
    if(window.location != base_url && window.location != base_url+'/auth/login'){
        window.location = base_url;
    }
} else{
    window.Auth = JSON.parse(auth);
    if(window.location == base_url+'/auth/login'){
        window.location = base_url+'/'+window.Auth.page;
    } else {
      // validate uri are exist in rules
      if(typeof window.Auth !== 'undefined'){
        window.AccessMenu = KTAccessMenu.get(window.Auth.menu);
        // add for profile
        if(window.AccessMenu.indexOf('/profile') == -1)
          window.AccessMenu.push('/profile');
        // default page
        if(window.AccessMenu.indexOf('/') == -1)
          window.AccessMenu.push('/');

        var link = window.location.href.replace(base_url,"").replace('/'+window.Auth.page,""),
          spl = window.location.href.split('/');

        if(link != "" && window.AccessMenu.indexOf(link) == -1 && spl[(spl.length-1)] !== 'print'){
          history.back(-1);
          window.stop();
        }
      }
    }
}
