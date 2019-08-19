<style media="all">
#kt_content {
  /* clear: both;
  page-break-after: auto;
  page-break-inside: avoid; */
  position: relative;
}
#kt_content .kt-portlet {
  position: relative;
  /* overflow: hidden; */
}
#kt_content .kt-portlet .kt-portlet__body {
  overflow: hidden;
  position: relative;
}
#kt_content .print-head {
  overflow: hidden;
  height: 230px;
  border: 1px solid white;
}
#kt_content .print-header {
  margin-top: -250px;
  height: 330px;
  background-color: #1E1E2D;
  transform: skew(0deg, -8deg);
}
#kt_content .print-header .logo, #kt_content .print-header .header-data {
  padding-left: 20px;
  padding-right: 20px;
  transform: skew(0deg, 8deg);
}
#kt_content .print-header .logo {
  margin-top: 150px;
  padding-top: 120px;
}
#kt_content .print-header .logo img {
  width: 240px;
  height: auto;
}
#kt_content .print-header .logo div {
  float: right;
  background-color: white;
  padding: 6px 10px;
  margin-right: 20px;
  text-align: center;
  width: 100px;
}
#kt_content .print-header .header-data .header-from, #kt_content .print-header .header-data .header-to {
  width: 300px;
  color: white;
  font-size: 12px;
}
#kt_content .print-header .header-data .header-from {
  float: left;
}
#kt_content .print-header .header-data .header-to {
  float: right;
}
#kt_content .print-body {
  padding-top: 10px;
  background-color: white;
  position: relative;
  z-index: 0;
  display: inline-block;
  height: 100px;
  width: 100%;
}
#kt_content .print-body div.body-title .line-title {
  margin-left: -100px;
  width: 140px;
  height: 2px;
  left: 0;
  top: 10px;
  background-color: #1E1E2D;
  position: absolute;
  overflow: hidden;
}
#kt_content .print-body div.body-title {
  height: 100px;
  top: 6px;
}
#kt_content .print-body div {
  position: absolute;
  left: 62px;
  width: 600px;
}
#kt_content .print-body div.body-label {
  font-size: 28px;
  line-height: 0.5;
  height: 100px;
  top: 0px;
  text-transform: capitalize;
}
#kt_content .print-body div.body-text {
  top: 23px;
  font-size: 14px;
  height: 80px;
}
#kt_content .print-body div.body-total {
  border: 1px solid #1E1E2D;
  right: 20px;
  left: auto;
  top: 30px;
  font-size: 28px;
  padding: 4px 4px;
  width: 320px;
  height: 40px;
  text-align: right;
  background-color: #1E1E2D;
  padding-top: 35px;
  color: white;
  font-weight: 500;
}
#kt_content .print-body div.body-total .total-price-title {
  font-size: 12px;
  position: absolute;
  top: 0;
  width: 80px;
  padding: 4px;
  color: white;
  text-align: left;
  font-weight: 500;
  margin-left: -60px;
}
#kt_content .print-body-data {
position: relative;
display: block;
height: 560px;
min-height: 560px;
max-height: 560px;
}
#kt_content .print-body-data div {
  /* border: 1px solid red; */
}
#kt_content .print-body-data .print-body-page {
margin-left: 80px;
margin-right: 20px;
/* border: 1px solid; */
}
#kt_content .print-body-data .print-body-page .print-body-head {
font-size: 18px;
font-weight: 500;
}
#kt_content .print-body-data .print-body-page .print-body-list {
margin-top: 8px;
font-size: 14px;
}
#kt_content .print-footer {
position: relative;
bottom: 0;
width: 100%;
}
#kt_content .print-footer .print-footer-page-total {
height: 40px;
border-radius: 10px;
background-color: #1E1E2D;
margin-left: 20px;
margin-right: 20px;
margin-bottom: 10px;
padding-top: 2px;
}
#kt_content .print-footer .print-footer-page-total .print-footer-page-total-price {
float: right;
font-size: 16px;
color: white;
text-align: right;
margin-top: 2px;
margin-right: 10px;
position: relative;
}
#kt_content .print-footer .print-footer-page-total .print-footer-page-total-price .sub-price-title {
margin-left: -55px;
color: white;
font-size: 10px;
position: absolute;
border-left: 1px solid white;
padding-left: 3px;
height: 30px;
}
#kt_content .print-footer .print-footer-label {
padding: 4px 6px;
text-align: center;
}
</style>
<?php
$length = 3;
$supl = 0;
?>
@foreach ($data['pur'] as $spl_code => $purchase)
<?php
  $supl++;
  // get grand total price
  $grandTotal = 0;
  foreach ($purchase as $idx => $row) {
    $grandTotal += ($row->stock_price*$row->po_qty);
  }
  $chunk = array_chunk($purchase, 28);
