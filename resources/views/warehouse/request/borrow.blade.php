<style>
    .typeahead .tt-dataset {
      max-height: 200px;
      overflow-y: auto;
    }
</style>

<!-- begin:: Content Head -->
<div class="kt-subheader   kt-grid__item" id="kt_subheader">
    <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Pinjam Barang</h3>
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
                    Pinjam Barang
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
                        <button type="button" class="btn btn-brand btn-icon-sm" data-toggle="modal" data-target='#addBorrow'>
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
                    <div class="col-xl-12 order-2 order-xl-1">
                        <div class="row align-items-center">
                            <div class="col-md-6">&nbsp;</div>
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
                                            <option value="ST06">Menunggu</option>
                                            <option value="ST02">Proses</option>
                                            <option value="ST05">Selesai</option>
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
            <div class="kt-datatable" id="datagrid-borrow"></div>
            <!--end: Datatable -->
        </div>

    </div>
</div>



<!-- modal for add stock -->
<div class="modal fade" id="addBorrow" tabindex="-1" role="dialog" aria-labelledby="longModal" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="longModal">Pinjam Barang</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body">
                <form class="kt-form" id="FBorrow">
                  <div class="row request_user kt-hidden">
                      <div class="col-md-6">
                          <div class="form-group">
                              <label>Perusahaan</label>
                              <select tabindex="1" class="form-control" name="company_code" data-live-search="true"></select>
                          </div>
                          <div class="form-group">
                              <label>NIK yang meminjam</label>
                              <div class="typeahead">
                                  <input type="text" class="form-control autocomplete" name="nik" value="" placeholder="NIK yang meminjam">
                              </div>
                          </div>
                          <div class="form-group">
                              <label>Nama yang meminjam</label>
                              <input type="text" class="form-control" name="borrowed_req_name" value="" placeholder="Nama yang meminjam">
                          </div>
                      </div>
                      <div class="col-md-6">
                          <div class="form-group take kt-hidden">
                              <label>NIK yang mengambil</label>
                              <div class="typeahead">
                                  <input type="text" class="form-control autocomplete" name="take_nik" value="" placeholder="NIK yang ambil">
                              </div>
                          </div>
                          <div class="form-group take kt-hidden">
                              <label>Nama yang mengambil</label>
                              <input type="text" class="form-control" name="borrowed_take_name" value="" placeholder="Nama yang mengambil">
                          </div>
                          <div class="form-group">
                              <div class="kt-checkbox-list">
                                  <label class="kt-checkbox">
                                      <input type="checkbox" tabindex="10" value="1" name="borrowed_self" checked> Pengambil dirinya sendiri
                                      <span></span>
                                  </label>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="row borrow validated">
                      <div class="col-md-6">
                          <div class="form-group">
                              <label>Kode Stok</label>
                              <div class="typeahead">
                                <input type="text" class="form-control autocomplete" name="stock_code" value="" placeholder="Kode Stok">
                                <input type="hidden" name="main_stock_code" value="">
                              </div>
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
                          <div class="form-group">
                              <label>Kuantiti</label>
                              <input type="text" class="form-control disabled" name="stock_qty" value="" placeholder="Kuantiti" disabled>
                          </div>
                      </div>
                      <div class="col-md-6 validated">
                          <div class="form-group">
                              <label>Lama Pinjam</label>
                              <div class="input-group">
                                <input type="text" class="form-control" name="borrowed_long_term" value="" placeholder="Lama Pinjam" >
                                <div class="input-group-append">
                                    <span class="input-group-text">Hari</span>
                                </div>
                              </div>
                          </div>
                          <div class="form-group">
                              <label>Tanggal Peminjaman</label>
                              <input type="text" class="form-control date-picker" name="borrowed_date" value="" placeholder="Tanggal Pinjaman" readonly>
                          </div>
                          <div class="form-group">
                              <label>Kuantiti yang dipinjam</label>
                              <input type="text" class="form-control" name="borrowed_qty" value="" placeholder="Kuantiti Pinjaman" >
                          </div>
                          <div class="form-group">
                              <label>Keterangan</label>
                              <textarea name="borrowed_notes" class="form-control" placeholder="keterangan"></textarea>
                          </div>
                      </div>
                  </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" tabindex="13" class="btn btn-secondary" data-dismiss="modal">Keluar</button>
                <button type="button" tabindex="12" class="btn btn-primary btn-submit">Simpan</button>
            </div>
        </div>
    </div>
