"use strict";

var KTForm = function(){
  var configuration = function(el, c){
    if(typeof c === "object")
      Object.assign(el,c);
  }

  var notif = function(obj){
    var conf = {
        "title": (typeof obj.title !== 'undefined'?obj.title:""),
        "text": (typeof obj.text !== 'undefined'?obj.text:""),
        "type": (typeof obj.type !== 'undefined'?obj.type:"info"),
        "confirmButtonClass": "btn btn-secondary",
        "onClose": function(e) {
            console.log('on close event fired!');
        }
    };

    if(typeof obj.timer !== 'undefined'){
      conf.showConfirmButton = false;
      conf.timer = obj.timer;
    }

    if(typeof obj.fn !== 'undefined'){
      if(typeof obj.fn.close !== 'undefined'){
        if(typeof obj.fn.close !== 'function')
        conf.onClose = obj.fn.close(e);
      }
    }

    if(typeof obj.btn !== 'undefined'){
      if(typeof obj.btn.confirm !== 'undefined')
        conf.confirmButtonClass = obj.btn.confirm;
    }

    // execute swal
    swal.fire(conf).then((res) => {
      if(typeof obj.fn !== 'undefined'){
        if(typeof obj.fn.after !== 'undefined'){
          if(typeof obj.fn.after === 'function'){
            obj.fn.after(res);
          }
        }
      }
    });
  }

  var validation = function(el){
    return $( el.formId ).validate({
        // define validation rules
        rules: el.formRules,

        //display error alert on form submit
        invalidHandler: function(event, validator) {
            notif({
              text: "Mohon periksa kembali inputan anda.",
              type: "error",
            });

            event.preventDefault();
        },

        submitHandler: function (form) {
            if(typeof el.fn.before !== 'undefined')
              el.fn.before(r);

            // collecting data
            var tmp = $(el.formId).serializeArray(),data={};
            tmp.forEach(function(v,k){
              data[v.name] = v.value;
            });

            Object.assign(el.data, data);

            // block ui modal
            KTApp.block(el.formId, {
                overlayColor: '#000000',
                type: 'v2',
                state: 'primary',
                message: 'Processing...'
            });

            $.ajax({
                url: el.link,
                type: "POST",
                data: el.data,
                success: function(r){
                    if(typeof el.fn.after !== 'undefined')
                      el.fn.after(r);

                    KTApp.unblock(el.formId);
                },
                error: function(){
                  notif({
                    text: "Kesalahan sistem",
                    type: "error",
                    timer: 1500
                  });
                  KTApp.unblock(el.formId);
                }
            });
            return false;
        }
    });
  }

  var setRules = function(rule,v){
    if(v == null)
      $(rule).rules("add", {required:true});
    else if(typeof v === 'object')
      $(rule).rules("add", v);
  }

  return {
    init: function(c){
      this['formRules'] = [];
      // need formId, link, data
      configuration(this,c);
      this['element'] = validation(this);
      return this;
    },
    rules: function(r,v=null){
      setRules(r,v);
    },
    notif: function(o){
      notif(o);
    }
  }
}();

var KTComplaintLoad = function(){
  var proccess = function(el){
    $.ajax({
      url: el.link,
      type: 'POST',
      data: el.data,
      async: false,
      success: function(r){
        if(typeof el.fn !== 'undefined')
          el.fn(r);
      },
      error: function(){
        console.log('error');
      }
    });
  }

  return {
    mycomplaint: function(){
      this['id'] = '#kt_quick_panel div.kt-notification';
      this['link'] = api_url+'/api/mng/user/complaint/infinite/'+window.Auth.nik;
      this['data'] = {length:10};
      this['fn'] = function(r){
        if(r.status){
          r.data.content.forEach(function(v,k){
            var t = v.create_date.split(" "),
                tm = t[1].split(":"),
                icon = {
                  'CMPT003': 'kt-font-danger',
                  'CMPT002': 'kt-font-warning',
                  'CMPT001' : 'kt-font-success',
                  'CMPT004': 'kt-font-info'
                },
                tmp = '<a href="javascript:;" class="kt-notification__item kt-notification__item--read">\
                    <div class="kt-notification__item-icon">\
                        <i class="flaticon2-user '+icon[v.complaint_type]+'"></i>\
                    </div>\
                    <div class="kt-notification__item-details">\
                        <div class="kt-notification__item-title">\
                            '+v.complaint_description+'\
                        </div>\
                        <div class="kt-notification__item-time">\
                            '+v.create_date+'\
                        </div>\
                    </div>\
                </a>';
            $('#kt_quick_panel div.kt-notification').append(tmp);
          });


          window.ktI2.config.last = $('#kt_quick_panel div.kt-notification > a').length;
          KTInfinite.reload(window.ktI2);
        }
      }
      if($(this.id).text !== "")
        $(this.id).html("");

      proccess(this);
    },
    complaint: function(){
      this['id'] = '#complaint-list .kt-timeline-v2__items';
      this['link'] = api_url+'/api/mng/user/complaint/infinite/0';
      this['data'] = {length:10};
      this['fn'] = function(r){
        if(r.status){
          r.data.content.forEach(function(v,k){
            var t = v.create_date.split(" "),
                tm = t[1].split(":"),
                icon = {
                  'CMPT003': 'kt-font-danger',
                  'CMPT002': 'kt-font-warning',
                  'CMPT001' : 'kt-font-success',
                  'CMPT004': 'kt-font-info'
                },
                tmp = '<div class="kt-timeline-v2__item">\
                  <span class="kt-timeline-v2__item-time">'+tm[0]+":"+tm[1]+'</span>\
                  <div class="kt-timeline-v2__item-cricle">\
                  <i class="fa fa-genderless '+icon[v.complaint_type]+'"></i>\
                  </div>\
                  <div class="kt-timeline-v2__item-text  kt-padding-top-5">\
                  '+(v.complaint_anonymous==0?v.create_by:"*****")+' ('+t[0]+')'+' :<br/>'+v.complaint_description+'\
                  </div>\
                  </div>';
            $('#complaint-list .kt-timeline-v2__items').append(tmp);
          });


          window.ktI1.config.last = $('#complaint-list .kt-timeline-v2__items > div').length;
          KTInfinite.reload(window.ktI1);
        }
      }
      if($(this.id).text !== "")
        $(this.id).html("");

      proccess(this);
    }
  };
}();

