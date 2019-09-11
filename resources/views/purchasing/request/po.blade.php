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
                    <!-- <div class="dropdown dropdown-inline">
                        <button type="button" class="btn btn-brand btn-icon-sm" data-toggle="modal" data-target='#addPo'>
                            <i class="flaticon2-plus"></i> Tambah
                        </button>
                    </div> -->
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
                                <div class="kt-input-icon kt-input-icon--left">
                                    <input type="text" class="form-control date-picker" placeholder="Mulai Dari" name="in[start]" readonly>
                                    <span class="kt-input-icon__icon kt-input-icon__icon--left">
                                        <span><i class="la la-calendar"></i></span>
                                    </span>
                                </div>
                            </div>
                            <div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
                                <div class="kt-input-icon kt-input-icon--left">
                                    <input type="text" class="form-control date-picker" placeholder="Sampai" name="in[end]" readonly>
                                    <span class="kt-input-icon__icon kt-input-icon__icon--left">
                                        <span><i class="la la-calendar"></i></span>
                                    </span>
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
<style>
  #addPo .modal-dialog {
    width: 99%;
    margin: 0 auto;
    padding: 0;
    max-width: none;
  }
  #addPo .modal-body-fit {
    padding-top: 10px;
  }
</style>
<div class="modal fade" id="addPo" tabindex="-1" role="dialog" aria-labelledby="longModal" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="longModal">Daftar Permintaan Pembelian</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <style media="screen">
                  /* notified price */
                  #FPO .po-table .po-row > div input.is-higher {
                    border-color: red;
                  }
                  #FPO .po-table .po-row > div input.is-lower {
                    border-color: green;
                  }
                  #FPO .po-table .po-row div{
                    position: relative;
                  }
                  #FPO .po-table .po-row div.is-higher::after{
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    content: "\f106";
                    right: 5px;
                    top: 7px;
                    color: red;
                    position: absolute;
                  }
                  #FPO .po-table .po-row div.is-lower::after{
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    content: "\f107";
                    right: 5px;
                    top: 7px;
                    color: green;
                    position: absolute;
                  }

                  /* table fixed */
                  .po-table {
                      display: table;
                  }
                  .po-table > .po-row {
                      display: table-row;
                  }
                  .po-table > .po-row > div {
                      display: table-cell;
                      padding: 4px;
                      border-bottom: 1px dashed grey;
                  }
                  .po-table > .po-row:first-child > div {
                      border-bottom: 1px solid grey;
                      font-weight: bold;
                      text-align: center;
                  }
                  .po-table > .po-row:nth-child(2) > div {
                      padding-top: 10px;
                  }
                  .po-table > .po-row > div:first-child {
                      width: 20px;
                  }
                  .po-table > .po-row > div:nth-child(2) {
                      width: 30%;
                  }
                  .po-table > .po-row > div:nth-child(3) {
                      width: 60px;
                  }
                  .po-table > .po-row > div:nth-child(4), .po-table > .po-row > div:nth-child(5), .po-table > .po-row > div:nth-child(6) {
                      width: 80px;
                  }
                </style>
                <div class="row">&nbsp;</div>
                <form class="kt-form" id="FPO">
                    <div class="row validated">
                        <div class="col-md-12 po-table">
                            <div class="list-header po-row">
                                <div>&nbsp;</div>
                                <div>Stok</div>
                                <div>Penting</div>
                                <div>PIC</div>
                                <div>Kuantiti</div>
                                <div>Kuantiti Masuk</div>
                                <div>Satuan</div>
                                <div title="Target Kirim">Target Kirim</div>
                                <div>Supplier</div>
                                <div>Harga</div>
                                <div>Tersedia</div>
                            </div>
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
