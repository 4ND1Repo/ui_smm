// datagrid library with vertical scrollbar

var myGrid = function(){
    var column = null,
        url = null,
        page = 10,
        height = 400,
        fn = null,
        target = '.kt-datatable',
        datatable = null,
        _data = null,
        _find = "#generalSearch";

    var _check_var = function(){
        if(column == null){
            console.log('Your column field not define')
            return _response(false,'Column not set',null);
        } else if(typeof column !== 'object'){
            console.log('Your column field not object format')
            return _response(false,'Column not set',null);
        } else if(typeof fn !== 'function'){
            console.log('Your function field not function format')
            return _response(false,'Function not set',null);
        } else if(typeof url == null){
            console.log('Your url field not define')
            return _response(false,'Url not set',null);
        }
        return _response(true,'all sets',null);
    };

    var _response = function(s,m,d){
        return {'status':s?1:0,'message':m,'data':d};
    }

    var _set = function(ty,v){
        if(ty == 'column')
            column = v;
        if(ty == 'url')
            url = v;
        if(ty == 'page')
            page = v;
        if(ty == 'height')
            height = v;
        if(ty == 'function')
            fn = v;
        if(ty == 'target')
            target = v;
        if(ty == 'data')
            _data = v;
        if(ty == 'finder')
            _find = v;
    }

    var _render = function(){

        return $(target).KTDatatable({
      			data: {
              type: 'remote',
      				source: {
      					read: {
                  url: url,
                  params: _data
      					}
      				},
      				pageSize: page,
      				serverPaging: true,
      				serverFiltering: true,
              serverSorting: true
              // saveState: {
              //   webstorage: false
              // }
      			},
      			layout: {
      				scroll: true,
      				height: height,
              footer: false
      			},
      			sortable: true,
      			filterable: false,
                  pagination: true,
                  toolbar: {
                      items: {
                          pagination: {
                              pageSizeSelect : [10, 25, 50, 100, 500]
                          }
                      }
                  },
      			search: {
      				input: $(_find)
      			},
            columns: column
        });
    }

    var _func = function(){
        if(typeof fn !== null)
            fn();
    }

    return {
        element: function(){
            return this[(target.replace("#",'',target)).replace(".",'',target)];
        },
        set: function(ty,v){
            _set(ty,v);
            return this;
        },
        init: function(){
            var res = _check_var();
            if(res.status){
                this[(target.replace("#",'',target)).replace(".",'',target)] = _render();
                _func();
            }
            return res;
        }
    }
}();

// get grid by class
class myGrids {
    constructor(u = null,t = '.kt-datatable', h = 400, p = 10){
        this._column = null;
        this._url = u;
        this._page = p;
        this._height = h;
        this._fn = null;
        this._target = t;
        this._datatable = null;
        this._data = null;
        this._find = "#generalSearch";
    }

    set = function(k,v){
        var key;

        if(key = this.#validation(k,v)){
            this[key] = v;
        }
    }

    #validation = function(k,v){
        if(typeof this['_'+k] == "undefined"){
            console.log("Your key : " + k + ", is not defined");
            return null;
        } else if(k == "fn"){
            if(typeof v !== 'function'){
                console.log("Your key : " + k + ", is not function");
                return null;
            }
        }
        return '_'+k;
    }

    #render = function(){
        this._datatable = $(this._target).KTDatatable({
			data: {
        type: 'remote',
				source: {
					read: {
            url: this._url,
            params: this._data
					}
				},
				pageSize: this._page,
				serverPaging: true,
				serverFiltering: true,
        serverSorting: true
			},
			layout: {
				scroll: true,
				height: this._height,
        footer: false,
        spinner: {
            message: "Mohon menunggu..."
        }
			},
			sortable: true,
			filterable: false,
            pagination: true,
            toolbar: {
                items: {
                    pagination: {
                        pageSizeSelect : [10, 25, 50, 100, 500]
                    }
                }
            },
			search: {
				input: $(this._find)
			},
			columns: this._column,
        });

        if(typeof this._fn !== null)
            this['_fn']();
    }

    get = function(k){
        return (typeof this['_'+k] !== "undefined"?this['_'+k]:null);
    }

    init = function(){
        this.#render();
    }
}

// price forcmat
var price = function(){

    var formatMoney = function(amount,decimalCount,decimal,thousands){
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
          } catch (e) {
            console.log(e)
          }
    }

    return {
        format: function(amount, decimalCount = 2, decimal = ".", thousands = ","){
            return formatMoney(amount,decimalCount,decimal,thousands);
        }
    };
}();

