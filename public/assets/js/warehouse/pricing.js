"use strict";

var KTGrid = function(){
    var _el,
        gridId = "#datagrid-stock-pricing",
        height = '550',
        url = api_url+'/api/wh/stock/pricing/grid',
        page = '10';

    var _KTDatatable = function(){
        myGrid.set('target', gridId);
        myGrid.set('height', height);
        myGrid.set('url', url);
        myGrid.set('page', page);
        myGrid.set('column',
            [{
                field: 'stock_code',
                title: 'Kode Stok'
            }, {
                field: 'stock_name',
                title: 'name'
            }, {
                field: 'stock_brand',
                title: 'Merek'
            }, {
                field: 'stock_size',
                title: 'Ukuran'
            }, {
                field: 'stock_type',
                title: 'Tipe'
            }, {
                field: 'stock_color',
                title: 'Warna'
            }, {
                field: 'max_price',
                title: 'Harga Tertinggi',
                overflow: 'visible',
                autoHide: false,
                template: function(row){
                    return price.format(row.max_price,0,",",'.');
                }
            }, {
                field: 'min_price',
                title: 'Harga Terendah',
                overflow: 'visible',
                autoHide: false,
                template: function(row){
                    return price.format(row.min_price,0,",",'.');
                }
            }]
        );
        myGrid.set('data',{page_code:window.Auth.page});
        myGrid.set('function', function(){
            $('.filter select[name=stock_brand]').on('change', function() {
                myGrid.element().search($(this).val(), 'stock_brand');
            });

            $('.filter select[name=stock_size]').on('change', function() {
                myGrid.element().search($(this).val(), 'stock_size');
            });

            $('.filter select[name=stock_type]').on('change', function() {
                myGrid.element().search($(this).val(), 'stock_type');
            });

            $('.filter select[name=stock_color]').on('change', function() {
                myGrid.element().search($(this).val(), 'stock_color');
            });

            $('.filter select[name=stock_daily_use]').on('change', function() {
                myGrid.element().search($(this).val(), 'stock_daily_use');
            });

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
    var selectID = "select[name=stock_type]",
        filter = {
          value: 'stock_type',
          label: 'stock_type'
        },
        url = api_url+'/api/mst/stock/type';

    ajaxProcess(selectID, url, filter);
  }

  var stock_size_filter = function(){
    var selectID = "select[name=stock_size]",
        filter = {
          value: 'stock_size',
          label: 'stock_size'
        },
        url = api_url+'/api/mst/stock/size';

    ajaxProcess(selectID, url, filter);
  }

  var stock_color_filter = function(){
    var selectID = "select[name=stock_color]",
        filter = {
          value: 'stock_color',
          label: 'stock_color'
        },
        url = api_url+'/api/mst/stock/color';

    ajaxProcess(selectID, url, filter);
  }

  var stock_brand_filter = function(){
    var selectID = "select[name=stock_brand]",
        filter = {
          value: 'stock_brand',
          label: 'stock_brand'
        },
        url = api_url+'/api/mst/stock/brand';

    ajaxProcess(selectID, url, filter);
  }

  return {
    init: function(){
      KTFilter.filter_type();
      KTFilter.filter_size();
      KTFilter.filter_color();
      KTFilter.filter_brand();
    },
    filter_type: function(){
      stock_type_filter();
    },
    filter_size: function(){
      stock_size_filter();
    },
    filter_color: function(){
      stock_color_filter();
    },
    filter_brand: function(){
      stock_brand_filter();
    }
  };
}();



$(document).ready(function(){
    myStorage.set('auth');
    window.Auth = JSON.parse(myStorage.get());
    window.opname = null;

    // initiate
    KTGrid.init();
    KTFilter.init();

    $('select[name=stock_daily_use]').selectpicker();

    // export excel
    $('[data-export=excel]').on('click', function(){
      var data = {
        api: api_url,
        page_code: window.Auth.page,
        query: {
          find:$('#generalSearch').val(),
          stock_brand:$('.filter [name=stock_brand]').val(),
          stock_size:$('.filter [name=stock_size]').val(),
          stock_type:$('.filter [name=stock_type]').val(),
          stock_color:$('.filter [name=stock_color]').val(),
          stock_daily_use:$('.filter [name=stock_daily_use]').val()
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
      KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/stk/pricing', data);
    });

});
