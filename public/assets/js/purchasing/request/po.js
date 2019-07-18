"use strict";

var KTFormPO = function(){
  var formId = '#FPO',
      link_add = api_url+"/api/pur/req/po/process",
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
                            $(formModal).modal('hide');
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
        gridId = "#datagrid-pur-po",
        height = '550',
        url = api_url+'/api/pur/req/po/grid',
        link_find = api_url+'/api/pur/req/po/find/',
        link_delete = api_url+'/api/pur/req/po/delete',
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
                    return (row.status != 'ST05')?'\
                        <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-detail" id="'+row.po_code+'" title="Proses PO">\
                            <i class="la la-automobile"></i>\
                        </a>\
                    ':"&nbsp;";
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
                                    tmpHtml = '',
                                    date = new Date();
                                    date.setDate(date.getDate());

                                if(typeof data.purchase_order == "object"){
                                  $.each(data.purchase_order_detail, function(k,v){
                                    tmpHtml = "";
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
                                    tmpHtml += '<div class="">'+price.format(v.po_qty,2,',','.')+'</div>';
                                    tmpHtml += '<div class=""><input type="text" class="form-control form-control-sm" name="data['+v.po_code+']['+v.main_stock_code+'][date]" value="'+(v.po_date_delivery == null?'':v.v.po_date_delivery)+'" placeholder="Tanggal Terima" title="Tanggal Terima" readonly></div>';
                                    tmpHtml += '<div class="typeahead"><input type="text" class="form-control form-control-sm" name="data['+v.po_code+']['+v.main_stock_code+'][supplier]" value="'+(v.supplier_code == null?'':v.supplier_code+' - '+v.supplier_name)+'" placeholder="Supplier" title="Supplier"></div>';
                                    tmpHtml += '<div class=""><input type="text" class="form-control form-control-sm" name="data['+v.po_code+']['+v.main_stock_code+'][price]" value="'+(v.stock_price == null?'':v.stock_price)+'" placeholder="Harga" title="Harga"></div>';
                                    tmpHtml += '<div class=""><input type="text" class="form-control form-control-sm" name="data['+v.po_code+']['+v.main_stock_code+'][qty]" value="'+v.po_qty+'" placeholder="Tersedia" title="Tersedia"></div>';
                                    $('#FPO .list-data').append(tmpHtml);
                                    tmpHtml += '</div>';
                                    $('input[name="data['+v.po_code+']['+v.main_stock_code+'][date]"]').datepicker({
                                        format: "dd/mm/yyyy",
                                        startDate: date,
                                        clearBtn: true
                                    });
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
      $('#FPO .list-body').html('');
    });

    // submit form PO
    $('#addPo .btn-submit').on('click', function(){
      $('#FPO').submit();
    });
});
