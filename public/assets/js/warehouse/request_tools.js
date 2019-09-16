"use strict";

var KTRequestTools = function(){
    var formId = "#FReqtools",
        formModal = '#addReqtools',
        _el = null;

    var _validation = function(){
        _el = $( formId ).validate({
            // define validation rules
            rules: {
                name_of_request: {
                    required: true,
                    maxlength: 30
                }
            },

            //display error alert on form submit
            invalidHandler: function(event, validator) {
                swal.fire({
                    "title": "",
                    "text": "Mohon periksa kembali inputan anda.",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary",
                    "onClose": function(e) {
                        console.log('on close event fired!');
                    }
                });

                event.preventDefault();
            },

            submitHandler: function (form) {
                if($('.request_tools_new .data-row').length == 0){
                    swal.fire({
                        title: "",
                        text: "belum mengisi stok yang dibutuhkan",
                        type: "warning",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return false;
                }
                var link = api_url+"/api/wh/req/tools/add";
                var bEdit = $(".btn-submit")[0].hasAttribute('edit');
                if(bEdit)
                    link = api_url+"/api/wh/req/tools/edit";

                var data = $(formId).serializeArray();
                data.push({name:"nik", value:Window.Auth.nik});
                data.push({name:"page_code", value:'wh'});
                data.push({name:"page_code_from", value:window.page_from});
                // block ui modal
                var target = formModal+' .modal-content';
                KTApp.block(target, {
                    overlayColor: '#000000',
                    type: 'v2',
                    state: 'primary',
                    message: 'Processing...'
                });

                $.ajax({
                    url: link,
                    type: "POST",
                    data: data,
                    success: function(r){
                        if(r.status){
                            $(formId+" .request_tools_new").find(".data-row").remove();
                            $(formId+" input[type=text]")[0].focus();

                            if(bEdit){
                                $(formModal).modal('hide');
                                $('.btn-submit')[0].removeAttribute('edit');
                            }

                            $('.request_tools').html('');
                            swal.fire({
                                title: "",
                                text: r.message,
                                type: "success",
                                showConfirmButton: false,
                                timer: 1500
                            }).then((res) => {
                                $(formId+" input[type=text]")[0].focus();
                                // send notification to target
                                $.ajax({
                                  url: api_url+'/api/mng/user/notification/add',
                                  type: 'POST',
                                  data:{notification_to:'wh', notification_from:window.Auth.nik, notification_content:'Ada request barang', notification_url:base_url+'/wh/req/tools', notification_icon: "fa fa-box kt-font-info"},
                                  success: function(r){
                                    console.log(r);
                                  }
                                });
                            });
                            KTGridRequestTools.element().reload();
                        } else {
                            swal.fire({
                                title: "",
                                text: r.message,
                                type: "warning",
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                        KTApp.unblock(target);
                    },
                    error: function(){
                        swal.fire({
                            title: "",
                            text: "Kesalahan sistem",
                            type: "error",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        KTApp.unblock(target);
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

    return {
        init: function(){
            _validation();
        },
        element: function(){
            return _el;
        }
    };
}();

var KTFormPO = function(){
  var formId = '#FPO',
      link_add = api_url+"/api/wh/req/po/add",
      formRules = {},
      formModal = '#addPO';

  var validation = function(){
    return $( formId ).validate({
        // define validation rules
        rules: formRules,

        //display error alert on form submit
        invalidHandler: function(event, validator) {
            swal.fire({
                "title": "",
                "text": "Mohon periksa kembali inputan anda.",
                "type": "error",
                "confirmButtonClass": "btn btn-secondary",
                "onClose": function(e) {
                    console.log('on close event fired!');
                }
            });

            event.preventDefault();
        },

        submitHandler: function (form) {
            var link = link_add;

            var data = $(formId).serializeArray();
            data.push({name:"nik", value:window.Auth.nik});
            data.push({name:"page_code", value:window.Auth.page});
            data.push({name:"page_code_destination", value:'pur'});
            // block ui modal
            var target = formModal+' .modal-content';
            KTApp.block(target, {
                overlayColor: '#000000',
                type: 'v2',
                state: 'primary',
                message: 'Processing...'
            });

            $.ajax({
                url: link,
                type: "POST",
                data: data,
                success: function(r){
                    if(r.status){
                        swal.fire({
                            title: "",
                            text: r.message,
                            type: "success",
                            showConfirmButton: false,
                            timer: 1500
                        }).then((res) => {
                            $('#FPO .list-body').html('');
                            window.po = {};
                            myGrid.element().reload();
                            console.log('Success');

                            // send notification to target
                            $.ajax({
                              url: api_url+'/api/mng/user/notification/add',
                              type: 'POST',
                              data:{notification_to:'pur', notification_from:window.Auth.nik, notification_content:'Ada request PO', notification_url:base_url+'/pur/req/po', notification_icon: "fa fa-book kt-font-warning"},
                              success: function(r){
                                console.log(r);
                              }
                            });

                            Swal.fire({
                                title: '',
                                text: "Pindah ke halaman PO ?",
                                type: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Ya',
                                cancelButtonText: 'Tidak',
                            }).then((result) => {
                                if (result.value) {
                                  window.location = base_url+'/wh/req/po';
                                }
                                $('#addPo').modal('hide');
                            });
                        });
                    } else {
                        swal.fire({
                            title: "",
                            text: r.message,
                            type: "warning",
                            showConfirmButton: false,
                            timer: 1500
                        }).then((res) => {
                            console.log('failed');
                        });
                    }
                    KTApp.unblock(target);
                },
                error: function(){
                    swal.fire({
                        title: "",
                        text: "Kesalahan sistem",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then((res) => {
                        console.log('failed');
                    });
                    KTApp.unblock(target);
                }
            });
            return false;
        }
    });
  }

  var setRules = function(rule){
    $(rule).rules("add", {required:true, min: 0.01});
  }

  return {
    init: function(){
      console.log('init form');
      this[formId.replace(/'#|.'/g,'')] = validation();
    },
    element: function(){
      return this[formId.replace(/'#|.'/g,'')];
    },
    rules: function(r){
      console.log('set rule');
      setRules(r);
    }
  }
}();

var KTGridRequestTools = function(){
    var _el,
        gridId = "#datagrid-req-tools",
        height = '550',
        url = api_url+'/api/wh/req/tools/grid',
        page = '10';

    var _KTDatatable = function(){
        myGrid.set('target', gridId);
        myGrid.set('height', height);
        myGrid.set('url', url);
        myGrid.set('page', page);
        myGrid.set('column',
            [{
                field: 'req_tools_code',
                title: 'Kode Request'
            }, {
                field: 'name_of_request',
                title: 'Nama Request'
            }, {
                field: 'req_tools_date',
                title: 'Tanggal Request'
            }, {
                field: 'sum_item',
                title: 'jumlah item'
            }, {
                field: 'status_label',
                title: 'Status',
                template: function(row){
                    var status = {
                        1: {'title': 'Pending', 'class': 'kt-badge--brand'},
                        2: {'title': 'Delivered', 'class': ' kt-badge--danger'},
                        "ST04": {'title': 'Canceled', 'class': ' kt-badge--primary'},
                        "ST05": {'title': 'Success', 'class': ' kt-badge--success'},
                        5: {'title': 'Info', 'class': ' kt-badge--info'},
                        "ST03": {'title': 'Danger', 'class': ' kt-badge--danger'},
                        "ST02": {'title': 'Warning', 'class': ' kt-badge--warning'},
                    };
                    return '<span class="kt-badge ' + (typeof status[row.status] !== 'undefined'?status[row.status].class:'') + ' kt-badge--inline kt-badge--pill">' + row.status_label + '</span>';
                }
            }, {
                field: 'action',
                title: 'Aksi',
                sortable: false,
                width: 80,
                overflow: 'visible',
                autoHide: false,
                template: function(row) {
                    var btn = [];
                    if(window.role.edit == 1)
                        btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-detail" id="'+row.req_tools_code+'" title="Detail data">\
                            <i class="la la-search-plus"></i>\
                        </a>');

                    if(window.role.del == 1){
                        if(row.finish_by == null)
                            btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.req_tools_code+'" title="Hapus">\
                            <i class="la la-trash"></i>\
                            </a>');
                    }
                    return myGrid.action(btn);
                },
            }]
        );
        myGrid.set('data',{page_code:Window.Auth.page});
        myGrid.set('function', function(){
            $('select[name=status]').on('change', function() {
                myGrid.element().search($(this).val(), 'status');
            });
            $('select[name=status]').selectpicker();

            // function buttin on datatable grid
            $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {
                $('.btn-detail').click(function(){
                    $.ajax({
                        url: api_url+'/api/wh/req/tools/find/'+$(this).attr('id'),
                        type: 'GET',
                        success: function(res){
                            if(res.status){
                                var data = res.data;
                                $('input[name=name_of_request]').val(data.request_tools.name_of_request).prop('readonly',true);
                                $('input[name=req_nik]').val(data.request_tools.req_nik).prop('readonly',true);
                                $('#addReqtools  .take-by').removeClass('kt-hidden');

                                $.each(data.request_tools_detail, function(k,v){
                                    var tmp = '';

                                    /* old data get*/
                                    // tmp = '<div class="col-md-3">';
                                    // tmp += '<div class="list-item">';
                                    // tmp += '<div class="item_header">'+v.stock_code+'</div>';
                                    // tmp += '<div class="item_body">';
                                    // tmp += '<div>'+v.stock_name+'&nbsp;</div>';
                                    // tmp += '<div>'+v.stock_type+'&nbsp;</div>';
                                    // tmp += '<div>'+v.stock_size+'&nbsp;</div>';
                                    // tmp += '<div>'+v.stock_brand+'&nbsp;</div>';
                                    // tmp += '<div><textarea name="notes['+v.stock_code+']" rows="2" class="form-control form-control-sm" placeholder="keterangan" readonly>'+(v.req_tools_notes==null?"":v.req_tools_notes)+'</textarea></div>';
                                    // tmp += '<div class="input-group input-group-sm"><input type="text" class="form-control form-control-sm qtyStock" name="items['+v.stock_code+']" value="'+v.req_tools_qty+'" disabled><div class="input-group-append"><span class="input-group-text">'+v.measure_type+'</span></div></div>'
                                    // tmp += '</div>';
                                    // if(v.finish_by == null && v.fullfillment == 1)
                                    //     tmp += '<div class="text-center"><button type="button" class="btn btn-success btn-wide btn-sm btn-send" data-from="'+data.request_tools.page_code_from+'" id="'+v.stock_code+'-'+v.req_tools_code+'">Kirim</botton></div>';
                                    // else if(v.finish_by == null && v.fullfillment == 0)
                                    //     tmp += '<div class="text-center"><button type="button" class="btn btn-warning btn-wide btn-sm btn-add-po" id="'+v.stock_code+'-'+v.req_tools_code+'">Buat PO</botton></div>';
                                    // tmp += '</div>';
                                    // tmp += '</div>';
                                    // tmp += '</div>';

                                    tmp += '<div class="row_request data-row'+((v.finish_by == null && v.fullfillment == 0)?' text-danger':'')+'">';
                                    tmp += '<div>'+v.stock_code+'</div>';
                                    tmp += '<div>'+v.stock_name+'</div>';
                                    tmp += '<div class="text-center">'+v.stock_size+'</div>';
                                    tmp += '<div class="text-center">'+v.stock_type+'</div>';
                                    tmp += '<div>'+v.stock_brand+'</div>';
                                    tmp += '<div class="text-center">'+v.stock_color+'</div>';
                                    tmp += '<div class="text-right">'+v.stock_qty+'</div>';
                                    tmp += '<div class="text-right"><div class="input-group input-group-sm"><input type="text" class="form-control form-control-sm qtyStock" name="items['+v.stock_code+']" value="'+v.req_tools_qty+'"><div class="input-group-append"><span class="input-group-text">'+v.measure_type+'</span></div></div></div>';
                                    tmp += '<div><input type="text" class="form-control form-control-sm" name="notes['+v.stock_code+']" value="'+(v.req_tools_notes!=null?v.req_tools_notes:'')+'"></div>';
                                    tmp += '<div>'+((v.finish_by == null && v.fullfillment == 1)?'<i class="fa fa-share-square text-success btn-send" id="'+v.stock_code+'-'+v.req_tools_code+'" title="Berikan"></i>':((v.finish_by == null && v.fullfillment == 0)?'<i class="fa fa-book text-danger btn-add-po" id="'+v.stock_code+'-'+v.req_tools_code+'" title="Tambahkan ke PO"></i>':'<i class="fa fa-check text-success"></i>'))+'</div>';
                                    tmp += '</div>';

                                    $('.request_tools_new').append(tmp);
                                });

                                $(".qtyStock").inputmask('decimal', {
                                    rightAlignNumerics: false
                                });

                                $('#addReqtools .modal-footer, #addReqtools .validated.search > div:first-child').addClass('kt-hidden');

                                $('#addReqtools').modal('show');

                                $(".btn-send").unbind('click');
                                // send to stock
                                $('.btn-send').click(function(){
                                    var id = ($(this).attr('id')).split('-'),
                                        el = this,
                                        receiver = 'input[name=req_take_nik]';
                                    if($(receiver).val() == ""){
                                      KTForm.notif({
                                        text: 'Mohon input NIK yang mengambil.',
                                        type: 'warning',
                                        timer: 1500,
                                        fn:{
                                          after: function(r){
                                            setTimeout(function(){
                                              $(receiver).focus();
                                            },1000);
                                          }
                                        }
                                      });
                                    } else {
                                      // block ui modal
                                      var target = $(el).parent().parent();
                                      KTApp.block(target, {
                                        overlayColor: '#000000',
                                        type: 'v2',
                                        state: 'primary',
                                        message: 'Processing...'
                                      });
                                      $.ajax({
                                        url: api_url+"/api/wh/req/tools/send",
                                        type: "POST",
                                        data: {stock_code:id[0], req_tools_code:id[1], req_take_nik: $(receiver).val(), nik:Window.Auth.nik},
                                        success: function(r){
                                        //   $(el).parent().remove();
                                            $(el).parent().html('<i class="fa fa-check text-success"></i>');
                                          _el.reload();
                                          KTApp.unblock(target);

                                          // send notification to target
                                          $.ajax({
                                            url: api_url+'/api/mng/user/notification/add',
                                            type: 'POST',
                                            data:{notification_to:$('[name=req_nik]').val(), notification_from:window.Auth.nik, notification_content:'Barang('+id[1]+' -> '+id[0]+') diberikan', notification_url:base_url+'/'+$(el).data('from')+'/req/tools', notification_icon: "fa fa-box-open kt-font-success"},
                                            success: function(r){
                                              console.log(r);
                                            }
                                          });
                                        },
                                        error: function(){
                                          KTApp.unblock(target);
                                          console.log('error while send process');
                                        }
                                      });
                                    }
                                });

                                $('.btn-add-po').click(function(){
                                    var id = ($(this).attr('id')).split('-'),
                                        el = this;

                                    // add to list po
                                    if(!(id[0] in window.po)){
                                        // getting data
                                        $.ajax({
                                          url: api_url+'/api/wh/stock/find_by_stock',
                                          type: 'POST',
                                          data: {stock_code:id[0], page_code:window.Auth.page},
                                          success: function(r){
                                            if(r.status){
                                              window.po[id[0]] = r.data;
                                              Swal.fire({
                                                  title: '',
                                                  text: 'Stok sudah ditambahkan ke daftar PO',
                                                  type: 'success',
                                                  showConfirmButton: false,
                                                  timer: 1500
                                              });
                                            }
                                          }
                                        });
                                    } else
                                      Swal.fire({
                                          title: '',
                                          text: 'Stok sudah ada di list PO',
                                          type: 'warning',
                                          showConfirmButton: false,
                                          timer: 1500
                                      });
                                });

                            }
                        },
                        error: function(){
                            console.log('error getting data');
                        }
                    });
                });

                $('.btn-delete').click(function(){
                    Swal.fire({
                        title: 'Anda yakin?',
                        text: "kamu tidak bisa mengembalikannya kembali!",
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ya',
                        cancelButtonText: 'Tidak',
                    }).then((result) => {
                        if (result.value) {
                            var el = this;
                            $.ajax({
                                url: api_url+'/api/wh/req/tools/delete',
                                type: 'POST',
                                data: {'req_tools_code':$(el).attr('id'),nik:Window.Auth.nik},
                                success: function(r){
                                    Swal.fire({
                                        title: 'Terhapus!',
                                        text: 'Data telah terhapus.',
                                        type: 'success',
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                    _el.reload();
                                    $('[name=find]')[0].focus();

                                    // send notification to target
                                    $.ajax({
                                      url: api_url+'/api/mng/user/notification/add',
                                      type: 'POST',
                                      data:{notification_to:$('[name=req_nik]').val(), notification_from:window.Auth.nik, notification_content:'Request Barang('+$(el).attr('id')+') digagalkan', notification_url:base_url+'/wh/req/tools', notification_icon: "fa fa-trash kt-font-danger"},
                                      success: function(r){
                                        console.log(r);
                                      }
                                    });
                                },
                                error: function(){
                                    console.log('error delete');
                                }
                            });
                        }
                    });
                });
            });


        });
        myGrid.init();
        _el = myGrid.element();
    }
    return {
        init: function(){
            _KTDatatable();
        },
        element: function(){
            return _el;
        }
    }
}();

// function delete item from list
var delete_items_stock = function(id=null){
    if(id != null){
        $('.request_tools').find('#'+id).remove();
    }
}

$(document).ready(function(){
    myStorage.set('auth');
    Window.Auth = JSON.parse(myStorage.get());
    window.po = {};
    window.page_from = Window.Auth.page;
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      };

    // initiate
    KTRequestTools.init();
    KTGridRequestTools.init();
    KTFormPO.init();

    $('#addReqtools').find('.btn-submit').click(function(){
        $('#FReqtools').submit();
    });

    // reset form when hide
    $("#addReqtools").on('hide.bs.modal', function(){
        // $('.request_tools').html('');
        $('.request_tools_new .data-row').remove();
        $('input[name=name_of_request]').val('').prop('readonly',false);
        $('input[name=req_nik]').val('').prop('readonly',false);
        $('#addReqtools .modal-footer, #addReqtools .validated.search > div:first-child').removeClass('kt-hidden');
        KTRequestTools.element().resetForm();
        $('#FReqtools').find('.invalid-feedback').remove();
        $('.take-by').addClass('kt-hidden');
    });



    // autocomplete
    var map = {},
        datas = {};
    var res = [],
    stockAutocomplete = $('input[name=stock_name].autocomplete').typeahead(null, {
        name: 'stock_name',
        limit: 100,
        autoselect: true,
        source: function(query,psc){
            $.ajax({
                url: api_url+'/api/wh/stock/autocomplete',
                type: 'POST',
                data: {find:query, page_code:window.Auth.page},
                async: false,
                success: function(r){
                    res = [];
                    map = {};
                    $.each(r, function(k,v){
                        res.push(v.label);
                        map[v.label] = v.id;
                        datas[v.label] = v.data;
                    });

                }
            });
            psc(res);
        }
    }).on('typeahead:selected', function(event, selection) {
        var tmp = '',
            data = selection.split(' - ');
        /* old process data */
        // tmp += '<div class="col-md-3" id="'+map[selection]+'">';
        // tmp += '<div class="list-item">';
        // tmp += '<div class="item_header">'+data[0]+'<span class="item" onclick="delete_items_stock(\''+map[selection]+'\')"><i class="flaticon-close"></i></span></div>';
        // tmp += '<div class="item_body">';
        // tmp += '<div>'+data[1]+'&nbsp;</div>';
        // tmp += '<div>'+data[2]+'&nbsp;</div>';
        // tmp += '<div>'+data[3]+'&nbsp;</div>';
        // tmp += '<div>'+data[4]+'&nbsp;</div>';
        // tmp += '<div><textarea name="notes['+data[0]+']" rows="2" class="form-control form-control-sm" placeholder="keterangan"></textarea></div>';
        // tmp += '<div class="input-group input-group-sm"><input type="text" class="form-control form-control-sm qtyStock" name="items['+data[0]+']" value="0"><div class="input-group-append"><span class="input-group-text">'+data[5]+'</span></div></div>';
        // tmp += '</div>';
        // tmp += '</div>';
        // tmp += '</div>';

        tmp += '<div class="row_request data-row" id="'+map[selection]+'">';
        tmp += '<div>'+datas[selection]['stock_code']+'</div>';
        tmp += '<div>'+datas[selection]['stock_name']+'</div>';
        tmp += '<div class="text-center">'+datas[selection]['stock_size']+'</div>';
        tmp += '<div class="text-center">'+datas[selection]['stock_type']+'</div>';
        tmp += '<div>'+datas[selection]['stock_brand']+'</div>';
        tmp += '<div class="text-center">'+datas[selection]['stock_color']+'</div>';
        tmp += '<div class="text-right">'+(datas[selection]['qty']==0?0:datas[selection]['qty'])+'</div>';
        tmp += '<div class="text-right"><div class="input-group input-group-sm"><input type="text" class="form-control form-control-sm qtyStock" name="items['+datas[selection]['stock_code']+']" value=""><div class="input-group-append"><span class="input-group-text">'+datas[selection]['measure_type']+'</span></div></div></div>';
        tmp += '<div><input type="text" class="form-control form-control-sm" name="notes['+datas[selection]['stock_code']+']" value=""></div>';
        tmp += '<div class="text-center"><i class="fa fa-trash" onclick="$(this).parent().parent().remove()"></i></div>';
        tmp += '</div>';
        if($('.request_tools_new').find("div[id='"+map[selection]+"']").length > 0){
            swal.fire({
                title: "",
                text: "Data sudah ada di daftar",
                type: "warning",
                showConfirmButton: false,
                timer: 1500
            });
        } else{
            $('.request_tools_new').append(tmp);
            $(".qtyStock").inputmask('decimal', {
                rightAlignNumerics: false
            });
            // $(".qtyStock").unbind('keayup');
            $(".qtyStock").keyup(function(){
                var el = this;
                if(parseFloat($(el).parent().parent().prev().text()) < parseFloat($(el).val())){
                    $(el).parent().parent().parent().addClass('text-danger');
                    toastr.warning($(el).parent().parent().parent().children('div:first-child').text()+' kurang dari yang diminta');
                } else {
                    $(el).parent().parent().parent().removeClass('text-danger');
                }
            });

            $('.request_tools_new input[name="items['+datas[selection]['stock_code']+']"]').rules('add', {required:true, min:0.01});
        }
        stockAutocomplete.typeahead('val','');
    });
    $('#FReqtools .typeahead').on('keyup', function(e) {
        if(e.which == 13) {
            $(".tt-suggestion:first-child", this).trigger('click');
        }
    });


    // autocomplete
    var map = {};
    var res = [],
    nikAutocomplete = $('input[name=req_nik]').typeahead(null, {
        name: 'req_nik',
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
        $('[name=name_of_request]').val(data[1]);
        nikAutocomplete.typeahead('val',data[0]);
        // get page from
        $.ajax({
          url: api_url+'/api/account/user/check/group',
          type: 'POST',
          data: {nik : data[0]},
          success: function(r){
            window.page_from = r.data.page_code;
          }
        });
    });


    // autocomplete
    var map = {};
    var res = [],
    takeNikAutocomplete = $('input[name=req_take_nik]').typeahead(null, {
        name: 'req_take_nik',
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
        takeNikAutocomplete.typeahead('val',map[selection]);
        $(takeNikAutocomplete).prop('readonly', true);
    });
    $("input[name=req_take_nik]").on('dblclick', function(){
      $(this).prop('readonly',false);
    });



    var tmpHtml = '',
        targetListPo= '#addPo .po-table';
    $('#addPo').on('show.bs.modal', function(){
      $.each(window.po, function(k,v){
        // data add from stock
        tmpHtml = '<div class="po-row data" id="'+v.main_stock_code+'">';
        // detail stock
        tmpHtml += '<div>';
        tmpHtml += v.stock_code+' - ';
        tmpHtml += v.stock_name+' - ';
        tmpHtml += v.stock_size+' - ';
        tmpHtml += v.stock_type;
        tmpHtml += '</div>';
        // input qty
        tmpHtml += '<div class="text-center">-</div>';
        tmpHtml += '<div><input type="text" class="form-control form-control-sm qtyPO" name="data['+v.main_stock_code+']" placeholder="Kuantiti" value="'+v.need_qty+'"></div>';
        tmpHtml += '<div class="text-center">'+v.measure_type+'</div>';
        tmpHtml += '<div><input type="text" class="form-control form-control-sm" name="notes['+v.main_stock_code+']" placeholder="Keterangan"></div>';
        tmpHtml += '<div style="position:relative"><div class="kt-checkbox-list" style="width:20px; position:absolute; left: calc(50% - 10px); top: calc(50% - 10px);">\
                <label class="kt-checkbox">\
                    <input type="checkbox" tabindex="10" value="1" name="urgent['+v.main_stock_code+']">&nbsp;\
                    <span></span>\
                </label>\
            </div></div>';
        tmpHtml += '<div><i class="fa fa-trash" onclick="$(this).parent().parent().remove(); delete window.po.'+k+';"></i></div>';
        tmpHtml += '</div>';
        $(targetListPo).append(tmpHtml);
        KTFormPO.rules('input[name="data['+v.main_stock_code+']"]');
      });
      $(".qtyPO").inputmask('decimal', {
          rightAlignNumerics: false
      });
    });
    $('#addPo').on('hide.bs.modal', function(){
      $(targetListPo+" .data").remove();
    });
    $('#addPo .btn-submit').on('click', function(){
      $('#FPO').submit();
    });

    // export Excel
    $('[data-export=excel]').on('click', function(){
      var data = {
        api: api_url,
        page_code: window.Auth.page,
        query: {
          find:$('#generalSearch').val(),
          status:$('[name=status]').val()
        }
      };
      if($('.kt-datatable th.kt-datatable__cell--sorted').length > 0){
        var tmp = {
            'sort' : {
              field: $('.kt-datatable th.kt-datatable__cell--sorted')[0].dataset.field,
              sort: $('.kt-datatable th.kt-datatable__cell--sorted')[0].dataset.sort
            }
        };
        Object.assign(data,tmp);
      }
      KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/req/tools', data);
    });

});
