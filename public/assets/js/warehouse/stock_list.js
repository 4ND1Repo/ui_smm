"use strict";

var KTValidationForm = function(){
    var formId = "#FStock",
        formModal = "#addStock";
    var _el = null,
        Auth;

    var SupplierFormValidation = function () {
        _el = $( formId ).validate({
            // define validation rules
            rules: {
                category_code: {
                    required: true
                },
                stock_name: {
                    required: true,
                    maxlength: 50
                },
                stock_size: {
                    maxlength: 50
                },
                stock_brand: {
                    maxlength: 50
                },
                stock_type: {
                    maxlength: 50
                },
                stock_color: {
                    maxlength: 20
                }
            },

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
                var data = $("#FStock").serializeArray(),
                    link = api_url+"/api/wh/stock/add",
                    bEdit = $(".btn-submit")[0].hasAttribute('edit');

                data.push({name:"nik", value:Auth.nik});
                data.push({name:"page_code", value:Auth.page});

                if(bEdit)
                    link = api_url+"/api/wh/stock/edit";

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
                            myGrid.element().reload();
                            $(formId)[0].reset();
                            $('select[name=category_code],select[name=measure_code]').selectpicker('refresh');

                            if(bEdit){
                                $('#addStock').modal('hide');
                                $('.btn-submit')[0].removeAttribute('edit');
                                $('select[name=category_code]').parent().parent().removeClass('kt-hidden');
                            }

                            swal.fire({
                                title: "",
                                text: r.message,
                                type: "success",
                                showConfirmButton: false,
                                timer: 1500
                            }).then((res) => {
                                console.log(res);
                            });

                            // generate brand
                            $('select[name=stock_brand]').selectpicker('destroy');
                            $('select[name=stock_brand]').html('<option value="">All</option>');
                            $.ajax({
                                url: api_url+'/api/mst/stock/brand',
                                type: 'GET',
                                success: function(r){
                                    if(r.status){
                                        $.each(r.data,function(k,v){
                                            $('select[name=stock_brand]').append('<option value="'+v.stock_brand+'">'+(v.stock_brand==null?'Kosong':v.stock_brand)+'</option>');
                                        });
                                        $('select[name=stock_brand]').selectpicker();
                                    }
                                }
                            });
                        } else {
                            swal.fire({
                                title: "",
                                text: r.message,
                                type: "warning",
                                showConfirmButton: false,
                                timer: 1500
                            }).then((res) => {
                                $(formId+" input[type=text]")[0].focus();
                            });
                        }
                        KTApp.unblock(target);
                    },
                    error: function(e){
                        swal.fire({
                            title: "",
                            text: "Kesalahan sistem",
                            type: "error",
                            showConfirmButton: false,
                            timer: 1500
                        }).then((res) => {
                            console.log(e);
                        });
                        KTApp.unblock(target);
                    }
                });
                return false;
            }
        });
    };

    var _auth = function(){
        myStorage.set('auth');
        Auth = JSON.parse(myStorage.get());
    }

    var GetCategory = function(){
        $.ajax({
            url: api_url+'/api/mst/category',
            type: 'GET',
            success: function(r){
                if(r.status){
                    $.each(r.data,function(k,v){
                        $('select[name=category_code]').append('<option value="'+v.category_code+'">'+v.category_name+'</option>');
                    });

                    $('select[name=category_code]').selectpicker();
                }
            }
        });
    }

    return {
        element: function(){
            return _el;
        },
        init: function(){
            _auth();
            SupplierFormValidation();
            GetCategory();
        }
    };
}();


