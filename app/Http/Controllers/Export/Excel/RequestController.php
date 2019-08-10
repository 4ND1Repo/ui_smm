<?php

namespace App\Http\Controllers\Export\Excel;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

// Add Helper
use App\Helper\{Api,ExcelHelper};
use PhpOffice\PhpSpreadsheet\{Spreadsheet,Writer\Xlsx,Worksheet\MemoryDrawing,IOFactory};
use App\Helper\Template\Views;
use App\Helper\RestCurl;

class RequestController extends Controller{

    public function tools(Request $r){
      // initiate styling for header and body

      $spreadsheet = new Spreadsheet();
      $spreadsheet->getProperties()->setCreator("System SMM")
      ->setLastModifiedBy($r->nik)
      ->setTitle("Export Data");

      // set active sheet
      $sheet = $spreadsheet->setActiveSheetIndex(0);
      // Set sheet title
      $spreadsheet->getActiveSheet()->setTitle("Request Barang");

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
        ['title' => 'Kode Request', 'field' => 'req_tools_code', 'width' => 20, 'style' => 'center'],
        ['title' => 'Dari', 'field' => 'name_of_request', 'width' => 16, 'style' => 'center'],
        ['title' => 'Tanggal', 'field' => 'req_tools_date', 'width' => 16, 'style' => 'center'],
        ['title' => 'Jumlah Item', 'field' => 'sum_item', 'width' => 16, 'style' => 'right'],
        ['title' => 'Status', 'field' => 'status_label', 'width' => 16, 'style' => 'center']
      ];

      $detailData = [
        ['title' => 'Kode Barang', 'field' => 'stock_code', 'style' => 'center'],
        ['title' => 'Barang', 'field' => 'stock_name', 'style' => 'left'],
        ['title' => 'Tipe', 'field' => 'stock_type', 'style' => 'center'],
        ['title' => 'Ukuran', 'field' => 'stock_size', 'style' => 'center'],
        ['title' => 'Merek', 'field' => 'stock_brand', 'style' => 'left'],
        ['title' => 'Satuan', 'field' => 'measure_type', 'style' => 'center'],
        ['title' => 'Kuantiti', 'field' => 'req_tools_qty', 'style' => 'right'],
        ['title' => 'Keterangan', 'field' => 'req_tools_notes', 'style' => 'left']
      ];

