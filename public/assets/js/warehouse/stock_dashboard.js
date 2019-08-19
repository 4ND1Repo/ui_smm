var KTQuickCabinet = function(){
    var formId='#FCabinet',
        validatorElement,
        Auth,
        link = api_url+"/api/mst/cabinet/add",
        linkGet = api_url+'/api/mst/cabinet/get',
        targetOption = "select[name=cabinet_code]";

    var __validator = function(){
        validatorElement = $( formId ).validate({
            // define validation rules
            rules: {
                cabinet_name: {
                    required: true,
                    maxlength: 4
                },
                cabinet_description: {
                    maxlength: 255
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
                $.ajax({
                    url: link,
                    type: "POST",
                    data: $("#FCabinet").serialize(),
                    success: function(r){
                        if(r.status){
                            $(formId)[0].reset();
                            $(formId+" input[type=text]")[0].focus();
                        }
                    },
                    error: function(){

                    }
                });

                swal.fire({
                    title: "",
                    text: "Semua terisi, akan diproses segera",
                    type: "success",
                    showConfirmButton: false,
                    timer: 1500
                }).then((res) => {
                    $(formId+" input[type=text]")[0].focus();
                });
                return false;
            }
        });

        myStorage.set('auth');
        Auth = JSON.parse(myStorage.get());
        $( formId ).append('<input type="hidden" name="page_code" value="'+Auth.page+'">');
    }

    var __render_option = function(){
        $(targetOption).selectpicker('destroy');
        $(targetOption).html("");
        $.ajax({
            url: linkGet+'/'+Auth.page,
            type: 'GET',
            success: function(r){
                if(r.status){
                    $.each(r.data,function(k,v){
                        $(targetOption).append('<option value="'+v.cabinet_code+'">'+v.cabinet_name+'</option>');
                    });

                    $(targetOption).selectpicker();
                }
            }
        });
    }

    return {
        init: function(){
            __validator();
        },
        add: function(){
            $(formId).submit();
        },
        validator: function(){
            return validatorElement;
        },
        renderOption: function(){
            __render_option();
        }
    };
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
                    required: true
                },
                stock_size: {
                    required: true
                },
                stock_brand: {
                    required: true
                },
                stock_type: {
                    required: true
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


                var data = $("#FStock").serializeArray();
                data.push({name:"nik", value:Auth.nik});
                data.push({name:"page_code", value:Auth.page});
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

var KTStockDashboard = function(){
    var link = api_url+'/api/mst/cabinet/get',
        Auth,
        data,
        target = '.kt-portlet__body';

    var __gettingData = function(){
        $.ajax({
            url: link+'/'+Auth.page,
            type: 'GET',
            async: false,
            success: function(r){
                if(r.status)
                    data = r.data;
            },
            error: function(e){
                console.log(e);
            }
        });
    }

    var __render = function(){
        __gettingData();

        var div = 4,
            c = Math.ceil((data.length/div)),
            tmp = null,
            row = '';

        if(c > 0)
            for(i=0;i<c;i++){
                tmp = data.splice(0,div);
                row += '<div class="row">';
                for(j=0;j<tmp.length;j++){
                    row += '<div class="col-md-3 locker"><div data-toggle="modal" data-target="#listStockModal" id="'+tmp[j].cabinet_code+'"><span>'+tmp[j].cabinet_description+'</span>';
                    row += '<div>'+tmp[j].cabinet_name+'</div>';
                    row += '</div></div>';
                }
                row += '</div>';
            }
        else
            row = '<div class="row"><div class="col-md-12 text-center">Belum membuat struktur Rak</div></div>';

        $(target).html(row);

        $(".locker").click(function(){
            $('.modal-title.stock_list').html('Rak ' + $(this).children('div').children('div').text());
        });
    }

    var __credential = function(){
        myStorage.set('auth');
        Auth = JSON.parse(myStorage.get());
    }

    var __loading = function(){
        $(target).html('<div class="row"><div class="col-md-12"><div class="kt-spinner kt-spinner--v2 kt-spinner--center kt-spinner--lg kt-spinner--warning"></div></div></div>');
    }

    return {
        init: function(){
            __credential();
            __render();
        },
        render: function(){
            __loading();
            __render();
        }
    };
}();

var KTStockCabinetForm = function(){
    var formId = "#FStockCabinet",
        _el = null,
        Auth;

    var FormValidation = function () {
        _el = $( formId ).validate({
            // define validation rules
            rules: {
                stock_name: {
                    required: true
                },
                stock_code: {
                    required: true
                },
                cabinet_code: {
                    required: true
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
                var link = api_url+"/api/wh/stock/cabinet/add";
                var data = $(formId).serializeArray();

                myStorage.set('auth');
                Auth = JSON.parse(myStorage.get());
                data.push({name:'page_code', value:Auth.page});
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
                                $(formId+" select").selectpicker('refresh');
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

    return {
        element: function(){
            return _el;
        },
        init: function(){
            FormValidation();
        }
    };
}();


var KTModalGrid = function(){
    var Auth,
        _cabinet,
        element = null;

    var modalGrid = function(){
        // begin: grid
        myGrid.set('target', '#datagrid-stock-cabinet');
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
        myGrid.set('data', {page_code:Auth.page, cabinet_code:_cabinet});

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
            $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {

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
        element = myGrid.element();
    }

    var _auth = function(){
        myStorage.set('auth');
        Auth = JSON.parse(myStorage.get());
    }

    var cabinet = function(){
        _cabinet = typeof window.cabinet_code !== 'undefined'?window.cabinet_code:'';
        console.log(_cabinet);
    }

    return {
        init: function(){
            _auth();
            cabinet();
            modalGrid();
        },
        reload: function(){
            element.destroy();
            cabinet();
            modalGrid();
        },
        element: function(){
            return element;
        }
    }
}();


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
                      return api_url+'/api/mst/cabinet/tree';
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
            if (link.attr("href") != "#" && link.attr("href") != "javascript:;" && link.attr("href") != "") {
                _generateToLayout(link.attr("href"));
                // if(typeof KTModalGrid  !== "undefined")
                //     KTModalGrid.reload();
                return false;
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
                }
                console.log(r);
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




$(document).ready(function(){
    myStorage.set('auth');
    Auth = JSON.parse(myStorage.get());
    // initiate Cabinet
    KTQuickCabinet.init();
    KTQuickCabinet.renderOption();
    // KTStockDashboard.init();
    KTStockForm.init();
    KTStockCabinetForm.init();
    KTTreeCabinet.init();


	$('#listStockModal').on('shown.bs.modal', function() {
        if(KTModalGrid.element() == null)
            KTModalGrid.init();
        else
            KTModalGrid.reload();
    });

    $('.locker > div').click(function(){
        window.cabinet_code = $(this).attr('id');
    });

    $('.btn-submit-cabinet').click(function(){
        KTQuickCabinet.add();
        KTQuickCabinet.renderOption();
        KTStockDashboard.render();
    });

    $('#addStockModal').find('.btn-submit').on('click',function(){
        $('#FStock').submit();
    });

    $('#addStockCabinetModal').find('.btn-submit').on('click',function(){
        $('#FStockCabinet').submit();
    });

    // autocomplete
    var map = {};
    var res = [];
    $('input[name=stock_name].autocomplete').typeahead(null, {
        name: 'stock_name',
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
        $('input[type=hidden][name=main_stock_code]').val(map[selection]);
    });

    $(".btn-delete-cabinet").click(function(){
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
                    data: {cabinet_code: window.cabinet_code, page_code: Auth.page},
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

                        $('#listStockModal').modal('hide');
                        KTQuickCabinet.renderOption();
                        KTStockDashboard.render();
                    },
                    error: function(){
                        console.log('error delete');
                    }
                });
            }
        });
    });
});
