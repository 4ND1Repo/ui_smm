<?php

namespace App\Http\Controllers\Marketing;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

// Add Helper
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
            'js/warehouse/main.js'
        ]);
        $v::page('warehouse.dashboard');

        return View('admin',$v::colect());
    }

    public function master_supplier(Request $r, Views $v){
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
            'js/warehouse/main.js'
        ]);
        $v::page('marketing.master.supplier');

        return View('admin',$v::colect());
    }
}