?>
@foreach ($chunk as $page => $pur)

<!-- begin:: Content -->
<div class="kt-content  kt-grid__item kt-grid__item--fluid" style="{{(isset($chunk[($page+1)]) || $supl < sizeof($data)?'page-break-after: always;':'')}}" id="kt_content">
  <div class="kt-portlet kt-portlet--mobile">
    <div class="kt-portlet__body kt-portlet__body--fit">
      <div class="print-head">
        <div class="print-header">
          <div class="logo">
            <div>Halaman {{($page+1)}}</div>
            <?php
                $subTotal = 0;
                $path = public_path('assets/media/logos/logo-smm.png');
                $type = pathinfo($path, PATHINFO_EXTENSION);
                $enc = file_get_contents($path);
                $base64 = 'data:image/' . $type . ';base64,' . base64_encode($enc);
            ?>
            <img src="{{$base64}}" alt="">
          </div>
          <div class="header-data">
            <div class="header-from">
              {{$data['nik']->first_name.(!empty($data['nik']->last_name) && !is_null($data['nik']->last_name)?" ".$data['nik']->last_name:"")}}<br>
              {{(!empty($data['nik']->phone) && !is_null($data['nik']->phone)?$data['nik']->phone:"").(!empty($data['nik']->handphone) && !is_null($data['nik']->handphone)?(!empty($data['nik']->phone) && !is_null($data['nik']->phone)?" / ":"").$data['nik']->handphone:"")}}<br>
              {{(!empty($data['nik']->email) && !is_null($data['nik']->email)?$data['nik']->email:"")}}
            </div>
            <div class="header-to">
              {{$pur[0]->supplier_name}}<br>
              {{$pur[0]->supplier_address." ".$pur[0]->city_name}}<br>
              {{$pur[0]->supplier_phone}}
            </div>
          </div>
        </div>
      </div>

      <div class="print-body">
        <div class="body-total">
          <div class="total-price-title">Total Semua</div>
          Rp. {{number_format($grandTotal, 2, ',', '.')}}
        </div>
        <div class="body-title">
          <div class="line-title">&nbsp;</div>
          <div class="body-label">
            Pembelian Barang
          </div>
          <div class="body-text">
            {{$pur[0]->po_code}}<br>
            {{$pur[0]->po_date}}
          </div>
        </div>
      </div>

      <div class="print-body-data">
        <div class="print-body-page">
          <div class="row print-body-head">
            <div class="col-7 text-center">Barang</div>
            <div class="col-1 text-center">Jml.</div>
            <div class="col-2 text-center">Harga</div>
            <div class="col-2 text-center">Total</div>
          </div>
          @foreach ($pur as $i => $row)
            <div class="row print-body-list">
              <div class="col-7">{{$row->stock_name.(!is_null($row->stock_brand)?" ".$row->stock_brand:"").(!is_null($row->stock_size)?" ".$row->stock_size:"").(!is_null($row->stock_type)?" ".$row->stock_type:"")}}</div>
              <div class="col-1 text-center">{{number_format($row->po_qty,2,',','.')." ".$row->measure_type}}</div>
              <div class="col-2 text-right">{{number_format($row->stock_price,2,',','.')}}</div>
              <div class="col-2 text-right">{{number_format(($iTotal = $row->stock_price*$row->po_qty),2,',','.')}}</div>
            </div>
            <?php $subTotal += $iTotal; ?>
          @endforeach
        </div>
      </div>

      <div class="print-footer">
        <div class="print-footer-page-total">
          <div class="print-footer-page-total-price">
            <div class="sub-price-title">Sub Total</div>
            Rp. {{number_format($subTotal,2,',','.')}}
          </div>
        </div>
        <div class="print-footer-label">
          Sarana Makin Mulya &copy; Agustus 2019
        </div>
      </div>

    </div>
  </div>
</div>
@endforeach
@endforeach
