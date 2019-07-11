<!DOCTYPE html>
<html lang="en">
	<!-- begin::Head -->
	<head>

		<!--begin::Base Path (base relative path for assets of this page) -->
        @if(env('APP_ENV') == 'production')
		<base href="http://{{{$_SERVER['HTTP_HOST'].'/public/'}}}">
        @else
		<base href="{{{env('APP_URL').'/public/'}}}">
        @endif
        <!--end::Base Path -->

		<meta charset="utf-8" />
		<title>Masuk Administrasi</title>
		<meta name="description" content="Halaman masuk administrasi">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

		<!--begin::Fonts -->
		<link href="./assets/vendors/google/fonts.css" rel="stylesheet" type='text/css'>
        <!--end::Fonts -->

        @if(env('APP_ENV') == 'production')
        <script>
            var base_url = 'http://{{{$_SERVER['HTTP_HOST']}}}',
                api_url = 'http://{{{$_SERVER['HTTP_HOST'].":8081"}}}';
        </script>
        @else
        <script>
            var base_url = '{{{env("APP_URL")}}}',
                api_url = '{{{env("API_URL")}}}';
        </script>
        @endif

        <!--begin:Generate default css -->
        @if(count($template['head']['css']) > 0)
            @foreach($template['head']['css'] AS $row)
        <link href="./assets/{{$row}}" rel="stylesheet" type='text/css'>
            @endforeach
        @endif
        <!--end:Generate default css -->

        <!--begin:Generate custom css -->
        @if(count($template['foot']['css']) > 0)
            @foreach($template['foot']['css'] AS $row)
        <link href="./assets/{{$row}}" rel="stylesheet" type='text/css'>
            @endforeach
        @endif
        <!--end:Generate custom css -->

		<!--begin::Generate Javascript on header -->
        @if(count($template['head']['js']) > 0)
            @foreach($template['head']['js'] AS $row)
            <script src="./assets/{{$row}}" type="text/javascript"></script>
            @endforeach
        @endif
		<!--end::Generate Javascript on header -->

		<!--end::Layout Skins -->
		<link rel="shortcut icon" href="./../favicon.ico" />
	</head>

    <!-- end::Head -->

	<!-- begin::Body -->
	<body class="kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--fixed kt-subheader--enabled kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-page--loading">