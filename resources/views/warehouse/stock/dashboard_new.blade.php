<!-- begin:: Content Head -->
<div class="kt-subheader   kt-grid__item" id="kt_subheader">
    <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Stock Dashboard</h3>
    </div>

    <div class="kt-subheader__toolbar">
        <div class="kt-subheader__wrapper">
            <div class="dropdown dropdown-inline" data-toggle="kt-tooltip" title="Aksi Cepat" data-placement="left">
                <a href="#" class="btn btn-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon kt-svg-icon--success kt-svg-icon--md">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                            <path d="M5.85714286,2 L13.7364114,2 C14.0910962,2 14.4343066,2.12568431 14.7051108,2.35473959 L19.4686994,6.3839416 C19.8056532,6.66894833 20,7.08787823 20,7.52920201 L20,20.0833333 C20,21.8738751 19.9795521,22 18.1428571,22 L5.85714286,22 C4.02044787,22 4,21.8738751 4,20.0833333 L4,3.91666667 C4,2.12612489 4.02044787,2 5.85714286,2 Z" id="Combined-Shape" fill="#000000" fill-rule="nonzero" opacity="0.3" />
                            <path d="M11,14 L9,14 C8.44771525,14 8,13.5522847 8,13 C8,12.4477153 8.44771525,12 9,12 L11,12 L11,10 C11,9.44771525 11.4477153,9 12,9 C12.5522847,9 13,9.44771525 13,10 L13,12 L15,12 C15.5522847,12 16,12.4477153 16,13 C16,13.5522847 15.5522847,14 15,14 L13,14 L13,16 C13,16.5522847 12.5522847,17 12,17 C11.4477153,17 11,16.5522847 11,16 L11,14 Z" id="Combined-Shape" fill="#000000" />
                        </g>
                    </svg>

                    <!--<i class="flaticon2-plus"></i>-->
                </a>
                <div class="dropdown-menu dropdown-menu-fit dropdown-menu-md dropdown-menu-right">
                    <!--begin::Nav-->
                    <ul class="kt-nav">
                        <li class="kt-nav__head">
                            Akses cepat:
                            <i class="flaticon2-information" data-toggle="kt-tooltip" data-placement="right" title="Click to learn more..."></i>
                        </li>
                        <li class="kt-nav__separator"></li>
                        <li class="kt-nav__item">
                            <a href="javascript:;" class="kt-nav__link" data-toggle="modal" data-target="#addStockModal">
                                <i class="kt-nav__link-icon fa fa-boxes"></i>
                                <span class="kt-nav__link-text">Stok</span>
                            </a>
                        </li>
                    </ul>

                    <!--end::Nav-->
                </div>
            </div>
        </div>
    </div>
</div>
<!-- end:: Content Head -->

