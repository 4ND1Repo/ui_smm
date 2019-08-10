<?php

namespace App\Http\Controllers\Warehouse;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

// Add Helper
use App\Helper\Template\Views;
use App\Helper\{Api,ExcelHelper};
use PhpOffice\PhpSpreadsheet\{Spreadsheet,Writer\Xlsx,Worksheet\MemoryDrawing,IOFactory};

class MainController extends Controller{

    public function index(Request $r, Views $v){
        // validate user is login
        $v::js_head([
            'js/authentication/storage.js',
            'js/authentication/validate.js'
        ]);

        $v::all_css();
        $v::all_js();

        $v::css([
            'css/demo1/pages/general/login/login-1.css',
            'css/demo1/style.bundle.css',
            'css/demo1/skins/header/base/light.css',
            'css/demo1/skins/header/menu/light.css',
            'css/demo1/skins/brand/dark.css',
            'css/demo1/skins/aside/dark.css'
        ]);
        $v::js([
            'vendors/custom/fullcalendar/fullcalendar.bundle.js',
            'vendors/custom/gmaps/gmaps.js',
            'js/demo1/pages/dashboard.js',
            'js/library/dashboard.js'
        ]);
        $v::page('warehouse.dashboard');

        return View('admin',$v::colect());
    }

    public function master_stock(Request $r, Views $v){
        // validate user is login
        $v::js_head([
            'js/authentication/storage.js',
            'js/authentication/validate.js'
        ]);

        $v::all_css();
        $v::all_js();

        $v::css([
            'css/demo1/pages/general/login/login-1.css',
            'css/demo1/style.bundle.css',
            'css/demo1/skins/header/base/light.css',
            'css/demo1/skins/header/menu/light.css',
            'css/demo1/skins/brand/dark.css',
            'css/demo1/skins/aside/dark.css'
        ]);
        $v::js([
            'js/warehouse/stock.js'
        ]);
        $v::page('warehouse.master.stock');

        return View('admin',$v::colect());
    }

    public function master_measure(Request $r, Views $v){
        // validate user is login
        $v::js_head([
            'js/authentication/storage.js',
            'js/authentication/validate.js'
        ]);

        $v::all_css();
        $v::all_js();

        $v::css([
            'css/demo1/pages/general/login/login-1.css',
            'css/demo1/style.bundle.css',
            'css/demo1/skins/header/base/light.css',
            'css/demo1/skins/header/menu/light.css',
            'css/demo1/skins/brand/dark.css',
            'css/demo1/skins/aside/dark.css'
        ]);
        $v::js([
            'js/warehouse/measure.js'
        ]);
        $v::page('warehouse.master.measure');

        return View('admin',$v::colect());
    }

    public function master_category(Request $r, Views $v){
        // validate user is login
        $v::js_head([
            'js/authentication/storage.js',
            'js/authentication/validate.js'
        ]);

        $v::all_css();
        $v::all_js();

        $v::css([
            'css/demo1/pages/general/login/login-1.css',
            'css/demo1/style.bundle.css',
            'css/demo1/skins/header/base/light.css',
            'css/demo1/skins/header/menu/light.css',
            'css/demo1/skins/brand/dark.css',
            'css/demo1/skins/aside/dark.css'
        ]);
        $v::js([
            'js/warehouse/category.js'
        ]);
        $v::page('warehouse.master.category');

        return View('admin',$v::colect());
    }

    public function stock_dashboard(Request $r, Views $v){
        // validate user is login
        $v::js_head([
            'js/authentication/storage.js',
            'js/authentication/validate.js'
        ]);

        $v::all_css();
        $v::all_js();

        $v::css([
            'css/demo1/pages/general/login/login-1.css',
            'css/demo1/style.bundle.css',
            'css/demo1/skins/header/base/light.css',
            'css/demo1/skins/header/menu/light.css',
            'css/demo1/skins/brand/dark.css',
            'css/demo1/skins/aside/dark.css',
            'vendors/custom/jstree/jstree.bundle.css',
            'vendors/custom/hover/hover.css'
        ]);
        $v::js([
            'vendors/custom/jstree/jstree.bundle.js',
            'js/warehouse/stock_dashboard_new.js'
        ]);
        $v::page('warehouse.stock.dashboard_new');

        return View('admin',$v::colect());
    }

