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
    KTFilterIn.init();
    KTFilterOut.init();
    KTDateRange.set({elStart:'[name="in[start]"]', elEnd:'[name="in[end]"]'});
    KTDateRange.set({elStart:'[name="out[start]"]', elEnd:'[name="out[end]"]'});

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
                return price.format(row.stock_qty,0,",",'.');
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

        $('input[name="in[start]"]').on('change', function() {
            gridIn.get('datatable').search($(this).val(), 'start_date');
        });

        $('input[name="in[end]"]').on('change', function() {
            gridIn.get('datatable').search($(this).val(), 'end_date');
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
                return price.format(row.stock_qty,0,",",'.');
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

        $('input[name="out[start]"]').on('change', function() {
            gridOut.get('datatable').search($(this).val(), 'start_date');
        });

        $('input[name="out[end]"]').on('change', function() {
            gridOut.get('datatable').search($(this).val(), 'end_date');
        });
    });

    gridOut.init();
    // end: history out grid



    // export Excel
    $('[data-export=excel]').on('click', function(){
        var data = {
            api: api_url,
            page_code: window.Auth.page,
            query: {
                type:$(this).data('id'),
                find:$('#generalSearch').val(),
                start_date:$('[name="'+$(this).data('id')+'[start]"]').val(),
                end_date:$('[name="'+$(this).data('id')+'[end]"]').val(),
                stock_brand:$('[name=stock_brand_'+$(this).data('id')+']').val(),
                stock_type:$('[name=stock_type_'+$(this).data('id')+']').val(),
                stock_size:$('[name=stock_size_'+$(this).data('id')+']').val(),
                stock_color:$('[name=stock_color_'+$(this).data('id')+']').val(),
                measure_code:$('[name=measure_code_'+$(this).data('id')+']').val(),
                stock_daily_use:$('[name=stock_daily_use_'+$(this).data('id')+']').val()
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
        KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/stk/history', data);
    });

});
