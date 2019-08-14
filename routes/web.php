<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
use App\Helper\RestCurl;
use App\Helper\Api;

// check URI
API::check_env();

// Route::get('/', function () {
//     return view('welcome');
// });
Route::get('/', function () {
    return redirect('auth/login');
});

Route::post('temp',function(){
  $tmp_files = storage_path().'/temp_'.$_POST['id'];
  move_uploaded_file($_FILES['pic']['tmp_name'],$tmp_files);
	if (function_exists('exif_read_data')) {
    $exif = exif_read_data($tmp_files);
    if($exif && isset($exif['Orientation'])) {
      $orientation = $exif['Orientation'];
      if($orientation != 1){
        $img = imagecreatefromjpeg($tmp_files);
        $deg = 0;
        switch ($orientation) {
          case 3:
            $deg = 180;
            break;
          case 6:
            $deg = 270;
            break;
          case 8:
            $deg = 90;
            break;
        }
        if ($deg) {
          $img = imagerotate($img, $deg, 0);
        }
        // then rewrite the rotated image back to the disk as $filename
        imagejpeg($img, $tmp_files, 95);
      } // if there is some rotation necessary
    } // if have the exif orientation info
  } // if function exists
  return 'http://'.$_SERVER['HTTP_HOST'].'/storage/temp_'.$_POST['id'];
});

// Authentication page
Route::group(['prefix'=>'auth'], function(){
    Route::get('login', 'Authentication\MainController@index');
});

// generate full of rules page
$response = RestCurl::get(env('API_URL')."/api/mst/page");
if($response->status==200){
  foreach ($response->data->data as $i => $row) {
    // by page role
    Route::group(['prefix' => $row->page_code], function() use($row){
        // All Dashboard by Folder
        Route::get('/', $row->page_name.'\MainController@index');

        // All Profile person
        Route::get('profile', 'Management\ProfileController@index');

        // Management group
        Route::group(['prefix' => 'mng'], function(){
            // Users Management
            Route::get('user', 'Management\MainController@users');
            // Menus Management
            Route::get('menu', 'Management\MainController@menu');
            // Role Menu Management
            Route::get('group', 'Management\MainController@group');
        });

        // Master group
        Route::group(['prefix' => 'mst'], function(){
            // Master Icon
            Route::get('icon', 'Management\MasterController@icon');
            // master stock
            Route::get('stock', 'Warehouse\MainController@master_stock');
            // master measure
            Route::get('measure', 'Warehouse\MainController@master_measure');
            // master category
            Route::get('category', 'Warehouse\MainController@master_category');
            // master supplier
            Route::get('supplier', 'Marketing\MainController@master_supplier');
        });

        // Stock Group
        Route::group(['prefix' => 'stk'], function(){
            // Dashboard Cabinet
            Route::get('cabinet','Warehouse\MainController@stock_dashboard');
            // Dashboard Stock
            Route::get('stock','Warehouse\MainController@stock');
            // History Stock
            Route::get('history','Warehouse\MainController@history');
            // Waiting for buy Stock
            Route::get('list_buy','Warehouse\MainController@list_buy');
            // Dashboard Stock
            Route::get('opname','Warehouse\MainController@opname');
        });

        // Request group
        Route::group(['prefix' => 'req'], function() use($row){
            // Purchase Order
            Route::group(['prefix' => 'po'], function() use($row){
                Route::get('/', $row->page_name.'\MainController@po');
                // History Purchasing
                Route::get('history', $row->page_name.'\MainController@history');
                // Print PO
                Route::get('print', $row->page_name.'\MainController@print_po');
            });
            // Delivery Order
            Route::get('do', $row->page_name.'\MainController@do');
            // Goods
            Route::get('tools', $row->page_name.'\MainController@tools');
        });


        // Export Group
        Route::group(['prefix' => 'export'], function() use($row){
          // page test
          Route::post('/', 'Warehouse\MainController@export');

          // Excel Group
          Route::group(['prefix' => 'excel'], function() use($row){
            // master group
            Route::group(['prefix' => 'mst'], function(){
              Route::post('stock', 'Export\Excel\MainController@mst_stock');
              Route::post('measure', 'Export\Excel\MainController@mst_measure');
              Route::post('category', 'Export\Excel\MainController@mst_category');
              Route::post('supplier', 'Export\Excel\MainController@mst_supplier');
            });

            // request group
            Route::group(['prefix' => 'req'], function(){
              Route::post('tools', 'Export\Excel\RequestController@tools');
              Route::post('po', 'Export\Excel\RequestController@po');
              Route::post('do', 'Export\Excel\RequestController@do');
              // for Purchasing
              Route::post('po_pur', 'Export\Excel\RequestController@po_pur');
              Route::post('history_po_pur', 'Export\Excel\RequestController@history_po_pur');
            });

            // stock by warehouse type group
            Route::group(['prefix' => 'stk'], function(){
              Route::post('stock', 'Export\Excel\StockController@stock');
              Route::post('list_buy', 'Export\Excel\StockController@list_buy');
              Route::post('opname', 'Export\Excel\StockController@opname');
            });
          });
        });


    });
  }
}
