<?php

namespace App\Helper\Template;

use Illuminate\Http\Request;

class Views{
    private static $js_head, $css_head, $js, $css, $data, $mandatory, $page;
    private static $list = [
        'css' => [
            'perfect-scrollbar' => 'vendors/general/perfect-scrollbar/css/perfect-scrollbar.css',
            'tether' => 'vendors/general/tether/dist/css/tether.css',
            'bootstrap-datepicker' => 'vendors/general/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css',
            'bootstrap-datetimepicker' => 'vendors/general/bootstrap-datetime-picker/css/bootstrap-datetimepicker.css',
            'bootstrap-timepicker' => 'vendors/general/bootstrap-timepicker/css/bootstrap-timepicker.css',
            'daterangepicker' => 'vendors/general/bootstrap-daterangepicker/daterangepicker.css',
            'bootstrap-touchspin' => 'vendors/general/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.css',
            'bootstrap-select' => 'vendors/general/bootstrap-select/dist/css/bootstrap-select.css',
            'bootstrap-switch' => 'vendors/general/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css',
            'select2' => 'vendors/general/select2/dist/css/select2.css',
            'ion-rangeSlider' => 'vendors/general/ion-rangeslider/css/ion.rangeSlider.css',
            'nouislider' => 'vendors/general/nouislider/distribute/nouislider.css',
            'owl-carousel' => 'vendors/general/owl.carousel/dist/assets/owl.carousel.css',
            'owl-theme-default' => 'vendors/general/owl.carousel/dist/assets/owl.theme.default.css',
            'dropzone' => 'vendors/general/dropzone/dist/dropzone.css',
            'summernote' => 'vendors/general/summernote/dist/summernote.css',
            'bootstrap-markdown' => 'vendors/general/bootstrap-markdown/css/bootstrap-markdown.min.css',
            'animate' => 'vendors/general/animate.css/animate.css',
            'toastr' => 'vendors/general/toastr/build/toastr.css',
            'morris' => 'vendors/general/morris.js/morris.css',
            'sweetalert2' => 'vendors/general/sweetalert2/dist/sweetalert2.css',
            'socicon' => 'vendors/general/socicon/css/socicon.css',
            'line-awesome' => 'vendors/custom/vendors/line-awesome/css/line-awesome.css',
            'flaticon' => 'vendors/custom/vendors/flaticon/flaticon.css',
            'flaticon2' => 'vendors/custom/vendors/flaticon2/flaticon.css',
            'fontawesome' => 'vendors/general/@fortawesome/fontawesome-free/css/all.min.css',
            'plyr' => 'vendors/custom/plyr/dist/plyr.css'
        ],
        'js_mandatory' => [
            'jquery' => 'vendors/general/jquery/dist/jquery.js',
            'popper' => 'vendors/general/popper.js/dist/umd/popper.js',
            'bootstrap' => 'vendors/general/bootstrap/dist/js/bootstrap.min.js',
            'js-cookie' => 'vendors/general/js-cookie/src/js.cookie.js',
            'moment' => 'vendors/general/moment/min/moment.min.js',
            'tooltip' => 'vendors/general/tooltip.js/dist/umd/tooltip.min.js',
            'perfect-scrollbar' => 'vendors/general/perfect-scrollbar/dist/perfect-scrollbar.js',
            'sticky' => 'vendors/general/sticky-js/dist/sticky.min.js',
            'wNumb' => 'vendors/general/wnumb/wNumb.js'
        ],
        'js' => [
            'jquery-form' => 'vendors/general/jquery-form/dist/jquery.form.min.js',
            'jquery-blockUI' => 'vendors/general/block-ui/jquery.blockUI.js',
            'bootstrap-datepicker' => 'vendors/general/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
            'bootstrap-datepicker-init' => 'vendors/custom/js/vendors/bootstrap-datepicker.init.js',
            'bootstrap-datetimepicker' => 'vendors/general/bootstrap-datetime-picker/js/bootstrap-datetimepicker.min.js',
            'bootstrap-timepicker' => 'vendors/general/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
            'bootstrap-timepicker-init' => 'vendors/custom/js/vendors/bootstrap-timepicker.init.js',
            'daterangepicker' => 'vendors/general/bootstrap-daterangepicker/daterangepicker.js',
            'jquery-bootstrap-touchspin' => 'vendors/general/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.js',
            'bootstrap-maxlength' => 'vendors/general/bootstrap-maxlength/src/bootstrap-maxlength.js',
            'bootstrap-multiselectsplitter' => 'vendors/custom/vendors/bootstrap-multiselectsplitter/bootstrap-multiselectsplitter.min.js',
            'bootstrap-select' => 'vendors/general/bootstrap-select/dist/js/bootstrap-select.js',
            'bootstrap-switch' => 'vendors/general/bootstrap-switch/dist/js/bootstrap-switch.js',
            'bootstrap-switch-init' => 'vendors/custom/js/vendors/bootstrap-switch.init.js',
            'select2-full' => 'vendors/general/select2/dist/js/select2.full.js',
            'ion-rangeSlider' => 'vendors/general/ion-rangeslider/js/ion.rangeSlider.js',
            'typeahead-bundle' => 'vendors/general/typeahead.js/dist/typeahead.bundle.js',
            'handlebars' => 'vendors/general/handlebars/dist/handlebars.js',
            'jquery-inputmask-bundle' => 'vendors/general/inputmask/dist/jquery.inputmask.bundle.js',
            'inputmask-date-extensions' => 'vendors/general/inputmask/dist/inputmask/inputmask.date.extensions.js',
            'inputmask-numeric-extensions' => 'vendors/general/inputmask/dist/inputmask/inputmask.numeric.extensions.js',
            'nouislider' => 'vendors/general/nouislider/distribute/nouislider.js',
            'owl-carousel' => 'vendors/general/owl.carousel/dist/owl.carousel.js',
            'autosize' => 'vendors/general/autosize/dist/autosize.js',
            'clipboard' => 'vendors/general/clipboard/dist/clipboard.min.js',
            'dropzone' => 'vendors/general/dropzone/dist/dropzone.js',
            'summernote' => 'vendors/general/summernote/dist/summernote.js',
            'markdown' => 'vendors/general/markdown/lib/markdown.js',
            'bootstrap-markdown' => 'vendors/general/bootstrap-markdown/js/bootstrap-markdown.js',
            'bootstrap-markdown-init' => 'vendors/custom/js/vendors/bootstrap-markdown.init.js',
            'bootstrap-notify' => 'vendors/general/bootstrap-notify/bootstrap-notify.min.js',
            'bootstrap-notify-init' => 'vendors/custom/js/vendors/bootstrap-notify.init.js',
            'jquery-validate' => 'vendors/general/jquery-validation/dist/jquery.validate.js',
            'additional-methods' => 'vendors/general/jquery-validation/dist/additional-methods.js',
            'jquery-validation-init' => 'vendors/custom/js/vendors/jquery-validation.init.js',
            'toastr' => 'vendors/general/toastr/build/toastr.min.js',
            'raphael' => 'vendors/general/raphael/raphael.js',
            'morris' => 'vendors/general/morris.js/morris.js',
            'Chart-bundle' => 'vendors/general/chart.js/dist/Chart.bundle.js',
            'bootstrap-session-timeout' => 'vendors/custom/vendors/bootstrap-session-timeout/dist/bootstrap-session-timeout.min.js',
            'idle-timer' => 'vendors/custom/vendors/jquery-idletimer/idle-timer.min.js',
            'jquery-waypoints' => 'vendors/general/waypoints/lib/jquery.waypoints.js',
            'jquery-counterup' => 'vendors/general/counterup/jquery.counterup.js',
            'promise' => 'vendors/general/es6-promise-polyfill/promise.min.js',
            'sweetalert2' => 'vendors/general/sweetalert2/dist/sweetalert2.min.js',
            'sweetalert2-init' => 'vendors/custom/js/vendors/sweetalert2.init.js',
            'jquery-repeater-lib' => 'vendors/general/jquery.repeater/src/lib.js',
            'jquery-repeater-jquery.input' => 'vendors/general/jquery.repeater/src/jquery.input.js',
            'jquery-repeater' => 'vendors/general/jquery.repeater/src/repeater.js',
            'purify' => 'vendors/general/dompurify/dist/purify.js',
            'timeago-id' => 'vendors/custom/timeago/jquery.timeago.id.js',
            'smartcrop' => 'vendors/custom/smartcrop/smartcrop.js',
            'face-api' => 'vendors/custom/faceapi/face-api.js',
            'bundle' => 'js/demo1/scripts.bundle.js',
            'auth' => 'js/authentication/auth.js',
            'my-library' => 'js/library/all-library.js',
            'plyr' => 'vendors/custom/plyr/dist/plyr.js',
            'jsbarcode' => 'vendors/custom/jsbarcode/JsBarcode.all.min.js'
        ]
    ];

