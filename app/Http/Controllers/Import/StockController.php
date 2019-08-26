<?php

namespace App\Http\Controllers\Import;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

// Add Helper
use App\Helper\{Api,ExcelHelper};
use PhpOffice\PhpSpreadsheet\{Spreadsheet,Writer\Xlsx,Worksheet\MemoryDrawing,IOFactory, Reader\Xlsx AS ReaderXlsx};
use App\Helper\Template\Views;
use App\Helper\RestCurl;

class StockController extends Controller{

    public function stock(Request $r){
      $file = $_FILES['file'];
      $sheet = [];
      $fields = [
        'id',
        'stock_code',
        'category_code',
        'stock_name',
        'stock_size',
        'stock_type',
        'stock_brand',
        'stock_color',
        'stock_min_qty',
        'measure_code',
        'stock_daily_use',
        'qty'
      ];

      $reader = new ReaderXlsx();
      $reader->setReadDataOnly(true);
      $spreadsheet = $reader->load($file['tmp_name']);

      foreach ($spreadsheet->getWorksheetIterator() as $i => $worksheet) {
        $sheet['stock'] = [];
        foreach ($worksheet->getRowIterator() as $k => $row) {
          if($row->getRowIndex() >= 2){
            $cellIterator = $row->getCellIterator();
            $cellIterator->setIterateOnlyExistingCells(false);
            $i = 0;
            foreach ($cellIterator as $l => $cell) {
              $sheet['stock'][$k][$fields[$i]] = $cell->getCalculatedValue();
              $i++;
            }
          }
        }
      }

      $res = RestCurl::post($r->api."/api/wh/import/stock", ['data' => $sheet['stock'], 'nik' => $r->nik, 'page_code' => $r->page_code]);

      if($res->status == 200)
        return response()->json(Api::response($res->data->status,$res->data->message),200);
      else
        return response()->json(Api::response(false,'Gagal Upload'),200);
    }

    public function qty(Request $r){
      $file = $_FILES['file'];
      $sheet = [];
      $fields = [
        'id',
        'stock_code',
        'category_code',
        'stock_name',
        'stock_size',
        'stock_type',
        'stock_brand',
        'stock_color',
        'stock_min_qty',
        'measure_code',
        'stock_daily_use',
        'qty'
      ];

      $reader = new ReaderXlsx();
      $reader->setReadDataOnly(true);
      $spreadsheet = $reader->load($file['tmp_name']);

      foreach ($spreadsheet->getWorksheetIterator() as $i => $worksheet) {
        $sheet['stock'] = [];
        foreach ($worksheet->getRowIterator() as $k => $row) {
          if($row->getRowIndex() >= 2){
            $cellIterator = $row->getCellIterator();
            $cellIterator->setIterateOnlyExistingCells(false);
            $i = 0;
            foreach ($cellIterator as $l => $cell) {
              $sheet['stock'][$k][$fields[$i]] = $cell->getCalculatedValue();
              $i++;
            }
          }
        }
      }

      $res = RestCurl::post($r->api."/api/wh/import/qty", ['data' => $sheet['stock'], 'nik' => $r->nik, 'page_code' => $r->page_code]);

      if($res->status == 200)
        return response()->json(Api::response($res->data->status,$res->data->message),200);
      else
        return response()->json(Api::response(false,'Gagal Upload'),200);
    }

}
