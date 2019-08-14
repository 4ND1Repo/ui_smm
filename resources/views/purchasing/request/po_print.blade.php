<style media="print">

  #kt_content {
    /* height: calc(100% - 10px); */
    page-break-before: always;
  }

</style>
@for($z=0; $z<8; $z++)
<style>
  #kt_content .kt-portlet {
    position: relative;
    overflow: hidden;
    height: 100%;
  }
  #kt_content .print-head {
    overflow: hidden;
    height: 300px;
  }
  #kt_content .print-header {
    margin-top: -250px;
    height: 400px;
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
  #kt_content .print-header .logo span {
    float: right;
    background-color: white;
    padding: 6px 10px;
    margin-right: 20px;
  }
  #kt_content .print-header .header-data .header-arrow {
    width: 80px;
    height: 80px;
    border-radius: 80px;
    background-color: white;
    color: grey;
    font-size: 32px;
    text-align: center;
    padding-top: 18px;
    position: absolute;
    left: calc(50% - 40px);
  }
  #kt_content .print-header .header-data .header-from, #kt_content .print-header .header-data .header-to {
    width: 300px;
    color: white;
    font-size: 14px;
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
    /* border: 1px solid black; */
    display: inline-block;
    height: 140px;
    width: 100%;
  }
  #kt_content .print-body div.body-title span {
    margin-left: -100px;
    width: 140px;
    height: 3px;
    left: 0;
    top: 30px;
    background-color: #1E1E2D;
    position: absolute;
    overflow: hidden;
  }
  #kt_content .print-body div {
    position: absolute;
    left: 82px;
    width: 800px;
    /* border: 1px solid red; */
  }
  #kt_content .print-body div.body-label {
    font-size: 48px;
    text-transform: capitalize;
  }
  #kt_content .print-body div.body-text {
    top: 73px;
    font-size: 14px;
  }
  #kt_content .print-body div.body-total {
    border: 1px solid #1E1E2D;
    right: 20px;
    left: auto;
    top: 60px;
    font-size: 28px;
    padding: 4px 4px;
    width: 320px;
    height: 80px;
    text-align: right;
    background-color: #1E1E2D;
    padding-top: 35px;
    color: white;
    font-weight: 500;
  }
  #kt_content .print-body div.body-total span {
    font-size: 10px;
    position: absolute;
    left: 0;
    padding: 4px;
    color: white;
    margin-top: -35px;
  }
</style>
<!-- begin:: Content -->
<div class="kt-content  kt-grid__item kt-grid__item--fluid" id="kt_content">
    <div class="kt-portlet kt-portlet--mobile">

        <div class="kt-portlet__body kt-portlet__body--fit">
          <div class="print-head">
            <div class="print-header">
              <div class="logo">
                <span>Halaman {{$z}}</span>
                <img src="./assets/media/logos/logo-smm.png" alt="">
              </div>
              <div class="header-data">
                <div class="header-from">
                  Purchasing<br>
                  022-60475746<br>
                  purchasing@email.co.id
                </div>
                <div class="header-to">
                  Supplier Test<br>
                  Jl. banda aceh No. 34 rt/rw 10/93, bandung - kota bandung 40000 (022) 645354637<br>
                  supplier@email.co.id
                </div>
                <div class="header-arrow">
                  <i class="fa fa-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="print-body">
            <div class="body-total">
              <span>Total Semua</span>
              Rp. 199.999.999.999,00
            </div>
            <div class="body-title">
              <span>&nbsp;</span>
              <div class="body-label">
                Pembelian Barang
              </div>
              <div class="body-text">
                PO190000001<br>
                2019-08-17
              </div>
            </div>
          </div>
<style>
#kt_content .print-body-data {
  position: relative;
  display: block;
  height: 1097px;
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
</style>
          <div class="print-body-data">
            <div class="print-body-page">
              <div class="row print-body-head">
                <div class="col-7 text-center">Barang</div>
                <div class="col-1 text-center">Jml.</div>
                <div class="col-2 text-center">Harga</div>
                <div class="col-2 text-center">Total</div>
              </div>
              @for($i=0;$i<34;$i++)
              <div class="row print-body-list">
                <div class="col-7">Barang {{$i}}</div>
                <div class="col-1 text-center">5</div>
                <div class="col-2 text-right">1.600,00</div>
                <div class="col-2 text-right">8.000,00</div>
              </div>
              @endfor
            </div>
          </div>
<style>
#kt_content .print-footer {
  position: absolute;
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
}
#kt_content .print-footer .print-footer-page-total .print-footer-page-total-price {
  float: right;
  font-size: 20px;
  color: white;
  text-align: right;
  margin-top: 5px;
  margin-right: 10px;
  position: relative;
}
#kt_content .print-footer .print-footer-page-total .print-footer-page-total-price span {
  left: -55px;
  color: white;
  font-size: 10px;
  position: absolute;
  border-left: 2px solid white;
  padding-left: 3px;
  height: 30px;
}
</style>
          <div class="print-footer">
            <div class="print-footer-page-total">
              <div class="print-footer-page-total-price">
                <span>Sub Total</span>
                Rp. 199.999.999.999,00
              </div>
            </div>
            <div class="print-footer-label">
              Sarana Makin Mulya
            </div>
          </div>
        </div>

    </div>
</div>
@endfor