    public function __construct(){
        self::$js_head = [];
        self::$css_head = [];
        self::$js = self::$css = [];
        self::$data = null;
        self::$page = 'template.blank';
        self::$mandatory = [
            'js' => true,
            'active_css' => true,
            'active_js' => true,
        ];
    }

    public static function no_mandatory_js(){
        self::$mandatory['js'] = false;
    }

    public static function no_css(){
        self::$mandatory['active_css'] = false;
    }

    public static function no_js(){
        self::$mandatory['active_js'] = false;
    }

    public static function page($tmp = null){
        if(!is_null($tmp))
            self::$page = $tmp;
    }

    public static function all_css(){
        self::$css_head = [];
        foreach(self::$list['css'] as $row){
            self::$css_head[] = $row;
        }
    }

    public static function all_js(){
        self::$js = [];
        foreach(self::$list['js'] as $row){
            self::$js[] = $row;
        }
    }

    public static function js($tmp = null){
        try{
            if(is_null($tmp) || empty($tmp))
                throw new \Exception('Variable JS not null or empty');
            else if(!is_array($tmp) && !is_object($tmp))
                throw new \Exception('Variable JS must array or object format list');
            else {
                foreach($tmp as $row){
                    if(self::_check_filepath($row,'js'))
                        self::$js[] = $row;
                    else{
                        if(isset($list['js'][$row]))
                            self::$js[] = $list['js'][$row];
                    }
                }
            }
        } catch(\Exception $e){
            dd($e);
        }
    }