$(document).ready(function(){
  // infinite Scroll
  window.ktI1 = new KTInfinite.init({
    element:"#complaint-list",
    target:"#complaint-list .kt-timeline-v2__items",
    url: api_url+"/api/mng/user/complaint/infinite/0",
    length: 5,
    last: $("#complaint-list .kt-timeline-v2__items > div").length,
    end: 'Sudah di akhir',
    template: function(r){
      var t = r.create_date.split(' '),
          tm = t[1].split(":"),
          icon = {
            'CMPT003': 'kt-font-danger',
            'CMPT002': 'kt-font-warning',
            'CMPT001' : 'kt-font-success',
            'CMPT004': 'kt-font-info'
          };
      return '<div class="kt-timeline-v2__item">\
        <span class="kt-timeline-v2__item-time">'+tm[0]+":"+tm[1]+'</span>\
        <div class="kt-timeline-v2__item-cricle">\
          <i class="fa fa-genderless '+icon[r.complaint_type]+'"></i>\
        </div>\
        <div class="kt-timeline-v2__item-text  kt-padding-top-5">\
          '+(r.complaint_anonymous==0?r.create_by:"*****")+' ('+t[0]+')'+' :<br/>'+r.complaint_description+'\
        </div>\
      </div>';
    }
  });

  // infinte scroll
  window.ktI2 = new KTInfinite.init({
    element:"#kt_quick_panel div.kt-notification",
    target:"#kt_quick_panel div.kt-notification",
    url: api_url+"/api/mng/user/complaint/infinite/"+window.Auth.nik,
    length: 5,
    last: $("#kt_quick_panel div.kt-notification > a").length,
    end: 'Sudah di akhir',
    template: function(r){
      var tm = (r.create_date.split(' '))[1].split(":"),
          icon = {
            'CMPT003': 'kt-font-danger',
            'CMPT002': 'kt-font-warning',
            'CMPT001' : 'kt-font-success',
            'CMPT004': 'kt-font-info'
          };
      return '<a href="javascript:;" class="kt-notification__item kt-notification__item--read">\
          <div class="kt-notification__item-icon">\
              <i class="flaticon2-user '+icon[r.complaint_type]+'"></i>\
          </div>\
          <div class="kt-notification__item-details">\
              <div class="kt-notification__item-title">\
                  '+r.complaint_description+'\
              </div>\
              <div class="kt-notification__item-time">\
                  19 hrs ago\
              </div>\
          </div>\
      </a>';
    }
  });

  // initiate complaint
  KTComplaintLoad.mycomplaint();
  KTComplaintLoad.complaint();

  // form validation for complaint
  var cmpt = new KTForm.init({
    formId:"#FComplaint",
    link: api_url+'/api/mng/user/complaint/add',
    data: {
      nik: window.Auth.nik,
      menu_page: window.Auth.page
    },
    formRules:{
      complaint_description : {required:true, minlength:20}
    },
    fn:{
      after: function(r){
        if(r.status){
            KTForm.notif({
              text: r.message,
              type: "success",
              timer: 1500,
              fn:{
                after: function(r){
                  cmpt.element.resetForm();
                  $(cmpt.formId)[0].reset();

                  KTComplaintLoad.complaint();
                  KTComplaintLoad.mycomplaint();

                  console.log('Success');
                }
              }
            });
        } else {
            KTForm.notif({
              text: r.message,
              type: "warning",
              timer: 1500
            });
        }
      }
    }
  });

  // $('#complaint-list').css('max-height', ($(window).height()-90)+"px").css('overflow-y', 'scroll');
  var ps = new PerfectScrollbar('#complaint-list', {
    wheelSpeed: 0.5,
    wheelPropagation: true,
    minScrollbarLength: 20,
    maxScrollbarLength: 300,
  });

  var kn = new PerfectScrollbar('#kt_quick_panel div.kt-notification', {
    wheelSpeed: 0.5,
    wheelPropagation: true,
    minScrollbarLength: 20,
    maxScrollbarLength: 300,
  });

  $('#kt_quick_panel').find('.kt-quick-panel__content').css('height', ($('#kt_quick_panel').height()-65.5) + 'px');
  // console.log(ps);

  $('a[href="#kt_quick_panel_tab_complaint"]').click(function(){
    KTComplaintLoad.complaint();
  });
});
