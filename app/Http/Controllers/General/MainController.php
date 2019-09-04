<?php

namespace App\Http\Controllers\General;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

// Add Helper
use App\Helper\Template\Views;
use App\Helper\{Api,ExcelHelper};
use PhpOffice\PhpSpreadsheet\{Spreadsheet,Writer\Xlsx,Worksheet\MemoryDrawing,IOFactory};

class MainController extends Controller{

    public function about(Request $r, Views $v){
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
            'js/general/about.js'
        ]);
        $v::page('general.about');

        $dir = [];
        if ($handle = opendir(public_path('tutorial'))) {

                while (false !== ($entry = readdir($handle))) {
                    if ($entry != "." && $entry != "..") {
                        $dir[] = $entry;
                    }
                }

                closedir($handle);
        }

        if(count($dir) > 0)
            $v::data(['tutorial' => $dir]);

        return View('admin',$v::colect());
    }

    public function get_video(Request $r, $pg){
        $dir = [];
        if ($dh = opendir(public_path('tutorial/'.$pg))){
            while (($file = readdir($dh)) !== false){
                $tmp = explode('.',$file);
                if(in_array(end($tmp),['mp4']))
                    $dir[] = $file;
            }
            closedir($dh);
        }

        return ['status' => true, 'message' => 'Tersedia', 'data' => $dir];
    }

}
