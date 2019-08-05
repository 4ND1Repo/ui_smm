"use strict";

var KTValidationForm = function(){
    var formId = "#FSupplier",
        formModal = "#insertSupplier";
    var _el = null;

    var SupplierFormValidation = function () {
        _el = $( formId ).validate({
            // define validation rules
            rules: {
                supplier_name: {
                    required: true
                },
                supplier_phone: {
                    required: true,
                    digits: true
                },
                supplier_address: {
                    required: true
                },
                city_code: {
                    required: true
                },
                supplier_category: {
                    required: true,
                    minlength: 3,
                    maxlength: 10
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
                var link = api_url+"/api/mst/supplier/add";
                var bEdit = $(".btn-submit")[0].hasAttribute('edit');
                if(bEdit)
                    link = api_url+"/api/mst/supplier/edit";

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
                    data: $("#FSupplier").serialize(),
                    success: function(r){
                        if(r.status){
                            myGrid.element().reload();
                            $(formId)[0].reset();
                            $(formId+" input[type=text]")[0].focus();

                            if(bEdit){
                                $('#insertSupplier').modal('hide');
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
    };

    return {
        element: function(){
            return _el;
        },
        init: function(){
            SupplierFormValidation();
        }
    };
}();

jQuery(document).ready(function () {
    // form validation
    KTValidationForm.init();

    // begin: grid
    myGrid.set('height', '550');
    myGrid.set('url', api_url+'/api/mst/supplier/grid');
    myGrid.set('page', '10');
    myGrid.set('column',
        [{
            field: 'supplier_code',
            title: 'Kode Supplier',
        }, {
            field: 'supplier_name',
            title: 'Nama Supplier',
        }, {
            field: 'supplier_phone',
            title: 'Telepon',
        }, {
            field: 'supplier_address',
            title: 'Alamat',
        }, {
            field: 'city_name',
            title: 'Kota',
            template: function(row) {
                return row.city_code + ' ' + row.city_name;
            },
        }, {
            field: 'supplier_category',
            title: 'Kategori',
        }, {
            field: 'status_label',
            title: 'Status',
            sortable: false,
            template: function(row) {
                var status = {
                    1: {'title': 'Pending', 'class': 'kt-badge--brand'},
                    2: {'title': 'Delivered', 'class': ' kt-badge--danger'},
                    3: {'title': 'Canceled', 'class': ' kt-badge--primary'},
                    'ST01': {'title': 'Success', 'class': ' kt-badge--success'},
                    5: {'title': 'Info', 'class': ' kt-badge--info'},
                    'ST00': {'title': 'Danger', 'class': ' kt-badge--danger'},
                    7: {'title': 'Warning', 'class': ' kt-badge--warning'},
                };
                return '<span class="kt-badge ' + status[row.status_code].class + ' kt-badge--inline kt-badge--pill">' + row.status_label + '</span>';
            },
        }, {
            field: 'action',
            title: 'Aksi',
            sortable: false,
            width: 80,
            overflow: 'visible',
            autoHide: false,
            template: function(row) {
                var btn = "",
                    role = window.role;
                if(role.edit == 1)
                  btn += '<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-edit" id="'+row.supplier_code+'" title="Ubah data">\
                      <i class="la la-edit"></i>\
                  </a>';
                if(role.del == 1)
                  btn += '<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.supplier_code+'" title="Hapus">\
                      <i class="la la-trash"></i>\
                  </a>';
                return btn;
            },
        }]
    );
    myGrid.set('function', function(){
        $('#kt_form_status').on('change', function() {
            myGrid.element().search($(this).val(), 'status_code');
        });

        $.ajax({
            url: api_url+'/api/mst/status',
            type: 'GET',
            success: function(r){
                if(r.status){
                    $.each(r.data,function(k,v){
                        $('#kt_form_status').append('<option value="'+v.status_code+'">'+v.status_label+'</option>');
                    });
                    $('#kt_form_status').selectpicker();
                }
            }

        });

        // function buttin on datatable grid
        $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {
            $('.btn-edit').click(function(){
                $.ajax({
                    url: api_url+'/api/mst/supplier/find/'+$(this).attr('id'),
                    type: 'GET',
                    success: function(res){
                        if(res.status){
                            var tmp = res.data;
                            $('input[name=supplier_code]').val(tmp.supplier_code);
                            $('input[name=supplier_name]').val(tmp.supplier_name);
                            $('input[name=supplier_address]').val(tmp.supplier_address);
                            $('input[name=supplier_phone]').val(tmp.supplier_phone);
                            $('select[name=city_code]').val(tmp.city_code).trigger('change');
                            $('input[name=supplier_category]').val(tmp.supplier_category);
                            $('.btn-submit').attr('edit',1);

                            $('#insertSupplier').modal('show');
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
                            url: api_url+'/api/mst/supplier/delete',
                            type: 'POST',
                            data: {'supplier_code':$(this).attr('id')},
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

    // get all data city to append new form
    $.ajax({
        url: api_url+'/api/mst/city',
        type: 'GET',
        success: function(r){
            if(r.status){
                $.each(r.data,function(k,v){
                    $('select[name=city_code]').append('<option value="'+v.city_code+'">'+v.city_name+'</option>');
                });
                $('select[name=city_code]').selectpicker();
            }
        }
    });

    $("#insertSupplier form").submit(function(){
        console.log(this);
        return false;
    });

    $(".btn-submit").click(function(){
        $("#insertSupplier form").submit();
    });

    // reset form when hide
    $("#insertSupplier").on('hide.bs.modal', function(){
        $('#FSupplier')[0].reset();
        $('.btn-submit')[0].removeAttribute('edit');
        KTValidationForm.element().resetForm();
        $('#FSupplier').find('.invalid-feedback').remove();
    });

    if(window.role.add != 1)
      $(".btn-add").addClass('kt-hidden');
});
