<?php

namespace App\Http\Controllers\Export\Excel;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

// Add Helper
use App\Helper\{Api,ExcelHelper};
use PhpOffice\PhpSpreadsheet\{Spreadsheet,Writer\Xlsx,Worksheet\MemoryDrawing,IOFactory};
use App\Helper\Template\Views;
use App\Helper\RestCurl;

class PurchasingController extends Controller{

    public function do(Request $r){
      // initiate styling for header and body

      $spreadsheet = new Spreadsheet();
      $spreadsheet->getProperties()->setCreator("System SMM")
      ->setLastModifiedBy($r->nik)
      ->setTitle("Export Data");

      // set active sheet
      $sheet = $spreadsheet->setActiveSheetIndex(0);
      // Set sheet title
      $spreadsheet->getActiveSheet()->setTitle("Stock");

      // get image
      $path = public_path('assets/media/logos/logo-smm.png');
      $type = pathinfo($path, PATHINFO_EXTENSION);
      $data = file_get_contents($path);
      $image = 'data:image/' . $type . ';base64,' . base64_encode($data);

      $orig = imagecreatefrompng($image);
      $imgWidth = imagesx($orig);
      $imgHeight = imagesy($orig);
      $newImgWidth = 200;
      $newImgHeight = $imgHeight*($newImgWidth/$imgWidth);
      $target = imagecreatetruecolor($newImgWidth, $newImgHeight);
      imagealphablending($target, false);
      imagesavealpha($target, true);
      imagecopyresampled($target, $orig, 0, 0, 0, 0, $newImgWidth, $newImgHeight, $imgWidth, $imgHeight);

      $objDrawing1 = new MemoryDrawing();
      $objDrawing1->setName('SMM');
      $objDrawing1->setDescription('SMM');
      $objDrawing1->setImageResource($target);
      $objDrawing1->setRenderingFunction(MemoryDrawing::RENDERING_PNG);
      $objDrawing1->setMimeType(MemoryDrawing::MIMETYPE_DEFAULT);
      $objDrawing1->setCoordinates("A1");
      $objDrawing1->setWorksheet($spreadsheet->getActiveSheet());

      $startRow = 6;
      $startAlpha = 'A';
      $headerTitle = [
        ['title' => 'No.', 'field' => 'incremental', 'width' => 5, 'style' => 'center'],
        ['title' => 'Surat Jalan', 'field' => 'do_code', 'width' => 16, 'style' => 'center'],
        ['title' => 'Nomor PO', 'field' => 'po_code', 'width' => 16, 'style' => 'center'],
        ['title' => 'Tanggal SJ', 'field' => 'create_date', 'width' => 16, 'style' => 'left'],
        ['title' => 'Kode Barang', 'field' => 'stock_code', 'width' => 16, 'style' => 'left'],
        ['title' => 'Nama Barang', 'field' => 'stock_name', 'width' => 24, 'style' => 'left'],
        ['title' => 'Ukuran', 'field' => 'stock_size', 'width' => 14, 'style' => 'center'],
        ['title' => 'Tipe', 'field' => 'stock_type', 'width' => 14, 'style' => 'left'],
        ['title' => 'Merek', 'field' => 'stock_brand', 'width' => 16, 'style' => 'left'],
        ['title' => 'Warna', 'field' => 'stock_color', 'width' => 10, 'style' => 'center'],
        ['title' => 'Kuantiti Masuk', 'field' => 'do_qty', 'width' => 10, 'style' => 'right']
      ];

      // config Header
      foreach ($headerTitle as $i => $row) {
        $col = ExcelHelper::getColumn($startAlpha, $i);
        $sheet->setCellValue($col.$startRow, $row['title']);

        // styling
        $spreadsheet->getActiveSheet()->getStyle($col.$startRow)->applyFromArray(ExcelHelper::style('header'));
        if(isset($row['width']))
          $spreadsheet->getActiveSheet()->getColumnDimension($col)->setWidth($row['width']);
      }

      // get data from API
      $data = RestCurl::post($r->input('api')."/api/pur/req/do/get", $r->except(['api']));
      if(count($data->data) > 0){
        foreach ($data->data as $i => $row) {
          $row = (array) $row;
          // content data
          foreach ($headerTitle as $j => $rows) {
            $col = ExcelHelper::getColumn($startAlpha, $j);
            $sheet->setCellValue($col.(($startRow+1)+$i), $rows['field']=='incremental'?(1+$i):$row[$rows['field']]);
            if(ExcelHelper::style($rows['style']))
              $spreadsheet->getActiveSheet()->getStyle($col.(($startRow+1)+$i))->applyFromArray(ExcelHelper::style($rows['style']));
          }
        }
      }


      $writer = new Xlsx($spreadsheet);

      header('Content-Type: application/vnd.ms-excel');
      header('Content-Disposition: attachment;filename="Surat_Jalan.xlsx"');
      header('Cache-Control: max-age=0');
      $writer->save("php://output");
    }

}