var KTQtyForm = function(){
    var formId = "#FQty",
        formModal = "#addQty";
    var _el = null,
        Auth;

    var SupplierFormValidation = function () {
        _el = $( formId ).validate({
            // define validation rules
            rules: {
                stock_qty: {
                    required: true
                },
            },

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
                var link = api_url+"/api/wh/stock/qty/add";

                var data = $("#FQty").serializeArray();
                data.push({name:"nik", value:Auth.nik});
                data.push({name:"page_code", value:Auth.page});
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
                            myGrid.element().reload();
                            $(formId)[0].reset();
                            $('#addQty').modal('hide');

                            swal.fire({
                                title: "",
                                text: r.message,
                                type: "success",
                                showConfirmButton: false,
                                timer: 1500,
                                allowOutsideClick: false
                            }).then((res) => {
                                console.log('success');
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
                    error: function(e){
                        swal.fire({
                            title: "",
                            text: "Kesalahan sistem",
                            type: "error",
                            showConfirmButton: false,
                            timer: 1500
                        }).then((res) => {
                            console.log(e);
                        });
                        KTApp.unblock(target);
                    }
                });
                return false;
            }
        });
    };

    var _auth = function(){
        myStorage.set('auth');
        Auth = JSON.parse(myStorage.get());
    }

    var GetCategory = function(){
        $.ajax({
            url: api_url+'/api/mst/category',
            type: 'GET',
            success: function(r){
                if(r.status){
                    $.each(r.data,function(k,v){
                        $('select[name=category_code]').append('<option value="'+v.category_code+'">'+v.category_name+'</option>');
                    });

                    $('select[name=category_code]').selectpicker();
                }
            }
        });
    }

    return {
        element: function(){
            return _el;
        },
        init: function(){
            _auth();
            SupplierFormValidation();
            GetCategory();
        }
    };
}();

var KTGridQtyIn = function(){
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
        gridID: '#datagrid-stock-qty-in',
        height: '400',
        page: '10',
        url: api_url+'/api/wh/stock/qty/grid/in',
        column: [{
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
        }],
        fn: function(){
            console.log(KTGridQtyIn.element);
        }
      }

      this.element = grid(this.config);
    },
    reload: function(){
      if(this.element !== null)
        this.element.destroy();
      this.config.main_stock_code = window.main_stock_code;
      this.element = grid(this.config);
    }
  };
}();

var KTGridQtyOut = function(){
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
        gridID: '#datagrid-stock-qty-out',
        height: '400',
        page: '10',
        url: api_url+'/api/wh/stock/qty/grid/out',
        column: [{
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
        }],
        fn: function(){
            console.log(KTGridQtyOut.element);
        }
      }

      this.element = grid(this.config);
    },
    reload: function(){
      if(this.element !== null)
        this.element.destroy();
      this.config.main_stock_code = window.main_stock_code;
      this.element = grid(this.config);
    }
  };
}();