// infinite scroll

var KTInfinite = function(){

  var _configuration = function(el, c){
    if(typeof c === 'object'){
      Object.assign(el.config, c);
    }
  }

  var _get = function(el, v){
    return (typeof el.config[v] !== 'undefined'? el.config['v']: null);
  }

  var _render = function(el){
    $(el.config.element).scroll(function() {
        console.log(($(el.config.element).scrollTop() + $(el.config.element).height() + 20)+ " " + $(el.config.target).children(":last-child")[0].offsetTop);
        if($(el.config.element).scrollTop() + $(el.config.element).height() + 20 >= ((el.config.target == el.config.element)? $(el.config.target).children(":last-child")[0].offsetTop : $(el.config.target).height())) {
            // _loading(true);
            if(typeof el.ajx !== 'object' && (typeof el.config.finish === 'undefined'))
              el.ajx = _load(el);
            if((typeof el.config.finish !== 'undefined') && (typeof el.config.end !== 'undefined') && $(el.config.target).find('.end-of-infinite').length == 0)
              $(el.config.target).append('<div class="end-of-infinite text-center kt-timeline-v2__item-text">'+el.config.end+"</div>");
        }
    });
  }

  var _load = function(el){
    _loading(el,true);
    return $.ajax({
      url: el.config.url,
      type: "POST",
      data: {last:el.config.last, length:(typeof el.config.length !== 'undefined'?el.config.length:5)},
      success: function(r){
        if(r.status){
          el.config.last = r.data.last;
          // halt if the end of content
          if(r.data.content.length == 0) el.config.finish = 1;

          if(typeof el.config.template === 'function'){
            r.data.content.forEach(function(v,k){
              $(el.config.target).append(el.config.template(v));
            });
            if(typeof el.config.fn !== 'undefined'){
              if(typeof el.config.fn === 'function')
                el.config.fn();
            }
          }
        }
        _loading(el,false);
        el.ajx = "";
      },
      error: function(){
        _loading(el,false);
        el.ajx = "";
      }
    });
  }

  var _loading = function(el,s){
    if(s) $(el.config.target).append('<div class="infinite-loading text-center">Loading...</div>');
    else $(el.config.target).find('.infinite-loading').remove();
  }

  return {
    init: function(c){
      this.config = {
        element: null,
        target: null,
        template: null,
        last: null
      },
      this.ajx = "";

      _configuration(this, c);
      _render(this);
      this['last'] = _get(this,'last');
      this['element'] = this;
    },
    reload: function(el){
      $(el.element).unbind('scroll');
      KTInfinite.init(el);
    }
  };
}();






// for complaint form and data
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
            var tmp = $(el.formId).serializeArray(),
                data= {};

            var callback = function(d=null,el){
                  if(typeof d === 'object')
                    Object.assign(el, d);
                  console.log(el);
                  return el;
                };

            if(typeof el.fn.before !== 'undefined'){
              var ret = true;
              if(!(ret = el.fn.before(el,callback)))
                return;
            }

            // collecting data
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
        },
        errorElement: 'span',
        errorClass: 'error invalid-feedback',
        errorPlacement: function(error, element) {
            if(element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
            element.addClass('is-invalid');
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
                        <span class="kt-notification__item-time" title="'+v.create_date+'">\
                            '+v.create_date+'\
                        </span>\
                    </div>\
                </a>';
            $('#kt_quick_panel div.kt-notification').append(tmp);
          });

          $("#kt_quick_panel_tab_my_complaint").find('span').timeago();

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

