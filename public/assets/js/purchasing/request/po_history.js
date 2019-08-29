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
                title: 'Kuantiti masuk',
                template: function(row){
                    return price.format(row.do_qty,2,",",'.');
                }
            }, {
                field: 'measure_type',
                title: 'Satuan'
            }, {
                field: 'stock_price',
                title: 'Harga',
                template: function(row){
                    return price.format(row.stock_price,2,",",'.');
                }
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
            }, {
                field: 'action',
                title: 'Aksi',
                sortable: false,
                width: 60,
                overflow: 'visible',
                autoHide: false,
                class: 'text-center',
                template: function(row) {
                    var btn = [];

                    btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-print" id="'+row.po_code+'" title="Print PO">\
                        <i class="la la-print"></i>\
                    </a>');

                    btn = myGrid.action(btn);
                    return btn;
                },
            }]
        );
        myGrid.set('data',{page_code:window.Auth.page});
        myGrid.set('function', function(){
            $('select[name=status]').on('change', function() {
                myGrid.element().search($(this).val(), 'status');
            });
            $('select[name=status]').selectpicker();

            // function buttin on datatable grid
            $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {

                $('.btn-print').click(function(){
                  var el = this;
                  var data = {
                    api: api_url,
                    nik: window.Auth.nik,
                    po_code: $(el).attr('id')
                  };
                  KTDownload.post(location.href + '/../print', data);
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
    KTGridPO.init();

    // export excel
    $('[data-export=excel]').on('click', function(){
      var data = {
        api: api_url,
        page_code: window.Auth.page,
        query: {
          find:$('#generalSearch').val(),
          status:$('.filter [name=status]').val()
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
      KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/req/history_po_pur', data);
    });
});