      // config Header
      foreach ($headerTitle as $i => $row) {
        $col = ExcelHelper::getColumn($startAlpha, $i);
        $cellRow = $startRow;
        $sheet->setCellValue($col.$cellRow, $row['title']);

        // styling
        $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style('header'));
        if(isset($row['width']))
          $spreadsheet->getActiveSheet()->getColumnDimension($col)->setWidth($row['width']);
      }

      // get data from API
      $data = RestCurl::post($r->input('api')."/api/wh/req/tools/get", $r->except(['api']));
      if(count($data->data) > 0){
        $index = 0;
        foreach ($data->data as $i => $row) {
          $row = (array) $row;
          // content data
          foreach ($headerTitle as $j => $rows) {
            $col = ExcelHelper::getColumn($startAlpha, $j);
            $cellRow = (($startRow+1)+$i+$index);
            $sheet->setCellValue($col.$cellRow, $rows['field']=='incremental'?(1+$i):$row[$rows['field']]);
            if(ExcelHelper::style($rows['style']))
              $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style($rows['style']));
          }

          // get detail data
          $dataDetail = RestCurl::get($r->input('api')."/api/wh/req/tools/find/".$row[$headerTitle[1]['field']]);
          if(isset($dataDetail->data->data->request_tools_detail)){
            // header detail
            $index += 1;
            foreach ($detailData as $m => $row) {
              $col = ExcelHelper::getColumn('B', $m);
              $cellRow = (($startRow+1)+$i+$index);
              $sheet->setCellValue($col.$cellRow, $row['title']);
              // styling
              $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style('header'));
            }
            // data Detail
            foreach ($dataDetail->data->data->request_tools_detail as $k => $rowDetail) {
              $row = (array) $rowDetail;
              // content data
              $index += $k + 1;
              foreach ($detailData as $l => $rows) {
                $col = ExcelHelper::getColumn('B', $l);
                $cellRow = (($startRow+1)+$i+$index);
                $sheet->setCellValue($col.$cellRow, $row[$rows['field']]);
                if(ExcelHelper::style($rows['style']))
                  $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style($rows['style']));
              }
            }
          }
          $index++;
        }
      }


      $writer = new Xlsx($spreadsheet);

      header('Content-Type: application/vnd.ms-excel');
      header('Content-Disposition: attachment;filename="Request_Barang.xlsx"');
      header('Cache-Control: max-age=0');
      $writer->save("php://output");
    }

    public function po(Request $r){
      // initiate styling for header and body

      $spreadsheet = new Spreadsheet();
      $spreadsheet->getProperties()->setCreator("System SMM")
      ->setLastModifiedBy($r->nik)
      ->setTitle("Export Data");

      // set active sheet
      $sheet = $spreadsheet->setActiveSheetIndex(0);
      // Set sheet title
      $spreadsheet->getActiveSheet()->setTitle("Request PO");

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
        ['title' => 'Kode PO', 'field' => 'po_code', 'width' => 20, 'style' => 'center'],
        ['title' => 'Tanggal', 'field' => 'po_date', 'width' => 16, 'style' => 'center'],
        ['title' => 'Pembuat', 'field' => 'create_by', 'width' => 16, 'style' => 'center'],
        ['title' => 'Kepada', 'field' => 'page_name', 'width' => 16, 'style' => 'center'],
        ['title' => 'Jumlah Item', 'field' => 'sum_item', 'width' => 16, 'style' => 'right'],
        ['title' => 'Status', 'field' => 'status_label', 'width' => 16, 'style' => 'center'],
        ['title' => 'Alasan', 'field' => 'reason', 'width' => 24, 'style' => 'left']
      ];

      $detailData = [
        ['title' => 'Kode Barang', 'field' => 'stock_code', 'style' => 'center'],
        ['title' => 'Barang', 'field' => 'stock_name', 'style' => 'left'],
        ['title' => 'Tipe', 'field' => 'stock_type', 'style' => 'center'],
        ['title' => 'Ukuran', 'field' => 'stock_size', 'style' => 'center'],
        ['title' => 'Merek', 'field' => 'stock_brand', 'style' => 'left'],
        ['title' => 'Satuan', 'field' => 'measure_type', 'style' => 'center'],
        ['title' => 'Target Terima', 'field' => 'po_date_delivery', 'style' => 'center'],
        ['title' => 'Kuantiti', 'field' => 'po_qty', 'style' => 'right']
      ];

      // config Header
      foreach ($headerTitle as $i => $row) {
        $col = ExcelHelper::getColumn($startAlpha, $i);
        $cellRow = $startRow;
        $sheet->setCellValue($col.$cellRow, $row['title']);

        // styling
        $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style('header'));
        if(isset($row['width']))
          $spreadsheet->getActiveSheet()->getColumnDimension($col)->setWidth($row['width']);
      }

      // get data from API
      $data = RestCurl::post($r->input('api')."/api/wh/req/po/get", $r->except(['api']));
      if(count($data->data) > 0){
        $index = 0;
        foreach ($data->data as $i => $row) {
          $row = (array) $row;
          // content data
          foreach ($headerTitle as $j => $rows) {
            $col = ExcelHelper::getColumn($startAlpha, $j);
            $cellRow = (($startRow+1)+$i+$index);
            $sheet->setCellValue($col.$cellRow, $rows['field']=='incremental'?(1+$i):$row[$rows['field']]);
            if(ExcelHelper::style($rows['style']))
              $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style($rows['style']));
          }

          // get detail data
          $dataDetail = RestCurl::get($r->input('api')."/api/wh/req/po/find/".$row[$headerTitle[1]['field']]);
          if(isset($dataDetail->data->data->purchase_order_detail)){
            // header detail
            $index += 1;
            foreach ($detailData as $m => $row) {
              $col = ExcelHelper::getColumn('B', $m);
              $cellRow = (($startRow+1)+$i+$index);
              $sheet->setCellValue($col.$cellRow, $row['title']);
              // styling
              $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style('header'));
            }
            // data Detail
            foreach ($dataDetail->data->data->purchase_order_detail as $k => $rowDetail) {
              $row = (array) $rowDetail;
              // content data
              $index += $k + 1;
              foreach ($detailData as $l => $rows) {
                $col = ExcelHelper::getColumn('B', $l);
                $cellRow = (($startRow+1)+$i+$index);
                $sheet->setCellValue($col.$cellRow, $row[$rows['field']]);
                if(ExcelHelper::style($rows['style']))
                  $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style($rows['style']));
              }
            }
          }
          $index++;
        }
      }


      $writer = new Xlsx($spreadsheet);

      header('Content-Type: application/vnd.ms-excel');
      header('Content-Disposition: attachment;filename="Request_PO.xlsx"');
      header('Cache-Control: max-age=0');
      $writer->save("php://output");
    }

    public function do(Request $r){
      // initiate styling for header and body

      $spreadsheet = new Spreadsheet();
      $spreadsheet->getProperties()->setCreator("System SMM")
      ->setLastModifiedBy($r->nik)
      ->setTitle("Export Data");

      // set active sheet
      $sheet = $spreadsheet->setActiveSheetIndex(0);
      // Set sheet title
      $spreadsheet->getActiveSheet()->setTitle("Terima Barang");

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
        ['title' => 'Kode PO', 'field' => 'po_code', 'width' => 20, 'style' => 'center'],
        ['title' => 'Tanggal', 'field' => 'po_date', 'width' => 16, 'style' => 'center'],
        ['title' => 'Pembuat', 'field' => 'create_by', 'width' => 16, 'style' => 'center'],
        ['title' => 'Kepada', 'field' => 'page_name', 'width' => 16, 'style' => 'center'],
        ['title' => 'Jumlah Item', 'field' => 'sum_item', 'width' => 16, 'style' => 'right'],
        ['title' => 'Status', 'field' => 'status_label', 'width' => 16, 'style' => 'center']
      ];

      $detailData = [
        ['title' => 'Kode Barang', 'field' => 'stock_code', 'style' => 'center'],
        ['title' => 'Barang', 'field' => 'stock_name', 'style' => 'left'],
        ['title' => 'Tipe', 'field' => 'stock_type', 'style' => 'center'],
        ['title' => 'Ukuran', 'field' => 'stock_size', 'style' => 'center'],
        ['title' => 'Merek', 'field' => 'stock_brand', 'style' => 'left'],
        ['title' => 'Satuan', 'field' => 'measure_type', 'style' => 'center'],
        ['title' => 'Target Terima', 'field' => 'po_date_delivery', 'style' => 'center'],
        ['title' => 'Sisa Kuantiti', 'field' => 'qty', 'style' => 'right']
      ];

      // config Header
      foreach ($headerTitle as $i => $row) {
        $col = ExcelHelper::getColumn($startAlpha, $i);
        $cellRow = $startRow;
        $sheet->setCellValue($col.$cellRow, $row['title']);

        // styling
        $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style('header'));
        if(isset($row['width']))
          $spreadsheet->getActiveSheet()->getColumnDimension($col)->setWidth($row['width']);
      }

      // get data from API
      $data = RestCurl::post($r->input('api')."/api/wh/req/do/get", $r->except(['api']));
      if(count($data->data) > 0){
        $index = 0;
        foreach ($data->data as $i => $row) {
          $row = (array) $row;
          // content data
          foreach ($headerTitle as $j => $rows) {
            $col = ExcelHelper::getColumn($startAlpha, $j);
            $cellRow = (($startRow+1)+$i+$index);
            $sheet->setCellValue($col.$cellRow, $rows['field']=='incremental'?(1+$i):$row[$rows['field']]);
            if(ExcelHelper::style($rows['style']))
              $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style($rows['style']));
          }

          // get detail data
          $dataDetail = RestCurl::get($r->input('api')."/api/wh/req/do/find/".$row[$headerTitle[1]['field']]);
          if(isset($dataDetail->data->data->purchase_order_detail)){
            // header detail
            $index += 1;
            foreach ($detailData as $m => $row) {
              $col = ExcelHelper::getColumn('B', $m);
              $cellRow = (($startRow+1)+$i+$index);
              $sheet->setCellValue($col.$cellRow, $row['title']);
              // styling
              $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style('header'));
            }
            // data Detail
            foreach ($dataDetail->data->data->purchase_order_detail as $k => $rowDetail) {
              $row = (array) $rowDetail;
              // content data
              $index += $k + 1;
              foreach ($detailData as $l => $rows) {
                $col = ExcelHelper::getColumn('B', $l);
                $cellRow = (($startRow+1)+$i+$index);
                $sheet->setCellValue($col.$cellRow, $row[$rows['field']]);
                if(ExcelHelper::style($rows['style']))
                  $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style($rows['style']));
              }
            }
          }
          $index++;
        }
      }


      $writer = new Xlsx($spreadsheet);

      header('Content-Type: application/vnd.ms-excel');
      header('Content-Disposition: attachment;filename="Terima_Barang.xlsx"');
      header('Cache-Control: max-age=0');
      $writer->save("php://output");
    }

    public function po_pur(Request $r){
      // initiate styling for header and body

      $spreadsheet = new Spreadsheet();
      $spreadsheet->getProperties()->setCreator("System SMM")
      ->setLastModifiedBy($r->nik)
      ->setTitle("Export Data");

      // set active sheet
      $sheet = $spreadsheet->setActiveSheetIndex(0);
      // Set sheet title
      $spreadsheet->getActiveSheet()->setTitle("Request PO");

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
        ['title' => 'Kode PO', 'field' => 'po_code', 'width' => 20, 'style' => 'center'],
        ['title' => 'Tanggal', 'field' => 'po_date', 'width' => 16, 'style' => 'center'],
        ['title' => 'Pembuat', 'field' => 'create_by', 'width' => 16, 'style' => 'center'],
        ['title' => 'Kepada', 'field' => 'page_name', 'width' => 16, 'style' => 'center'],
        ['title' => 'Jumlah Item', 'field' => 'sum_item', 'width' => 16, 'style' => 'right'],
        ['title' => 'Status', 'field' => 'status_label', 'width' => 16, 'style' => 'center'],
        ['title' => 'Alasan', 'field' => 'reason', 'width' => 24, 'style' => 'left']
      ];

      $detailData = [
        ['title' => 'Kode Barang', 'field' => 'stock_code', 'style' => 'center'],
        ['title' => 'Barang', 'field' => 'stock_name', 'style' => 'left'],
        ['title' => 'Tipe', 'field' => 'stock_type', 'style' => 'center'],
        ['title' => 'Ukuran', 'field' => 'stock_size', 'style' => 'center'],
        ['title' => 'Merek', 'field' => 'stock_brand', 'style' => 'left'],
        ['title' => 'Satuan', 'field' => 'measure_type', 'style' => 'center'],
        ['title' => 'Target Kirim', 'field' => 'po_date_delivery', 'style' => 'center'],
        ['title' => 'Kuantiti', 'field' => 'po_qty', 'style' => 'right'],
        ['title' => 'Supplier', 'field' => 'supplier_name', 'style' => 'left'],
        ['title' => 'Harga', 'field' => 'stock_price', 'style' => 'right']
      ];

      // config Header
      foreach ($headerTitle as $i => $row) {
        $col = ExcelHelper::getColumn($startAlpha, $i);
        $cellRow = $startRow;
        $sheet->setCellValue($col.$cellRow, $row['title']);

        // styling
        $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style('header'));
        if(isset($row['width']))
          $spreadsheet->getActiveSheet()->getColumnDimension($col)->setWidth($row['width']);
      }

      // get data from API
      $data = RestCurl::post($r->input('api')."/api/pur/req/po/get", $r->except(['api']));
      if(count($data->data) > 0){
        $index = 0;
        foreach ($data->data as $i => $row) {
          $row = (array) $row;
          // content data
          foreach ($headerTitle as $j => $rows) {
            $col = ExcelHelper::getColumn($startAlpha, $j);
            $cellRow = (($startRow+1)+$i+$index);
            $sheet->setCellValue($col.$cellRow, $rows['field']=='incremental'?(1+$i):$row[$rows['field']]);
            if(ExcelHelper::style($rows['style']))
              $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style($rows['style']));
          }

          // get detail data
          $dataDetail = RestCurl::get($r->input('api')."/api/pur/req/po/find/".$row[$headerTitle[1]['field']]);
          if(isset($dataDetail->data->data->purchase_order_detail)){
            // header detail
            $index += 1;
            foreach ($detailData as $m => $row) {
              $col = ExcelHelper::getColumn('B', $m);
              $cellRow = (($startRow+1)+$i+$index);
              $sheet->setCellValue($col.$cellRow, $row['title']);
              // styling
              $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style('header'));
            }
            // data Detail
            foreach ($dataDetail->data->data->purchase_order_detail as $k => $rowDetail) {
              $row = (array) $rowDetail;
              // content data
              $index += $k + 1;
              foreach ($detailData as $l => $rows) {
                $col = ExcelHelper::getColumn('B', $l);
                $cellRow = (($startRow+1)+$i+$index);
                $sheet->setCellValue($col.$cellRow, $row[$rows['field']]);
                if(ExcelHelper::style($rows['style']))
                  $spreadsheet->getActiveSheet()->getStyle($col.$cellRow)->applyFromArray(ExcelHelper::style($rows['style']));
              }
            }
          }
          $index++;
        }
      }


      $writer = new Xlsx($spreadsheet);

      header('Content-Type: application/vnd.ms-excel');
      header('Content-Disposition: attachment;filename="Request_PO.xlsx"');
      header('Cache-Control: max-age=0');
      $writer->save("php://output");
    }

    public function history_po_pur(Request $r){
      // initiate styling for header and body

      $spreadsheet = new Spreadsheet();
      $spreadsheet->getProperties()->setCreator("System SMM")
      ->setLastModifiedBy($r->nik)
      ->setTitle("Export Data");

      // set active sheet
      $sheet = $spreadsheet->setActiveSheetIndex(0);
      // Set sheet title
      $spreadsheet->getActiveSheet()->setTitle("Riwayat PO");

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
        ['title' => 'Kode PO', 'field' => 'po_code', 'width' => 20, 'style' => 'center'],
        ['title' => 'Tanggal', 'field' => 'po_date', 'width' => 16, 'style' => 'center'],
        ['title' => 'Surat Jalan', 'field' => 'do_code', 'width' => 20, 'style' => 'center'],
        ['title' => 'Kode Barang', 'field' => 'stock_code', 'width' => 20, 'style' => 'center'],
        ['title' => 'Barang', 'field' => 'stock_name', 'width' => 24, 'style' => 'left'],
        ['title' => 'Ukuran', 'field' => 'stock_size', 'width' => 16, 'style' => 'center'],
        ['title' => 'Merek', 'field' => 'stock_brand', 'width' => 16, 'style' => 'left'],
        ['title' => 'Tipe', 'field' => 'stock_type', 'width' => 16, 'style' => 'center'],
        ['title' => 'Warna', 'field' => 'stock_color', 'width' => 16, 'style' => 'center'],
        ['title' => 'Kuantiti Masuk', 'field' => 'do_qty', 'width' => 10, 'style' => 'right'],
        ['title' => 'Satuan', 'field' => 'measure_type', 'width' => 10, 'style' => 'center'],
        ['title' => 'Harga', 'field' => 'stock_price', 'width' => 10, 'style' => 'right'],
        ['title' => 'Status', 'field' => 'status_label', 'width' => 10, 'style' => 'center'],
        ['title' => 'Diselesaikan Oleh', 'field' => 'finish_by', 'width' => 16, 'style' => 'left'],
        ['title' => 'Pada Tanggal', 'field' => 'finish_date', 'width' => 16, 'style' => 'center']
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
      $data = RestCurl::post($r->input('api')."/api/pur/req/po/history/get", $r->except(['api']));
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
      header('Content-Disposition: attachment;filename="Riwayat_PO.xlsx"');
      header('Cache-Control: max-age=0');
      $writer->save("php://output");
    }

}
