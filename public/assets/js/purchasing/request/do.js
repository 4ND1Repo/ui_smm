"use strict";

var KTGrid = function(){
    var _el,
        gridId = "#datagrid-purchasing-do",
        height = '550',
        url = api_url+'/api/pur/req/do/grid',
        page = '10';

    var _KTDatatable = function(){
        myGrid.set('target', gridId);
        myGrid.set('height', height);
        myGrid.set('url', url);
        myGrid.set('page', page);
        myGrid.set('column',
            [{
                field: 'do_code',
                title: 'Surat Jalan'
            }, {
                field: 'create_date',
                title: 'Tanggal'
            }, {
                field: 'po_code',
                title: 'Kode PO'
            }, {
                field: 'stock_code',
                title: 'Kode Barang'
            }, {
                field: 'stock_name',
                title: 'Nama Barang'
            }, {
                field: 'stock_size',
                title: 'Ukuran'
            }, {
                field: 'stock_type',
                title: 'Tipe'
            }, {
                field: 'stock_brand',
                title: 'Merek'
            }, {
                field: 'stock_color',
                title: 'Warna'
            }, {
                field: 'do_qty',
                title: 'Kuantiti Masuk',
                overflow: 'visible',
                sortable: false,
                autoHide: false,
                template: function(row){
                    return price.format(row.do_qty,2,",",'.');
                }
            }]
        );
        myGrid.set('data',{page_code:window.Auth.page});
        myGrid.set('function', function(){
            // function buttin on datatable grid
            $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {

                $('.filter input[name="date[start]"]').on('change', function() {
                    myGrid.element().search($(this).val(), 'start_date');
                });

                $('.filter input[name="date[end]"]').on('change', function() {
                    myGrid.element().search($(this).val(), 'end_date');
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
    // initiate
    KTGrid.init();

    // export Excel
    $('[data-export=excel]').on('click', function(){
      var data = {
        api: api_url,
        page_code: window.Auth.page,
        query: {
          find:$('#generalSearch').val(),
          start_date:$('[name="date[start]"]').val(),
          end_date:$('[name="date[end]"]').val()
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
      KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/pur/req/do', data);
    });



    // for date range
    $('input[name="date[start]"]').on('changeDate', function(selected) {
        if($(this).val() != ""){
          var startDate = new Date(selected.date.valueOf());
          $('input[name="date[end]"]').datepicker('setStartDate', startDate);
          if($('input[name="date[start]"]').val() > $('input[name="date[end]"]').val()){
            $('input[name="date[end]"]').val($('input[name="date[start]"]').val());
          }
        }
    });
    $('input[name="date[end]"]').on('changeDate', function(selected) {
        if($(this).val() != ""){
          var endDate = new Date(selected.date.valueOf());
          $('input[name="date[start]"]').datepicker('setEndDate', endDate);
          if($('input[name="date[start]"]').val() > $('input[name="date[end]"]').val()){
            $('input[name="date[start]"]').val($('input[name="date[end]"]').val());
          }
        }
    });
});
