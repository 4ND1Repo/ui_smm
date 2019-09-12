<style>
    * {
        font-family: Helvetica;
    }
    .kt-content {
        /* border: 1px solid red; */
        width: 770px;
        padding: 15px;
    }
    .kt-content .kt-portlet {
        /* border: 1px solid yellow; */
    }
    .kt-content .kt-portlet .kt-portlet__body {
        /* border: 1px solid blue; */
    }
    .grid {
        margin: 6px 0;
    }
    table {
        width: 100%;
    }
    table.border tr th, table.border tr td {
        padding: 2px;
        border-left: 1px solid black;
        border-bottom: 1px solid black;
        font-family: Helvetica;
    }
    table.border tr th:last-child, table.border tr td:last-child {
        border-right: 1px solid black;
    }
    table.border tr:first-child th, table.border tr:first-child td {
        border-top: 1px solid black;
    }
    table.border thead:after {
        content: " ";
        display: block;
        height: 10px;
        margin-bottom: 10px;
    }
    table.border tr td:first-child {
        text-align: center;
    }
    .table-data thead tr th {
        min-height: 30px;
        height: 30px;
    }
    .table-data tbody tr td {
        padding: 3px;
    }
</style>
<!-- begin:: Content -->
<?php
    $chunk = array_chunk($data,60);
?>
@foreach($chunk AS $i => $data)
<div class="kt-content kt-grid__item kt-grid__item--fluid" {{($i>0?"</table>style=\"page-break-before: always;\"":"")}}>
    <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__body kt-portlet__body--fit">
            <table class='header-title border' cellspacing="0" cellpadding="0" >
                <tr>
                    <th rowspan="3" style="background-color:#1a1a27; padding:4px; width:18%;">
                    <?php
                        $subTotal = 0;
                        $path = public_path('assets/media/logos/logo-smm.png');
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $enc = file_get_contents($path);
                        $base64 = 'data:image/' . $type . ';base64,' . base64_encode($enc);
                    ?>
                    <img src="{{$base64}}" alt="" style="width:130px; height:40px;">
                    </th>
                    <th rowspan="3" style="font-size: 20px; text-align:center;">PERMINTAAN PEMBELIAN BARANG</th>
                    <th style="width:11%; text-align: left;">No. Dokumen</th>
                    <th style="width:11%; text-align: left;">F-PMB-03</th>
                </tr>
                <tr>
                    <th style="width:11%; text-align: left;">Edisi/Revisi</th>
                    <th style="width:11%; text-align: left;">B/00</th>
                </tr>
                <tr>
                    <th style="width:11%; text-align: left;">Tgl. Efektif</th>
                    <th style="width:11%; text-align: left;">01/01/2019</th>
                </tr>
            </table>
            <div class="grid">
                <?php $day = ['Minggu','Senin','Selasa','Rabu','Kamis','Jum\'at','Sabtu']; ?>
                Hari/Tanggal: {{$day[date('w')]}}, {{date("d/m/Y")}}
            </div>
            <table class="table-data border" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th align="center" style="width:30px;">No.</th>
                        <th align="center" style="width:80px;">PO</th>
                        <th align="center" style="width:180px;">Nama Barang</th>
                        <th align="center">Spesifikasi</th>
                        <th align="center" style="width:60px;">Jumlah</th>
                        <th align="center" style="width:160px;">Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($data AS $i => $row)
                    <tr>
                        <td>{{$row->id}}</td>
                        <td align="center">{{$row->po_code}}</td>
                        <td>{{$row->stock_name}}</td>
                        <td>{{$row->stock_spec}}</td>
                        <td align="right">{{number_format($row->po_qty,2,',','.')}}</td>
                        <td style="text-overflow: elipsis; white-space: nowrap; overflow: hidden">{{$row->po_notes}}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>            
        </div>
    </div>
</div>
@endforeach

@if(count($chunk[(count($chunk)-1)])>57)
<div class="kt-content kt-grid__item kt-grid__item--fluid" style="page-break-before: always;">
    <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__body kt-portlet__body--fit">
            <table class='header-title border' cellspacing="0" cellpadding="0" >
                <tr>
                    <th rowspan="3" style="background-color:#1a1a27; padding:4px; width:18%;">
                    <?php
                        $subTotal = 0;
                        $path = public_path('assets/media/logos/logo-smm.png');
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $enc = file_get_contents($path);
                        $base64 = 'data:image/' . $type . ';base64,' . base64_encode($enc);
                    ?>
                    <img src="{{$base64}}" alt="" style="width:130px; height:40px;">
                    </th>
                    <th rowspan="3" style="font-size: 20px; text-align:center;">PERMINTAAN PEMBELIAN BARANG</th>
                    <th style="width:11%; text-align: left;">No. Dokumen</th>
                    <th style="width:11%; text-align: left;">F-PMB-03</th>
                </tr>
                <tr>
                    <th style="width:11%; text-align: left;">Edisi/Revisi</th>
                    <th style="width:11%; text-align: left;">B/00</th>
                </tr>
                <tr>
                    <th style="width:11%; text-align: left;">Tgl. Efektif</th>
                    <th style="width:11%; text-align: left;">01/01/2019</th>
                </tr>
            </table>
            <div class="grid">
                <?php $day = ['Minggu','Senin','Selasa','Rabu','Kamis','Jum\'at','Sabtu']; ?>
                Hari/Tanggal: {{$day[date('w')]}}, {{date("d/m/Y")}}
            </div>
        </div>
    </div>
</div>
@endif

<style>
    .sign {
        width: 800px;
        margin: 10px 15px 10px 12px;
    }
    .sign tr td {
        text-align: center;
    }
    .sign tr td:after {
        content: "(....................................)";
        display: block;
        margin-top: 50px;
    }
</style>
<table class="sign" cellpadding="0" cellspacing="0">
    <tr>
        <td style="width: 256px;">Gudang</td>
        <td style="width: 256px;">Pembeli</td>
        <td style="width: 256px;">Direktur Utama</td>
    </tr>
</table>