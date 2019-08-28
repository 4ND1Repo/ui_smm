"use strict";

var KTFilterIn = function(){
  var ajaxProcess = function(el, uri, obj){
    $(el).selectpicker('destroy');
    $.ajax({
      type: 'GET',
      url: uri,
      success: function(r){
        var tmp = '<option value="">Semua</option>';
        $.each(r.data, function(k,v){
          tmp += '<option value="'+encodeURI(v[obj.value])+'">'+v[obj.label]+'</option>';
        });
        $(el).html(tmp);
        $(el).selectpicker();
      }
    });
  }

  var stock_type_filter = function(){
    var selectID = "select[name=stock_type_in]",
        filter = {
          value: 'stock_type',
          label: 'stock_type'
        },
        url = api_url+'/api/mst/stock/type';

    ajaxProcess(selectID, url, filter);
  }

  var stock_size_filter = function(){
    var selectID = "select[name=stock_size_in]",
        filter = {
          value: 'stock_size',
          label: 'stock_size'
        },
        url = api_url+'/api/mst/stock/size';

    ajaxProcess(selectID, url, filter);
  }

  var stock_color_filter = function(){
    var selectID = "select[name=stock_color_in]",
        filter = {
          value: 'stock_color',
          label: 'stock_color'
        },
        url = api_url+'/api/mst/stock/color';

    ajaxProcess(selectID, url, filter);
  }

  return {
    init: function(){
      KTFilterIn.filter_type();
      KTFilterIn.filter_size();
      KTFilterIn.filter_color();
    },
    filter_type: function(){
      stock_type_filter();
    },
    filter_size: function(){
      stock_size_filter();
    },
    filter_color: function(){
      stock_color_filter();
    }
  };
}();

var KTFilterOut = function(){
  var ajaxProcess = function(el, uri, obj){
    $(el).selectpicker('destroy');
    $.ajax({
      type: 'GET',
      url: uri,
      success: function(r){
        var tmp = '<option value="">Semua</option>';
        $.each(r.data, function(k,v){
          tmp += '<option value="'+encodeURI(v[obj.value])+'">'+v[obj.label]+'</option>';
        });
        $(el).html(tmp);
        $(el).selectpicker();
      }
    });
  }

  var stock_type_filter = function(){
    var selectID = "select[name=stock_type_out]",
        filter = {
          value: 'stock_type',
          label: 'stock_type'
        },
        url = api_url+'/api/mst/stock/type';

    ajaxProcess(selectID, url, filter);
  }

  var stock_size_filter = function(){
    var selectID = "select[name=stock_size_out]",
        filter = {
          value: 'stock_size',
          label: 'stock_size'
        },
        url = api_url+'/api/mst/stock/size';

    ajaxProcess(selectID, url, filter);
  }

  var stock_color_filter = function(){
    var selectID = "select[name=stock_color_out]",
        filter = {
          value: 'stock_color',
          label: 'stock_color'
        },
        url = api_url+'/api/mst/stock/color';

    ajaxProcess(selectID, url, filter);
  }

  return {
    init: function(){
      KTFilterOut.filter_type();
      KTFilterOut.filter_size();
      KTFilterOut.filter_color();
    },
    filter_type: function(){
      stock_type_filter();
    },
    filter_size: function(){
      stock_size_filter();
    },
    filter_color: function(){
      stock_color_filter();
    }
  };
}();


$(document).ready(function(){
    myStorage.set('auth');
    var Auth = JSON.parse(myStorage.get());

    KTFilterIn.init();
    KTFilterOut.init();

    // begin:  history grid
    var gridIn = new myGrids(api_url+'/api/wh/stock/history','#datagrid-history-stock');
    gridIn.set('height', '550');
    gridIn.set('page', '10');
    gridIn.set('column',
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
            field: 'supplier_name',
            title: 'Nama Supplier'
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
            field: 'stock.qty.qty',
            title: 'Kuantiti',
            overflow: 'visible',
            sortable: false,
            autoHide: false,
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
    gridIn.set('data', {page_code:Auth.page});
    gridIn.set('fn', function(){
        $('select[name=measure_code_in]').on('change', function() {
            gridIn.get('datatable').search($(this).val(), 'measure_code');
        });

        $('select[name=stock_brand_in]').on('change', function() {
            gridIn.get('datatable').search($(this).val(), 'stock_brand');
        });

        $('select[name=stock_size_in]').on('change', function() {
            gridIn.get('datatable').search($(this).val(), 'stock_size');
        });

        $('select[name=stock_type_in]').on('change', function() {
            gridIn.get('datatable').search($(this).val(), 'stock_type');
        });

        $('select[name=stock_color_in]').on('change', function() {
            gridIn.get('datatable').search($(this).val(), 'stock_color');
        });

        $('select[name=stock_daily_use_in]').on('change', function() {
            gridIn.get('datatable').search($(this).val(), 'stock_daily_use');
        });

        $.ajax({
            url: api_url+'/api/mst/measure',
            type: 'GET',
            success: function(r){
                if(r.status){
                    $.each(r.data,function(k,v){
                        $('select[name=measure_code_in], select[name=measure_code_out]').append('<option value="'+v.measure_code+'">'+v.measure_type+'</option>');
                    });

                    $.ajax({
                        url: api_url+'/api/mst/stock/brand',
                        type: 'GET',
                        success: function(r){
                            if(r.status){
                                $.each(r.data,function(k,v){
                                    $('select[name=stock_brand_in], select[name=stock_brand_out]').append('<option value="'+v.stock_brand+'">'+(v.stock_brand==null?'Kosong':v.stock_brand)+'</option>');
                                });
                                $('select[name=stock_brand_in],select[name=measure_code_in],select[name=stock_daily_use_in],select[name=stock_brand_out],select[name=measure_code_out],select[name=stock_daily_use_out]').selectpicker();
                            }
                        }
                    });
                }
            }
        });
    });

    gridIn.init();
    // end: history grid



    // begin:  history out grid
    var gridOut = new myGrids(api_url+'/api/wh/stock/history_out','#datagrid-history-stock-out');
    gridOut.set('height', '550');
    gridOut.set('page', '10');
    gridOut.set('find', '#generalSearchOut');
    gridOut.set('column',
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
            field: 'supplier_name',
            title: 'Nama Supplier'
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
            width: 80,
            overflow: 'visible',
            autoHide: false,
        }, {
            field: 'stock_out_date',
            title: 'Tanggal Keluar',
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
            field: 'stock.qty_out.qty',
            title: 'Kuantiti',
            overflow: 'visible',
            sortable: false,
            autoHide: false,
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
    gridOut.set('data', {page_code:Auth.page});
    gridOut.set('fn', function(){
        $('select[name=measure_code_out]').on('change', function() {
            gridOut.get('datatable').search($(this).val(), 'measure_code');
        });

        $('select[name=stock_brand_out]').on('change', function() {
            gridOut.get('datatable').search($(this).val(), 'stock_brand');
        });

        $('select[name=stock_size_out]').on('change', function() {
            gridOut.get('datatable').search($(this).val(), 'stock_size');
        });

        $('select[name=stock_type_out]').on('change', function() {
            gridOut.get('datatable').search($(this).val(), 'stock_type');
        });

        $('select[name=stock_color_out]').on('change', function() {
            gridOut.get('datatable').search($(this).val(), 'stock_color');
        });

        $('select[name=stock_daily_use_out]').on('change', function() {
            gridOut.get('datatable').search($(this).val(), 'stock_daily_use');
        });
    });

    gridOut.init();
    // end: history out grid




});
