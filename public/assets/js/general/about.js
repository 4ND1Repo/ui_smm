"use strict";

var KTAbout = function(){
    var _ajax = function(t,u,d,f){
        $.ajax({
            type: t,
            url: u,
            d: d,
            success: function(r){
                if(typeof f == 'function')
                    f(r);
            },
            error: function(e){
                console.log(e);
            }
        });
    }

    var tutorialList = function(){
        _ajax('GET', location.href+'/vid/'+window.Auth.page, null,function(r){
            if(r.status){
                $('.list_video ul').html('');
                $('.list_video').prepend('<h5>Cara Pakai</h5>');
                r.data.forEach(function(v,k){
                    var tmp = v.split('.');
                    $('.list_video ul').append('<li class="changeVid"> <a href="javascript:;" data-type="'+(tmp[(tmp.length-1)])+'" data-src="'+base_url+'/public/tutorial/'+window.Auth.page+'/'+v+'">'+(v.split('.'))[0].replace('_',' ')+'</a></li>')
                });

                var lvd = new PerfectScrollbar('.list_video', {
                  wheelSpeed: 0.5,
                  wheelPropagation: true,
                  minScrollbarLength: 20,
                  maxScrollbarLength: 300,
                });

                var player = new Plyr('#player');
                $('li.changeVid a').click(function(){
                    var src = $(this).data('src'),
                        type = 'video/'+$(this).data('type'),
                        poster = $(this).data('poster');

                        player.source = {
                            type: 'video',
                            title: 'Video Tutorial',
                            sources: [
                                { src: src, type: type }
                            ]
                        };

                        player.play();
                });
            }
        });
    }

    return{
        init: function(){
            KTAbout.video();
        },
        video: function(){
            tutorialList();
        }
    };
}();

$(document).ready(function(){
    KTAbout.init();
});
