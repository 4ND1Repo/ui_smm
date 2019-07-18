<!-- begin:: Content Head -->
<div class="kt-subheader   kt-grid__item" id="kt_subheader">
    <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Halaman Surat Jalan</h3>
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
                    Surat Jalan
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
                </div>
            </div>
        </div>


        <div class="kt-portlet__body kt-portlet__body--fit">

            <!--begin: Datatable -->
            <div class="kt-datatable" id="datagrid-do"></div>
            <!--end: Datatable -->
        </div>

    </div>
</div>


<!-- modal for add stock to PO -->
<div class="modal fade" id="addPo" tabindex="-1" role="dialog" aria-labelledby="longModal" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="longModal">Terima Barang</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body">
                <style media="screen">
                  .list_stock .list-header, .list_stock .list-body {
                    display: block;
                  }
                  .list_stock .list-header {
                    min-height: 30px;
                    border-bottom: 1px solid #999;
                    margin-bottom: 6px;
                  }
                  .list_stock .list-header > div {
                    float: left;
                    font-weight: bold;
                    width: calc( 20% - 12px);
                    padding-left: 6px;
                    padding-right: 6px;
                    text-align: center;
                  }
                  .list_stock .list-header > div:first-child {
                    width: 60%;
                  }
                  .list_stock .list-body > div {
                    width: 100%;
                    min-height: 40px;
                  }
                  .list_stock .list-body > div > div {
                    float: left;
                    width: calc( 20% - 12px);
                    padding-left: 6px;
                    padding-right: 6px;
                  }
                  .list_stock .list-body > div > div:first-child {
                    width: 60%;
                  }
                </style>
                <div class="row typeahead">
                    <div class="col-md-3"><input type="text" class="form-control form-control-sm autocomplete" name="main_stock_code" placeholder="cari stok disini"></div>
                    <div class="col-md-9">&nbsp;</div>
                </div>
                <form class="kt-form" id="FPO">
                    <div class="row validated">
                        <div class="col-md-8">&nbsp;</div>
                        <div class="col-md-4"><input type="text" class="form-control form-control-sm" name="do_code" placeholder="Nomor surat jalan"></div>
                    </div>
                    <div class="row">&nbsp;</div>
                    <div class="row validated list_stock">
                        <div class="col-md-12">
                            <div class="list-header">
                                <div>Stok</div>
                                <div>Kuantiti</div>
                                <div>Terima</div>
                            </div>
                            <div class="list-body"></div>
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