var KTNotification = function(){
  var _get = function(el){
    var t = el,
        target_icon = '.kt-header__topbar-icon',
        target_notif = '#topbar_notifications_notifications .kt-notification';

    $.ajax({
      url: el.link,
      type: 'POST',
      data: {nik:window.Auth.nik,init:(typeof t.init !== 'undefined'?1:0)},
      success: function(r){
        if(r.status){
          var data = r.data;
          if(data.count > 0 || (typeof t.init !== 'undefined')){
            $.each(data.content, function(k,v){
              var tmp = '<a href="'+(v.notification_url !== null?v.notification_url:"javascript:void(0);")+'" target="_self" data-id="'+v.notification_id+'" class="kt-notification__item'+(v.notification_read==1?' kt-notification__item--read':'')+'">\
              <div class="kt-notification__item-icon">\
              <i class="'+v.notification_icon+'"></i>\
              </div>\
              <div class="kt-notification__item-details" style="width: calc(100% - 32px - 39px)">\
              <div class="kt-notification__item-title" title="'+(v.notification_title!=null?v.notification_title+" : ":"")+v.notification_content+'" data-toggle="kt-tooltip" data-placement="top" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\
              '+(v.notification_title!=null?v.notification_title+" : ":"")+v.notification_content+'\
              </div>\
              <div class="kt-notification__item-time" title="'+v.notification_time+'"></div>\
              </div>\
              </a>';
              $(target_notif).prepend(tmp);
              $(target_notif+' a[data-id="'+v.notification_id+'"] .kt-notification__item-time').timeago();
              $(target_notif+' a[data-id="'+v.notification_id+'"] [data-toggle="kt-tooltip"]').tooltip();


              // stop propagation
              $(target_notif+' a[data-id="'+v.notification_id+'"]').click(function(e){
                var elm = this;
                if(! $(elm).hasClass('kt-notification__item--read'))
                  $.ajax({
                    url: el.link+"/read",
                    type: 'POST',
                    data: {id:$(elm).data('id')},
                    success: function(r){
                      if(r.status)
                        $(elm).addClass('kt-notification__item--read');
                    }
                  });

                e.stopPropagation()
              });
            });
            if($(target_notif).find('.kt-notification__item--read').length < $(target_notif+' a').length){
              // if(! $(target_icon).hasClass('kt-pulse')){
                $(target_icon).addClass('kt-pulse kt-pulse--brand');
              // }
            }

            if(typeof t.init !== 'undefined') {
              // infinite Scroll for notif
              window.ktN1 = new KTInfinite.init({
                element:"#topbar_notifications_notifications .kt-notification",
                target:"#topbar_notifications_notifications .kt-notification",
                url: api_url+"/api/mng/user/notification/infinite/"+window.Auth.nik,
                length: 5,
                last: $("#topbar_notifications_notifications .kt-notification > a").length,
                end: 'Sudah di akhir',
                template: function(r){
                  return '<a href="'+(r.notification_url !== null?r.notification_url:"javascript:void(0);")+'" target="_blank" data-id="'+r.notification_id+'" class="kt-notification__item'+(r.notification_read==1?' kt-notification__item--read':'')+'">\
                  <div class="kt-notification__item-icon">\
                  <i class="'+r.notification_icon+' kt-font-success"></i>\
                  </div>\
                  <div class="kt-notification__item-details" style="width: calc(100% - 32px - 39px)">\
                  <div class="kt-notification__item-title" title="'+(r.notification_title!=null?r.notification_title+" : ":"")+r.notification_content+'" data-toggle="kt-tooltip" data-placement="top" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\
                  '+(r.notification_title!=null?r.notification_title+" : ":"")+r.notification_content+'\
                  </div>\
                  <div class="kt-notification__item-time" title="'+r.notification_time+'"></div>\
                  </div>\
                  </a>';
                },
                fn: function(){
                  $('.kt-notification__item-time').timeago();
                  $(target_notif+' a [data-toggle="kt-tooltip"]').tooltip();

                  // stop propagation
                  $(target_notif+' a').unbind('click');
                  $(target_notif+' a').click(function(e){
                    var elm = this;
                    if(! $(elm).hasClass('kt-notification__item--read'))
                      $.ajax({
                        url: el.link+"/read",
                        type: 'POST',
                        data: {id:$(elm).data('id')},
                        success: function(r){
                          if(r.status)
                            $(elm).addClass('kt-notification__item--read');
                        }
                      });

                    e.stopPropagation()
                  });
                }
              });
              console.log('ok');
            }

            // update infinite scroll
            console.log($('#topbar_notifications_notifications .kt-notification > a').length);
            window.ktN1.config.last = $('#topbar_notifications_notifications .kt-notification > a').length;
            KTInfinite.reload(window.ktN1);
            console.log(window.ktN1);
          }
        }
      }
    });

    $(target_icon).click(function(){
      $(this).removeClass('kt-pulse kt-pulse--brand');
    });
  }

  return {
    init: function(c){
      window.notif = {};
      if(typeof c === 'object')
        Object.assign(window.notif, c);

      Object.assign(window.notif, {init:1});
      KTNotification.get(window.notif);
      setTimeout(function(){
        delete window.notif.init;
      },10000);
      window.ktnotify = setInterval(function(){KTNotification.get(window.notif);},10000);

      return this;
    },
    get: function(el){
      if(typeof el !== 'undefined')
        _get(el);
      else
        console.log('Notification configuration not found!');
    }
  };
}();

