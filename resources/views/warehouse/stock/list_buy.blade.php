<!-- begin:: Content Head -->
<div class="kt-subheader   kt-grid__item" id="kt_subheader">
    <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Daftar Stok Kurang</h3>
    </div>
</div>
<!-- end:: Content Head -->

<!-- begin:: Content -->
<div class="kt-content  kt-grid__item kt-grid__item--fluid" id="kt_content">

    <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
            <div class="kt-portlet__head-label">
                <span class="kt-portlet__head-icon">
                    <i class="kt-font-brand flaticon2-line-chart"></i>
                </span>
                <h3 class="kt-portlet__head-title">
                    Stok Kurang
                </h3>
            </div>
            <div class="kt-portlet__head-toolbar">
                <div class="kt-portlet__head-wrapper">
                    <a href="javascript:;" class="btn btn-clean btn-icon-sm btn-back">
                        <i class="la la-long-arrow-left"></i>
                        Kembali
                    </a>
                    &nbsp;
                    <div class="dropdown dropdown-inline">
                        <button type="button" class="btn btn-default btn-icon-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="la la-download"></i> Export
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <ul class="kt-nav">
                                <li class="kt-nav__section kt-nav__section--first">
                                    <span class="kt-nav__section-text">Choose an option</span>
                                </li>
                                <li class="kt-nav__item">
                                    <a href="javascript:;" data-export="excel" class="kt-nav__link">
                                        <i class="kt-nav__link-icon la la-file-excel-o"></i>
                                        <span class="kt-nav__link-text">Excel</span>
                                    </a>
                                </li>
                                {{-- <li class="kt-nav__item">
                                    <a href="javascript:;" class="kt-nav__link">
                                        <i class="kt-nav__link-icon la la-file-text-o"></i>
                                        <span class="kt-nav__link-text">CSV</span>
                                    </a>
                                </li>
                                <li class="kt-nav__item">
                                    <a href="javascript:;" class="kt-nav__link">
                                        <i class="kt-nav__link-icon la la-file-pdf-o"></i>
                                        <span class="kt-nav__link-text">PDF</span>
                                    </a>
                                </li> --}}
                            </ul>
                        </div>
                    </div>
                    &nbsp;
                    <div class="dropdown dropdown-inline">
                        <button type="button" class="btn btn-brand btn-icon-sm" data-toggle="modal" data-target='#addPO' disabled>
                            <i class="flaticon2-plus"></i> Buat PO
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="kt-portlet__body">

            <!--begin: Search Form -->
            <div class="kt-form kt-form--label-right">
                <div class="row align-items-center">
                    <div class="col-xl-12 order-2 order-xl-1">
                        <div class="row align-items-center filter">
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
                            <div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
                                <div class="kt-form__group kt-form__group--inline">
                                    <div class="kt-form__label">
                                        <label>Tipe Ukuran:</label>
                                    </div>
                                    <div class="kt-form__control">
                                        <select class="form-control bootstrap-select" name='measure_code'>
                                            <option value="">All</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
                                <div class="kt-form__group kt-form__group--inline">
                                    <div class="kt-form__label">
                                        <label>Pinjaman:</label>
                                    </div>
                                    <div class="kt-form__control">
                                        <select class="form-control bootstrap-select" name='stock_daily_use'>
                                            <option value="">All</option>
                                            <option value="0">Tidak</option>
                                            <option value="1">Ya</option>
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
        <div class="kt-portlet__body kt-portlet__body--fit">

            <!--begin: Datatable -->
            <div class="kt-datatable" id="datagrid-list-buy"></div>

            <!--end: Datatable -->
        </div>
    </div>

</div>

<!-- modal for add stock to PO -->
<div class="modal fade" id="addPO" tabindex="-1" role="dialog" aria-labelledby="longModal" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="longModal">Buat Purchase Order</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body">
                <style media="screen">
                  #FPO .list-header, #FPO .list-body {
                    display: block;
                  }
                  #FPO .list-header {
                    min-height: 30px;
                    border-bottom: 1px solid #999;
                    margin-bottom: 6px;
                  }
                  #FPO .list-header > div {
                    float: left;
                    font-weight: bold;
                    width: 70%;
                  }
                  #FPO .list-header > div:last-child {
                    text-align: center;
                    width: 30%;
                  }
                  #FPO .list-body > div {
                    width: 100%;
                    min-height: 40px;
                  }
                  #FPO .list-body > div > div {
                    width: 70%;
                    float: left;
                  }
                  #FPO .list-body > div > div:last-child {
                    width: 30%;
                  }
                </style>
                <form class="kt-form" id="FPO">
                    <div class="row validated">
                        <div class="col-md-12">
                            <div class="list-header">
                                <div>Stok</div>
                                <div>Kuantiti</div>
                            </div>
                            <div class="list-body"></div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" tabindex="12" class="btn btn-secondary" data-dismiss="modal">Keluar</button>
                <button type="button" tabindex="11" class="btn btn-primary btn-submit">Buat</button>
            </div>
        </div>
    </div>
</div>

<!--end::Modal-->
