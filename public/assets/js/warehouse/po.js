"use strict";

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
            data.push({name:"menu_page", value:window.Auth.page});
            data.push({name:"menu_page_destination", value:'pur'});
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
                            myGrid.element().reload();
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
                },
                error: function(){

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
                    var btn = '\
                        <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-detail" id="'+row.po_code+'" title="Detail data">\
                            <i class="la la-search-plus"></i>\
                        </a>\
                    ';
                    if(row.status == 'ST06')
                      btn += '\
                      <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.po_code+'" title="Hapus">\
                          <i class="la la-trash"></i>\
                      </a>\ ';
                    return btn;
                },
            }]
        );
        myGrid.set('data',{menu_page:window.Auth.page});
        myGrid.set('function', function(){
            $('select[name=status]').on('change', function() {
                myGrid.element().search($(this).val(), 'status');
            });
            $('select[name=status]').selectpicker();

            // function buttin on datatable grid
            $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {
                $('.btn-detail').click(function(){
                    $.ajax({
                        url: link_find+$(this).attr('id'),
                        type: 'GET',
                        success: function(res){
                            if(res.status){
                                var data = res.data,
                                    tmpHtml = '';

                                if(typeof data.purchase_order == "object"){
                                  $.each(data.purchase_order_detail, function(k,v){
                                    // get data from po detail
                                    tmpHtml += '<div id="'+v.po_code+'">';
                                    // detail stock
                                    tmpHtml += '<div>';
                                    tmpHtml += v.stock_code+' - ';
                                    tmpHtml += v.stock_name+' - ';
                                    tmpHtml += v.stock_type+' - ';
                                    tmpHtml += v.stock_size;
                                    tmpHtml += '</div>';
                                    // input qty
                                    var tmpdt = (v.po_date_delivery !== null)?v.po_date_delivery.split('-'):'-';
                                    tmpHtml += '<div class="text-center">'+((v.po_date_delivery !== null)?(tmpdt[2]+"/"+tmpdt[1]+"/"+tmpdt[0]):tmpdt)+'</div>';
                                    // input qty
                                    tmpHtml += '<div class="text-right">'+price.format(v.po_qty,2,',','.')+'</div>';
                                    tmpHtml += '</div>';
                                  });
                                  $('#FPO .list-body').append(tmpHtml);
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

    // autocomplete
    var map = {};
    var res = [],
    stockAutocomplete = $('input[name=main_stock_code].autocomplete').typeahead(null, {
        name: 'stock_name',
        source: function(query,psc){
            $.ajax({
                url: api_url+'/api/wh/stock/autocomplete',
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
        var data = selection.split(' - '),
            tmpHtml = '';

        // data add from stock
        tmpHtml += '<div id="'+map[selection]+'">';
        // detail stock
        tmpHtml += '<div>';
        tmpHtml += data[0]+' - ';
        tmpHtml += data[1]+' - ';
        tmpHtml += data[2]+' - ';
        tmpHtml += data[3];
        tmpHtml += '</div>';
        // input qty
        tmpHtml += '<div class="text-center">-</div>';
        tmpHtml += '<div><input type="text" class="form-control form-control-sm qtyPO" name="data['+map[selection]+']" placeholder="Kuantiti"></div>';
        tmpHtml += '</div>';

        if($('#FPO').find("div[id='"+map[selection]+"']").length > 0){
            swal.fire({
                title: "",
                text: "Data sudah ada di daftar",
                type: "warning",
                showConfirmButton: false,
                timer: 1500
            });
        } else{
            $('#FPO .list-body').append(tmpHtml);
            $(".qtyPO").inputmask('decimal', {
                rightAlignNumerics: false
            });
            // add rules
            KTFormPO.rules('input[name="data['+map[selection]+']"]');
        }
        stockAutocomplete.typeahead('val','');
    });


    $("#addPo").on('hide.bs.modal', function(){
      $('#FPO .list-body').html('');
      $('#addPo .btn-submit, #addPo .typeahead').removeClass('kt-hidden');
    });

    // submit form PO
    $('#addPo .btn-submit').on('click', function(){
      $('#FPO').submit();
    });
});