<style>
    .locker > div {
        margin-top: 16px;
        height: 75px;
        box-shadow:0 0 8px #aaa;
        border-radius: 6px;
        overflow: hidden;
        text-align: center;
        font-size: 48px;
        position: relative;
        cursor: pointer;
    }
    .locker > div span{
        background: #9FAFFC;
        transition: transform 2s ease;
        transform: translateY(0);
        width: 100%;
        height: 50%;
        left: 0;
        position: absolute;
        top: 75px;
        font-size: 14px;
        color: white;
        padding-top: 8px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .locker:hover > div span {
        transition: transform 0.5s ease;
        transform: translateY(-100%);
        cursor: pointer;
    }
    .layout3DCabinet {
        margin: 0;
        background: #707784;
        min-height: 50px;
        padding: 5px;
        position: relative;
        color: white;
    }
    .layout3DCabinet .bg3Dlocker {
        border: 1px solid #405562;
        min-height: 40px;
        width: calc( 100% - 2px );
        background: #606673;
        position: relative;
    }
    .layout3DCabinet .bg3Dlocker:before {
        display: inline-block;
        content: '';
        -webkit-border-radius: 0.375rem;
        border-radius: 0.375rem;
        height: 0.75rem;
        width: 0.75rem;
        margin: 8px 0 0 calc( 50% - 0.325rem );
        background-color: #bdbdbd;
    }
    .layout3DCabinet .bg3Dlocker:hover {
        background: #707784;
    }
    .layout3DCabinet .bg3Dlocker .content3Dlocker {
        position: absolute;
        width: 100%;
        top: 16px;
        text-align: center;
    }
    .typeahead .tt-dataset {
      max-height: 200px;
      overflow-y: auto;
    }

</style>
<!-- begin:: Content -->
<div class="kt-content kt-grid__item kt-grid__item--fluid" id="kt_content">
    <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__body">
            <div class="row">
                <div class="col-md-3">
                    <div class="row">
                        <div class="col-sm-12">
                            <form action="javascript:;" id="FCabinet" method="post">
                                <div class="form-group form-group-sm">
                                    <input type="text" class="form-control form-control-sm" placeholder="Nama lantai/rak" name="cabinet_name">
                                </div>
                                <div class="form-group form-group-sm">
                                    <select name="parent_cabinet_code" class="form-control form-control-sm" placeholder="akan disimpan di" data-live-search="true">
                                        <option value="">Paling Awal</option>
                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <textarea name="cabinet_description" class="form-control form-control-sm" placeholder="Tentang rak"></textarea>
                                </div>
                                <div class="form-group form-group-sm text-right">
                                    <input type="submit" class="btn btn-success btn-sm" value="Tambah">
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12">
                            <div id="cabinet-list" class="tree-demo"></div>
                            <div class="alert alert-outline-primary">
                                ini akan di ambil dari server.
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-9 layout3D">
                    <div class="row"></div>
                </div>
            </div>
        </div>
    </div>
</div>



<!-- modal for listing stock -->
<div class="modal fade" id="listStockModal" role="dialog" aria-labelledby="longModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title stock_list" id="longModal">Rak</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body">
                <!--begin: Search Form -->
                <div class="kt-form kt-form--label-right">
                    <div class="row align-items-center">
                        <div class="col-xl-12 order-2 order-xl-1">
                            <div class="row align-items-center">
                                <div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
                                    <div class="form-group">
                                        <label class="form-label">Tambah ke rak</label>
                                        <div class="typeahead">
                                            <input type="text" class="form-control autocomplete" autocomplete="off" dir="ltr" name='stock_name'>
                                        </div>
                                        <input type="hidden" name='main_stock_code' class="stock_code" value="">
                                    </div>
                                </div>
                                <div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
                                    &nbsp;
                                </div>
                                <div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
                                    <div class="kt-input-icon kt-input-icon--left">
                                        <input type="text" class="form-control" placeholder="Search..." id="generalSearch" name="find">
                                        <span class="kt-input-icon__icon kt-input-icon__icon--left">
                                            <span><i class="la la-search"></i></span>
                                        </span>
                                    </div>
                                </div>
                                <div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
                                    <div class="kt-form__group kt-form__group--inline">
                                        <div class="kt-form__label">
                                            <label>Merek:</label>
                                        </div>
                                        <div class="kt-form__control">
                                            <select class="form-control bootstrap-select" name='stock_brand' data-live-search="true">
                                                <option value="">All</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--end: Search Form -->
            </div>
			<div class="modal-body modal-body-fit">
                <!--begin: Datatable -->
                <div id="datagrid-stock-cabinet"></div>
                <!--end: Datatable -->
			</div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger btn-delete-cabinet">Hapus Rak</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Keluar</button>
            </div>
        </div>
    </div>
</div>

<!-- modal for add stock -->
<div class="modal fade" id="addStockModal" tabindex="-1" role="dialog" aria-labelledby="longModal" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="longModal">Stock</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body">
                <form class="kt-form" id="FStock">
                    <div class="row validated">
                        <div class="col-md-6">
                            <div class="form-group kt-hidden">
                                <label>Kode Stok</label>
                                <input type="text" name="stock_code" class="form-control" placeholder="Generate otomatis" readonly>
                            </div>
                            <div class="form-group">
                                <label>Kategori</label>
                                <select tabindex="1" class="form-control" name="category_code"></select>
                            </div>
                            <div class="form-group">
                                <label>Nama Stok</label>
                                <input type="text" tabindex="2" name="stock_name" class="form-control" placeholder="Isian nama stok">
                            </div>
                            <div class="form-group">
                                <label>Ukuran</label>
                                <input type="text" tabindex="3" name="stock_size" class="form-control" placeholder="Isian ukuran">
                            </div>
                            <div class="form-group">
                                <label>Merek</label>
                                <input type="text" tabindex="4" name="stock_brand" class="form-control" placeholder="Isian merek">
                            </div>
                            <div class="form-group">
                                <label>Tipe</label>
                                <input type="text" tabindex="5" name="stock_type" class="form-control" placeholder="Isian tipe">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Warna</label>
                                <input type="text" tabindex="6" name="stock_color" class="form-control" placeholder="Isian warna">
                            </div>
                            <div class="form-group">
                                <label>Tipe Satuan</label>
                                <select tabindex="7" class="form-control" name="measure_code"></select>
                            </div>
                            <div class="form-group">
                                <label>Minimal Kuantiti</label>
                                <input type="text" tabindex="8" name="stock_min_qty" class="form-control" placeholder="Isian jumlah minimal stok">
                            </div>
                            <div class="form-group">
                                <label>Maksimal Kuantiti</label>
                                <input type="text" tabindex="9" name="stock_max_qty" class="form-control" placeholder="Isian jumlah maksimal stok">
                            </div>
                            <div class="form-group">
                                <div class="kt-checkbox-list">
                                    <label class="kt-checkbox">
                                        <input type="checkbox" tabindex="10" value="1" name="stock_daily_use"> Pinjaman
                                        <span></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" tabindex="12" class="btn btn-secondary" data-dismiss="modal">Keluar</button>
                <button type="button" tabindex="11" class="btn btn-primary btn-submit">Simpan</button>
            </div>
        </div>
    </div>
</div>

<!--end::Modal-->
