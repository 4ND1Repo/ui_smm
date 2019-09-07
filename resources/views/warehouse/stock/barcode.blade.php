<!-- begin:: Content Head -->
<div class="kt-subheader   kt-grid__item" id="kt_subheader">
    <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Print Barcode</h3>
    </div>
</div>

<!-- begin:: Content -->
<div class="kt-content  kt-grid__item kt-grid__item--fluid" id="kt_content">

    <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
            <div class="kt-portlet__head-label">
                <span class="kt-portlet__head-icon">
                    <i class="kt-font-brand la la-barcode"></i>
                </span>
                <h3 class="kt-portlet__head-title">
                    Print Barcode
                </h3>
            </div>
            <div class="kt-portlet__head-toolbar">
                <div class="kt-portlet__head-wrapper">
                    <a href="javascript:;" class="btn btn-clean btn-icon-sm btn-back">
                        <i class="la la-long-arrow-left"></i>
                        Kembali
                    </a>

                    <button type="button" class="btn btn-default btn-icon-sm btn-print">
                        <i class="la la-print"></i> Print
                    </button>
                </div>
            </div>
        </div>
        <div class="kt-portlet__body">
            <div class="row">
                <div class="col-xl-12 col-md-12">
                    <ul>Keterangan :
                        <li>Kertas yang digunakan kertas label merek Fox ukuran 108</li>
                    </ul>
                </div>
                <style>
                form {
                    width: 100%;
                }
                .grid-container {
                    margin-top: 50px;
                    width: 100%;
                    display: grid;
                    grid-gap: 9px;
                    grid-auto-rows: minmax(50px, 70px);
                    grid-template-columns: repeat(5, 1fr);
                }
                .grid-container .grid-list {
                    text-align: center;
                    font-size: 12px;
                    text-transform: uppercase;
                    padding: 4px 6px;
                    border: 1px solid grey;
                    border-radius: 8px;
                }
                </style>
                <form id="Fbarcode" method="POST" target="_blank">
                    <div class="grid-container">
                        @for($i=0;$i < 40;$i++)
                        <div class="grid-list" data-id="barcode_{{$i}}"><input type="hidden" name="barcode[{{$i}}][stock_code]" value=""><input type="hidden" name="barcode[{{$i}}][label]" value=""><div>Tidak Ada Barcode</div></div>
                        @endfor
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
    .popup-search {
        width: 180px;
        position: absolute;
        background: white;
        border-radius: 8px;
        box-shadow: 0 -4px 5px grey;    
        padding: 8px;
        display: none;
    }
    .btn-full {
        width: 100%;
    }
    .no-margin {
        margin: 0;
    }
</style>
<div class="popup-search">
    <div class="form-group no-margin typeahead">
        <input type="text" id="find-goods" class="form-control form-control-sm">
        <button type="button" class="btn btn-danger btn-sm btn-full btn-cancel">Batalkan</button>
    </div>
</div>