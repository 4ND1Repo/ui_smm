"use strict";

var KTGridBorrow = function(){
    var _el,
        gridId = "#datagrid-borrow",
        height = '550',
        url = api_url+'/api/wh/req/borrow/grid',
        page = '10',
        gridContent = [{
            field: 'borrowed_code',
            title: 'Kode Pinjaman'
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
            field: 'borrowed_qty',
            title: 'Jumlah'
        }, {
            field: 'borrowed_date',
            title: 'Tanggal Pinjam'
        }, {
            field: 'borrowed_end_date',
            title: 'Tanggal Pengembalian',
            sortable: false
        }, {
            field: 'borrowed_notes',
            title: 'Keterangan'
        }, {
            field: 'status_label',
            title: 'Status',
            template: function(row){
                var status = {
                    1: {'title': 'Pending', 'class': 'kt-badge--brand'},
                    2: {'title': 'Delivered', 'class': ' kt-badge--danger'},
                    "ST04": {'title': 'Canceled', 'class': ' kt-badge--primary'},
                    "ST05": {'title': 'Success', 'class': ' kt-badge--success'},
                    "ST06": {'title': 'Info', 'class': ' kt-badge--info'},
                    "ST03": {'title': 'Danger', 'class': ' kt-badge--danger'},
                    "ST02": {'title': 'Warning', 'class': ' kt-badge--warning'},
                };
                return '<span class="kt-badge ' + (typeof status[row.status] !== 'undefined'?status[row.status].class:'') + ' kt-badge--inline kt-badge--pill">' + row.status_label + '</span>';
            }
        }, {
            field: 'action',
            title: 'Aksi',
            sortable: false,
            width: 110,
            overflow: 'visible',
            autoHide: false,
            class: 'text-center',
            template: function(row) {
                var btn = [];

                // action to add button
                btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-detail" id="'+row.borrowed_code+'" title="Detail data">\
                    <i class="la la-search-plus"></i>\
                </a>');

                if(window.Auth.page == 'wh' && $.inArray(row.status, ['ST02']) !== -1)
                    btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-return" id="'+row.borrowed_code+'" title="Pengembalian">\
                        <i class="la la-check-square"></i>\
                    </a>');

                if(window.Auth.page == 'wh' && $.inArray(row.status, ['ST02', 'ST05']) == -1)
                    btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-take" id="'+row.borrowed_code+'" title="Proses data">\
                        <i class="la la-cog"></i>\
                    </a>');

                if(window.role.edit == 1 && $.inArray(row.status, ['ST02', 'ST05']) == -1)
                    btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-edit" id="'+row.borrowed_code+'" title="Ubah data">\
                        <i class="la la-pencil"></i>\
                    </a>');

                if(window.role.del == 1 && $.inArray(row.status, ['ST02', 'ST05']) == -1){
                    if(row.finish_by == null)
                        btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.borrowed_code+'" title="Hapus">\
                        <i class="la la-trash"></i>\
                        </a>');
                }


                // joining array button to grid
                btn = myGrid.action(btn);
                return btn;
            },
        }];
    if(window.Auth.page == 'wh'){
      gridContent.splice(6,0,{field: 'company_name', title: 'Perusahaan'});
      gridContent.splice(7,0,{field: 'borrowed_req_name', title: 'Peminjam'});
      gridContent.splice(8,0,{field: 'borrowed_take_name', title: 'Pengambil'});
    }

    var _KTDatatable = function(){
        myGrid.set('target', gridId);
        myGrid.set('height', height);
        myGrid.set('url', url);
        myGrid.set('page', page);
        myGrid.set('column', gridContent);
        var opt = {page_code:window.Auth.page};
        if(window.Auth.page !== 'wh')
          Object.assign(opt,{nik:window.Auth.nik});
        myGrid.set('data',opt);
        myGrid.set('function', function(){
            $('select[name=status]').on('change', function() {
                myGrid.element().search($(this).val(), 'status');
            });
            $('select[name=status]').selectpicker();

            // function buttin on datatable grid
            $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {
                $('.btn-detail').click(function(){
                    $.ajax({
                        url: api_url+'/api/wh/req/borrow/find/'+$(this).attr('id'),
                        type: 'GET',
                        success: function(res){
                            if(res.status){
                                var data = res.data;
                                $('input[name=main_stock_code]').val(data.main_stock_code);
                                $('input[name=stock_code]').val(data.stock_code).prop('disabled',true);
                                $('input[name=stock_name]').val(data.stock_name);
                                $('input[name=stock_type]').val(data.stock_type);
                                $('input[name=stock_size]').val(data.stock_size);
                                $('input[name=stock_qty]').val(parseFloat(data.stock_qty==null?0:data.stock_qty));
                                $('input[name=borrowed_qty]').val(data.borrowed_qty);
                                $('input[name=borrowed_long_term]').val(data.borrowed_long_term);
                                $('input[name=borrowed_date]').val(data.borrowed_date);
                                $('input[name=borrowed_notes]').val(data.borrowed_notes);
                                $('input[name=nik]').val(data.nik);
                                $('input[name=take_nik]').val(data.take_nik);
                                $('input[name=borrowed_req_name]').val(data.borrowed_req_name);
                                $('input[name=borrowed_take_name]').val(data.borrowed_take_name);
                                $('select[name=company_code]').val(data.company_code);
                                if(data.borrowed_take_name != data.borrowed_req_name){
                                  $('input[name=borrowed_self]').prop('checked', false);
                                  $('.take').removeClass('kt-hidden');
                                }
                                $('#FBorrow').find('input,select,textarea').prop('disabled', true);
                                $('#addBorrow').find('.btn-submit').attr({'edit':1, 'id': data.borrowed_code});

                                $('.modal-footer,.validated.search').addClass('kt-hidden');

                                $('#addBorrow').modal('show');
                            }
                        },
                        error: function(){
                            console.log('error getting data');
                        }
                    });
                });

                $('.btn-edit').click(function(){
                    $.ajax({
                        url: api_url+'/api/wh/req/borrow/find/'+$(this).attr('id'),
                        type: 'GET',
                        success: function(res){
                            if(res.status){
                                var data = res.data;
                                $('input[name=main_stock_code]').val(data.main_stock_code);
                                $('input[name=stock_code]').val(data.stock_code).prop('disabled',true);
                                $('input[name=stock_name]').val(data.stock_name);
                                $('input[name=stock_type]').val(data.stock_type);
                                $('input[name=stock_size]').val(data.stock_size);
                                $('input[name=stock_qty]').val(parseFloat(data.stock_qty==null?0:data.stock_qty));
                                $('input[name=borrowed_qty]').val(data.borrowed_qty);
                                $('input[name=borrowed_long_term]').val(data.borrowed_long_term);
                                $('input[name=borrowed_date]').val(data.borrowed_date);
                                $('input[name=borrowed_notes]').val(data.borrowed_notes);
                                $('input[name=nik]').val(data.nik);
                                $('input[name=take_nik]').val(data.take_nik);
                                $('input[name=borrowed_req_name]').val(data.borrowed_req_name);
                                $('input[name=borrowed_take_name]').val(data.borrowed_take_name);
                                $('select[name=company_code]').val(data.company_code);
                                if(data.borrowed_take_name != data.borrowed_req_name){
                                  $('input[name=borrowed_self]').prop('checked', false);
                                  $('.take').removeClass('kt-hidden');
                                }
                                $('#addBorrow').find('.btn-submit').attr({'edit':1, 'id': data.borrowed_code});

                                $('#addBorrow').modal('show');
                            }
                        },
                        error: function(){
                            console.log('error getting data');
                        }
                    });
                });

                $('.btn-take').click(function(){
                    $.ajax({
                        url: api_url+'/api/wh/req/borrow/find/'+$(this).attr('id'),
                        type: 'GET',
                        success: function(res){
                            if(res.status){
                                var data = res.data;
                                $('input[name=main_stock_code]').val(data.main_stock_code);
                                $('input[name=stock_code]').val(data.stock_code).prop('disabled',true);
                                $('input[name=stock_name]').val(data.stock_name);
                                $('input[name=stock_type]').val(data.stock_type);
                                $('input[name=stock_size]').val(data.stock_size);
                                $('input[name=stock_qty]').val(parseFloat(data.stock_qty==null?0:data.stock_qty));
                                $('input[name=borrowed_qty]').val(data.borrowed_qty);
                                $('input[name=borrowed_long_term]').val(data.borrowed_long_term);
                                $('input[name=borrowed_date]').val(data.borrowed_date);
                                $('input[name=borrowed_notes]').val(data.borrowed_notes);
                                $('input[name=nik]').val(data.nik);
                                $('input[name=take_nik]').val(data.take_nik);
                                $('input[name=borrowed_req_name]').val(data.borrowed_req_name);
                                $('input[name=borrowed_take_name]').val(data.borrowed_take_name);
                                $('select[name=company_code]').val(data.company_code);
                                if(data.borrowed_take_name != data.borrowed_req_name){
                                  $('input[name=borrowed_self]').prop('checked', false);
                                  $('.take').removeClass('kt-hidden');
                                }
                                // disabled form
                                $("#FBorrow").find('input, select, textarea').prop('readonly', true);
                                $("#FBorrow").find('[name=borrowed_take_name], [name=take_nik], [name=borrowed_self]').prop('readonly', false);

                                $('#addBorrow').find('.btn-submit').attr({'edit':1, 'id': data.borrowed_code});

                                $('#addBorrow').modal('show');
                            }
                        },
                        error: function(){
                            console.log('error getting data');
                        }
                    });
                });

                $('.btn-return').click(function(){
                    $.ajax({
                        url: api_url+'/api/wh/req/borrow/find/'+$(this).attr('id'),
                        type: 'GET',
                        data: {return:1},
                        success: function(res){
                            if(res.status){
                                var data = res.data,
                                  formID = '#FReturn';
                                $(formID+' input[name=main_stock_code]').val(data.main_stock_code);
                                $(formID+' input[name=stock_code]').val(data.stock_code).prop('disabled',true);
                                $(formID+' input[name=stock_name]').val(data.stock_name);
                                $(formID+' input[name=stock_type]').val(data.stock_type);
                                $(formID+' input[name=stock_size]').val(data.stock_size);
                                $(formID+' input[name=stock_qty]').val(parseFloat(data.stock_qty==null?0:data.stock_qty)+parseFloat(data.borrowed_qty));
                                $(formID+' input[name=borrowed_qty]').val(data.borrowed_last_qty);
                                $(formID+' input[name=borrowed_long_term]').val(data.borrowed_long_term);
                                $(formID+' input[name=borrowed_date]').val(data.borrowed_date);
                                $(formID+' input[name=borrowed_notes]').val(data.borrowed_notes);
                                $(formID+' input[name=nik]').val(data.nik);
                                $(formID+' input[name=take_nik]').val(data.take_nik);
                                $(formID+' input[name=borrowed_req_name]').val(data.borrowed_req_name);
                                $(formID+' input[name=borrowed_take_name]').val(data.borrowed_take_name);
                                $(formID+' select[name=company_code]').val(data.company_code);
                                if(data.borrowed_take_name != data.borrowed_req_name){
                                  $(formID+' input[name=borrowed_self]').prop('checked', false);
                                  $(formID+' .take').removeClass('kt-hidden');
                                }
                                // disabled form
                                $(formID).find('input, select, textarea').prop('readonly', true);
                                $(formID).find('[name=returned_qty]').prop('readonly', false);

                                $('#addReturn').find('.btn-submit').attr({'id': data.borrowed_code});

                                $('#addReturn').modal('show');
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
                            var el = this;
                            $.ajax({
                                url: api_url+'/api/wh/req/borrow/delete',
                                type: 'POST',
                                data: {'borrowed_code':$(el).attr('id'),nik:window.Auth.nik},
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

                                    // send notification to target
                                    $.ajax({
                                      url: api_url+'/api/mng/user/notification/add',
                                      type: 'POST',
                                      data:{notification_to:'wh', notification_from:window.Auth.nik, notification_content:'Request Pinjam Barang('+$(el).attr('id')+') digagalkan', notification_url:'/wh/req/borrow', notification_icon: "fa fa-people-carry kt-font-danger"},
                                      success: function(r){
                                        console.log(r);
                                      }
                                    });
                                },
                                error: function(){
                                    console.log('error delete');
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

$(document).ready(function(){
    // initiate
    KTGridBorrow.init();

    $('#addBorrow').find('.btn-submit').click(function(){
        $('#FBorrow').submit();
    });

    $('#addReturn').find('.btn-submit').click(function(){
        $('#FReturn').submit();
    });

    // reset form when hide
    $("#addBorrow").on('hide.bs.modal', function(){
        borrow.element.resetForm();
        $('#FBorrow')[0].reset();
        $('input[name=stock_code], input[name=borrowed_long_term], input[name=borrowed_date], input[name=borrowed_qty], input[name=main_stock_code], input[name=create_by], textarea[name=borrowed_notes]').prop('disabled',false);
        $('.request_user').find('input,select').prop('disabled',false);
        $('#FBorrow').find('.invalid-feedback').remove();
        $('#addBorrow').find('.btn-submit').removeAttr('edit');
        $('.modal-footer,.validated.search').removeClass('kt-hidden');
    });

    // autocomplete
    var map = {},
        datas = {};
    var res = [],
    ajx = null,
    stockAutocomplete = $('input[name=stock_code].autocomplete').typeahead(null, {
        name: 'stock_code',
        limit: 100,
        source: function(query,psc){
            $.ajax({
                url: api_url+'/api/wh/stock/autocomplete',
                type: 'POST',
                data: {find:query, page_code:'wh', stock_daily_use:1},
                async: false,
                success: function(r){
                    res = [];
                    map = {};
                    $.each(r, function(k,v){
                        res.push(v.label);
                        map[v.label] = v.id;
                        datas[v.label] = v.data;
                    });

                }
            });
            psc(res);
        }
    }).on('typeahead:selected', function(event, selection) {
        var tmp = '',
            data = selection.split(' - ');

        $('input[name=stock_name]').val(datas[selection]['stock_name']);
        $('input[name=stock_type]').val(datas[selection]['stock_type']);
        $('input[name=stock_size]').val(datas[selection]['stock_size']);
        $('input[name=stock_qty]').val((datas[selection]['qty']==null?0:datas[selection]['qty']));
        $('input[name=main_stock_code]').val(map[selection]);
        $(stockAutocomplete).prop('disabled', true);
        $('input[name=borrowed_long_term]').focus();

        $('.typeahead').on('dblclick', function(){
          $(this).find('input').prop('disabled', false).focus();
        });

        stockAutocomplete.typeahead('val',data[0]);
    });
    $('#FBorrow .typeahead').on('keyup', function(e) {
        if(e.which == 13) {
            $(".tt-suggestion:first-child", this).trigger('click');
        }
    });


    // autocomplete
    var map = {};
    var res = [],
    nikAutocomplete = $('input[name=nik]').typeahead(null, {
        name: 'req_nik',
        source: function(query,psc){
            $.ajax({
                url: api_url+'/api/account/user/autocomplete',
                type: 'POST',
                data: {find:query},
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
        var tmp = '',
            data = selection.split(' - ');
        $('[name=borrowed_req_name]').val(data[1]);
        nikAutocomplete.typeahead('val',data[0]);

        if($('[name=borrowed_self]').is(':checked')){
          $('[name=take_nik]').val(data[0]);
          $('[name=borrowed_take_name]').val(data[1]);
        }
    });


    // autocomplete
    var map = {};
    var res = [],
    takeNikAutocomplete = $('input[name=take_nik]').typeahead(null, {
        name: 'req_nik',
        source: function(query,psc){
            $.ajax({
                url: api_url+'/api/account/user/autocomplete',
                type: 'POST',
                data: {find:query},
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
        var tmp = '',
            data = selection.split(' - ');
        $('[name=borrowed_take_name]').val(data[1]);
        takeNikAutocomplete.typeahead('val',data[0]);
    });


    // form by all-library.js
    var borrow = new KTForm.init({
      formId:"#FBorrow",
      link: api_url+'/api/wh/req/borrow/add',
      data: {
        nik: window.Auth.nik,
        page_code: window.Auth.page
      },
      formRules:{
        borrowed_req_name : {required:true},
        company_code : {required:true},
        main_stock_code : {required:true},
        borrowed_long_term : {required:true},
        borrowed_date : {required:true},
        borrowed_qty : {required:true},
      },
      fn:{
        before: function(el,callback){
          if(parseFloat($('input[name=stock_qty]').val()) < parseFloat($('input[name=borrowed_qty]').val())){
            KTForm.notif({
              text: 'Kuantiti melebihi stok yang ada',
              type: 'error',
              timer: 1500
            });
            $('input[name=borrowed_qty]').focus();
            return;
          } else if(parseFloat($('input[name=borrowed_qty]').val()) <= 0){
            KTForm.notif({
              text: 'Kuantiti tidak boleh kurang dari 1',
              type: 'error',
              timer: 1500
            });
            $('input[name=borrowed_qty]').focus();
            return;
          }

          if(typeof $('#addBorrow').find('.btn-submit').attr('edit') !== 'undefined')
              callback({link:api_url+'/api/wh/req/borrow/edit', data:{borrowed_code:$('#addBorrow').find('.btn-submit').attr('id')}},el);
          return true;
        },
        after: function(r){
          if(r.status){
              KTForm.notif({
                text: r.message,
                type: "success",
                timer: 1500,
                fn:{
                  after: function(r){
                    var to = 'wh';
                    borrow.element.resetForm();
                    $(borrow.formId)[0].reset();
                    KTGridBorrow.element().reload();

                    if(typeof $('#addBorrow').find('.btn-submit').attr('edit') !== 'undefined')
                      $('#addBorrow').modal('hide');
                    // send notification to target
                    if(to !== ""){
                      $.ajax({
                        url: api_url+'/api/mng/user/notification/add',
                        type: 'POST',
                        data:{notification_to:to, notification_from:window.Auth.nik, notification_content:'Pinjaman barang', notification_icon: "fa fa-people-carry kt-font-default"},
                        success: function(r){
                          console.log(r);
                        }
                      });
                    }
                    console.log('Success');

                    // action for warehouse add Borrowed of Goods
                    if(window.Auth.page == 'wh'){
                      $('.request_user').removeClass('kt-hidden');

                      $('[name=borrowed_self]').on('change', function(){
                        if($(this).is(':checked')){
                          $('.take').addClass('kt-hidden');
                          $('[name=take_nik]').val($('[name=nik]').val());
                          $('[name=borrowed_take_name]').val($('[name=borrowed_req_name]').val());
                        } else {
                          $('.take').removeClass('kt-hidden');
                          $('[name=take_nik]').val('');
                          $('[name=borrowed_take_name]').val('');
                        }

                        if($('#FBorrow').find('[name="create_by"]').length == 0)
                          $('#FBorrow').append('<input type="hidden" name="create_by" value="'+window.Auth.nik+'">');
                      })
                    } else {
                        $('.take').addClass('kt-hidden');
                        $('[name=nik]').val(window.Auth.nik);
                        $('[name=borrowed_self]').prop('checked', false).removeAttr('checked');
                        $('[name=borrowed_req_name]').val(window.Auth.name);
                        $('[name=company_code]').val(window.Auth.company);
                    }
                  }
                }
              });
          } else {
              KTForm.notif({
                text: r.message,
                type: "warning",
                timer: 1500
              });
          }
        }
      }
    });

    var returnGoods = new KTForm.init({
      formId:"#FReturn",
      link: api_url+'/api/wh/req/borrow/return',
      data: {
        nik: window.Auth.nik,
        page_code: window.Auth.page
      },
      formRules:{
        main_stock_code : {required:true},
        returned_qty : {required:true}
      },
      fn:{
        before: function(el,callback){
          if(parseFloat($(el.formId+' input[name=returned_qty]').val()) > parseFloat($(el.formId+' input[name=borrowed_qty]').val())){
            KTForm.notif({
              text: 'Kuantiti melebihi stok yang ada',
              type: 'error',
              timer: 1500
            });
            $(el.formId+' input[name=returned_qty]').focus();
            return;
          } else if(parseFloat($(el.formId+' input[name=returned_qty]').val()) <= 0){
            KTForm.notif({
              text: 'Kuantiti tidak boleh kurang dari 1',
              type: 'error',
              timer: 1500
            });
            $(el.formId+' input[name=returned_qty]').focus();
            return;
          }

          callback({data:{borrowed_code:$('#addReturn').find('.btn-submit').attr('id')}},el);
          return true;
        },
        after: function(r){
          if(r.status){
              KTForm.notif({
                text: r.message,
                type: "success",
                timer: 1500,
                fn:{
                  after: function(r){
                    var to = 'wh';
                    returnGoods.element.resetForm();
                    $(returnGoods.formId)[0].reset();
                    KTGridBorrow.element().reload();
                    $('#addReturn').modal('hide');
                  }
                }
              });
          } else {
              KTForm.notif({
                text: r.message,
                type: "warning",
                timer: 1500
              });
          }
        }
      }
    });

    $("input[name=borrowed_long_term], input[name=borrowed_qty], input[name=returned_qty]").inputmask('decimal', {
        rightAlignNumerics: false
    });

    // generate company data
    $.ajax({
      url: api_url+'/api/mst/company',
      type: 'GET',
      success: function(r){
        var option = "";
        $.each(r.data, function(k,v){
          option += '<option value="'+v.company_code+'">'+v.company_name+'</option>';
        });
        $('select[name="company_code"]').html(option);
        $('select').selectpicker();
      }
    });

    // action for warehouse add Borrowed of Goods
    if(window.Auth.page == 'wh'){
      $('.request_user').removeClass('kt-hidden');

      $('[name=borrowed_self]').on('change', function(){
        if($(this).is(':checked')){
          $('.take').addClass('kt-hidden');
          $('[name=take_nik]').val($('[name=nik]').val());
          $('[name=borrowed_take_name]').val($('[name=borrowed_req_name]').val());
        } else {
          $('.take').removeClass('kt-hidden');
          $('[name=take_nik]').val('');
          $('[name=borrowed_take_name]').val('');
        }

        if($('#FBorrow').find('[name="create_by"]').length == 0)
          $('#FBorrow').append('<input type="hidden" name="create_by" value="'+window.Auth.nik+'">');
      })
    } else {
        $('.take').addClass('kt-hidden');
        $('[name=nik]').val(window.Auth.nik);
        $('[name=borrowed_self]').prop('checked', false).removeAttr('checked');
        $('[name=borrowed_req_name]').val(window.Auth.name);
        $('[name=company_code]').val(window.Auth.company);
    }

});
