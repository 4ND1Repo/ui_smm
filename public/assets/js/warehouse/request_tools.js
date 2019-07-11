"use strict";

var KTRequestTools = function(){
    var formId = "#FReqtools",
        formModal = '#addReqtools',
        _el = null;

    var _validation = function(){
        _el = $( formId ).validate({
            // define validation rules
            rules: {
                name_of_request: {
                    required: true,
                    maxlength: 30
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
                if($('.request_tools').html()== ""){
                    swal.fire({
                        title: "", 
                        text: "belum mengisi stok yang dibutuhkan", 
                        type: "warning",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return false;
                }
                var link = api_url+"/api/wh/req/tools/add";
                var bEdit = $(".btn-submit")[0].hasAttribute('edit');
                if(bEdit)
                    link = api_url+"/api/wh/req/tools/edit";

                var data = $(formId).serializeArray();
                data.push({name:"nik", value:Window.Auth.nik});
                data.push({name:"menu_page", value:Window.Auth.page});
                $.ajax({
                    url: link,
                    type: "POST",
                    data: data,
                    success: function(r){
                        if(r.status){
                            $(formId)[0].reset();
                            $(formId+" input[type=text]")[0].focus();

                            if(bEdit){
                                $(formModal).modal('hide');
                                $('.btn-submit')[0].removeAttribute('edit');
                            }

                            $('.request_tools').html('');
                            swal.fire({
                                title: "", 
                                text: r.message, 
                                type: "success",
                                showConfirmButton: false,
                                timer: 1500
                            }).then((res) => {
                                $(formId+" input[type=text]")[0].focus();
                            });
                            KTGridRequestTools.element().reload();
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
    }

    return {
        init: function(){
            _validation();
        },
        element: function(){
            return _el;
        }
    };
}();

var KTGridRequestTools = function(){
    var _el,
        gridId = "#datagrid-req-tools",
        height = '550',
        url = api_url+'/api/wh/req/tools/grid',
        page = '10';

    var _KTDatatable = function(){
        myGrid.set('target', gridId);
        myGrid.set('height', height);
        myGrid.set('url', url);
        myGrid.set('page', page);
        myGrid.set('column', 
            [{
                field: 'req_tools_code',
                title: 'Kode Request'
            }, {
                field: 'name_of_request',
                title: 'Nama Request'
            }, {
                field: 'req_tools_date',
                title: 'Tanggal Request'
            }, {
                field: 'sum_item',
                title: 'jumlah item'
            }, {
                field: 'status_label',
                title: 'Status',
                template: function(row){
                    var status = {
                        1: {'title': 'Pending', 'class': 'kt-badge--brand'},
                        2: {'title': 'Delivered', 'class': ' kt-badge--danger'},
                        "ST04": {'title': 'Canceled', 'class': ' kt-badge--primary'},
                        "ST05": {'title': 'Success', 'class': ' kt-badge--success'},
                        5: {'title': 'Info', 'class': ' kt-badge--info'},
                        "ST03": {'title': 'Danger', 'class': ' kt-badge--danger'},
                        "ST02": {'title': 'Warning', 'class': ' kt-badge--warning'},
                    };
                    return '<span class="kt-badge ' + (typeof status[row.status] !== 'undefined'?status[row.status].class:'') + ' kt-badge--inline kt-badge--pill">' + row.status_label + '</span>';
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
                        <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-detail" id="'+row.req_tools_code+'" title="Detail data">\
                            <i class="la la-search-plus"></i>\
                        </a>\
                        <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.req_tools_code+'" title="Hapus">\
                            <i class="la la-trash"></i>\
                        </a>\
                    ';
                },
            }]
        );
        myGrid.set('data',{menu_page:Window.Auth.page});
        myGrid.set('function', function(){
            $('select[name=status]').on('change', function() {
                myGrid.element().search($(this).val(), 'status');
            });
            $('select[name=status]').selectpicker();

            // function buttin on datatable grid
            $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {
                $('.btn-detail').click(function(){
                    $.ajax({
                        url: api_url+'/api/wh/req/tools/find/'+$(this).attr('id'),
                        type: 'GET',
                        success: function(res){
                            if(res.status){
                                var data = res.data;
                                console.log(tmp);
                                $('input[name=name_of_request]').val(data.request_tools.name_of_request).prop('readonly',true);
                                $('input[name=req_nik]').val(data.request_tools.req_nik).prop('readonly',true);
                                
                                var tmp = '';
                                $.each(data.request_tools_detail, function(k,v){

                                    tmp = '<div class="col-md-3">';
                                    tmp += '<div class="list-item">';
                                    tmp += '<div class="item_header">'+v.stock_code+'</div>';
                                    tmp += '<div class="item_body">';
                                    tmp += '<div>'+v.stock_name+'&nbsp;</div>';
                                    tmp += '<div>'+v.stock_type+'&nbsp;</div>';
                                    tmp += '<div>'+v.stock_size+'&nbsp;</div>';
                                    tmp += '<div><input type="text" class="form-control form-control-sm qtyStock" name="items['+v.stock_code+']" value="'+v.req_tools_qty+'" readonly></div>';
                                    tmp += '</div>';
                                    if(v.finish_by == null && v.fullfillment == 1)
                                        tmp += '<div class="text-center"><button type="button" class="btn btn-success btn-wide btn-sm btn-send" id="'+v.stock_code+'-'+v.req_tools_code+'">Kirim</botton></div>';
                                    else if(v.finish_by == null && v.fullfillment == 0)
                                        tmp += '<div class="text-center"><button type="button" class="btn btn-danger btn-wide btn-sm disable" id="'+v.stock_code+'-'+v.req_tools_code+'" disabled>Belum Terpenuhi</botton></div>'; 
                                    tmp += '</div>';
                                    tmp += '</div>';
                                    tmp += '</div>';

                                    $('.request_tools').append(tmp);
                                });

                                $(".qtyStock").inputmask('decimal', {
                                    rightAlignNumerics: false
                                });

                                $('.modal-footer,.validated.search').addClass('kt-hidden');

                                $('#addReqtools').modal('show');

                                $(".btn-send").unbind('click');
                                // send to stock
                                $('.btn-send').click(function(){
                                    var id = ($(this).attr('id')).split('-'),
                                        el = this;
                                    $.ajax({
                                        url: api_url+"/api/wh/req/tools/send",
                                        type: "POST",
                                        data: {stock_code:id[0],req_tools_code:id[1],nik:Window.Auth.nik},
                                        success: function(r){
                                            $(el).parent().remove();
                                            _el.reload();
                                        },
                                        error: function(){
                                            console.log('error while send process');
                                        }
                                    });
                                });

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
                                url: api_url+'/api/wh/req/tools/delete',
                                type: 'POST',
                                data: {'req_tools_code':$(this).attr('id'),nik:Window.Auth.nik},
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

// function delete item from list
var delete_items_stock = function(id=null){
    if(id != null){
        $('.request_tools').find('#'+id).remove();
    }
}

$(document).ready(function(){
    myStorage.set('auth');
    Window.Auth = JSON.parse(myStorage.get());

    // initiate
    KTRequestTools.init();
    KTGridRequestTools.init();

    $('#addReqtools').find('.btn-submit').click(function(){
        $('#FReqtools').submit();
    });

    // reset form when hide
    $("#addReqtools").on('hide.bs.modal', function(){
        $('.request_tools').html('');
        $('input[name=name_of_request]').val('').prop('readonly',false);
        $('input[name=req_nik]').val('').prop('readonly',false);
        $('.modal-footer,.validated.search').removeClass('kt-hidden');
    });



    // autocomplete
    var map = {};
    var res = [],
    stockAutocomplete = $('input[name=stock_name].autocomplete').typeahead(null, {
        name: 'stock_name',
        source: function(query,psc){
            $.ajax({
                url: api_url+'/api/wh/stock/autocomplete',
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
        tmp += '<div class="col-md-3" id="'+map[selection]+'">';
        tmp += '<div class="list-item">';
        tmp += '<div class="item_header">'+data[0]+'<span class="item" onclick="delete_items_stock(\''+map[selection]+'\')"><i class="flaticon-close"></i></span></div>';
        tmp += '<div class="item_body">';
        tmp += '<div>'+data[1]+'&nbsp;</div>';
        tmp += '<div>'+data[2]+'&nbsp;</div>';
        tmp += '<div>'+data[3]+'&nbsp;</div>';
        tmp += '<div><input type="text" class="form-control form-control-sm qtyStock" name="items['+data[0]+']" value="0"></div>';
        tmp += '</div>';
        tmp += '</div>';
        tmp += '</div>';
        if($('.request_tools').find("div[id='"+map[selection]+"']").length > 0){
            swal.fire({
                title: "", 
                text: "Data sudah ada di daftar", 
                type: "warning",
                showConfirmButton: false,
                timer: 1500
            });
        } else{
            $('.request_tools').append(tmp);
            $(".qtyStock").inputmask('decimal', {
                rightAlignNumerics: false
            });
        }
        stockAutocomplete.typeahead('val','');
    });
});