    public static function css($tmp = null){
        try{
            if(is_null($tmp) || empty($tmp))
                throw new \Exception('Variable CSS not null or empty');
            else if(!is_array($tmp) && !is_object($tmp))
                throw new \Exception('Variable CSS must array or object format list');
            else {
                foreach($tmp as $row){
                    if(self::_check_filepath($row,'css'))
                        self::$css[] = $row;
                    else{
                        if(isset($list['css'][$row]))
                            self::$css[] = $list['css'][$row];
                    }
                }
            }
        } catch(\Exception $e){
            dd($e);
        }
    }

    public static function css_head($tmp = null){
        try{
            if(is_null($tmp) || empty($tmp))
                throw new \Exception('Variable CSS not null or empty');
            else if(!is_array($tmp) && !is_object($tmp))
                throw new \Exception('Variable CSS must array or object format list');
            else {
                foreach($tmp as $row){
                    if(self::_check_filepath($row,'css'))
                        self::$css_head[] = $row;
                    else{
                        if(isset($list['css'][$row]))
                            self::$css_head[] = $list['css'][$row];
                    }
                }
            }
        } catch(\Exception $e){
            dd($e);
        }
    }

    public static function js_head($tmp = null){
        try{
            if(is_null($tmp) || empty($tmp))
                throw new \Exception('Variable JS not null or empty');
            else if(!is_array($tmp) && !is_object($tmp))
                throw new \Exception('Variable JS must array or object format list');
            else {
                foreach($tmp as $row){
                    if(self::_check_filepath($row,'js'))
                        self::$js_head[] = $row;
                    else{
                        if(isset($list['js'][$row]))
                            self::$js_head[] = $list['js'][$row];
                    }
                }
            }
        } catch(\Exception $e){
            dd($e);
        }
    }

    private static function _is_js_mandatory(){
        $tmp = self::$js;
        self::$js = [];
        if(self::$mandatory['js'])
            foreach(self::$list['js_mandatory'] as $row){
                self::$js[] = $row;
            }
        self::$js = array_merge(self::$js,$tmp);
    }

    private static function _check_filepath($tmp, $type = null){
        if(!is_null($type)){
            $el = explode(".", $tmp);
            if(count($el) > 1){
                $file = $el[(count($el)-1)];
                if($type == $file)
                    return true;
            }
        }
    }

    private static function _no_css(){
        if(!self::$mandatory['active_css']){
            self::$css = [];
            self::$css_head = [];
        }
    }

    private static function _no_js(){
        if(!self::$mandatory['active_js']){
            self::$js = [];
            self::$js_head = [];
        }
    }

    public static function data($tmp = null){
        self::$data = (!is_null($tmp) && !empty($tmp))?$tmp:null;
    }

    public static function colect(){
        // validation is mandatory JS
        self::_is_js_mandatory();


        // validate empty all environment
        self::_no_css();
        self::_no_js();

        return ['template' => [
            'head' => [
                'js' => self::$js_head,
                'css' => self::$css_head
            ],
            'foot' => [
                'js' => self::$js,
                'css' => self::$css
            ],
            'page' => self::$page
            ],
        'data' => self::$data];
    }
}