var KTDownload = function(){
  var tgt = $('body');
  var __ajax = function(t,u,d=null){
    KTApp.block(tgt, {
        overlayColor: '#000000',
        type: 'v2',
        state: 'primary',
        message: 'Sedang memproses...'
    });
    var option = {
      xhrFields: {
        responseType: 'blob'
      },
      type: t==1?'POST':'GET',
      url: u,
      success: function(r,t,h){
        var a = document.createElement('a'),
        url = window.URL.createObjectURL((r instanceof Blob)?r:(new Blob(r, {type : h.getResponseHeader('Content-Type')})));

        a.href = url;
        a.download = (h.getResponseHeader('Content-Disposition').split('"'))[1];
        document.body.append(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        KTApp.unblock(tgt);
      },
      error: function(e){
        KTForm.notif({
          text: 'Kesalahan sistem',
          type: "error",
          timer: 1500
        });
        KTApp.unblock(tgt);
      }
    };
    if(d !== null){
      if(typeof d === 'object'){
        option['data'] = d;
      }
    }
    $.ajax(option);
  }

  var _postDownload = function(u,d){
    __ajax(1,u,d);
  }

  var _getDownload = function(u,d){
    __ajax(0,u,d);
  }

  return {
    post: function(u,d){
      _postDownload(u,d);
    },
    get: function(u){
      _getDownload(u);
    }
  };
}();

















// load all process
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

  if(typeof window.Auth !== 'undefined'){
    // infinte scroll
    window.ktI2 = new KTInfinite.init({
      element:"#kt_quick_panel div.kt-notification",
      target:"#kt_quick_panel div.kt-notification",
      url: api_url+"/api/mng/user/complaint/infinite/"+window.Auth.nik,
      length: 5,
      last: $("#kt_quick_panel div.kt-notification > a").length,
      end: 'Sudah di akhir',
      fn: function(){
          $("#kt_quick_panel_tab_my_complaint").find('span').timeago();
      },
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
                <span class="kt-notification__item-time" title="'+r.create_date+'">\
                    '+r.create_date+'\
                </span>\
            </div>\
        </a>';
      }
    });

    // initiate complaint
    KTComplaintLoad.mycomplaint();
    KTComplaintLoad.complaint();
    // initiate notification
    KTNotification.init({
      link: api_url+'/api/mng/user/notification'
    });

    // form validation for complaint
    var cmpt = new KTForm.init({
      formId:"#FComplaint",
      link: api_url+'/api/mng/user/complaint/add',
      data: {
        nik: window.Auth.nik,
        page_code: window.Auth.page
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
                    var to = $(cmpt.formId).find('[name="complaint_to"]').val();
                    cmpt.element.resetForm();
                    $(cmpt.formId)[0].reset();
                    // send notification to target
                    if(to !== ""){
                      $.ajax({
                        url: api_url+'/api/mng/user/notification/add',
                        type: 'POST',
                        data:{notification_to:to, notification_from:window.Auth.nik, notification_content:'Ada komplain untuk anda', notification_icon: "fa fa-bullhorn kt-font-warning"},
                        success: function(r){
                          console.log(r);
                        }
                      });
                    }

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
    $(window).resize(function(){
      $('#kt_quick_panel').find('.kt-quick-panel__content').css('height', ($('#kt_quick_panel').height()-65.5) + 'px');
    });
    // console.log(ps);

    $('a[href="#kt_quick_panel_tab_complaint"]').click(function(){
      KTComplaintLoad.complaint();
    });

    // autocomplete for complaint_to
    var map = {};
    var res = [],
    compToAutocomplete = $('input[name=complaint_to]').typeahead(null, {
        name: 'complaint_to',
        source: function(query,psc){
            $.ajax({
                url: api_url+'/api/account/user/autocomplete',
                type: 'POST',
                data: {find:query},
                async: false,
                success: function(r){
                    res = [];
                    map = {};
                    $.each(r, function(k,v){
                        res.push(v.label);
                        map[v.label] = v.id;
                    });

                }
            });
            psc(res);
        }
    }).on('typeahead:selected', function(event, selection) {
        var tmp = '',
            data = selection.split(' - ');
        compToAutocomplete.typeahead('val',map[selection]);
    });

    // grab images
    if(window.Auth.photo !== null)
      $('.kt-badge--username, .kt-avatar__holder').removeAttr('style').attr('style', "background-image: url('"+window.Auth.photo+"'); background-size: cover;");

    $('.date-picker').datepicker({
      changeMonth:true,
      changeYear:true,
      format:"yyyy-mm-dd",
      autoclose: true
    }).on('hide',function(event){
        event.preventDefault();
        event.stopPropagation();
    });;
  }
});
