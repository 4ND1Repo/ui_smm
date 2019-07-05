<?php

namespace App\Http\Controllers\Authentication;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

// Add Helper
use App\Helper\Template\Views;

class MainController extends Controller{
    
    public function index(Request $r, Views $v){
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
        // validate user is login
        $v::js_head([
            'js/authentication/storage.js',
            'js/authentication/validate.js'
        ]);
        $v::js(['js/authentication/login.js']);
        $v::page('Authenticate.login');

        return View('template',$v::colect());
    }
}
