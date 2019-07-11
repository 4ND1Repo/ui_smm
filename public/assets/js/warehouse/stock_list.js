"use strict";

var KTValidationForm = function(){
    var formId = "#FStock";
    var _el = null,
        Auth;

    var SupplierFormValidation = function () {
        _el = $( formId ).validate({
            // define validation rules
            rules: {
                stock_name: {
                    required: true,
                    maxlength: 50
                },
                stock_size: {
                    required: true,
                    maxlength: 20
                },
                stock_brand: {
                    required: true,
                    maxlength: 20
                },
                stock_type: {
                    required: true,
                    maxlength: 20
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
                var link = api_url+"/api/wh/stock/add";
                var bEdit = $(".btn-submit")[0].hasAttribute('edit');
                if(bEdit)
                    link = api_url+"/api/wh/stock/edit";

                var data = $("#FStock").serializeArray();
                data.push({name:"nik", value:Auth.nik});
                data.push({name:"menu_page", value:Auth.page});
                $.ajax({
                    url: link,
                    type: "POST",
                    data: data,
                    success: function(r){
                        if(r.status){
                            myGrid.element().reload();
                            $(formId)[0].reset();
                            $(formId+" input[type=text]")[0].focus();

                            if(bEdit){
                                $('#addStock').modal('hide');
                                $('.btn-submit')[0].removeAttribute('edit');
                            }

                            swal.fire({
                                title: "", 
                                text: r.message, 
                                type: "success",
                                showConfirmButton: false,
                                timer: 1500
                            }).then((res) => {
                                $(formId+" input[type=text]")[0].focus();
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
                    },
                    error: function(){

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

    return {
        element: function(){
            return _el;
        },
        init: function(){
            _auth();
            SupplierFormValidation();
        }
    };
}();


$(document).ready(function(){
    myStorage.set('auth');
    var Auth = JSON.parse(myStorage.get());
    // validation form
    KTValidationForm.init();

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
            field: 'stock_brand',
            title: 'Merek'
        }, {
            field: 'stock_type',
            title: 'Tipe'
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
            field: 'stock_price',
            title: 'Harga',
            template: function(row){
                return price.format(row.stock_price,2,",",'.');
            }
        }, {
            field: 'stock_deliver_price',
            title: 'Ongkos',
            template: function(row){
                return price.format(row.stock_deliver_price,2,",",'.');
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
            field: 'stock_max_qty',
            title: 'Maksimal Kuantiti',
            template: function(row){
                return price.format(row.stock_max_qty,2,",",'.');
            }
        }, {
            field: 'stock_daily_use',
            title: 'Pakai Harian',
            template: function(row){
                return parseInt(row.stock_daily_use)==1?'Ya':'Tidak';
            }
        }, {
            field: 'action',
            title: 'Aksi',
            sortable: false,
            width: 80,
            overflow: 'visible',
            autoHide: false,
            template: function(row) {
                return '\
                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-edit" id="'+row.main_stock_code+'" title="Ubah data">\
                        <i class="la la-edit"></i>\
                    </a>\
                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.main_stock_code+'" title="Hapus">\
                        <i class="la la-trash"></i>\
                    </a>\
                ';
            },
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
    
        
    });
    myGrid.init();
    // end: grid


    $(".btn-submit").click(function(){
        $("#addStock form").submit();
    });

    // reset form when hide
    $("#addStock").on('hide.bs.modal', function(){
        $('#FStock')[0].reset();
        $('.btn-submit')[0].removeAttribute('edit');
        KTValidationForm.element().resetForm();
    });

    // form masking
    $("input[name=stock_price],input[name=stock_deliver_price],input[name=stock_qty],input[name=stock_min_qty],input[name=stock_max_qty]").inputmask('decimal', {
        rightAlignNumerics: false
    });
});