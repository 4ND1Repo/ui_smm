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

  // response default format
  public static function response($s=true,$m=null,$d=[]){
      return ['status'=>is_bool($s)?($s?1:0):($s==1?1:0),'message'=>is_string($m)?$m:null,'data'=>$d];
  }

  public static function is_https(){
	  return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443;
  }
}

Class ExcelHelper {
  // $s for start Alphabeth
  // $i for indexing
  public static function getColumn($s,$i){
    $l = strlen($s);
    $ext = $l > 1?(26*((ord($s[0])+1)-ord('A')))+(ord($s[1])-ord('A')):(ord($s)-ord('A'));
    return (floor(($i+$ext)/26) > 0?chr((ord('A')-1)+floor(($i+$ext)/26)):"").chr(65+(($i+$ext)%26));
  }

  public static function style($t){
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
      'header' => [
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
        ]
      ]
    ];
    return isset($style[$t])?$style[$t]:false;
  }
}


Class converter {
    public static function fromID($dt){
        if(strpos($dt, '/') != -1){
            list($date, $month, $year) = explode("/",$dt);
            return implode("-",[$year, $month, $date]);
        }
    }
}