    public function stock(Request $r, Views $v){
        // validate user is login
        $v::js_head([
            'js/authentication/storage.js',
            'js/authentication/validate.js'
        ]);

        $v::all_css();
        $v::all_js();

        $v::css([
            'css/demo1/pages/general/login/login-1.css',
            'css/demo1/style.bundle.css',
            'css/demo1/skins/header/base/light.css',
            'css/demo1/skins/header/menu/light.css',
            'css/demo1/skins/brand/dark.css',
            'css/demo1/skins/aside/dark.css'
        ]);
        $v::js([
            'js/warehouse/stock_list.js'
        ]);
        $v::page('warehouse.stock.stock');

        return View('admin',$v::colect());
    }

    public function history(Request $r, Views $v){
        // validate user is login
        $v::js_head([
            'js/authentication/storage.js',
            'js/authentication/validate.js'
        ]);

        $v::all_css();
        $v::all_js();

        $v::css([
            'css/demo1/pages/general/login/login-1.css',
            'css/demo1/style.bundle.css',
            'css/demo1/skins/header/base/light.css',
            'css/demo1/skins/header/menu/light.css',
            'css/demo1/skins/brand/dark.css',
            'css/demo1/skins/aside/dark.css'
        ]);
        $v::js([
            'js/warehouse/stock_history.js'
        ]);
        $v::page('warehouse.stock.history');

        return View('admin',$v::colect());
    }

    public function list_buy(Request $r, Views $v){
        // validate user is login
        $v::js_head([
            'js/authentication/storage.js',
            'js/authentication/validate.js'
        ]);

        $v::all_css();
        $v::all_js();

        $v::css([
            'css/demo1/pages/general/login/login-1.css',
            'css/demo1/style.bundle.css',
            'css/demo1/skins/header/base/light.css',
            'css/demo1/skins/header/menu/light.css',
            'css/demo1/skins/brand/dark.css',
            'css/demo1/skins/aside/dark.css'
        ]);
        $v::js([
            'js/warehouse/list_buy.js'
        ]);
        $v::page('warehouse.stock.list_buy');

        return View('admin',$v::colect());
    }

    public function opname(Request $r, Views $v){
        // validate user is login
        $v::js_head([
            'js/authentication/storage.js',
            'js/authentication/validate.js'
        ]);

        $v::all_css();
        $v::all_js();

        $v::css([
            'css/demo1/pages/general/login/login-1.css',
            'css/demo1/style.bundle.css',
            'css/demo1/skins/header/base/light.css',
            'css/demo1/skins/header/menu/light.css',
            'css/demo1/skins/brand/dark.css',
            'css/demo1/skins/aside/dark.css'
        ]);
        $v::js([
            'js/warehouse/opname.js'
        ]);
        $v::page('warehouse.stock.opname');

        return View('admin',$v::colect());
    }

    public function po(Request $r, Views $v){
        // validate user is login
        $v::js_head([
            'js/authentication/storage.js',
            'js/authentication/validate.js'
        ]);

        $v::all_css();
        $v::all_js();

        $v::css([
            'css/demo1/pages/general/login/login-1.css',
            'css/demo1/style.bundle.css',
            'css/demo1/skins/header/base/light.css',
            'css/demo1/skins/header/menu/light.css',
            'css/demo1/skins/brand/dark.css',
            'css/demo1/skins/aside/dark.css'
        ]);
        $v::js(['js/warehouse/po.js']);
        $v::page('warehouse.request.po');

        return View('admin',$v::colect());
    }

    public function do(Request $r, Views $v){
        // validate user is login
        $v::js_head([
            'js/authentication/storage.js',
            'js/authentication/validate.js'
        ]);

        $v::all_css();
        $v::all_js();

        $v::css([
            'css/demo1/pages/general/login/login-1.css',
            'css/demo1/style.bundle.css',
            'css/demo1/skins/header/base/light.css',
            'css/demo1/skins/header/menu/light.css',
            'css/demo1/skins/brand/dark.css',
            'css/demo1/skins/aside/dark.css'
        ]);
        $v::js(['js/warehouse/do.js']);
        $v::page('warehouse.request.do');

        return View('admin',$v::colect());
    }

