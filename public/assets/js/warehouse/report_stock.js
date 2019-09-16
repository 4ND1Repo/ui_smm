"use strict";

var KTFilter = function(){
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
      KTFilter.filter_type();
      KTFilter.filter_size();
      KTFilter.filter_color();
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


var KTGridDetailReport = function(){
    var grid = function(cf){
      if(cf.main_stock_code !== null){
        var gridElement = new myGrids(cf.url,cf.gridID);
        gridElement.set('height', cf.height);
        gridElement.set('page', cf.page);
        gridElement.set('column', cf.column);
        gridElement.set('data', {page_code:Auth.page, main_stock_code:cf.main_stock_code});
        gridElement.set('fn', cf.fn);
        gridElement.init();
        return gridElement.get('datatable');
      }
      return null;
    }
    return {
      init: function(){
        this.config = {
          main_stock_code: window.main_stock_code,
          gridID: '#datagrid-detail-report-stock',
          height: '500',
          page: '10',
          url: api_url+'/api/wh/rep/stock/detail',
          column: [{
              field: 'stock_date',
              title: 'Tanggal'
          }, {
              field: 'stock_name',
              title: 'Barang'
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
              title: 'Warna',
          }, {
              field: 'master.master_measure.measure_type',
              title: 'Tipe Ukuran',
              template: function(row){
                  return row.measure_code+" - "+row.measure_type;
              }
          }, {
                field: 'first_qty',
                title: 'Stok Awal',
                overflow: 'visible',
                sortable: false,
                autoHide: false,
                template: function(row){
                    return price.format(row.first_qty,0,",",'.');
                }
            }, {
                field: 'qty_in',
                title: 'Stok Masuk',
                overflow: 'visible',
                sortable: false,
                autoHide: false,
                template: function(row){
                    return price.format(row.qty_in,0,",",'.');
                }
            }, {
                field: 'qty_out',
                title: 'Stok Keluar',
                overflow: 'visible',
                sortable: false,
                autoHide: false,
                template: function(row){
                    return price.format(row.qty_out,0,",",'.');
                }
            }, {
                field: 'current_qty',
                title: 'Stock Sekarang',
                overflow: 'visible',
                sortable: false,
                autoHide: false,
                template: function(row){
                    return price.format(row.current_qty,0,",",'.');
                }
            }],
          fn: function(){
              console.log(KTGridDetailReport.element);
          }
        }
  
        this.element = grid(this.config);
      },
      reload: function(){
        if(this.element !== null)
          this.element.destroy();
        this.config.main_stock_code = window.main_stock_code;
        this.element = grid(this.config);
        // reload
        this.element.reload();
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
    window.main_stock_code = null;
    KTFilter.init();
    KTGridDetailReport.init();
    KTDateRange.set({elStart:'[name="in[start]"]', elEnd:'[name="in[end]"]'});

    // begin: Report grid
    var grid = new myGrids(api_url+'/api/wh/rep/stock','#datagrid-report-stock');
    grid.set('height', '550');
    grid.set('page', '10');
    grid.set('column',
        [{
            field: 'stock_code',
            title: 'Kode Stock',
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
            field: 'stock_type',
            title: 'Tipe'
        }, {
            field: 'stock_brand',
            title: 'Merek'
        }, {
            field: 'stock_color',
            title: 'Warna',
        }, {
            field: 'master.master_measure.measure_type',
            title: 'Tipe Ukuran',
            template: function(row){
                return row.measure_code+" - "+row.measure_type;
            }
        }, {
            field: 'first_qty',
            title: 'Stok Awal',
            overflow: 'visible',
            sortable: false,
            autoHide: false,
            template: function(row){
                return price.format(row.first_qty,0,",",'.');
            }
        }, {
            field: 'in_qty',
            title: 'Stok Masuk',
            overflow: 'visible',
            sortable: false,
            autoHide: false,
            template: function(row){
                return price.format(row.in_qty,0,",",'.');
            }
        }, {
            field: 'out_qty',
            title: 'Stok Keluar',
            overflow: 'visible',
            sortable: false,
            autoHide: false,
            template: function(row){
                return price.format(row.out_qty,0,",",'.');
            }
        }, {
            field: 'current_qty',
            title: 'Stock Sekarang',
            overflow: 'visible',
            sortable: false,
            autoHide: false,
            template: function(row){
                return price.format(row.current_qty,0,",",'.');
            }
        }, {
            field: '#',
            title: 'Aksi',
            overflow: 'visible',
            sortable: false,
            autoHide: false,
            template: function(row){
                var btn = [];

                btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-detail" id="'+row.main_stock_code+'" title="Detail data">\
                    <i class="la la-search-plus"></i>\
                </a>');

                return myGrid.action(btn);
            }
        }]
    );
    grid.set('data', {page_code:Auth.page});
    grid.set('fn', function(){
        $('select[name=measure_code_in]').on('change', function() {
            grid.get('datatable').search($(this).val(), 'measure_code');
        });

        $('select[name=stock_brand_in]').on('change', function() {
            grid.get('datatable').search($(this).val(), 'stock_brand');
        });

        $('select[name=stock_size_in]').on('change', function() {
            grid.get('datatable').search($(this).val(), 'stock_size');
        });

        $('select[name=stock_type_in]').on('change', function() {
            grid.get('datatable').search($(this).val(), 'stock_type');
        });

        $('select[name=stock_color_in]').on('change', function() {
            grid.get('datatable').search($(this).val(), 'stock_color');
        });

        $('select[name=stock_daily_use_in]').on('change', function() {
            grid.get('datatable').search($(this).val(), 'stock_daily_use');
        });

        $('input[name="in[start]"]').on('change', function() {
            grid.get('datatable').search($(this).val(), 'start_date');
        });

        $('input[name="in[end]"]').on('change', function() {
            grid.get('datatable').search($(this).val(), 'end_date');
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


        // function buttin on datatable grid
        grid.get('datatable').on('kt-datatable--on-layout-updated', function() {
            $('.btn-detail').click(function(){
                window.main_stock_code = $(this).attr('id');
                KTGridDetailReport.reload();
                $('#detailReport').modal('show');
              });
        });
    });

    grid.init();
    // end: Report grid


    // export Excel
    $('[data-export=excel]').on('click', function(){
        var data = {
            api: api_url,
            page_code: window.Auth.page,
            query: {
                find:$('#generalSearch').val(),
                start_date:$('[name="in[start]"]').val(),
                end_date:$('[name="in[end]"]').val(),
                stock_brand:$('[name=stock_brand]').val(),
                stock_type:$('[name=stock_type]').val(),
                stock_size:$('[name=stock_size]').val(),
                stock_color:$('[name=stock_color]').val(),
                measure_code:$('[name=measure_code]').val(),
                stock_daily_use:$('[name=stock_daily_use]').val()
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
        KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/rep/stock', data);
    });

    $('.btn-export').on('click', function(){
        var data = {
            api: api_url,
            page_code: window.Auth.page,
            main_stock_code: window.main_stock_code,
            query: {
                find:$('#generalSearch').val(),
                start_date:$('[name="in[start]"]').val(),
                end_date:$('[name="in[end]"]').val(),
                stock_brand:$('[name=stock_brand]').val(),
                stock_type:$('[name=stock_type]').val(),
                stock_size:$('[name=stock_size]').val(),
                stock_color:$('[name=stock_color]').val(),
                measure_code:$('[name=measure_code]').val(),
                stock_daily_use:$('[name=stock_daily_use]').val()
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
        KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/rep/stock/detail', data);
    });
});
