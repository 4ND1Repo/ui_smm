"use strict";

var KTFormPO = function(){
  var formId = '#FPO',
      link_add = api_url+"/api/pur/req/po/process",
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
                            $(formModal).modal('hide');
                            myGrid.element().reload();
                            console.log('Success');
                            // send notification to target
                            $.ajax({
                              url: api_url+'/api/mng/user/notification/add',
                              type: 'POST',
                              data:{notification_to:r.data.to, notification_from:window.Auth.nik, notification_content:'PO '+r.data.po_code+' sedang diproses', notification_url:base_url+'/wh/req/po', notification_icon: "fa fa-book kt-font-success"},
                              success: function(r){
                                console.log(r);
                              }
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

var KTGridPO = function(){
    var _el,
        gridId = "#datagrid-pur-po",
        height = '550',
        url = api_url+'/api/pur/req/po/grid',
        link_find = api_url+'/api/pur/req/po/find/',
        link_delete = api_url+'/api/pur/req/po/delete',
        link_cancel = api_url+'/api/pur/req/po/cancel',
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
                title: 'Dari'
            }, {
                field: 'sum_item',
                title: 'jumlah item'
            }, {
                field: 'status_label',
                title: 'Status',
                template: function(row){
                    var status = {
                        "ST06": {'title': 'Pending', 'class': 'kt-badge--brand'},
                        "ST09": {'title': 'Delivered', 'class': ' kt-badge--danger'},
                        "ST04": {'title': 'Canceled', 'class': ' kt-badge--primary'},
                        "ST05": {'title': 'Success', 'class': ' kt-badge--success'},
                        5: {'title': 'Info', 'class': ' kt-badge--info'},
                        "ST03": {'title': 'Danger', 'class': ' kt-badge--danger'},
                        "ST02": {'title': 'Warning', 'class': ' kt-badge--warning'},
                    };
                    return '<span class="kt-badge ' + (typeof status[row.status] !== 'undefined'?status[row.status].class:'') + ' kt-badge--inline kt-badge--pill">' + row.status_label + '</span>';
                }
            }, {
                field: 'reason',
                title: 'Alasan'
            }, {
                field: 'action',
                title: 'Aksi',
                sortable: false,
                width: 80,
                overflow: 'visible',
                autoHide: false,
                template: function(row) {
                    return (row.status != 'ST05')?'\
                        <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-detail" id="'+row.po_code+'" title="Proses PO">\
                            <i class="la la-automobile"></i>\
                        </a>\
                        <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-cancel" id="'+row.po_code+'" title="Batalkan PO">\
                            <i class="la la-remove text-danger"></i>\
                        </a>\
                    ':"&nbsp;";
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
                $('.btn-cancel').click(function(){
                  Swal.fire({
                      title: 'Anda yakin?',
                      // text: "untuk membatalkan transaksi ini!",
                      type: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Ya',
                      cancelButtonText: 'Tidak',
                      html: 'Isi alasan pembatalan :<br/><textarea rows="3" id="reason" name="reason" class="form-control form-control-sm"></textarea>',
                      preConfirm: (res) => {

                        if($('#reason').val().length > 0) return true;

                        swal.fire({
                            title: "",
                            text: "Mohon input alasannya",
                            type: "warning",
                            showConfirmButton: false,
                            timer: 1500
                        });

                        return false;
                      }
                  }).then((result) => {
                      console.log(result);
                      console.log($('#reason').val());
                      if (result.value) {
                          var el = this;
                          $.ajax({
                              url: link_cancel,
                              type: 'POST',
                              data: {po_code:$(el).attr('id'),reason:$('#reason').val(),nik:window.Auth.nik},
                              success: function(r){
                                  Swal.fire({
                                      title: 'Dibatalkan!',
                                      text: 'Transaksi telah dibatalkan.',
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
                                    data:{notification_to:$(el).parent().parent().parent().children('[data-field="create_by"]').text(), notification_from:window.Auth.nik, notification_content:'PO '+$(el).attr('id')+' dibatalkan', notification_url:base_url+'/wh/req/po', notification_icon: "fa fa-book kt-font-danger"},
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

                $('.btn-detail').click(function(){
                    $.ajax({
                        url: link_find+$(this).attr('id'),
                        type: 'GET',
                        success: function(res){
                            if(res.status){
                                var data = res.data,
                                    tmpHtml = '',
                                    date = new Date();
                                    date.setDate(date.getDate());

                                if(typeof data.purchase_order == "object"){
                                  $.each(data.purchase_order_detail, function(k,v){
                                    tmpHtml = "";
                                    // get data from po detail
                                    tmpHtml += '<div id="'+v.po_code+'">';
                                    // detail stock
                                    tmpHtml += '<div data-toggle="kt-tooltip" data-placement="top" data-original-title="'+v.stock_name+' - '+v.stock_type+' - '+v.stock_size+'" data-skin="dark">';
                                    tmpHtml += v.stock_code+' - ';
                                    tmpHtml += v.stock_name+' - ';
                                    tmpHtml += v.stock_type+' - ';
                                    tmpHtml += v.stock_size;
                                    if(v.po_notes !== null && v.po_notes !== "")
                                      tmpHtml += '<br/>Keterangan :<br/>'+v.po_notes;
                                    tmpHtml += '</div>';
                                    // input qty
                                    tmpHtml += '<div class="text-right">'+price.format(v.po_qty,2,',','.')+'</div>';
                                    // input measure
                                    tmpHtml += '<div class="text-center">'+v.measure_type+'</div>';
                                    var tmp = (v.po_date_delivery == null?false:v.po_date_delivery),
                                      dte = '';
                                    if(tmp){
                                      tmp = tmp.split('-');
                                      dte = tmp[2]+"/"+tmp[1]+"/"+tmp[0];
                                    }
                                    tmpHtml += '<div class=""><input type="text" class="form-control form-control-sm" name="data['+v.po_code+']['+v.main_stock_code+'][date]" value="'+dte+'" placeholder="Tanggal Terima" title="Tanggal Terima" readonly></div>';
                                    tmpHtml += '<div class="typeahead"><input type="text" class="form-control form-control-sm" name="data['+v.po_code+']['+v.main_stock_code+'][supplier]" value="'+(v.supplier_code == null?'':v.supplier_code+' - '+v.supplier_name)+'" placeholder="Supplier" title="Supplier"></div>';
                                    tmpHtml += '<div class=""><input type="text" class="form-control form-control-sm" name="data['+v.po_code+']['+v.main_stock_code+'][price]" value="'+(v.stock_price == null?'':v.stock_price)+'" data-id="'+v.main_stock_code+'" data-skin="dark" data-toggle="kt-tooltip" data-container="body" data-placement="top" data-original-title="" placeholder="Harga" title="Harga"></div>';
                                    tmpHtml += '<div class=""><input type="text" class="form-control form-control-sm" name="data['+v.po_code+']['+v.main_stock_code+'][qty]" value="'+v.po_qty+'" placeholder="Tersedia" title="Tersedia"></div>';
                                    $('#FPO .list-data').append(tmpHtml);
                                    tmpHtml += '</div>';
                                    // datepicker
                                    $('input[name="data['+v.po_code+']['+v.main_stock_code+'][date]"]').datepicker({
                                        format: "dd/mm/yyyy",
                                        pickTime: false,
                                        startDate: date,
                                        clearBtn: true,
                                        autoclose: true
                                    }).on('hide',function(event){
                                      	event.preventDefault();
                                      	event.stopPropagation();
                                    });
                                    // supplier autocomplete
                                    $('input[name="data['+v.po_code+']['+v.main_stock_code+'][supplier]"]').typeahead(null, {
                                        name: 'stock_name',
                                        source: function(query,psc){
                                            $.ajax({
                                                url: api_url+'/api/mst/supplier/autocomplete',
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
                                    });
                                    // masking number format
                                    $('input[name="data['+v.po_code+']['+v.main_stock_code+'][price]"], input[name="data['+v.po_code+']['+v.main_stock_code+'][qty]"]').inputmask('decimal', {
                                        rightAlignNumerics: false
                                    });

                                    // check last update price is higher or not
                                    var ajx = "";
                                    $('input[name="data['+v.po_code+']['+v.main_stock_code+'][price]"]').on('keyup', function(){
                                      var el = this;
                                      if(typeof ajx === 'object'){
                                        ajx.abort();
                                      }
                                      $(el).attr('title','');

                                      if($('input[name="data['+v.po_code+']['+$(el).data('id')+'][supplier]"]').val() !== ""){
                                        ajx = $.ajax({
                                          url: api_url+'/api/pur/req/po/check_price',
                                          type: 'POST',
                                          data: {main_stock_code: $(el).data('id'), supplier_code:$('input[name="data['+v.po_code+']['+$(el).data('id')+'][supplier]"]').val()},
                                          success: function(r){
                                            $(el).attr('data-original-title',"");
                                            $(el).removeClass('is-higher');
                                            $(el).parent().removeClass('is-higher');
                                            $(el).removeClass('is-lower');
                                            $(el).parent().removeClass('is-lower');

                                            if(r.status){
                                              if(parseFloat($(el).val()) > r.data){
                                                $(el).attr('data-original-title','harga sebelumnya : '+r.data);
                                                if(!$(el).hasClass('is-higher'))
                                                  $(el).addClass('is-higher');
                                                if(!$(el).parent().hasClass('is-higher'))
                                                  $(el).parent().addClass('is-higher');
                                              } else if(parseFloat($(el).val()) < r.data){
                                                $(el).attr('data-original-title','harga sebelumnya : '+r.data);
                                                if(!$(el).hasClass('is-lower'))
                                                  $(el).addClass('is-lower');
                                                if(!$(el).parent().hasClass('is-lower'))
                                                  $(el).parent().addClass('is-lower');
                                              }
                                            }
                                          }
                                        }).done(function(){
                                          $('input[data-toggle="kt-tooltip"]').tooltip({
                                            trigger: "hover",
                                            template: '<div class="tooltip tooltip-dark" role="tooltip">\
                                            <div class="arrow"></div>\
                                            <div class="tooltip-inner"></div>\
                                            </div>'
                                          });
                                        });
                                      }
                                    });
                                  });

                                  $('#FPO .list-data div[data-toggle="kt-tooltip"]').tooltip({
                                    trigger: "hover",
                                    template: '<div class="tooltip tooltip-dark" role="tooltip">\
                                        <div class="arrow"></div>\
                                        <div class="tooltip-inner"></div>\
                                    </div>'
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
      console.log('test');
      $('#FPO .list-data').html('');
    });

    // submit form PO
    $('#addPo .btn-submit').on('click', function(){
      $('#FPO').submit();
    });
});
