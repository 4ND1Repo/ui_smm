"use strict";

var KTValidationForm = function(){
    var formId = "#FMeasure";
    var _el = null,
        Auth;

    var FormValidation = function () {
        _el = $( formId ).validate({
            // define validation rules
            rules: {
                measure_type: {
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
                var link = api_url+"/api/mst/measure/add";
                var bEdit = $(".btn-submit")[0].hasAttribute('edit');
                if(bEdit)
                    link = api_url+"/api/mst/measure/edit";

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
                                $('#addMeasure').modal('hide');
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
            FormValidation();
        }
    };
}();


$(document).ready(function(){
    // validation form
    KTValidationForm.init();

    // begin: grid
    myGrid.set('target', '#datagrid-measure');
    myGrid.set('height', '550');
    myGrid.set('url', api_url+'/api/mst/measure/grid');
    myGrid.set('page', '10');
    myGrid.set('column', 
        [{
            field: 'measure_code',
            title: 'Kode Satuan',
            width: 80
        }, {
            field: 'measure_type',
            title: 'Nama Satuan'
        }, {
            field: 'action',
            title: 'Aksi',
            sortable: false,
            width: 80,
            overflow: 'visible',
            autoHide: false,
            template: function(row) {
                return '\
                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-edit" id="'+row.measure_code+'" title="Ubah data">\
                        <i class="la la-edit"></i>\
                    </a>\
                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.measure_code+'" title="Hapus">\
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
                    url: api_url+'/api/mst/measure/find/'+$(this).attr('id'),
                    type: 'GET',
                    success: function(res){
                        if(res.status){
                            var tmp = res.data;
                            $('input[name=measure_code]').val(tmp.measure_code);
                            $('input[name=measure_type]').val(tmp.measure_type);
                            $('.btn-submit').attr('edit',1);

                            $('#addMeasure').modal('show');
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
                            url: api_url+'/api/mst/measure/delete',
                            type: 'POST',
                            data: {'measure_code':$(this).attr('id')},
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
        $("#addMeasure form").submit();
    });

    // reset form when hide
    $("#addMeasure").on('hide.bs.modal', function(){
        $('#FMeasure')[0].reset();
        $('.btn-submit')[0].removeAttribute('edit');
        KTValidationForm.element().resetForm();
    });
});