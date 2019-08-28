"use strict";

var KTFormOpname = function(){
  var formId = '#FOpname',
      link_add = api_url+"/api/wh/stock/opname/add",
      formRules = {},
      formModal = '#addOpname';

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
                            $('#FOpname')[0].reset();
                            $('input[name=find_stock]').focus();
                            myGrid.element().reload();
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

  var setRules = function(el,rule){
    $(el).rules("add", (typeof rule === null ?{required:true, min: 0.01}:rule));
  }

  return {
    init: function(){
      console.log('init form');
      this[formId.replace(/'#|.'/g,'')] = validation();
    },
    element: function(){
      return this[formId.replace(/'#|.'/g,'')];
    },
    rules: function(r,s=null){
      console.log('set rule');
      setRules(r,s);
    }
  }
}();

var KTGridOpname = function(){
    var _el,
        gridId = "#datagrid-stock-opname",
        height = '550',
        url = api_url+'/api/wh/stock/opname/grid',
        link_find = api_url+'/api/wh/stock/opname/find/',
        link_delete = api_url+'/api/wh/stock/opname/delete',
        link_approve = api_url+'/api/wh/stock/opname/approve',
        link_reject = api_url+'/api/wh/stock/opname/reject',
        page = '10';

    var _KTDatatable = function(){
        myGrid.set('target', gridId);
        myGrid.set('height', height);
        myGrid.set('url', url);
        myGrid.set('page', page);
        myGrid.set('column',
            [{
                field: 'opname_date_from',
                title: 'Tanggal Opname',
                template: function(row){
                  var tmp = row.opname_date_from.split('-');
                  return tmp[2]+"/"+tmp[1]+"/"+tmp[0];
                }
            }, {
                field: 'create_by',
                title: 'Pembuat'
            }, {
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
                field: 'opname_qty_from',
                title: 'Stok Awal'
            }, {
                field: 'opname_qty',
                title: 'Stok Baru'
            }, {
                field: 'opname_notes',
                title: 'Keterangan'
            }, {
                field: 'approve_by',
                title: 'Disetujui Oleh'
            }, {
                field: 'approve_date',
                title: 'Pada tanggal'
            }, {
                field: 'reject_by',
                title: 'Tidak Disetujui Oleh'
            }, {
                field: 'reject_date',
                title: 'Pada tanggal'
            }, {
                field: 'action',
                title: 'Aksi',
                sortable: false,
                width: 80,
                overflow: 'visible',
                autoHide: false,
                template: function(row) {
                    var btn = '\
                        <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-detail" id="'+row.main_stock_code+'|'+row.opname_date_from+'" title="Detail data">\
                            <i class="la la-search-plus"></i>\
                        </a>\
                    ';
                    if(row.approve_by == null && row.reject_by == null)
                        btn += '\
                            <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.main_stock_code+'|'+row.opname_date_from+'" title="Hapus data">\
                                <i class="la la-trash"></i>\
                            </a>\
                        ';
                    return btn;
                },
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

            $('.filter select[name=approve]').on('change', function() {
                myGrid.element().search($(this).val(), 'approve');
            });

            $('.filter select[name=opname_date_from]').on('change', function() {
                myGrid.element().search($(this).val(), 'opname_date_from');
            });

            $.ajax({
                url: api_url+'/api/mst/stock/brand',
                type: 'GET',
                success: function(r){
                    if(r.status){
                        $.each(r.data,function(k,v){
                            $('select[name=stock_brand]').append('<option value="'+v.stock_brand+'">'+(v.stock_brand==null?'Kosong':v.stock_brand)+'</option>');
                        });
                        // get date opname list
                        $.ajax({
                            url: api_url+'/api/wh/stock/opname/date',
                            type: 'GET',
                            success: function(r){
                                if(r.status){
                                    $.each(r.data,function(k,v){
                                        var tmp = v.opname_date_from.split('-');
                                        $('select[name=opname_date_from]').append('<option value="'+v.opname_date_from+'">'+(tmp[2]+'/'+tmp[1]+'/'+tmp[0])+'</option>');
                                    });

                                    $('select[name=opname_date_from],select[name=stock_brand],select[name=approve]').selectpicker();
                                }
                            }
                        });
                    }
                }
            });

            // function buttin on datatable grid
            $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {
                // coloring for reject opname
                var rw = $('.kt-datatable .kt-datatable__body tr'),
                  rej = [];
                $.each(rw,function(k,v){
                  if($(v).children('td:nth-child(13)').text() !== "")
                    rej.push(v);
                });
                $.each(rej, function(k,v){
                  $(v).css({'background-color':'red'});
                  $(v).children('td').children('span').css({'color':'black'});
                });

                $('.btn-detail').click(function(){
                    $.ajax({
                        url: link_find+$(this).attr('id'),
                        type: 'GET',
                        success: function(res){
                            if(res.status){
                                console.log(res);
                                $('#FOpname input[name=stock_name]').val(res.data.stock_name);
                                $('#FOpname input[name=stock_type]').val(res.data.stock_type);
                                $('#FOpname input[name=stock_size]').val(res.data.stock_size);
                                $('#FOpname input[name=stock_code]').val(res.data.stock_code);
                                $('#FOpname input[name=opname_qty]').val(res.data.opname_qty);
                                $('#FOpname input[name=opname_qty_from]').val(res.data.opname_qty_from);
                                $('#FOpname textarea[name=opname_notes]').val(res.data.opname_notes);
                                $('#FOpname input[name=opname_qty], #FOpname input[name=opname_qty_from], #FOpname textarea[name=opname_notes]').prop('disabled', true);
                                $('#addOpname .btn-submit, #addOpname .typeahead').addClass('kt-hidden');
                                if(res.data.approve_by == null && res.data.reject_by == null){
                                    window.opname = res.data.main_stock_code+"|"+res.data.opname_date_from;
                                    $('#addOpname .btn-approve').removeClass('kt-hidden');
                                }
                                $('#addOpname').modal('show');
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
                                url: link_delete,
                                type: 'POST',
                                data: {'opname':$(this).attr('id'),nik:window.Auth.nik},
                                success: function(r){
                                    Swal.fire({
                                        title: 'Terhapus!',
                                        text: 'Data telah terhapus.',
                                        type: 'success',
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                    _el.reload();
                                    $('[name=find]')[0].focus();
                                },
                                error: function(){
                                    console.log('error delete');
                                }
                            });
                        }
                    });
                });

                $('.btn-approve').click(function(){
                    Swal.fire({
                        title: 'Konfirmasi Stok ini?',
                        text: "Klik di luar pilihan ini jika masih ragu",
                        type: 'info',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Setujui',
                        cancelButtonText: 'Tidak Setujui',
                    }).then((result) => {
                        var formModal = '#addOpname';
                        if (result.value) {
                            // block ui modal
                            var target = formModal+' .modal-content';
                            KTApp.block(target, {
                                overlayColor: '#000000',
                                type: 'v2',
                                state: 'primary',
                                message: 'Processing...'
                            });
                            $.ajax({
                                url: link_approve,
                                type: 'POST',
                                data: {'opname':window.opname,nik:window.Auth.nik,page_code:window.Auth.page},
                                success: function(r){
                                    Swal.fire({
                                        title: 'Konfirmasi!',
                                        text: 'Data telah disetujui.',
                                        type: 'success',
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                    _el.reload();
                                    $('#addOpname').modal('hide');
                                    KTApp.unblock(target);
                                },
                                error: function(){
                                    console.log('error delete');
                                    KTApp.unblock(target);
                                }
                            });
                        } else if (result.dismiss == 'cancel'){
                              // block ui modal
                              var target = formModal+' .modal-content';
                              KTApp.block(target, {
                                  overlayColor: '#000000',
                                  type: 'v2',
                                  state: 'primary',
                                  message: 'Processing...'
                              });
                              $.ajax({
                                  url: link_reject,
                                  type: 'POST',
                                  data: {'opname':window.opname,nik:window.Auth.nik,page_code:window.Auth.page},
                                  success: function(r){
                                      Swal.fire({
                                          title: 'Konfirmasi!',
                                          text: 'Data tidak disetujui.',
                                          type: 'success',
                                          showConfirmButton: false,
                                          timer: 1500
                                      });
                                      _el.reload();
                                      $('#addOpname').modal('hide');
                                      KTApp.unblock(target);
                                  },
                                  error: function(){
                                      console.log('error delete');
                                      KTApp.unblock(target);
                                  }
                              });
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



$(document).ready(function(){
    myStorage.set('auth');
    window.Auth = JSON.parse(myStorage.get());
    window.opname = null;

    // initiate
    KTGridOpname.init();
    KTFormOpname.init();
    KTFilter.init();
    // set rules
    KTFormOpname.rules("#FOpname input[name=stock_code]", {required: true});

    // autocomplete
    var map = {};
    var res = [],
    stockAutocomplete = $('input[name=find_stock].autocomplete').typeahead(null, {
        name: 'stock_name',
        limit: 100,
        source: function(query,psc){
            $.ajax({
                url: api_url+'/api/wh/stock/autocomplete',
                type: 'POST',
                data: {find:query, page_code:window.Auth.page},
                async: false,
                success: function(r){
                    res = [];
                    map = {};
                    $.each(r, function(k,v){
                        res.push(v.label);
                        map[v.label] = v.id;
                    });

                }
            });
            psc(res);
        }
    }).on('typeahead:selected', function(event, selection) {
        var data = selection.split(' - '),
            tmpHtml = '';

        $('#FOpname input[name=stock_code]').val(data[0]);
        $('#FOpname input[name=stock_name]').val(data[1]);
        $('#FOpname input[name=stock_type]').val(data[2]);
        $('#FOpname input[name=stock_size]').val(data[3]);
        $('#FOpname input[name=main_stock_code]').val(map[selection]);

        // get real qty
        $.ajax({
          url: api_url+'/api/wh/stock/qty',
          type: 'POST',
          data: {page_code:window.Auth.page, main_stock_code:map[selection]},
          success: function(r){
            if(r.status){

              $('#FOpname input[name=opname_qty_from]').val((r.data == null?0:r.data));
              $('#FOpname input[name=opname_qty]').focus();
              // set rules
              var opt = {required:true};
              console.log(r.data);
              if(r.data)
                Object.assign(opt, {max: parseFloat(r.data)})
              KTFormOpname.rules("#FOpname input[name=opname_qty]", opt);
              KTFormOpname.rules("#FOpname textarea[name=opname_notes]", {maxlength: 254});
            }
          }
        });

        stockAutocomplete.typeahead('val','');
    });

    $("input[name=opname_qty], input[name=opname_qty_from]").inputmask('decimal', {
        rightAlignNumerics: false
    });

    $("#addOpname").on('hide.bs.modal', function(){
      $('#FOpname input[name=opname_qty], #FOpname input[name=opname_qty_from], #FOpname textarea[name=opname_notes]').prop('disabled', false);
      $('#addOpname .btn-submit, #addOpname .typeahead').removeClass('kt-hidden');
      $('#addOpname .btn-approve').addClass('kt-hidden');
      window.opname = null;
      $('#FOpname')[0].reset();
    });

    // submit form PO
    $('#addOpname .btn-submit').on('click', function(){
      $('#FOpname').submit();
    });

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
          stock_daily_use:$('.filter [name=stock_daily_use]').val(),
          approve:$('.filter [name=approve]').val(),
          opname_date_from:$('.filter [name=opname_date_from]').val()
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
      KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/stk/opname', data);
    });

    $('select[name=stock_daily_use]').selectpicker();
});
