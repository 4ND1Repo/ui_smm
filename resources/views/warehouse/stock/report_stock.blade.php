<style>
    .datepicker tbody tr > td.day.disabled, .datepicker tbody tr > td span.month.disabled, .datepicker tbody tr > td span.year.disabled {
        color: #ccc;
    }
</style>
<!-- begin:: Content Head -->
<div class="kt-subheader   kt-grid__item" id="kt_subheader">
    <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Laporan Stok Barang</h3>
    </div>
</div>
<!-- end:: Content Head -->

<!-- begin:: Content -->
<div class="kt-content  kt-grid__item kt-grid__item--fluid" id="kt_content">

    <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
            <div class="kt-portlet__head-label">
                <span class="kt-portlet__head-icon">
                    <i class="kt-font-brand flaticon2-open-box"></i>
                </span>
                <h3 class="kt-portlet__head-title">
                    Laporan Stok Barang
                </h3>
            </div>
            <div class="kt-portlet__head-toolbar">
                <div class="kt-portlet__head-wrapper">
                    <a href="javascript:;" class="btn btn-clean btn-icon-sm btn-back">
                        <i class="la la-long-arrow-left"></i>
                        Kembali
                    </a>

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
                                    <a href="javascript:;" data-export="excel" data-id="in" class="kt-nav__link">
                                        <i class="kt-nav__link-icon la la-file-excel-o"></i>
                                        <span class="kt-nav__link-text">Excel</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="kt-portlet__body">

            <!--begin: Search Form -->
            <div class="kt-form kt-form--label-right">
                <div class="row align-items-center">
                    <div class="col-xl-12 order-2 order-xl-1">
                        <div class="row align-items-center">
                            <div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
                                <div class="kt-input-icon kt-input-icon--left">
                                    <input type="text" class="form-control" placeholder="Search..." id="generalSearch" name="find">
                                    <span class="kt-input-icon__icon kt-input-icon__icon--left">
                                        <span><i class="la la-search"></i></span>
                                    </span>
                                </div>
                            </div>
                            <div class="col-md-9 kt-margin-b-20-tablet-and-mobile">
                              <div class="row">
                                <div class="col-md-4 kt-margin-b-20-tablet-and-mobile">
                                    <div class="kt-form__group kt-form__group--inline">
                                        <div class="kt-form__label">
                                            <label>Merek:</label>
                                        </div>
                                        <div class="kt-form__control">
                                            <select class="form-control bootstrap-select" name='stock_brand_in' data-live-search="true">
                                                <option value="">Semua</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 kt-margin-b-20-tablet-and-mobile">
                                    <div class="kt-form__group kt-form__group--inline">
                                        <div class="kt-form__label">
                                            <label>Tipe:</label>
                                        </div>
                                        <div class="kt-form__control">
                                            <select class="form-control bootstrap-select" name='stock_type_in' data-live-search="true">
                                                <option value="">Semua</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 kt-margin-b-20-tablet-and-mobile">
                                    <div class="kt-form__group kt-form__group--inline">
                                        <div class="kt-form__label">
                                            <label>Ukuran:</label>
                                        </div>
                                        <div class="kt-form__control">
                                            <select class="form-control bootstrap-select" name='stock_size_in' data-live-search="true">
                                                <option value="">Semua</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 kt-margin-b-20-tablet-and-mobile">
                                    <div class="kt-form__group kt-form__group--inline">
                                        <div class="kt-form__label">
                                            <label>Warna:</label>
                                        </div>
                                        <div class="kt-form__control">
                                            <select class="form-control bootstrap-select" name='stock_color_in' data-live-search="true">
                                                <option value="">Semua</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 kt-margin-b-20-tablet-and-mobile">
                                    <div class="kt-form__group kt-form__group--inline">
                                        <div class="kt-form__label">
                                            <label>Tipe Satuan:</label>
                                        </div>
                                        <div class="kt-form__control">
                                            <select class="form-control bootstrap-select" name='measure_code_in'>
                                                <option value="">Semua</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 kt-margin-b-20-tablet-and-mobile">
                                    <div class="kt-form__group kt-form__group--inline">
                                        <div class="kt-form__label">
                                            <label>Pinjaman:</label>
                                        </div>
                                        <div class="kt-form__control">
                                            <select class="form-control bootstrap-select" name='stock_daily_use_in'>
                                                <option value="">Semua</option>
                                                <option value="0">Tidak</option>
                                                <option value="1">Ya</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                  <div class="col-md-4 kt-margin-b-20-tablet-and-mobile">
                                      <div class="kt-input-icon kt-input-icon--left">
                                          <input type="text" class="form-control date-picker" placeholder="Mulai Dari" name="in[start]" readonly>
                                          <span class="kt-input-icon__icon kt-input-icon__icon--left">
                                      <span><i class="la la-calendar"></i></span>
                                  </span>
                                      </div>
                                  </div>
                                  <div class="col-md-4 kt-margin-b-20-tablet-and-mobile">
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
            </div>

            <!--end: Search Form -->
        </div>
        <div class="kt-portlet__body kt-portlet__body--fit">

            <!--begin: Datatable -->
            <div class="kt-datatable" id="datagrid-report-stock"></div>

            <!--end: Datatable -->
        </div>
    </div>

</div>


<!-- begin: modal for detail stock -->
<style>
  #detailReport .modal-dialog {
    width: 99%;
    margin: 0 auto;
    padding: 0;
    max-width: none;
  }
  #detailReport .modal-body-fit {
    padding-top: 10px;
  }
</style>
<div class="modal fade" id="detailReport" tabindex="-1" role="dialog" aria-labelledby="longModal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="longModal">Rincian Stock</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body modal-body-fit">
              <div class="row">
                <div class="col-sm-12 col-md-12 col-xl-12 text-right" style='padding-right:20px;'>
                    <button type="button" class="btn btn-clear btn-info btn-sm btn-export" style="float:right">Export</button>
                </div>
                <div class="col-sm-12 col-md-12 col-xl-12">
                  <!--begin: Datatable -->
                  <div id="datagrid-detail-report-stock"></div>
                  <!--end: Datatable -->
                </div>
              </div>
      		</div>
        </div>
    </div>
</div>

<!--end::Modal-->