var KTUpload = function(){
  var _link_template = function(){
    _link();

    $('.template-download').unbind('click');
    $('.template-download').click(function(){
      var data = {
        api: api_url,
        target: '#uploadStock',
        page_code: window.Auth.page,
        query: {
          find: null,
          stock_brand: null,
          measure_code: null,
          stock_daily_use: null
        }
      };
      KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/stk/template/stock', data);
    });
  }

  var _link = function(){
    $(KTUpload.config.elStock).prepend('<a href="javascript:;" class="float-right template-download"><i class="fa fa-download"></i>Template</a>');
  }

  return {
    init: function(){
      this.config = {
        elStock: $('[name=FUploadStock]'),
        elQty: $('[name=FUploadQty]'),
        fModal: "#uploadStock"
      };
      _link_template();
    },
    stock: function(){
      var data = new FormData(),
          el = this,
          fl = ($(el.config.elStock).find('[type=file]'))[0].files[0],
          tmp = null,
          target = "#uploadStock";

      tmp = fl.name.split('.');
      if(tmp[(tmp.length-1)] == 'xlsx'){
        data.append('file', fl);
        data.append('api', api_url);
        data.append('nik', window.Auth.nik);
        data.append('page_code', window.Auth.page);

        KTApp.block(target, {
            overlayColor: '#000000',
            type: 'v2',
            state: 'primary',
            message: ''
        });
        $.ajax({
          url: base_url + '/' + window.Auth.page + '/import/stk/stock',
          type: 'POST',
          data: data,
          contentType: false,
          processData: false,
          success: function(r){
            KTForm.notif({
              type: r.status ==1?'success':'warning',
              text: r.message,
              timer: 1500
            });

            $(el.config.elStock)[0].reset();
            KTApp.unblock(target);
            myGrid.element().reload();
          },
          error: function(e){
            if(e.status == 413)
              swal.fire({
                  "title": "",
                  "text": "Ukuran file terlalu besar, harus kurang dari 1.5Mb.",
                  "type": "error",
                  "confirmButtonClass": "btn btn-secondary",
                  "onClose": function(e) {
                      console.log('on close event fired!');
                  }
              });
            KTApp.unblock(target);
            $(el.config.elStock)[0].reset();
          }
        });
      } else {
        KTForm.notif({
          type: 'warning',
          text: 'File tidak didukung! Coba kembali template-nya, kemudian isi kembali',
          timer: 1500
        });
      }
    },
    qty: function(){
      var data = new FormData(),
          el = this,
          fl = ($(el.config.elQty).find('[type=file]'))[0].files[0],
          tmp = null,
          target = "#uploadStock";

      tmp = fl.name.split('.');
      if(tmp[(tmp.length-1)] == 'xlsx'){
        data.append('file', fl);
        data.append('api', api_url);
        data.append('nik', window.Auth.nik);
        data.append('page_code', window.Auth.page);

        KTApp.block(target, {
            overlayColor: '#000000',
            type: 'v2',
            state: 'primary',
            message: ''
        });
        $.ajax({
          url: base_url + '/' + window.Auth.page + '/import/stk/qty',
          type: 'POST',
          data: data,
          contentType: false,
          processData: false,
          success: function(r){
            KTForm.notif({
              type: r.status ==1?'success':'warning',
              text: r.message,
              timer: 1500
            });
            $(el.config.elQty)[0].reset();
            KTApp.unblock(target);
            myGrid.element().reload();
          },
          error: function(e){
            if(e.status == 413)
              swal.fire({
                  "title": "",
                  "text": "Ukuran file terlalu besar, harus kurang dari 1.5Mb.",
                  "type": "error",
                  "confirmButtonClass": "btn btn-secondary",
                  "onClose": function(e) {
                      console.log('on close event fired!');
                  }
              });
            KTApp.unblock(target);
            $(el.config.elQty)[0].reset();
          }
        });
      } else {
        KTForm.notif({
          type: 'warning',
          text: 'File tidak didukung! Coba kembali template-nya, kemudian isi kembali',
          timer: 1500
        });
      }
    }
  };
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
    var Auth = JSON.parse(myStorage.get());
    window.main_stock_code = null;
    // validation form
    KTValidationForm.init();
    KTQtyForm.init();
    KTGridQtyIn.init();
    KTGridQtyOut.init();
    KTFilter.init();

    // begin: grid
    myGrid.set('target', '#datagrid-stock');
    myGrid.set('height', '550');
    myGrid.set('url', api_url+'/api/wh/stock/grid');
    myGrid.set('page', '10');
    myGrid.set('column',
        [{
            field: 'stock_code',
            title: 'Kode Stock'
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
            field: 'stock_color',
            title: 'Warna',
        }, {
            field: 'stock_brand',
            title: 'Merek'
        }, {
            field: 'cabinet_name',
            title: 'Rak'
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

                btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-qty" id="'+row.main_stock_code+'" title="Ubah data">\
                    <i class="la la-balance-scale"></i>\
                </a>\ ');

                btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-history" id="'+row.main_stock_code+'" title="Riwayat">\
                    <i class="la la-book"></i>\
                </a>\ ');

                if(window.role.edit == 1)
                    btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-edit" id="'+row.main_stock_code+'" title="Ubah data">\
                        <i class="la la-edit"></i>\
                    </a>\ ');

                if(window.role.del == 1)
                    btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.main_stock_code+'" title="Hapus">\
                        <i class="la la-trash"></i>\
                    </a>\ ');

                // joining array button to grid
                btn = myGrid.action(btn);
                return btn;
            },
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
                            $('#addStock input[name=stock_code]').val(tmp.stock_code);
                            $('#addStock input[name=stock_name]').val(tmp.stock_name);
                            $('#addStock input[name=stock_size]').val(tmp.stock_size);
                            $('#addStock input[name=stock_brand]').val(tmp.stock_brand);
                            $('#addStock input[name=stock_type]').val(tmp.stock_type);
                            $('#addStock input[name=stock_color]').val(tmp.stock_color);
                            $('#addStock input[name=stock_price]').val(tmp.stock_price);
                            $('#addStock input[name=stock_deliver_price]').val(tmp.stock_deliver_price);
                            $('#addStock select[name=measure_code]').val(tmp.measure_code).trigger('change');
                            $('#addStock input[name=stock_qty]').val(tmp.stock_qty);
                            $('#addStock input[name=stock_min_qty]').val(tmp.stock_min_qty);
                            if(parseInt(tmp.stock_daily_use) == 1)
                                $('input[name=stock_daily_use]').prop('checked',true);
                            $('#addStock .btn-submit').attr('edit',1);
                            $('#addStock select[name=category_code]').parent().parent().addClass('kt-hidden');

                            $('#addStock').modal('show');
                        }
                    },
                    error: function(){
                        console.log('error getting data');
                    }
                });
            });

            $('.btn-history').click(function(){
              window.main_stock_code = $(this).attr('id');
              KTGridQtyIn.reload();
              KTGridQtyOut.reload();
              $('#detailHistory').modal('show');
            });


            $('.btn-qty').click(function(){

                $.ajax({
                    url: api_url+'/api/wh/stock/find/'+$(this).attr('id'),
                    type: 'GET',
                    success: function(res){
                        if(res.status){
                            var tmp = res.data,
                              formModal = '#addQty';
                            $(formModal+' input[name=stock_code]').val(tmp.stock_code);
                            $(formModal+' input[name=stock_name]').val(tmp.stock_name);
                            $(formModal+' input[name=stock_size]').val(tmp.stock_size);
                            $(formModal+' input[name=stock_brand]').val(tmp.stock_brand);
                            $(formModal+' input[name=stock_type]').val(tmp.stock_type);
                            $(formModal+' input[name=stock_color]').val(tmp.stock_color);
                            $(formModal+' input[name=stock_qty]').val(tmp.stock_qty);
                            if(tmp.stock_qty == null){
                              $(formModal+' input[name=stock_qty]').prev().html('Kuantiti');
                            } else {
                              $(formModal+' input[name=stock_qty]').prev().html('Potongan Kuantiti');
                            }
                            $(formModal+' input[name=main_stock_code]').val(tmp.main_stock_code);

                            $(formModal).modal('show');
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
                            data: {'main_stock_code':$(this).attr('id'), nik: window.Auth.nik},
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


    });
    myGrid.init();
    // end: grid


    $("#addStock .btn-submit").click(function(e){
        e.preventDefault();
        $("#addStock form").submit();
    });
    $("#addQty .btn-submit").click(function(e){
        e.preventDefault();
        $("#addQty form").submit();
    });

    // reset form when hide
    $("#addStock").on('hide.bs.modal', function(){
        $('#FStock')[0].reset();
        $('.btn-submit')[0].removeAttribute('edit');
        $('select[name=category_code]').parent().parent().removeClass('kt-hidden');
        $('select[name=category_code],select[name=measure_code]').selectpicker('refresh');
        KTValidationForm.element().resetForm();
        $('#FStock').find('.invalid-feedback').remove();
    });

    // reset form when hide
    $("#addQty").on('hide.bs.modal', function(){
        $('#FQty')[0].reset();
        KTQtyForm.element().resetForm();
        $('#FQty').find('.invalid-feedback').remove();
    });

    // form masking
    $("input[name=stock_price],input[name=stock_deliver_price],input[name=stock_qty],input[name=stock_min_qty]").inputmask('decimal', {
        rightAlignNumerics: false
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
      KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/stk/stock', data);
    });


    // import process
    KTUpload.init();
    $('form[name=FUploadStock] [type=file]').on('change', function(){
      KTUpload.stock();
    });
    $('form[name=FUploadQty] [type=file]').on('change', function(){
      KTUpload.qty();
    });
});