    public function tools(Request $r, Views $v){
        // validate user is login
        $v::js_head([
            'js/authentication/storage.js',
            'js/authentication/validate.js'
        ]);

        $v::all_css();
        $v::all_js();

        $v::css([
            'css/demo1/pages/general/login/login-1.css',
            'css/demo1/style.bundle.css',
            'css/demo1/skins/header/base/light.css',
            'css/demo1/skins/header/menu/light.css',
            'css/demo1/skins/brand/dark.css',
            'css/demo1/skins/aside/dark.css'
        ]);
        $v::js(['js/warehouse/request_tools.js']);
        $v::page('warehouse.request.tools');

        return View('admin',$v::colect());
    }

    public function export(Request $r){
        // initiate styling for header and body
        $styleHeader = [
            'font' => [
                'bold' => true,
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
            ],
            'borders' => [
                'outline' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN
                ]
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'color' => [
                    'argb' => 'FFA0A0A0',
                ]
            ],
        ];
        $style = [
          'center' => [
              'alignment' => [
                  'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
              ],
              'borders' => [
                  'outline' => [
                      'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN
                  ]
              ],
          ],
          'right' => [
              'alignment' => [
                  'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT,
              ],
              'borders' => [
                  'outline' => [
                      'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN
                  ]
              ],
          ],
          'left' => [
              'alignment' => [
                  'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
              ],
              'borders' => [
                  'outline' => [
                      'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN
                  ]
              ],
          ],
        ];


        $spreadsheet = new Spreadsheet();
        $spreadsheet->getProperties()->setCreator("System SMM")
        ->setLastModifiedBy($r->nik)
        ->setTitle("Export Data");

        // set active sheet
        $sheet = $spreadsheet->setActiveSheetIndex(0);
        // Set sheet title
        $spreadsheet->getActiveSheet()->setTitle("export");

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
        $objDrawing1->setName('Sample image');
        $objDrawing1->setDescription('Sample image');
        $objDrawing1->setImageResource($target);
        $objDrawing1->setRenderingFunction(MemoryDrawing::RENDERING_PNG);
        $objDrawing1->setMimeType(MemoryDrawing::MIMETYPE_DEFAULT);
        $objDrawing1->setCoordinates("A1");
        $objDrawing1->setWorksheet($spreadsheet->getActiveSheet());

        $startRow = 6;
        $startAlpha = 'A';
        $this->level = 0;
        $headerTitle = [
          ['title' => 'No.', 'align' => 'center', 'width' => 5],
          ['title' => 'Barang', 'align' => 'center', 'width' => 24],
          ['title' => 'Ukuran', 'align' => 'center', 'width' => 17],
          ['title' => 'Tipe', 'align' => 'center'],
          ['title' => 'Merek', 'align' => 'center'],
          ['title' => 'Satuan', 'align' => 'center']
        ];

        // config Header
        foreach ($headerTitle as $i => $row) {
          $col = ExcelHelper::getColumn($startAlpha, $i);
          $sheet->setCellValue($col.$startRow, $row['title']);

          // styling
          $spreadsheet->getActiveSheet()->getStyle($col.$startRow)->applyFromArray($styleHeader);
          if(isset($row['width']))
            $spreadsheet->getActiveSheet()->getColumnDimension($col)->setWidth($row['width']);
        }

        // content data
        $sheet->setCellValue('A7', 1);
        $spreadsheet->getActiveSheet()->getStyle('A7')->applyFromArray($style['center']);
        $sheet->setCellValue('B7', 'Hello '.$r->nik.' !');
        $spreadsheet->getActiveSheet()->getStyle('B7')->applyFromArray($style['right']);

        $writer = new Xlsx($spreadsheet);

        header('Content-Type: application/vnd.ms-excel');
    		header('Content-Disposition: attachment;filename="export.xlsx"');
    		header('Cache-Control: max-age=0');
        $writer->save("php://output");
    }

}
