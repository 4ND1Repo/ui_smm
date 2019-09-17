<?php

namespace App\Http\Controllers\Purchasing;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

// Add Helper
use PDF;
use URL;
use App\Helper\RestCurl;
use App\Helper\Template\Views;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

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
        $v::js([
            'js/purchasing/request/po.js'
        ]);
        $v::page('purchasing.request.po');

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
            'js/purchasing/request/po_history.js'
        ]);
        $v::page('purchasing.request.po_history');

        return View('admin',$v::colect());
    }

    public function print_po(Request $r, Views $v){
        $v::page('purchasing.request.po_print');

        $tmp = RestCurl::post($r->get('api')."/api/pur/req/po/print_data", ['po_code' => $r->get('po_code'), 'supplier_code' => $r->get('supplier_code')]);
        if($tmp->status == 200){
          $nik = RestCurl::post($r->get('api')."/api/account/user/biodata", ['nik' => $r->get('nik')]);
          if($nik->data->status !== 0 && $nik->data->status !== false)
            $v::data(['pur' => $tmp->data->data, 'nik' => $nik->data->data]);
          else {
            return response()->json(['status' => 0, 'message' => 'Biodata belum diisi'],200);
          }
          // dd($tmp->data->data);
        } else {
            return response()->json(['status' => 0, 'message' => 'Kesalahan sistem'],200);
        }
        $html = View('template.print',$v::colect())->render();

        // dompdf
        // if($r->get('die'))
          // echo $html; die();
        $pdf = PDF::loadHTML($html);
        $pdf->setOptions([
          'isHtml5ParserEnabled' => true,
          'isFontSubsettingEnabled' => true,
          'isPhpEnabled' => true,
          'tempDir' => storage_path(),
          'fontDir' => storage_path()
        ]);
        // $pdf->setPaper('a4', 'portrait');
        header('Content-Type: application/pdf');
        header('Cache-Control: max-age=0');

        // mpdf
        // $mpdf = new \Mpdf\Mpdf(['tempDir' => storage_path()]);
        // $mpdf->WriteHTML($html);$r->nik
        // return $mpdf->Output();


        // $pdf = $pdf->output();
        // $pdf->stream();
        return $pdf->stream($r->get('po_code')."_".$r->get('supplier_code').'.pdf');
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
        $v::js(['js/purchasing/request/do.js']);
        $v::page('purchasing.request.do');

        return View('admin',$v::colect());
    }

    public function manual_print(Request $r, Views $v){
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
        $v::js(['js/purchasing/request/manual_print.js']);
        $v::page('purchasing.request.manual_print');

        return View('admin',$v::colect());
    }

    public function manual_print_po(Request $r, Views $v){
        $v::page('purchasing.request.manual_po_print');
        $tmp = RestCurl::post($r->get('api')."/api/pur/req/po/print/get", $r->post());

        if($tmp->status == 200){
            $v::data($tmp->data);
        }
        $html = View('template.print',$v::colect())->render();

        // dompdf
        $pdf = PDF::loadHTML($html);
        $pdf->setOptions([
          'isHtml5ParserEnabled' => true,
          'isFontSubsettingEnabled' => true,
          'isPhpEnabled' => true,
          'tempDir' => storage_path(),
          'fontDir' => storage_path()
        ]);
        $pdf->setPaper(array(0,0,609.4488,935.433), 'portrait');
        header('Content-Type: application/pdf');
        header('Cache-Control: max-age=0');

        // mpdf
        // $mpdf = new \Mpdf\Mpdf(['tempDir' => storage_path()]);
        // $mpdf->WriteHTML($html);$r->nik
        // return $mpdf->Output();


        // $pdf = $pdf->output();
        // $pdf->stream();
        return $pdf->stream('PO_'.date("Y-m-d").'.pdf');
    }
}
