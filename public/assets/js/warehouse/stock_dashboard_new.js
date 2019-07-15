"use strict";

var KTTreeCabinet = function(){
    var LayoutCabinet = '#cabinet-list';

    var _render = function(){
        $(LayoutCabinet).jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                }, 
                // so that create works
                "check_callback" : true,
                'data' : {
                    'url' : function (node) {
                      return api_url+'/api/mst/cabinet/tree?p='+window.Auth.page;
                    },
                    'data' : function (node) {
                      return { 'parent' : node.id };
                    }
                }
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder kt-font-brand"
                },
                "file" : {
                    "icon" : "fa fa-file  kt-font-brand"
                }
            },
            "state" : { "key" : "jstree" },
            "plugins" : [ "dnd", "state", "types" ]
        });

        
        $(LayoutCabinet).on('load_node.jstree', function(e,data) { 
            console.log('Load tree');
            console.log(data);
        });

        $(LayoutCabinet).on('refresh.jstree', function(e,data) { 
            console.log('refresh tree');
        });

        // handle link clicks in tree nodes(support target="_blank" as well)
        $(LayoutCabinet).on('select_node.jstree', function(e,data) { 
            var link = $('#' + data.selected).find('a');
            if (link.attr("href") != "#" && link.attr("href") != "javascript:;" && link.attr("href") != "" && !$(link).data('toggle')) {
                _generateToLayout(link.attr("href"));
                return false;
            } else {
                window.cabinet_code = $(link).attr('href');
                $($(link).data('target')).modal('show');
            }
        });
    }

    var _generateToLayout= function(code){
        $.ajax({
            url: api_url+'/api/mst/cabinet/tree_child?parent='+code+'&cnt=6',
            type: 'GET',
            success: function(r){
                if(typeof r == 'object'){
                    var tmp = '';
                    $.each(r, function(k,v){
                        tmp += '<div class="col-sm-3" style="margin-bottom:10px;">';
                        $.each(v, function(k1,v1){
                            tmp += '<div class="layout3DCabinet">';
                            if( v1.cabinet_description !== null)
                                tmp += '<div class="bg3Dlocker hvr-grow-shadow" data-container="body" data-container="body" data-toggle="kt-tooltip-locker" data-placement="top" title="'+v1.cabinet_description+'" data-id="'+v1.cabinet_code+'">';
                            else
                                tmp += '<div class="bg3Dlocker hvr-grow-shadow">';
                            tmp += '<div class="content3Dlocker">';
                            tmp += v1.cabinet_name;
                            tmp += '</div>';
                            tmp += '</div>';
                            tmp += '</div>';
                        });
                        tmp += '</div>';
                    });
                    $('.layout3D .row').html(tmp);
                    $('[data-toggle="kt-tooltip-locker"]').tooltip();

                    $('.bg3Dlocker').on('click', function(){
                        var el = this;
                        window.cabinet_code = $(el).data('id');
                        $('.modal-title.stock_list').html('Rak ' + $(this).children('div').text());
                        $('#listStockModal').modal('show');
                    });
                }
            }
        });
    }

    var _refresh = function (){
        // refresh list of tree
        $(LayoutCabinet).jstree(true).refresh();
    }

    return {
        init: function(){
            _render();
        },
        refresh: function(){
            _refresh();
        }
    }
}();

