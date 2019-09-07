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
    var map = {};
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

        label = encodeURI(data[1].substring(0,14)+((data[2]!="")?" "+data[2].substring(0,8):"")+((data[3]!="")?" "+data[3].substring(0,8):"")+((data[4]!="")?" "+data[4].substring(0,8):""));
        

        $("[data-id="+target+"]").children('input:first-child').val(data[0]).next().val(label);
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