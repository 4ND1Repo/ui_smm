"use strict";

var faceDetect = function(el,callback){
  return faceapi.nets.tinyFaceDetector.loadFromUri('assets/vendors/custom/faceapi').then(function(){
    return faceapi.tinyFaceDetector(el);
  }, function(){
    swal.fire({
        "title": "",
        "text": "Ada kesalahan sistem.",
        "type": "error",
        "confirmButtonClass": "btn btn-secondary",
        "onClose": function(e) {
            console.log('on close event fired!');
        }
    });
    KTApp.unblock(target);
  }).then(
    function(faces) {
      var options = {};
      options['boost'] = faces.map(function(face) {
        var box = face.box;
        return {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
          weight: 1.0
        };
      });
      callback(options);
    },
    function(err) {
      swal.fire({
          "title": "",
          "text": "Tidak bisa mendeteksi wajah.",
          "type": "error",
          "confirmButtonClass": "btn btn-secondary",
          "onClose": function(e) {
              console.log('on close event fired!');
          }
      });
      KTApp.unblock(target);
    }
  );
}

$(document).ready(function(){
  // when change picture
  $('[name="profile_avatar"]').on('change', function(e){
    var formData = new FormData(),
    target = '.kt-avatar__holder';
    formData.append('pic', this.files[0]);
    formData.append('id', window.Auth.nik);
    KTApp.block(target, {
        overlayColor: '#000000',
        type: 'v2',
        state: 'primary',
        message: ''
    });
    $.ajax({
      url: base_url+'/temp',
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      success: function(r){
        $('body').after("<img class='foto kt-hidden' src='"+r+"'>");
        var el = $('.foto')[0];
        $(el).on('load', function(){
          var options = {width: 250, height: 250},
            el = this,
            width = el.naturalWidth || el.width,
            height = el.naturalHeight || el.height,
            opt = function(option){
              Object.assign(options, option);
            };
          // face api detect
          faceDetect(el, opt).then(function(){
            SmartCrop.crop(el, options, function(result){
              var crop = result.topCrop;
              var canvas = $('<canvas>')[0];
              var ctx = canvas.getContext('2d');
              canvas.width = options.width;
              canvas.height = options.height;
              if(typeof options.boost[0] !== 'undefined'){
                crop.width = crop.width < options.boost[0].width?options.boost[0].width:crop.width;
                crop.height = crop.height < options.boost[0].height?options.boost[0].height:crop.height;
                ctx.drawImage(
                  el,
                  crop.x,
                  crop.y,
                  crop.width,
                  crop.height,
                  0,
                  0,
                  canvas.width,
                  canvas.height
                );
                var dataUrl = canvas.toDataURL("image/png");
                // saving to database
                $.ajax({
                  url: api_url + '/api/mng/user/photo/update',
                  type: 'POST',
                  data: {photo:dataUrl, nik: window.Auth.nik},
                  success: function(r){
                    window.Auth['photo'] = dataUrl;
                    myStorage.set('auth');
                    myStorage.store(JSON.stringify(window.Auth));

                    $('.kt-badge--username, .kt-avatar__holder').removeAttr('style').attr('style', "background-image: url('"+dataUrl+"'); background-size: cover;");
                    KTApp.unblock(target);
                  },
                  error: function(){
                    KTApp.unblock(target);
                  }
                });
              } else {
                swal.fire({
                    "title": "",
                    "text": "Pastikan ada muka dan muka nya terlihat jelas.",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary",
                    "onClose": function(e) {
                        console.log('on close event fired!');
                    }
                });
                KTApp.unblock(target);
              }
            });

          }, function(){
            swal.fire({
                "title": "",
                "text": "Kesalahan saat memproses photo.",
                "type": "error",
                "confirmButtonClass": "btn btn-secondary",
                "onClose": function(e) {
                    console.log('on close event fired!');
                }
            });
          });

        });
      },
      error: function(e){
        if(e.status == 413)
          swal.fire({
              "title": "",
              "text": "Ukuran file terlalu besar, harus kurang dari 1.5Mb.",
              "type": "error",
              "confirmButtonClass": "btn btn-secondary",
              "onClose": function(e) {
                  console.log('on close event fired!');
              }
          });
        KTApp.unblock(target);
      }
    });
  });

  $('#kt_apps_user_edit input[type=text], #kt_apps_user_edit select, #kt_apps_user_edit textarea').on('focusout', function(){
    var data = {},
        target = $(this).parent();
    data['nik'] = window.Auth.nik;
    data[$(this).attr('name')] = $(this).val();
    KTApp.block(target, {
        overlayColor: '#000000',
        type: 'v2',
        state: 'success',
        message: 'Tunggu...'
    });
    $.ajax({
      url: api_url + '/api/account/user/edit/field',
      type: 'POST',
      data: data,
      success: function(r){
        KTApp.unblock(target);
      },
      error: function(){
        KTApp.unblock(target);
      }
    });
  });

  // get biodata on load
  $.ajax({
    url: api_url + '/api/account/user/biodata',
    type: 'POST',
    data: {nik: window.Auth.nik},
    success: function(r){
      if(r.status){
        $.each(r.data, function(k,v){
          if(k == 'address')
            $('textarea[name='+k+']').html(v);
          else if(k == 'marital_code')
            $('select[name='+k+']').val(v);
          else
            $('input[name='+k+']').val(v);
        });
      }
    }
  });

});