</div>

<!--end::Modal-->



<!-- modal for add stock -->
<div class="modal fade" id="addReturn" tabindex="-1" role="dialog" aria-labelledby="longModal" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="longModal">Pengembalian Barang</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body">
                <form class="kt-form" id="FReturn">
                  <div class="row request_user kt-hidden">
                      <div class="col-md-6">
                          <div class="form-group">
                              <label>Perusahaan</label>
                              <select tabindex="1" class="form-control" name="company_code" data-live-search="true"></select>
                          </div>
                          <div class="form-group">
                              <label>NIK yang meminjam</label>
                              <div class="typeahead">
                                  <input type="text" class="form-control autocomplete" name="nik" value="" placeholder="NIK yang meminjam">
                              </div>
                          </div>
                          <div class="form-group">
                              <label>Nama yang meminjam</label>
                              <input type="text" class="form-control" name="borrowed_req_name" value="" placeholder="Nama yang meminjam">
                          </div>
                      </div>
                      <div class="col-md-6">
                          <div class="form-group take kt-hidden">
                              <label>NIK yang mengambil</label>
                              <div class="typeahead">
                                  <input type="text" class="form-control autocomplete" name="take_nik" value="" placeholder="NIK yang ambil">
                              </div>
                          </div>
                          <div class="form-group take kt-hidden">
                              <label>Nama yang mengambil</label>
                              <input type="text" class="form-control" name="borrowed_take_name" value="" placeholder="Nama yang mengambil">
                          </div>
                          <div class="form-group">
                              <div class="kt-checkbox-list">
                                  <label class="kt-checkbox">
                                      <input type="checkbox" tabindex="10" value="1" name="borrowed_self" checked> Pengambil dirinya sendiri
                                      <span></span>
                                  </label>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="row borrow validated">
                      <div class="col-md-6">
                          <div class="form-group">
                              <label>Kode Stok</label>
                              <div class="typeahead">
                                <input type="text" class="form-control autocomplete" name="stock_code" value="" placeholder="Kode Stok">
                                <input type="hidden" name="main_stock_code" value="">
                              </div>
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
                          <div class="form-group">
                              <label>Kuantiti</label>
                              <input type="text" class="form-control disabled" name="stock_qty" value="" placeholder="Kuantiti" disabled>
                          </div>
                      </div>
                      <div class="col-md-6 validated">
                          <div class="form-group">
                              <label>Lama Pinjam</label>
                              <div class="input-group">
                                <input type="text" class="form-control" name="borrowed_long_term" value="" placeholder="Lama Pinjam" >
                                <div class="input-group-append">
                                    <span class="input-group-text">Hari</span>
                                </div>
                              </div>
                          </div>
                          <div class="form-group">
                              <label>Tanggal Peminjaman</label>
                              <input type="text" class="form-control date-picker" name="borrowed_date" value="" placeholder="Tanggal Pinjaman" readonly>
                          </div>
                          <div class="form-group">
                              <label>Kuantiti yang dipinjam</label>
                              <input type="text" class="form-control" name="borrowed_qty" value="" placeholder="Kuantiti Pinjaman" >
                          </div>
                          <div class="form-group">
                              <label>Keterangan</label>
                              <textarea name="borrowed_notes" class="form-control" placeholder="keterangan"></textarea>
                          </div>
                      </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                          <label>Kuantiti yang dikembalikan</label>
                          <input type="text" class="form-control" name="returned_qty" value="" placeholder="Kuantiti Kembali" >
                      </div>
                    </div>
                  </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" tabindex="13" class="btn btn-secondary" data-dismiss="modal">Keluar</button>
                <button type="button" tabindex="12" class="btn btn-primary btn-submit">Simpan</button>
            </div>
        </div>
    </div>
</div>

<!--end::Modal-->