var KTCabinetForm = function(){
    var element,
        formId = "#FCabinet",
        link = api_url+"/api/mst/cabinet/add",
        link_get = api_url+"/api/mst/cabinet/get",
        optionTarget = "select[name=parent_cabinet_code]";

    var validation = function(){
        element = $( formId ).validate({
            // define validation rules
            rules: {
                cabinet_name: {
                    required: true,
                    maxlength: 20
                },
                cabinet_description: {
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
                    }
                });

                event.preventDefault();
            },

            submitHandler: function (form) {
                var data = $(formId).serializeArray();
                
                data.push({name:'menu_page', value:window.Auth.page});
                $.ajax({
                    url: link,
                    type: "POST",
                    data: data,
                    success: function(r){
                        if(r.status){
                            $(formId)[0].reset();
                            // $('#addStockCabinetModal').modal('hide');

                            swal.fire({
                                title: "", 
                                text: r.message, 
                                type: "success",
                                showConfirmButton: false,
                                timer: 1500
                            }).then((res) => {
                                $(formId+" input[type=text]")[0].focus();
                                $(optionTarget).selectpicker('refresh');
                                KTTreeCabinet.refresh();
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
    }

    var option = function(){
        $.ajax({
            url: link_get+'/'+window.Auth.page,
            type: 'GET',
            success: function(r){
                if(r.status){
                    if(r.data.length > 0){
                        $(optionTarget).html('<option value="">Paling awal</option>');
                        $.each(r.data, function(k,v){
                            $(optionTarget).append('<option value="'+v.cabinet_code+'">'+v.cabinet_name+'</option>');
                        });
                    }
                    $(optionTarget).selectpicker();
                }
            }
        });
    }
    return {
        init: function(){
            validation();
            option();
        }
    }
}();

var KTModalGrid = function(){
    var Auth,
        _cabinet,
        _el,
        _elGrid = '#datagrid-stock-cabinet';

    var modalGrid = function(){
        // begin: grid
        myGrid.set('target', _elGrid);
        myGrid.set('height', '300');
        myGrid.set('url', api_url+'/api/wh/stock/cabinet/grid');
        myGrid.set('page', '10');
        myGrid.set('column', 
            [{
                field: 'cabinet_name',
                title: 'Rak'
            }, {
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
                field: 'action',
                title: 'Aksi',
                sortable: false,
                width: 80,
                overflow: 'visible',
                autoHide: false,
                template: function(row) {
                    return '\
                        <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.stock_cabinet_code+'" title="Hapus">\
                            <i class="la la-trash"></i>\
                        </a>\
                    ';
                },
            }]
        );
        // sent to ajax data
        myGrid.set('data', {menu_page:Auth.page, cabinet_code:_cabinet});

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

            // function buttin on datatable grid
            $(_elGrid).on('kt-datatable--on-layout-updated', function() {
                
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
                                url: api_url+'/api/wh/stock/cabinet/delete',
                                type: 'POST',
                                data: {stock_cabinet_code:$(this).attr('id')},
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
        _el = myGrid.element();
    }

    var _auth = function(){
        myStorage.set('auth');
        Auth = JSON.parse(myStorage.get());
    }

    var cabinet = function(){
        _cabinet = typeof window.cabinet_code !== 'undefined'?window.cabinet_code:'';
    }

    var getEl = function(){
        return _el;
    }

    return {
        init: function(){
            _auth();
            cabinet();
            modalGrid();
        },
        reload: function(){
            KTModalGrid.getElement().destroy();
            cabinet();
            modalGrid();
        },
        getElement: function(){
            return getEl();
        }
    }
}();


var KTStockForm = function(){
    var formId = "#FStock";
    var _el = null,
        Auth;

    var FormValidation = function () {
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


                var data = $(formId).serializeArray();
                data.push({name:"nik", value:Auth.nik});
                data.push({name:"menu_page", value:Auth.page});
                $.ajax({
                    url: link,
                    type: "POST",
                    data: data,
                    success: function(r){
                        if(r.status){
                            $(formId)[0].reset();
                            $(formId+" input[type=text]")[0].focus();
                            $('#addStockModal').modal('hide');

                            swal.fire({
                                title: "", 
                                text: "Semua terisi, akan diproses segera", 
                                type: "success",
                                showConfirmButton: false,
                                timer: 1500
                            }).then((res) => {
                                $(formId+" input[type=text]")[0].focus();
                            });
                        } else
                            swal.fire({
                                title: "", 
                                text: r.message, 
                                type: "warning",
                                showConfirmButton: false,
                                timer: 1500
                            }).then((res) => {
                                $(formId+" input[type=text]")[0].focus();
                            });
                    },
                    error: function(){

                    }
                });
                return false;
            }
        });
    };

    var GetMeasure = function(){
        $.ajax({
            url: api_url+'/api/mst/measure',
            type: 'GET',
            success: function(r){
                if(r.status){
                    $.each(r.data,function(k,v){
                        $('select[name=measure_code]').append('<option value="'+v.measure_code+'">'+v.measure_type+'</option>');
                    });

                    $('select[name=measure_code]').selectpicker();
                }
            }
        });
    }

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
            GetMeasure();
        }
    };
}();




$(document).ready(function(){
    myStorage.set('auth');
    window.Auth = JSON.parse(myStorage.get());

    // initiate Cabinet
    KTTreeCabinet.init();
    KTCabinetForm.init();
    KTStockForm.init();

    // function submit form stock shortcut
    $('#addStockModal').find('.btn-submit').on('click',function(){
        $('#FStock').submit();
    });

    $('#listStockModal').on('shown.bs.modal', function() {
        if(KTModalGrid.getElement() == null)
            KTModalGrid.init();
        else
            KTModalGrid.reload();
    });

    // button delete when popup running
    $('.btn-delete-cabinet').on('click', function(){
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
                    url: api_url+'/api/mst/cabinet/delete',
                    type: 'POST',
                    data: {cabinet_code: window.cabinet_code, menu_page: window.Auth.page},
                    success: function(r){
                        Swal.fire({
                            title: 'Terhapus!',
                            text: 'Data telah terhapus.',
                            type: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        });

                        $('#listStockModal').modal('hide');
                        $('select[name=parent_cabinet_code]').selectpicker('refresh');
                        $('.layout3D .row').html('');
                        KTTreeCabinet.refresh();
                    },
                    error: function(){
                        console.log('error delete');
                    }
                });
            }
        });
    });

    // autocomplete
    var map = {};
    var res = [];
    var stockAutocomplete = $('input[name=stock_name].autocomplete').typeahead(null, {
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
        var link = api_url+"/api/wh/stock/cabinet/add",
            stock_code = map[selection],
            data = [];

        data.push({name:'menu_page', value:window.Auth.page});
        data.push({name:'main_stock_code', value:stock_code});
        data.push({name:'cabinet_code', value:window.cabinet_code});
        
        $.ajax({
            url: link,
            type: "POST",
            data: data,
            success: function(r){
                $('input[name=stock_name].autocomplete').val('');
                if(r.status){
                    swal.fire({
                        title: "", 
                        text: r.message, 
                        type: "success",
                        showConfirmButton: false,
                        timer: 1500
                    }).then((res) => {
                        KTModalGrid.reload();
                        stockAutocomplete.typeahead('val','');
                    });
                } else {
                    swal.fire({
                        title: "", 
                        text: r.message, 
                        type: "warning",
                        showConfirmButton: false,
                        timer: 1500
                    }).then((res) => {
                        stockAutocomplete.typeahead('val','');
                    });
                }
            },
            error: function(){

            }
        });
    });

    // form masking
    $("input[name=stock_min_qty],input[name=stock_max_qty]").inputmask('decimal', {
        rightAlignNumerics: false
    });
});