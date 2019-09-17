"use strict";

var KTGridPO = function(){
    var _el,
        gridId = "#datagrid-print-po-pur",
        height = '550',
        url = api_url+'/api/pur/req/po/print/grid',
        page = '10';

    var _KTDatatable = function(){
        myGrid.set('target', gridId);
        myGrid.set('height', height);
        myGrid.set('url', url);
        myGrid.set('page', page);
        myGrid.set('column',
            [{
                field: 'id',
                title: 'Urutan',
                width: 60,
                class: "text-center"
            }, {
                field: 'po_code',
                title: 'Nomor PO'
            }, {
                field: 'po_date',
                title: 'Tanggal'
            }, {
                field: 'stock_name',
                title: 'Nama Barang'
            }, {
                field: 'stock_spec',
                title: 'Spesifikasi'
            }, {
                field: 'po_qty',
                title: 'Jumlah',
                template: function(row){
                    return price.format(row.po_qty,0,",",'.');
                }
            }, {
                field: 'po_notes',
                title: 'Keterangan'
            }]
        );
        myGrid.set('data',{page_code:window.Auth.page});
        myGrid.set('function', function(){
            $('select[name=supplier_code]').on('change', function() {
                myGrid.element().search($(this).val(), 'supplier_code');
            });
            $('select[name=supplier_code]').selectpicker();

            $('input[name="start_date"]').on('change', function() {
                myGrid.element().search($(this).val(), 'start_date');
            });
    
            $('input[name="end_date"]').on('change', function() {
                myGrid.element().search($(this).val(), 'end_date');
            });

            // function buttin on datatable grid
            $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {

                $('.btn-print').click(function(){
                    var el = this,
                        data = {
                            api: api_url,
                            nik: window.Auth.nik,
                            po_code: $(el).attr('id')
                        };
                    // get supplier collection
                    $.ajax({
                        url: api_url+"/api/pur/req/po/supplier",
                        type: "POST",
                        data: {po_code:$(el).attr('id')},
                        success: function(r){
                            if(r.status){
                                if(r.data.length > 0){
                                    r.data.forEach(function(v,k){
                                        Object.assign(data, {supplier_code:v});
                                        KTDownload.post(location.href + '/../print', data);
                                    });
                                }
                            }
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

var KTDateRange = function(){
    var dateRange = function(opt){
        if(typeof opt.elStart !== 'undefined' && typeof opt.elEnd !== 'undefined'){
            $(opt.elStart).on('changeDate', function(selected) {
                if($(this).val() != ""){
                    var startDate = new Date(selected.date.valueOf());
                    $(opt.elEnd).datepicker('setStartDate', startDate);
                    if($(opt.elStart).val() > $(opt.elEnd).val()){
                        $(opt.elEnd).val($(opt.elStart).val());
                    }
                }
            });
            $(opt.elEnd).on('changeDate', function(selected) {
                if($(this).val() != ""){
                    var endDate = new Date(selected.date.valueOf());
                    $(opt.elStart).datepicker('setEndDate', endDate);
                    if($(opt.elStart).val() > $(opt.elEnd).val()){
                        $(opt.elStart).val($(opt.elEnd).val());
                    }
                }
            });
        }
    }
    return {
        set: function(opt){
            new dateRange(opt);
        }
    };
}();

$(document).ready(function(){
    // initiate
    KTGridPO.init();
    KTDateRange.set({elStart:'[name="start_date"]', elEnd:'[name="end_date"]'});

    // get supplier_code
    $.ajax({
        url: api_url+'/api/pur/req/po/supplier/process',
        type: 'POST',
        data: {nik: window.Auth.nik},
        success: function(r){
            console.log(r);
            if(r.status == 1){
                $('select[name=supplier_code]').selectpicker('destroy');
                r.data.forEach(function(v,k){
                    $('select[name=supplier_code]').append('<option value="'+v.supplier_code+'">'+v.supplier_name+'</option>');
                });
                $('select[name=supplier_code]').selectpicker();
            }
        }
    });

    $(".btn-print").click(function(){
        // empty post before send data
        $('#print_page').html('');
        // filter find
        if($('input#generalSearch').val() != "")
            $('#print_page').append('<input type="hidden" name="query[find]" value="'+$('input#generalSearch').val()+'">');
        // filter supplier
        if($('select[name=supplier_code]').val() != "")
            $('#print_page').append('<input type="hidden" name="query[supplier_code]" value="'+$('select[name=supplier_code]').val()+'">');
        // filter date
        if($('[name="start_date"]').val() != "")
            $('#print_page').append('<input type="hidden" name="query[start_date]" value="'+$('[name="start_date"]').val()+'">');
        if($('[name="end_date"]').val() != "")
            $('#print_page').append('<input type="hidden" name="query[end_date]" value="'+$('[name="end_date"]').val()+'">');

        if($('.kt-datatable th.kt-datatable__cell--sorted').length > 0){
            $('#print_page').append('<input type="hidden" name="sort[field]" value="'+$('.kt-datatable th.kt-datatable__cell--sorted')[0].dataset.field+'">');
            $('#print_page').append('<input type="hidden" name="sort[sort]" value="'+$('.kt-datatable th.kt-datatable__cell--sorted')[0].dataset.sort+'">');
        }

        $('#print_page').append('<input type="hidden" name="api" value="'+api_url+'">');
        $('#print_page').append('<input type="hidden" name="page_code" value="'+window.Auth.page+'">');
        $('#print_page').submit();
    });

    // export excel
    $('[data-export=excel]').on('click', function(){
      var data = {
        api: api_url,
        page_code: window.Auth.page,
        query: {
          find:$('#generalSearch').val(),
          supplier_code:$('.filter [name=supplier_code]').val()
        }
      };

      if($('[name="start_date"]').val() != "")
        Object.assign(data.query, {start_date:$('[name="start_date"]').val()});
      if($('[name="end_date"]').val() != "")
        Object.assign(data.query, {end_date:$('[name="end_date"]').val()});

      if($('.kt-datatable th.kt-datatable__cell--sorted').length > 0){
        var tmp = {
            'sort' : {
              field: $('.kt-datatable th.kt-datatable__cell--sorted')[0].dataset.field,
              sort: $('.kt-datatable th.kt-datatable__cell--sorted')[0].dataset.sort
            }
        };
        Object.assign(data,tmp);
      }
      KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/pur/req/po', data);
    });
});
