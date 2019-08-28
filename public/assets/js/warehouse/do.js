"use strict";

var KTFormPO = function(){
  var formId = '#FPO',
      link_add = api_url+"/api/wh/req/do/add",
      formRules = {},
      formModal = '#addPo';

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
            if($('input.exists').length == 0){
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
                                $('#addPo').modal('hide');
                                myGrid.element().reload();

                                // send notification to target
                                $.ajax({
                                  url: api_url+'/api/mng/user/notification/add',
                                  type: 'POST',
                                  data:{notification_to:'pur', notification_from:window.Auth.nik, notification_content:'Ada barang masuk gudang', notification_url:base_url+'/pur/req/do', notification_icon: "fa fa-box-open kt-font-success"},
                                  success: function(r){
                                    console.log(r);
                                  }
                                });
                                console.log('Success');
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
            } else {
                swal.fire({
                    title: "",
                    text: "Nomor Surat Jalan sudah ada",
                    type: "warning",
                    showConfirmButton: false,
                    timer: 1500
                }).then((res) => {
                    console.log('failed');
                });
            }
            return false;
        }
    });
  }

  var setRules = function(rule,v){
    if(v == null)
      $(rule).rules("add", {required:true, min: 0.01});
    else if(typeof v === 'object')
      $(rule).rules("add", v);
  }

  return {
    init: function(){
      console.log('init form');
      this[formId.replace(/'#|.'/g,'')] = validation();
    },
    element: function(){
      return this[formId.replace(/'#|.'/g,'')];
    },
    rules: function(r,v=null){
      console.log('set rule');
      setRules(r,v);
    }
  }
}();

var KTGridPO = function(){
    var _el,
        gridId = "#datagrid-do",
        height = '550',
        url = api_url+'/api/wh/req/do/grid',
        link_find = api_url+'/api/wh/req/do/find/',
        link_delete = api_url+'/api/wh/req/do/delete',
        page = '10';

    var _KTDatatable = function(){
        myGrid.set('target', gridId);
        myGrid.set('height', height);
        myGrid.set('url', url);
        myGrid.set('page', page);
        myGrid.set('column',
            [{
                field: 'po_code',
                title: 'Kode PO'
            }, {
                field: 'po_date',
                title: 'Tanggal',
                template: function(row){
                  var tmp = row.po_date.split('-');
                  return (tmp.length > 1?(tmp[2]+"/"+tmp[1]+"/"+tmp[0]):row.po_date);
                }
            }, {
                field: 'create_by',
                title: 'pembuat'
            }, {
                field: 'page_name',
                title: 'Kepada'
            }, {
                field: 'sum_item',
                title: 'jumlah item'
            }, {
                field: 'status_label',
                title: 'Status',
                overflow: 'visible',
                autoHide: false,
                template: function(row){
                    var status = {
                        "ST06": {'title': 'Pending', 'class': 'kt-badge--brand'},
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
                width: 110,
                overflow: 'visible',
                autoHide: false,
                template: function(row) {
                    return '\
                        <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-add-do" id="'+row.po_code+'" title="Terima Surat Jalan">\
                            <i class="la la-paste"></i>\
                        </a>\
                    ';
                },
            }]
        );
        myGrid.set('data',{page_code:window.Auth.page});
        myGrid.set('function', function(){
            $('select[name=status]').on('change', function() {
                myGrid.element().search($(this).val(), 'status');
            });
            $('select[name=status]').selectpicker();

            // function buttin on datatable grid
            $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {
                $('.btn-add-do').click(function(){
                    $.ajax({
                        url: link_find+$(this).attr('id'),
                        type: 'GET',
                        success: function(res){
                            if(res.status){
                                var data = res.data,
                                    tmpHtml = '';

                                if(typeof data.purchase_order_detail == "object"){
                                  $.each(data.purchase_order_detail, function(k,v){
                                    if(v.qty > 0){
                                      tmpHtml = '';
                                      // get data from po detail
                                      tmpHtml += '<div id="'+v.po_code+'">';
                                      // detail stock
                                      tmpHtml += '<div>';
                                      tmpHtml += v.stock_code+' - ';
                                      tmpHtml += v.stock_name+' - ';
                                      tmpHtml += v.stock_type+' - ';
                                      tmpHtml += v.stock_size;
                                      tmpHtml += '</div>';
                                      // po date
                                      var tmp = v.po_date_delivery.split("-");
                                      tmpHtml += '<div class="text-right"><input type="text" class="form-control form-control-sm doNumber" data-supplier="'+v.supplier_code+'" name="do['+v.po_code+']['+v.main_stock_code+']" value=""></div>';
                                      tmpHtml += '<div class="text-center">'+((typeof tmp == 'object')?tmp.reverse().join('/'):"-")+'</div>';
                                      // input qty
                                      tmpHtml += '<div class="text-right">'+price.format(v.qty,2,',','.')+'</div>';
                                      tmpHtml += '<div class="text-right"><input type="text" class="form-control form-control-sm qtyDO" name="data['+v.po_code+']['+v.main_stock_code+']" value="'+v.qty+'"></div>';
                                      tmpHtml += '<div class="text-right">'+(Math.ceil(((v.po_qty-v.qty)/v.po_qty)*100))+"%"+'</div>';
                                      tmpHtml += '</div>';
                                      $('#FPO .list-body').append(tmpHtml);
                                      KTFormPO.rules('input[name="data['+v.po_code+']['+v.main_stock_code+']"]',{max: parseFloat(v.qty)});
                                    }
                                  });
                                  $('#addPo .typeahead').addClass('kt-hidden');
                                  $("input.qtyDO").inputmask('decimal', {
                                      rightAlignNumerics: false
                                  });
                                  $('#addPo').modal('show');
                                }
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
                            $.ajax({
                                url: link_delete,
                                type: 'POST',
                                data: {'po_code':$(this).attr('id'),nik:window.Auth.nik},
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

$(document).ready(function(){
    myStorage.set('auth');
    window.Auth = JSON.parse(myStorage.get());

    // initiate
    KTGridPO.init();
    KTFormPO.init();

    $("#addPo").on('hide.bs.modal', function(){
      $('#FPO .list-body').html('');
      $('#addPo .btn-submit, #addPo .typeahead').removeClass('kt-hidden');
      KTFormPO.element().resetForm();
      $('#FPO').find('.invalid-feedback').remove();
    });

    // submit form PO
    $('#addPo .btn-submit').on('click', function(){
      $('#FPO').submit();
    });

    $("#addPo").on('shown.bs.modal', function(){
      var doCode = "";
      $('.doNumber').on('keyup', function(){
        $(this).val($(this).val().toUpperCase());
        var el = this,
        poCode = $(".list-body > div:first-child").attr('id');
        if(typeof doCode === 'object') doCode.abort();

        var supplier_code = $(el).data('supplier');
        if($(el).next().length > 0)
          $(el).next().remove();

        doCode = $.ajax({
          url: api_url+"/api/wh/req/do/check",
          type: "POST",
          data: {do_code:$(el).val(), supplier_code:supplier_code},
          success: function(r){
            $(el).removeClass('exists');

            if(!r.status){
              $(el).addClass('exists').parent().append('<div class="error invalid-feedback">'+r.message+'</div>');
            }
          }
        });
      });
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
      KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/req/do', data);
    });

});
