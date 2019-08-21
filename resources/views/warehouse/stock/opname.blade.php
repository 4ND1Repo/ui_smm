<style>
.typeahead .tt-dataset {
  max-height: 200px;
  overflow-y: auto;
}
</style>

<!-- begin:: Content Head -->
<div class="kt-subheader   kt-grid__item" id="kt_subheader">
    <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Stok Opname</h3>
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
                    Stock Opname
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
                        <button type="button" class="btn btn-brand btn-icon-sm" data-toggle="modal" data-target='#addOpname'>
                            <i class="flaticon2-plus"></i> Tambah
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="kt-portlet__body">

            <!--begin: Search Form -->
            <div class="kt-form kt-form--label-right">
                <div class="row align-items-center">
                    <div class="col-xl-8 order-2 order-xl-1">
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
                                          <label>Tanggal Opname:</label>
                                      </div>
                                      <div class="kt-form__control">
                                          <select class="form-control bootstrap-select" name='opname_date_from' data-live-search="true">
                                              <option value="">Semua</option>
                                          </select>
                                      </div>
                                  </div>
                            </div>
                            <div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
                                <div class="kt-form__group kt-form__group--inline">
                                    <div class="kt-form__label">
                                        <label>Merek:</label>
                                    </div>
                                    <div class="kt-form__control">
                                        <select class="form-control bootstrap-select" name='stock_brand' data-live-search="true">
                                            <option value="">Semua</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
                                <div class="kt-form__group kt-form__group--inline">
                                    <div class="kt-form__label">
                                        <label>status:</label>
                                    </div>
                                    <div class="kt-form__control">
                                        <select class="form-control bootstrap-select" name='approve'>
                                            <option value="">Semua</option>
                                            <option value="1">Disetujui</option>
                                            <option value="0">Tidak Disetujui</option>
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
            <div class="kt-datatable" id="datagrid-stock-opname"></div>

            <!--end: Datatable -->
        </div>
    </div>

</div>

<!-- modal for add stock -->
<div class="modal fade" id="addOpname" tabindex="-1" role="dialog" aria-labelledby="longModal" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="longModal">Stok Opname</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Stock</label>
                            <div class="typeahead">
                              <input type="text" name="find_stock" class="form-control autocomplete" placeholder="Cari Stok">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        &nbsp;
                    </div>
                </div>
                <form class="kt-form" id="FOpname">
                    <div class="row opname-list validated">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Kode Stok</label>
                                <input type="text" class="form-control disabled" name="stock_code" value="" placeholder="Kode Stok" readonly>
                                <input type="hidden" name="main_stock_code" value="">
                            </div>
                            <div class="form-group">
                                <label>Nama Stok</label>
                                <input type="text" class="form-control disabled" name="stock_name" value="" placeholder="Nama stok" disabled>
                            </div>
                            <div class="form-group">
                                <label>Ukuran</label>
                                <input type="text" class="form-control disabled" name="stock_size" value="" placeholder="Ukuran stok" disabled>
                            </div>
                            <div class="form-group">
                                <label>Tipe</label>
                                <input type="text" class="form-control disabled" name="stock_type" value="" placeholder="Tipe stok" disabled>
                            </div>
                        </div>
                        <div class="col-md-6 validated">
                            <div class="form-group">
                                <label>Kuantiti asal</label>
                                <input type="text" class="form-control disabled" name="opname_qty_from" value="" placeholder="Kuantiti sekarang" readonly>
                            </div>
                            <div class="form-group">
                                <label>Kuantiti sekarang</label>
                                <input type="text" class="form-control" name="opname_qty" value="" placeholder="Kuantiti sekarang" >
                            </div>
                            <div class="form-group">
                                <label>Keterangan</label>
                                <textarea name="opname_notes" class="form-control" placeholder="keterangan"></textarea>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" tabindex="12" class="btn btn-secondary" data-dismiss="modal">Keluar</button>
                <button type="button" tabindex="11" class="btn btn-primary btn-approve kt-hidden">Konfirmasi</button>
                <button type="button" tabindex="11" class="btn btn-primary btn-submit">Opname</button>
            </div>
        </div>
    </div>
</div>

<!--end::Modal-->
