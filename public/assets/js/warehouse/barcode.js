"use strict";

$(document).ready(function(){
    $('.grid-list').click(function(){
        var el = this,
        position = $(el).position();

        $('.popup-search').css({top:position.top, left:position.left, display:'block'}).attr('target',$(el).data('id')).find('#find-goods')[0].focus();
    });
    $('.popup-search .btn-cancel').click(function(){
        var el = this;
        $(el).parent().parent().css({display:'none'});
        $("[data-id="+$(el).parent().parent().attr('target')+"]").children('input').val('');
        $("[data-id="+$(el).parent().parent().attr('target')+"]").children('div').html('TIDAK ADA BARCODE');
    });

    $('.btn-print').click(function(){
        var el = this;

        $('#Fbarcode').attr('action', location.href+"/print").submit();
    });




    // autocomplete
    var map = {},
        datas = {};
    var res = [],
    stockAutocomplete = $('#find-goods').typeahead(null, {
        name: 'stock_name',
        limit: 100,
        autoselect: true,
        placement: 'top',
        source: function(query,psc){
            $.ajax({
                url: api_url+'/api/wh/stock/autocomplete',
                type: 'POST',
                data: {find:query, page_code:window.Auth.page},
                async: false,
                success: function(r){
                    res = [];
                    map = {};
                    $.each(r, function(k,v){
                        res.push(v.label);
                        map[v.label] = v.id;
                        datas[v.label] = v.data;
                    });

                }
            });
            psc(res);
        }
    }).on('typeahead:selected', function(event, selection) {
        var tmp = '',
            data = selection.split(' - '),
            target = $('.popup-search').attr('target'),
            label = '';

        label = encodeURI(datas[selection]['stock_name'].substring(0,14)+((datas[selection]['stock_type']!="")?" "+datas[selection]['stock_type'].substring(0,8):"")+((datas[selection]['stock_size']!="")?" "+datas[selection]['stock_size'].substring(0,8):"")+((datas[selection]['stock_brand']!="")?" "+datas[selection]['stock_brand'].substring(0,8):""));
        

        $("[data-id="+target+"]").children('input:first-child').val(datas[selection]['stock_code']).next().val(label);
        $("[data-id="+target+"]").children('div').html(selection);
        $('.popup-search').css({display:'none'});
        stockAutocomplete.typeahead('val','');
    });
    $('#FReqtools .typeahead').on('keyup', function(e) {
        if(e.which == 13) {
            $(".tt-suggestion:first-child", this).trigger('click');
        }
    });
});