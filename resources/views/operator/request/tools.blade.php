<style>
    .list-item {
        border-radius: 5px;
        box-shadow: 0 0 12px #BBB;
        overflow: hidden;
        position: relative;
    }
    .list-item .item_header {
        padding: 4px 10px;
        background: #C6CFFA;
        font-weight: bold;
    }
    .list-item .item_body > div {
        padding: 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .list-item .item_body > div:last-child {
        margin-bottom: 6px;
    }
    .list-item .item_header span {
        position: absolute;
        right: 6px;
    }
    .typeahead .tt-dataset {
      max-height: 200px;
      overflow-y: auto;
    }
</style>

<!-- begin:: Content Head -->
<div class="kt-subheader   kt-grid__item" id="kt_subheader">
    <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Request Barang</h3>
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
                    Request Barang
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
                        <button type="button" class="btn btn-brand btn-icon-sm" data-toggle="modal" data-target='#addReqtools'>
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
                                            <option value="ST02">Process</option>
                                            <option value="ST03">Tidak Cukup</option>
                                            <option value="ST04">Pembelian</option>
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
            <div class="kt-datatable" id="datagrid-req-tools-opr"></div>
            <!--end: Datatable -->
        </div>

    </div>
</div>



<!-- modal for add stock -->
<div class="modal fade" id="addReqtools" tabindex="-1" role="dialog" aria-labelledby="longModal" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="longModal">Request Barang</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body">
                <form class="kt-form" id="FReqtools">
                    <div class="row validated search">
                        <input type="hidden" name="req_nik">
                        <input type="hidden" name="name_of_request">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Cari Stock</label>
                                <div class="input-group typeahead">
                                    <input type="text" class="form-control autocomplete" name="stock_name" placeholder="Cari stok" autocomplete="off">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">&nbsp;</div>
                    </div>
                    <div class="row request_tools"></div>
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
