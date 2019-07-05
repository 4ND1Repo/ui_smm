"use strict";

$(document).ready(function(){
    myStorage.set('auth');
    var Auth = JSON.parse(myStorage.get());

    // begin: grid
    myGrid.set('target', '#datagrid-history-stock');
    myGrid.set('height', '550');
    myGrid.set('url', api_url+'/api/wh/stock/history');
    myGrid.set('page', '10');
    myGrid.set('column', 
        [{
            field: 'stock_code',
            title: 'Kode Stock',
            sortable: false,
            width: 80,
            overflow: 'visible',
            autoHide: false,
        }, {
            field: 'nik',
            title: 'NIK',
            sortable: false,
            width: 80,
            overflow: 'visible',
            autoHide: false,
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
            title: 'Warna',
        }, {
            field: 'stock_date',
            title: 'Tanggal',
            sortable: false,
            width: 80,
            overflow: 'visible',
            autoHide: false,
        }, {
            field: 'master.master_measure.measure_type',
            title: 'Tipe Ukuran',
            template: function(row){
                return row.measure_code+" - "+row.measure_type;
            }
        }, {
            field: 'stock.qty.stock_qty',
            title: 'Kuantiti',
            template: function(row){
                return price.format(row.stock_qty,2,",",'.');
            }
        }, {
            field: 'stock_notes',
            title: 'Keterangan',
            sortable: false,
            width: 100,
            overflow: 'visible',
            autoHide: false,
        }]
    );
    myGrid.set('data', {menu_page:Auth.page});
    myGrid.set('function', function(){
        $('select[name=measure_code]').on('change', function() {
            myGrid.element().search($(this).val(), 'measure_code');
        });

        $('select[name=stock_brand]').on('change', function() {
            myGrid.element().search($(this).val(), 'stock_brand');
        });

        $('select[name=stock_daily_use]').on('change', function() {
            myGrid.element().search($(this).val(), 'stock_daily_use');
        });

        $.ajax({
            url: api_url+'/api/mst/measure',
            type: 'GET',
            success: function(r){
                if(r.status){
                    $.each(r.data,function(k,v){
                        $('select[name=measure_code]').append('<option value="'+v.measure_code+'">'+v.measure_type+'</option>');
                    });

                    $.ajax({
                        url: api_url+'/api/mst/stock/brand',
                        type: 'GET',
                        success: function(r){
                            if(r.status){
                                $.each(r.data,function(k,v){
                                    $('select[name=stock_brand]').append('<option value="'+v.stock_brand+'">'+(v.stock_brand==null?'Kosong':v.stock_brand)+'</option>');
                                });
                                $('select[name=stock_brand],select[name=measure_code],select[name=stock_daily_use]').selectpicker();
                            }
                        }
                    });
                }
            }
        });
    });

    myGrid.init();
    // end: grid
});