<!-- begin:: Content -->
<div class="kt-content  kt-grid__item kt-grid__item--fluid" id="kt_content">

@if(isset($data['tutorial']))
    <!--Begin::Section-->
    <style media="screen">
        .kt-portlet__space-x {
            margin: 30px 0;
        }
        .list_video {
            height: 100%;
            padding : 6px 0;
        }
        .list_video ul {
            padding: 3px 6px;
            margin: 0;
            list-style: none;
        }
        .list_video h5 {
            color: grey;
            text-align: center;
            padding-top: 5px;
        }
        .list_video ul li {
            border-radius: 4px;
            box-shadow: 0 0 5px grey;
            color: grey;
            cursor: pointer;
            padding: 3px 6px;
            display: block;
            margin: 5px 0 0;
        }
        .list_video ul li a {
            display: block;
            text-decoration: none;
            color: grey;
        }
        .list_video ul li a:active, .list_video ul li a:hover {
            color: grey;
        }
        .height-full {
            height: 100%;
        }
    </style>
    <div class="row">
        <div class="col-xl-10 col-md-10">
            <div class="kt-portlet kt-portlet--fit kt-portlet--body-lg kt-portlet--body-overlay kt-portlet--skin-solid height-full">
                <div class="kt-portlet__body kt-portlet__body--noborder kt-portlet__space-x height-full">
                    <video id="player" playsinline controls>
                        <source src="{{URL::to('/public/video/MARS_SMM.mp4')}}" type="video/mp4" />
                    </video>
                </div>
            </div>
        </div>
        <div class="col-xl-2 col-md-2">
            <div class="kt-portlet kt-portlet--fit kt-portlet--body-lg kt-portlet--body-overlay kt-portlet--skin-solid height-full">
                <div class="kt-portlet__body kt-portlet__body--noborder list_video height-full">
                    <ul></ul>
                </div>
            </div>
        </div>
    </div>
    <!--End::Section-->
@endif

</div>

<!-- end:: Content -->
