

		<!-- begin::Global Config(global config for global JS sciprts) -->
		<script>
			var KTAppOptions = {
				"colors": {
					"state": {
						"brand": "#5d78ff",
						"dark": "#282a3c",
						"light": "#ffffff",
						"primary": "#5867dd",
						"success": "#34bfa3",
						"info": "#36a3f7",
						"warning": "#ffb822",
						"danger": "#fd3995"
					},
					"base": {
						"label": ["#c5cbe3", "#a1a8c3", "#3d4465", "#3e4466"],
						"shape": ["#f0f3ff", "#d9dffa", "#afb4d4", "#646c9a"]
					}
				}
			};
		</script>

        <!-- end::Global Config -->
		<!--begin::Generate JS -->
        @if(count($template['foot']['js']) > 0)
            @foreach($template['foot']['js'] AS $row)
            <script src="./assets/{{$row}}" type="text/javascript"></script>
            @endforeach
        @endif
		<!--end::Generate JS -->
	</body>

	<!-- end::Body -->
</html>