"use strict";

var KTValidationForm = function(){
    var formId = "#FCategory",
        _el = null,
        link_add = api_url+"/api/mst/category/add",
        link_edit = api_url+"/api/mst/category/edit",
        targetModal = '#addCategory';

    var FormValidation = function () {
        _el = $( formId ).validate({
            // define validation rules
            rules: {
                category_code: {
                    required: true,
                    maxlength: 4
                },
                category_name: {
                    required: true,
                    maxlength: 50
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
                        $(formId+" input[type=text]")[0].focus();
                    }
                });

                event.preventDefault();
            },

            submitHandler: function (form) {
                var link = link_add;
                var bEdit = $(".btn-submit")[0].hasAttribute('edit');
                if(bEdit)
                    link = link_edit;

                var data = $(formId).serializeArray();
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
                                $(targetModal).modal('hide');
                                console.log(targetModal);
                                $(targetModal).find('.btn-submit')[0].removeAttribute('edit');
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

    return {
        element: function(){
            return _el;
        },
        init: function(){
            FormValidation();
        }
    };
}();


$(document).ready(function(){
    myStorage.set('auth');
    window.Auth = JSON.parse(myStorage.get());

    // validation form
    KTValidationForm.init();

    // begin: grid
    myGrid.set('target', '#datagrid-category');
    myGrid.set('height', '550');
    myGrid.set('url', api_url+'/api/mst/category/grid');
    myGrid.set('page', '10');
    myGrid.set('column',
        [{
            field: 'category_code',
            title: 'Kode Kategori',
            width: 80
        }, {
            field: 'category_name',
            title: 'Kategori'
        }, {
            field: 'action',
            title: 'Aksi',
            sortable: false,
            width: 80,
            overflow: 'visible',
            autoHide: false,
            template: function(row) {
                return '\
                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-edit" id="'+row.category_code+'" title="Ubah data">\
                        <i class="la la-edit"></i>\
                    </a>\
                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.category_code+'" title="Hapus">\
                        <i class="la la-trash"></i>\
                    </a>\
                ';
            },
        }]
    );
    myGrid.set('function', function(){

        // function buttin on datatable grid
        $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {
            $('.btn-edit').click(function(){
                $.ajax({
                    url: api_url+'/api/mst/category/find/'+$(this).attr('id'),
                    type: 'GET',
                    success: function(res){
                        if(res.status){
                            var tmp = res.data;
                            $('input[name=category_code]').val(tmp.category_code);
                            $('input[name=category_name]').val(tmp.category_name);
                            $('.btn-submit').attr('edit',1);

                            $('#addCategory').modal('show');
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
                            url: api_url+'/api/mst/category/delete',
                            type: 'POST',
                            data: {'category_code':$(this).attr('id')},
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
        $("#addCategory form").submit();
    });

    // reset form when hide
    $("#addCategory").on('hide.bs.modal', function(){
        $('#FCategory')[0].reset();
        $('.btn-submit')[0].removeAttribute('edit');
        $('#FCategory').find('.invalid-feedback').remove();
        KTValidationForm.element().resetForm();
    });
});
