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
    });

    // Warehouse master group
    Route::group(['prefix' => 'mst'], function(){
        // master stock
        Route::get('stock', 'Warehouse\MainController@master_stock');
        // master measure
        Route::get('measure', 'Warehouse\MainController@master_measure');
    });

    // Warehouse request
    Route::group(['prefix' => 'req'], function(){
        // Purchase Order
        Route::get('po', 'Warehouse\RequestController@po');
        // Tools
        Route::get('tools', 'Warehouse\RequestController@tools');
    });
});


// Marketing Admin page
Route::group(['prefix' => 'mk'], function(){
    // Marketing dashboard
    Route::get('/', 'Marketing\MainController@index');

    // Warehouse master group
    Route::group(['prefix' => 'mst'], function(){
        // master supplier
        Route::get('supplier', 'Marketing\MainController@master_supplier');
    });
});