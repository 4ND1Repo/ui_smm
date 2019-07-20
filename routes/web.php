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

// Route::get('/', function () {
//     return view('welcome');
// });
Route::get('/', function () {
    return redirect('auth/login');
});

// Authentication page
Route::group(['prefix'=>'auth'], function(){
    Route::get('login', 'Authentication\MainController@index');
});

// Warehouse Admin page
Route::group(['prefix' => 'wh'], function(){
    // Warehouse dashboard
    Route::get('/', 'Warehouse\MainController@index');

    Route::get('export', 'Warehouse\MainController@export');
    Route::get('export/{ty}', 'Warehouse\MainController@export');

    // Stock
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

    // Warehouse master group
    Route::group(['prefix' => 'mst'], function(){
        // master stock
        Route::get('stock', 'Warehouse\MainController@master_stock');
        // master measure
        Route::get('measure', 'Warehouse\MainController@master_measure');
        // master category
        Route::get('category', 'Warehouse\MainController@master_category');
    });

    // Warehouse request
    Route::group(['prefix' => 'req'], function(){
        // Purchase Order
        Route::get('po', 'Warehouse\RequestController@po');
        // Delivery Order
        Route::get('do', 'Warehouse\RequestController@do');
        // Tools
        Route::get('tools', 'Warehouse\RequestController@tools');
    });
});


// Marketing Admin page
Route::group(['prefix' => 'mk'], function(){
    // Marketing dashboard
    Route::get('/', 'Marketing\MainController@index');

    // Marketing master group
    Route::group(['prefix' => 'mst'], function(){
        // master supplier
        Route::get('supplier', 'Marketing\MainController@master_supplier');
    });
});


// Purchasing Admin page
Route::group(['prefix' => 'pur'], function(){
    // Marketing dashboard
    Route::get('/', 'Purchasing\MainController@index');

    // Purchasing master group
    Route::group(['prefix' => 'mst'], function(){
        // master supplier
        Route::get('supplier', 'Marketing\MainController@master_supplier');
    });

    // Warehouse master group
    Route::group(['prefix' => 'req'], function(){
        // master supplier
        Route::get('po', 'Purchasing\MainController@po');
    });
});
