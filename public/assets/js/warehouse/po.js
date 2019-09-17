"use strict";

var KTFormPO = function(){
  var formId = '#FPO',
      link_add = api_url+"/api/wh/req/po/add",
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
                            $('#FPO .po-table .data').remove();
                            myGrid.element().reload();
                            // send notification to target
                            $.ajax({
                              url: api_url+'/api/mng/user/notification/add',
                              type: 'POST',
                              data:{notification_to:'pur', notification_from:window.Auth.nik, notification_content:'Ada request PO', notification_url:base_url+'/pur/req/po', notification_icon: "fa fa-book kt-font-warning"},
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
                      text: 'Kesalahan sistem',
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
        gridId = "#datagrid-po",
        height = '550',
        url = api_url+'/api/wh/req/po/grid',
        link_find = api_url+'/api/wh/req/po/find/',
        link_delete = api_url+'/api/wh/req/po/delete',
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
                    var btn = [];
                    btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-detail" id="'+row.po_code+'" title="Detail data">\
                            <i class="la la-search-plus"></i>\
                        </a>');

                    if(window.role.del == 1 && row.status == 'ST06')
                      btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.po_code+'" title="Hapus">\
                          <i class="la la-trash"></i>\
                      </a>');
                    return myGrid.action(btn);
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
                var ajx = null;
                $('.btn-detail').click(function(){
                    if(ajx != null) ajx.abort();
                    
                    ajx = $.ajax({
                        url: link_find+$(this).attr('id'),
                        type: 'GET',
                        success: function(res){
                            if(res.status){
                                var data = res.data,
                                    tmpHtml = '';

                                if(typeof data.purchase_order == "object"){
                                  $.each(data.purchase_order_detail, function(k,v){
                                    // get data from po detail
                                    tmpHtml += '<div id="'+v.po_code+'" class="po-row data '+(v.urgent==1?'text-danger font-weight-bold':'')+'">';
                                    // detail stock
                                    tmpHtml += '<div>';
                                    tmpHtml += '('+v.stock_code+') ';
                                    tmpHtml += v.stock_name;
                                    tmpHtml += (v.stock_size !== '' && v.stock_size != null? ' '+v.stock_size:'');
                                    tmpHtml += (v.stock_type !== '' && v.stock_type != null? ' '+v.stock_type:'');
                                    tmpHtml += (v.stock_brand !== '' && v.stock_brand != null? ' '+v.stock_brand:'');
                                    tmpHtml += (v.stock_color !== '' && v.stock_color != null? ' '+v.stock_color:'');
                                    tmpHtml += '</div>';
                                    // supplier
                                    tmpHtml += '<div class="text-center">'+(v.supplier_code != null? v.supplier_code:'-')+'</div>';
                                    // Target
                                    var tmpdt = (v.po_date_delivery !== null)?v.po_date_delivery.split('-'):'-';
                                    tmpHtml += '<div class="text-center">'+((v.po_date_delivery !== null)?(tmpdt[2]+"/"+tmpdt[1]+"/"+tmpdt[0]):tmpdt)+'</div>';
                                    // input qty
                                    tmpHtml += '<div class="text-right">'+price.format(v.po_qty,0,',','.')+'</div>';
                                    tmpHtml += '<div class="text-center">'+v.measure_type+'</div>';
                                    tmpHtml += '<div class="text-center" data-toggle="kt-tooltip-notes" data-container="body" data-placement="top" title="'+(v.po_notes==null?"":v.po_notes)+'">'+(v.po_notes==null?"":v.po_notes)+'</div>';
                                    tmpHtml += '<div class="text-center">'+(v.urgent==1?'<i class="fa fa-check"></i>':'')+'</div>';
                                    tmpHtml += '</div>';
                                  });
                                  $('#FPO .po-table').append(tmpHtml);
                                  $('[data-toggle="kt-tooltip-notes"]').tooltip();
                                  $('#addPo .btn-submit, #addPo .typeahead').addClass('kt-hidden');
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
                            var el = this;
                            $.ajax({
                                url: link_delete,
                                type: 'POST',
                                data: {'po_code':$(el).attr('id'),nik:window.Auth.nik},
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
                                    $.ajax({
                                      url: api_url+'/api/mng/user/notification/add',
                                      type: 'POST',
                                      data:{notification_to:'pur', notification_from:window.Auth.nik, notification_content:'Request PO '+$(el).attr('id')+' digagalkan', notification_url:base_url+'/pur/req/po', notification_icon: "fa fa-trash kt-font-danger"},
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

$(document).ready(function(){
    myStorage.set('auth');
    window.Auth = JSON.parse(myStorage.get());

    // initiate
    KTGridPO.init();
    KTFormPO.init();

    // autocomplete
    var map = {},
        datas = {};
    var res = [],
    stockAutocomplete = $('input[name=main_stock_code].autocomplete').typeahead(null, {
        name: 'stock_name',
        limit: 100,
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
                        map[v.label] = {id: v.id, need: v.need};
                        datas[v.label] = v.data;
                    });

                }
            });
            psc(res);
        }
    }).on('typeahead:selected', function(event, selection) {
        var data = selection.split(' - '),
            tmpHtml = '';

        // data add from stock
        tmpHtml += '<div class="po-row data" id="'+map[selection].id+'">';
        // detail stock
        tmpHtml += '<div>';
        tmpHtml += '('+datas[selection].stock_code+') ';
        tmpHtml += datas[selection].stock_name;
        tmpHtml += (datas[selection].stock_size != '' && datas[selection].stock_size != null?' '+datas[selection].stock_size:'');
        tmpHtml += (datas[selection].stock_type != '' && datas[selection].stock_type != null?' '+datas[selection].stock_type:'');
        tmpHtml += (datas[selection].stock_brand != '' && datas[selection].stock_brand != null?' '+datas[selection].stock_brand:'');
        tmpHtml += (datas[selection].stock_color != '' && datas[selection].stock_color != null?' '+datas[selection].stock_color:'');
        tmpHtml += '</div>';
        // input qty
        tmpHtml += '<div class="text-center">-</div>';
        tmpHtml += '<div class="text-center">-</div>';
        tmpHtml += '<div><input type="text" class="form-control form-control-sm qtyPO" name="data['+map[selection].id+']" placeholder="Kuantiti" value="'+map[selection].need+'"></div>';
        tmpHtml += '<div class="text-center">'+datas[selection].measure_type+'</div>';
        tmpHtml += '<div style="position:relative; overflow:visible;"><input type="text" class="form-control form-control-sm" name="notes['+map[selection].id+']" placeholder="Keterangan"></div>';
        tmpHtml += '<div style="position:relative"><div class="kt-checkbox-list" style="width:20px; position:absolute; left: calc(50% - 10px); top: calc(50% - 10px);">\
                <label class="kt-checkbox">\
                    <input type="checkbox" tabindex="10" value="1" name="urgent['+map[selection].id+']">&nbsp;\
                    <span></span>\
                </label>\
            </div></div>';
        tmpHtml += '<div class="text-center"><i class="fa fa-trash" onclick="$(this).parent().parent().remove();"></i></div>';
        tmpHtml += '</div>';

        if($('#FPO').find("div[id='"+map[selection].id+"']").length > 0){
            swal.fire({
                title: "",
                text: "Data sudah ada di daftar",
                type: "warning",
                showConfirmButton: false,
                timer: 1500
            });
        } else{
            $('#FPO .po-table').append(tmpHtml);
            $(".qtyPO").inputmask('decimal', {
                rightAlignNumerics: false
            });
            // add rules
            KTFormPO.rules('input[name="data['+map[selection].id+']"]');
        }
        stockAutocomplete.typeahead('val','');
    });
    $('#addPo .typeahead').on('keyup', function(e) {
        if(e.which == 13) {
            $(".tt-suggestion:first-child", this).trigger('click');
        }
    });


    $("#addPo").on('hide.bs.modal', function(){
      $('#FPO .po-table .data').remove();
      $('#addPo .btn-submit, #addPo .typeahead').removeClass('kt-hidden');
    });

    // submit form PO
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
      KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/req/po', data);
    });
});
