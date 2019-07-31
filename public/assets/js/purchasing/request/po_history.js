"use strict";

var KTGridPO = function(){
    var _el,
        gridId = "#datagrid-history-po",
        height = '550',
        url = api_url+'/api/pur/req/po/history/grid',
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
                title: 'Tanggal PO'
            }, {
                field: 'do_code',
                title: 'Nomor Surat Jalan'
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
                field: 'stock_name',
                title: 'Nama Stok'
            }, {
                field: 'stock_size',
                title: 'Ukuran'
            }, {
                field: 'stock_brand',
                title: 'Merek'
            }, {
                field: 'stock_type',
                title: 'Tipe'
            }, {
                field: 'stock_color',
                title: 'Warna'
            }, {
                field: 'do_qty',
                title: 'Kuantiti masuk'
            }, {
                field: 'measure_type',
                title: 'Satuan'
            }, {
                field: 'stock_price',
                title: 'Harga'
            }, {
                field: 'finish_by',
                title: 'Diselesaikan oleh'
            }, {
                field: 'finish_date',
                title: 'Pada Tanggal',
                template: function(row){
                  var tmp = row.po_date.split(" "), date;
                  date = tmp[0].split('-');
                  return (tmp.length > 1?(date[2]+"/"+date[1]+"/"+date[0]+' '+tmp[1]):row.po_date);
                }
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
    KTGridPO.init();
});
