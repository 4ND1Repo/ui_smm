<?php

namespace App\Http\Controllers\Export\Excel;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

// Add Helper
use App\Helper\{Api,ExcelHelper};
use PhpOffice\PhpSpreadsheet\{Spreadsheet,Writer\Xlsx,Worksheet\MemoryDrawing,IOFactory};
use App\Helper\Template\Views;
use App\Helper\RestCurl;

class MainController extends Controller{

    public function mst_stock(Request $r){
      // initiate styling for header and body

      $spreadsheet = new Spreadsheet();
      $spreadsheet->getProperties()->setCreator("System SMM")
      ->setLastModifiedBy($r->nik)
      ->setTitle("Export Data");

      // set active sheet
      $sheet = $spreadsheet->setActiveSheetIndex(0);
      // Set sheet title
      $spreadsheet->getActiveSheet()->setTitle("Master Stock");

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
        ['title' => 'Kode Barang', 'field' => 'stock_code', 'width' => 20, 'style' => 'center'],
        ['title' => 'Barang', 'field' => 'stock_name', 'width' => 24, 'style' => 'left'],
        ['title' => 'Ukuran', 'field' => 'stock_size', 'width' => 16, 'style' => 'center'],
        ['title' => 'Tipe', 'field' => 'stock_type', 'width' => 16, 'style' => 'center'],
        ['title' => 'Merek', 'field' => 'stock_brand', 'width' => 24, 'style' => 'left'],
        ['title' => 'Warna', 'field' => 'stock_color', 'width' => 16, 'style' => 'left'],
        ['title' => 'Minimum', 'field' => 'stock_min_qty', 'width' => 14, 'style' => 'right'],
        ['title' => 'Satuan', 'field' => 'measure_type', 'width' => 16, 'style' => 'center'],
        ['title' => 'Pinjaman', 'field' => 'stock_daily_use', 'width' => 10, 'style' => 'center']
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
      $data = RestCurl::post($r->input('api')."/api/mst/stock/get", $r->except(['api']));
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
      header('Content-Disposition: attachment;filename="Master_Barang.xlsx"');
      header('Cache-Control: max-age=0');
      $writer->save("php://output");
    }

    public function mst_measure(Request $r){
      // initiate styling for header and body

      $spreadsheet = new Spreadsheet();
      $spreadsheet->getProperties()->setCreator("System SMM")
      ->setLastModifiedBy($r->nik)
      ->setTitle("Export Data");

      // set active sheet
      $sheet = $spreadsheet->setActiveSheetIndex(0);
      // Set sheet title
      $spreadsheet->getActiveSheet()->setTitle("Master Satuan");

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
        ['title' => 'Kode Satuan', 'field' => 'measure_code', 'width' => 20, 'style' => 'center'],
        ['title' => 'Satuan', 'field' => 'measure_type', 'width' => 24, 'style' => 'left']
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
      $data = RestCurl::post($r->input('api')."/api/mst/measure/get", $r->except(['api']));
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
      header('Content-Disposition: attachment;filename="Master_Satuan.xlsx"');
      header('Cache-Control: max-age=0');
      $writer->save("php://output");
    }

    public function mst_category(Request $r){
      // initiate styling for header and body

      $spreadsheet = new Spreadsheet();
      $spreadsheet->getProperties()->setCreator("System SMM")
      ->setLastModifiedBy($r->nik)
      ->setTitle("Export Data");

      // set active sheet
      $sheet = $spreadsheet->setActiveSheetIndex(0);
      // Set sheet title
      $spreadsheet->getActiveSheet()->setTitle("Master Kategori");

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
        ['title' => 'Kode Kategori', 'field' => 'category_code', 'width' => 20, 'style' => 'center'],
        ['title' => 'Kategori', 'field' => 'category_name', 'width' => 24, 'style' => 'left']
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
      $data = RestCurl::post($r->input('api')."/api/mst/category/get", $r->except(['api']));
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
      header('Content-Disposition: attachment;filename="Master_Kategori.xlsx"');
      header('Cache-Control: max-age=0');
      $writer->save("php://output");
    }

    public function mst_supplier(Request $r){
      // initiate styling for header and body

      $spreadsheet = new Spreadsheet();
      $spreadsheet->getProperties()->setCreator("System SMM")
      ->setLastModifiedBy($r->nik)
      ->setTitle("Export Data");

      // set active sheet
      $sheet = $spreadsheet->setActiveSheetIndex(0);
      // Set sheet title
      $spreadsheet->getActiveSheet()->setTitle("Master Supplier");

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
        ['title' => 'Kode Supplier', 'field' => 'supplier_code', 'width' => 20, 'style' => 'center'],
        ['title' => 'Supplier', 'field' => 'supplier_name', 'width' => 24, 'style' => 'left'],
        ['title' => 'Telepon', 'field' => 'supplier_phone', 'width' => 16, 'style' => 'center'],
        ['title' => 'Alamat', 'field' => 'supplier_address', 'width' => 24, 'style' => 'left'],
        ['title' => 'Kota', 'field' => 'city_name', 'width' => 16, 'style' => 'center'],
        ['title' => 'Kategori', 'field' => 'supplier_category', 'width' => 10, 'style' => 'center'],
        ['title' => 'NPWP', 'field' => 'supplier_npwp', 'width' => 20, 'style' => 'center']
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
      $data = RestCurl::post($r->input('api')."/api/mst/supplier/get", $r->except(['api']));
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
      header('Content-Disposition: attachment;filename="Master_Supplier.xlsx"');
      header('Cache-Control: max-age=0');
      $writer->save("php://output");
    }

    public function mst_city(Request $r){
      // initiate styling for header and body

      $spreadsheet = new Spreadsheet();
      $spreadsheet->getProperties()->setCreator("System SMM")
      ->setLastModifiedBy($r->nik)
      ->setTitle("Export Data");

      // set active sheet
      $sheet = $spreadsheet->setActiveSheetIndex(0);
      // Set sheet title
      $spreadsheet->getActiveSheet()->setTitle("Master Kota");

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
        ['title' => 'Kode Kota', 'field' => 'city_code', 'width' => 10, 'style' => 'center'],
        ['title' => 'Nama Kota', 'field' => 'city_name', 'width' => 24, 'style' => 'left']
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
      $data = RestCurl::post($r->input('api')."/api/mst/city/get", $r->except(['api']));
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
      header('Content-Disposition: attachment;filename="Master_Kota.xlsx"');
      header('Cache-Control: max-age=0');
      $writer->save("php://output");
    }

}
