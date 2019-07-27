<style>
  .datepicker tbody tr > td.day.disabled, .datepicker tbody tr > td span.month.disabled, .datepicker tbody tr > td span.year.disabled {
    color: #ccc;
  }
</style>
<!-- begin:: Content Head -->
<div class="kt-subheader   kt-grid__item" id="kt_subheader">
    <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Halaman PO</h3>
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
                    PO
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
                                    <a href="javascript:;" class="kt-nav__link">
                                        <i class="kt-nav__link-icon la la-file-excel-o"></i>
                                        <span class="kt-nav__link-text">Excel</span>
                                    </a>
                                </li>
                                <li class="kt-nav__item">
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
                                </li>
                            </ul>
                        </div>
                    </div>
                    &nbsp;
                    <!-- <div class="dropdown dropdown-inline">
                        <button type="button" class="btn btn-brand btn-icon-sm" data-toggle="modal" data-target='#addPo'>
                            <i class="flaticon2-plus"></i> Tambah
                        </button>
                    </div> -->
                </div>
            </div>
        </div>


        <div class="kt-portlet__body kt-portlet__body--fit">
            <!--begin: Search Form -->
            <div class="kt-form kt-form--label-right">
                <div class="row align-items-center">
                    <div class="col-xl-8 order-2 order-xl-1">
                        <div class="row align-items-center filter">
                            <div class="col-md-6 kt-margin-b-20-tablet-and-mobile">
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
                                        <label>Status:</label>
                                    </div>
                                    <div class="kt-form__control">
                                        <select class="form-control bootstrap-select" name='status'>
                                            <option value="">All</option>
                                            <option value="ST02">Proses</option>
                                            <option value="ST06">Menunggu</option>
                                            <option value="ST05">Selesai</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="kt-portlet__body kt-portlet__body--fit">

            <!--begin: Datatable -->
            <div class="kt-datatable" id="datagrid-pur-po"></div>
            <!--end: Datatable -->
        </div>

    </div>
</div>


<!-- modal for add stock to PO -->
<div class="modal fade" id="addPo" tabindex="-1" role="dialog" aria-labelledby="longModal" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="longModal">Daftar Request Stok</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
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
                    text-overflow: ellipsis;
                    overflow: hidden;
                    width: 30%;
                  }
                  #FPO .list-header > div:last-child, #FPO .list-header > div:nth-child(2), #FPO .list-header > div:nth-child(3), #FPO .list-header > div:nth-child(4), #FPO .list-header > div:nth-child(6) {
                    text-align: center;
                    width: 10%;
                  }
                  #FPO .list-header > div:nth-child(5) {
                    text-align: center;
                    width: 20%;
                  }
                  #FPO .list-data > div {
                    width: 100%;
                    min-height: 40px;
                  }
                  #FPO .list-data > div > div {
                    width: 30%;
                    float: left;
                  }
                  #FPO .list-data > div > div:first-child {
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }
                  #FPO .list-data > div > div:last-child, #FPO .list-data > div > div:nth-child(2), #FPO .list-data > div > div:nth-child(3), #FPO .list-data > div > div:nth-child(4), #FPO .list-data > div > div:nth-child(6) {
                    width: 10%;
                  }
                  #FPO .list-data > div > div:nth-child(5) {
                    width: 20%;
                  }
                </style>
                <div class="row">&nbsp;</div>
                <form class="kt-form" id="FPO">
                    <div class="row validated">
                        <div class="col-md-12">
                            <div class="list-header">
                                <div>Stok</div>
                                <div>Kuantiti</div>
                                <div>Satuan</div>
                                <div>Kirim</div>
                                <div>Supplier</div>
                                <div>Harga</div>
                                <div>Tersedia</div>
                            </div>
                            <div class="list-data"></div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" tabindex="12" class="btn btn-secondary" data-dismiss="modal">Keluar</button>
                <button type="button" tabindex="11" class="btn btn-primary btn-submit">Proses</button>
            </div>
        </div>
    </div>
</div>

<!--end::Modal-->
