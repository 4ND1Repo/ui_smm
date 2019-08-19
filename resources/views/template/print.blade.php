<!DOCTYPE html>
<html lang="en">
	<!-- begin::Head -->
	<head>
			<style media="all">
					@font-face {
						font-family: 'Poppins';
						font-style: normal;
						font-weight: 300;
						src: local('Poppins Light'), local('Poppins-Light'), url({{public_path()}}/assets/vendors/google/fonts/pxiByp8kv8JHgFVrLDz8Z1xlFd2JQEk.ttf) format('truetype');
					}
					.row {
						display: block;
						width: 100%;
						height: auto;
						margin: 0 -10px -10px -10px;
						padding: 0;
					}
					.col-1 {
						display: inline-block;
						width: 8.33%;
						margin: 0 -5px;
					}
					.col-2 {
						display: inline-block;
						width: 16.67%;
						margin: 0 -5px;
					}
					.col-7 {
						display: inline-block;
						width: 58.33%;
						margin: 0 -5px;
					}
					.text-center {
						text-align: center;
					}
					.text-left {
						text-align: left;
					}
					.text-right {
						text-align: right;
					}
					@page {
						margin: 0px;
						padding: 0px;
					}
					* {
						font-family: 'Poppins';
						font-size: 12px;
						line-height: 0.9;

					}
					.kt-content {
						padding: 25px; }
						.kt-subheader--enabled.kt-subheader--transparent:not(.kt-subheader--fixed) .kt-content {
							padding-top: 0; }

					@media (min-width: 1025px) {
						.kt-footer--fixed .kt-content {
							padding-bottom: 60px; } }

					@media (max-width: 1024px) {
						.kt-content {
							padding: 15px; }
							.kt-subheader--enabled.kt-subheader--transparent .kt-content {
								padding-top: 0; } }
					body {
						display: block !important;
					}
			</style>
	</head>

    <!-- end::Head -->

	<!-- begin::Body -->
	<body>
		@include($template['page'])
	</body>
</html>
