<?php

namespace App\Helper;

Class Api {
  public static function check_env() {
     if(in_array(strtolower(env('APP_ENV')), ['production', 'prod', 'p'])){
       // set APP_URL
       $_ENV['APP_URL'] = (self::is_https()?'https://':'http://').$_SERVER['SERVER_NAME'];

       // set API_URL
       if(strpos(':',env('API_URL')) >= 0){
          $uri = parse_url(env('API_URL'));
          $_ENV['API_URL'] = (self::is_https()?'https://':'http://').$_SERVER['SERVER_NAME'].(isset($uri['port'])?":".$uri['port']:"");
       }
     }
  }

  public static function is_https(){
	  return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443;
  }
}
