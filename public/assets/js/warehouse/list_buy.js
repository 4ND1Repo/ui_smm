"use strict";

var KTFormPO = function(){
  var formId = '#FPO',
      link_add = api_url+"/api/wh/req/po/add",
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
            data.push({name:"page_code", value:window.Auth.page});
            data.push({name:"page_code_destination", value:'pur'});
            // block ui modal
            var target = formModal+' .modal-content';
            KTApp.block(target, {
                overlayColor: '#000000',
                type: 'v2',
                state: 'primary',
                message: 'Processing...'
            });

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
                            $("#addPO").modal('hide');
                            myGrid.element().reload();
                            console.log('Success');

                            // send notification to target
                            $.ajax({
                              url: api_url+'/api/mng/user/notification/add',
                              type: 'POST',
                              data:{notification_to:'pur', notification_from:window.Auth.nik, notification_content:'Ada request PO', notification_url:base_url+'/pur/req/po', notification_icon: "fa fa-book kt-font-warning"},
                              success: function(r){
                                console.log(r);
                              }
                            });
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
                    KTApp.unblock(target);
                },
                error: function(){
                    swal.fire({
                        title: "",
                        text: "Kesalahan sistem",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then((res) => {
                        console.log('failed');
                    });
                    KTApp.unblock(target);
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

$(document).ready(function(){
    myStorage.set('auth');
    window.Auth = JSON.parse(myStorage.get());

    // begin: grid
    myGrid.set('target', '#datagrid-list-buy');
    myGrid.set('height', '550');
    myGrid.set('url', api_url+'/api/wh/stock/list_buy/grid');
    myGrid.set('page', '10');
    myGrid.set('column',
        [{
            field: 'main_stock_code',
            title: '#',
            sortable: false,
            width: 20,
            selector: {
                class: 'kt-checkbox--solid'
            },
            textAlign: 'center',
        }, {
            field: 'stock_code',
            title: 'Kode Stock'
        }, {
            field: 'po_code',
            title: 'Kode PO',
            sortable: false
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
            field: 'qty.stock_qty',
            title: 'Kuantiti',
            autoHide: false,
            overflow: 'visible',
            template: function(row){
                return price.format(row.stock_qty,2,",",'.');
            }
        }, {
            field: 'qty.need_qty',
            title: 'Kuantiti Kebutuhan',
            autoHide: false,
            overflow: 'visible',
            sortable: false,
            template: function(row){
                return price.format(row.need_qty,2,",",'.');
            }
        }, {
            field: 'stock_min_qty',
            title: 'Minimal Kuantiti',
            template: function(row){
                return price.format(row.stock_min_qty,2,",",'.');
            }
        }, {
            field: 'stock_daily_use',
            title: 'Pinjaman',
            template: function(row){
                return parseInt(row.stock_daily_use)==1?'Ya':'Tidak';
            }
        }]
    );
    myGrid.set('data', {page_code:Auth.page});
    myGrid.set('function', function(){
        $('.filter select[name=measure_code]').on('change', function() {
            myGrid.element().search($(this).val(), 'measure_code');
        });

        $('.filter select[name=stock_brand]').on('change', function() {
            myGrid.element().search($(this).val(), 'stock_brand');
        });

        $('.filter select[name=stock_daily_use]').on('change', function() {
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

        // function buttin on datatable grid
        $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {
            $('.btn-edit').click(function(){
                $.ajax({
                    url: api_url+'/api/wh/stock/find/'+$(this).attr('id'),
                    type: 'GET',
                    success: function(res){
                        if(res.status){
                            var tmp = res.data;
                            $('input[name=stock_code]').val(tmp.stock_code);
                            $('input[name=stock_name]').val(tmp.stock_name);
                            $('input[name=stock_size]').val(tmp.stock_size);
                            $('input[name=stock_brand]').val(tmp.stock_brand);
                            $('input[name=stock_type]').val(tmp.stock_type);
                            $('input[name=stock_color]').val(tmp.stock_color);
                            $('input[name=stock_price]').val(tmp.stock_price);
                            $('input[name=stock_deliver_price]').val(tmp.stock_deliver_price);
                            $('select[name=measure_code]').val(tmp.measure_code).trigger('change');
                            $('input[name=stock_qty]').val(tmp.stock_qty);
                            $('input[name=stock_min_qty]').val(tmp.stock_min_qty);
                            $('input[name=stock_max_qty]').val(tmp.stock_max_qty);
                            if(parseInt(tmp.stock_daily_use) == 1)
                                $('input[name=stock_daily_use]').prop('checked',true);
                            $('.btn-submit').attr('edit',1);
                            $('select[name=category_code]').parent().parent().addClass('kt-hidden');

                            $('#addStock').modal('show');
                        }
                    },
                    error: function(){
                        console.log('error getting data');
                    }
                });
            });

            $('.btn-delete').click(function(){
                Swal.fire({
                    title: 'Anda yakin?',
                    text: "kamu tidak bisa mengembalikannya kembali!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Ya',
                    cancelButtonText: 'Tidak',
                }).then((result) => {
                    if (result.value) {
                        $.ajax({
                            url: api_url+'/api/wh/stock/delete',
                            type: 'POST',
                            data: {'main_stock_code':$(this).attr('id')},
                            success: function(r){
                                Swal.fire({
                                    title: 'Terhapus!',
                                    text: 'Data telah terhapus.',
                                    type: 'success',
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                                myGrid.element().reload();
                                $('[name=find]')[0].focus();
                            },
                            error: function(){
                                console.log('error delete');
                            }
                        });
                    }
                });
            });
        });

        // for check method
        myGrid.element().on('kt-datatable--on-check kt-datatable--on-uncheck kt-datatable--on-layout-updated', function(e) {
          var checkedNodes = myGrid.element().rows('tr[data-row].kt-datatable__row.kt-datatable__row--active').nodes();
          var count = checkedNodes.length;
          var countList = myGrid.element().rows('tr[data-row].kt-datatable__row').nodes().length;
          if (count > 0) {
            $('button[data-target="#addPO"]').prop('disabled', false);
            if(count == countList)
              $('.kt-datatable__head .kt-datatable__row > .kt-datatable__cell .kt-checkbox.kt-checkbox--solid > input').prop('checked', true);
            else
              $('.kt-datatable__head .kt-datatable__row > .kt-datatable__cell .kt-checkbox.kt-checkbox--solid > input').prop('checked', false);
          } else {
            $('button[data-target="#addPO"]').prop('disabled', true);
            $('.kt-datatable__head .kt-datatable__row > .kt-datatable__cell .kt-checkbox.kt-checkbox--solid > input').prop('checked', false);
          }
        });

    });
    myGrid.init();
    // end: grid

    // show create PO modal
    $("#addPO").on('show.bs.modal', function(){
        // initiate validation forms
        KTFormPO.init();

        var nodes = myGrid.element().rows('tr[data-row].kt-datatable__row.kt-datatable__row--active').nodes();
        $.each(nodes, function(k,v){
            var tmpHtml = '';
            tmpHtml += '<div class="po-row data">';
            // detail stock
            tmpHtml += '<div>';
            tmpHtml += '('+$(v).children("td:nth-child(3)").text()+') ';
            tmpHtml += $(v).children("td:nth-child(5)").text();
            tmpHtml += ($(v).children("td:nth-child(6)").text()!==''?' '+$(v).children("td:nth-child(6)").text():'');
            tmpHtml += ($(v).children("td:nth-child(7)").text()!==''?' '+$(v).children("td:nth-child(7)").text():'');
            tmpHtml += ($(v).children("td:nth-child(8)").text()!==''?' '+$(v).children("td:nth-child(8)").text():'');
            tmpHtml += ($(v).children("td:nth-child(9)").text()!==''?' '+$(v).children("td:nth-child(9)").text():'');
            tmpHtml += '</div>';
            // input qty
            tmpHtml += '<div><input type="text" class="form-control form-control-sm qtyPO" name="data['+$(v).find(":checked").val()+']" placeholder="Kuantiti" value="'+($(v).children("td:nth-child(12)").text().replace('.','')).replace(',','.')+'"></div>';
            tmpHtml += '<div>'+(($(v).children("td:nth-child(10)").text()).split(' - '))[1]+'</div>';
            tmpHtml += '<div><input type="text" class="form-control form-control-sm" name="notes['+$(v).find(":checked").val()+']" placeholder="Keterangan" value=""></div>';
            tmpHtml += '<div style="position:relative"><div class="kt-checkbox-list" style="width:20px; position:absolute; left: calc(50% - 10px); top: calc(50% - 10px);">\
                    <label class="kt-checkbox">\
                        <input type="checkbox" tabindex="10" value="1" name="urgent['+$(v).find(":checked").val()+']">&nbsp;\
                        <span></span>\
                    </label>\
                </div></div>';
            tmpHtml += '</div>';
            $('#FPO .po-table').append(tmpHtml);

            KTFormPO.rules('input[name="data['+$(v).find(":checked").val()+']"]');
        });
        $("input.qtyPO").inputmask('decimal', {
            rightAlignNumerics: false
        });
    });

    $("#addPO").on('hide.bs.modal', function(){
      $('#FPO .po-table .data').remove();
    });

    // submit form PO
    $('#addPO .btn-submit').on('click', function(){
      $('#FPO').submit();
    });

    // export excel
    $('[data-export=excel]').on('click', function(){
      var data = {
        api: api_url,
        page_code: window.Auth.page,
        query: {
          find:$('#generalSearch').val(),
          stock_brand:$('.filter [name=stock_brand]').val(),
          measure_code: $('.filter [name=measure_code]').val(),
          stock_daily_use: $('.filter [name=stock_daily_use]').val()
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
      KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/stk/list_buy', data);
    });
});
