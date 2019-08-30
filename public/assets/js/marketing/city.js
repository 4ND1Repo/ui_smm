"use strict";

var KTCity = function () {
    var gridGenerate = function () {
        var el = new myGrids(api_url + '/api/mst/city/grid', '#datagrid-city');
        el.set('height', '550');
        el.set('page', '10');
        el.set('find', '#generalSearch');
        el.set('column',
            [{
                field: 'city_code',
                title: 'Kode Kota'
            }, {
                field: 'city_name',
                title: 'Nama Kota'
            }, {
                field: 'action',
                title: 'Aksi',
                sortable: false,
                width: 80,
                overflow: 'visible',
                autoHide: false,
                class: 'text-center',
                template: function (row) {
                    var btn = [];

                    if (window.role.edit == 1)
                        btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-edit" id="' + row.city_code + '" title="Ubah data">\
                        <i class="la la-edit"></i>\
                    </a>\ ');

                    if (window.role.del == 1)
                        btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="' + row.city_code + '" title="Hapus">\
                        <i class="la la-trash"></i>\
                    </a>\ ');

                    // joining array button to grid
                    btn = myGrid.action(btn);
                    return btn;
                },
            }]
        );
        el.set('data', {page_code: window.Auth.page, nik: window.Auth.nik});
        el.set('fn', function () {
            $('.kt-datatable').on('kt-datatable--on-layout-updated', function () {
                $('.btn-edit').click(function () {
                    $.ajax({
                        url: api_url + '/api/mst/city/find/' + $(this).attr('id'),
                        type: 'GET',
                        success: function (res) {
                            if (res.status) {
                                var tmp = res.data;
                                $('#addCity input[name=city_code]').val(tmp.city_code);
                                $('#addCity input[name=city_name]').val(tmp.city_name);
                                $('#addCity .btn-submit').attr('edit', 1);

                                $('#addCity').modal('show');
                            }
                        },
                        error: function () {
                            console.log('error getting data');
                        }
                    });
                });

                $('.btn-delete').click(function () {
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
                                url: api_url + '/api/mst/city/delete',
                                type: 'POST',
                                data: {'city_code': $(this).attr('id'), nik: window.Auth.nik},
                                success: function (r) {
                                    Swal.fire({
                                        title: 'Terhapus!',
                                        text: 'Data telah terhapus.',
                                        type: 'success',
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                    KTCity.grid.get('datatable').reload();
                                    $('#generalSearch')[0].focus();
                                },
                                error: function () {
                                    console.log('error delete');
                                }
                            });
                        }
                    });
                });
            });
        });

        return el;
    }

    var formModal = function() {
        var el = KTForm.init({
            formId: "#FCity",
            link: api_url + '/api/mst/city/add',
            data: {
                nik: window.Auth.nik,
                page_code: window.Auth.page
            },
            formRules: {
                city_code: {required: true},
                city_name: {required: true}
            },
            fn: {
                before: function (el, callback) {
                    var data = {data: {city_code: $('#addCity').find('.btn-submit').attr('id')}};
                    if ($('#addCity .btn-submit')[0].hasAttribute('edit'))
                        Object.assign(data, {link: api_url + '/api/mst/city/edit'});

                    callback(data, el);
                    return true;
                },
                after: function (r) {
                    if (r.status) {
                        KTForm.notif({
                            text: r.message,
                            type: "success",
                            timer: 1500,
                            fn: {
                                after: function (r) {
                                    KTCity.grid.get('datatable').reload();
                                    $('#addCity').modal('hide');
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
        return el;
    }

    return {
        init: function () {
            KTCity.datatable();
            KTCity.modal();
        },
        datatable: function () {
            this.grid = gridGenerate();

            // initiate grid
            this.grid.init();
        },
        modal: function () {
            this.form = formModal();

            $('#addCity .btn-submit').click(function(){
                $('#FCity').submit();
            });

            $('#addCity').on('hide.bs.modal', function(){
                console.log(KTCity.form);
                $(KTCity.form.formId)[0].reset();
                $('#addCity .btn-submit').removeAttr('edit');
            });
        }
    };
}();


jQuery(document).ready(function () {
    // initiate
    KTCity.init();

    // export excel
    $('[data-export=excel]').on('click', function () {
        var data = {
            api: api_url,
            page_code: window.Auth.page,
            query: {
                find: $('#generalSearch').val()
            }
        };
        if ($('.kt-datatable th.kt-datatable__cell--sorted').length > 0) {
            var tmp = {
                'sort': {
                    field: $('.kt-datatable th.kt-datatable__cell--sorted')[0].dataset.field,
                    sort: $('.kt-datatable th.kt-datatable__cell--sorted')[0].dataset.sort
                }
            };
            Object.assign(data, tmp);
        }
        KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/mst/city', data);
    });
});
