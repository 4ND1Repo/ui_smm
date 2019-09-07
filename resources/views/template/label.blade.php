<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Print Barcode</title>
    <script src="{{URL::to('public/assets/vendors/custom/jsbarcode/JsBarcode.all.min.js')}}"></script>
</head>
<body>
<style>
    .container {
        width: 800px;
        page-break-after: always;
        padding: 12px 65px 15px 0;
        margin-right: 120px;
    }
    .container .container-row {
        width: 100%;
        display: grid;
        grid-gap: 9px;
        grid-auto-rows: minmax(50px, 70px);
        grid-template-columns: repeat(5, 1fr);
    }
    .container .container-row .template-label {
        text-align: center;
        font-size: 12px;
        text-transform: uppercase;
        padding: 4px 6px;
    }
    .container .container-row .template-label div {
        font-size: 9px;
    }
    .container .container-row .template-label img, .container .container-row .template-label svg {
        width: 100%;
    }
</style>
    <div class="container">
        <div class="container-row">
            @for($i=0;$i < 40;$i++)
            <div class="template-label"><div>{!!urldecode($data['barcode'][$i]['label'])!!}</div><svg id="barcode_{{$i}}"></svg></div>
            @if(!is_null($data['barcode'][$i]['stock_code']) && !empty($data['barcode'][$i]['stock_code']))
            <script>
                JsBarcode("#barcode_{{$i}}", "{{$data['barcode'][$i]['stock_code']}}", {
                    format: "CODE128",
                    width: 1,
                    height: 25,
                    fontSize: 10,
                    margin: 1
                });
            </script>
            @endif
            @endfor
        </div>
    </div>
</body>
</html>