// datagrid library with vertical scrollbar
var myGrid = function(){
    var column = null,
        url = null,
        page = 10,
        height = 400,
        fn = null,
        target = '.kt-datatable',
        datatable = null,
        _data = null;

    var _check_var = function(){
        if(column == null){
            console.log('Your column field not define')
            return _response(false,'Column not set',null);
        } else if(typeof column !== 'object'){
            console.log('Your column field not object format')
            return _response(false,'Column not set',null);
        } else if(typeof fn !== 'function'){
            console.log('Your function field not function format')
            return _response(false,'Function not set',null);
        } else if(typeof url == null){
            console.log('Your url field not define')
            return _response(false,'Url not set',null);
        }
        return _response(true,'all sets',null);
    };

    var _response = function(s,m,d){
        return {'status':s?1:0,'message':m,'data':d};
    }

    var _set = function(ty,v){
        if(ty == 'column')
            column = v;
        if(ty == 'url')
            url = v;
        if(ty == 'page')
            page = v;
        if(ty == 'height')
            height = v;
        if(ty == 'function')
            fn = v;
        if(ty == 'target')
            target = v;
        if(ty == 'data')
            _data = v;
    }

    var _render = function(){
        datatable = $(target).KTDatatable({
			data: {
                type: 'remote',
				source: {
					read: {
                        url: url,
                        params: _data
					}
				},
				pageSize: page,
				serverPaging: true,
				serverFiltering: true,
                serverSorting: true
			},
			layout: {
				scroll: true,
				height: height,
				footer: false
			},
			sortable: true,
			filterable: false,
            pagination: true,
            toolbar: {
                items: {
                    pagination: {
                        pageSizeSelect : [10, 25, 50, 100, "All"]
                    }
                }
            },
			search: {
				input: $('#generalSearch')
			},
			columns: column,
        });
        
        if(typeof fn !== null)
            fn();
    }

    return {
        element: function(){
            return datatable;
        },
        set: function(ty,v){
            _set(ty,v);
            return this;
        },
        init: function(){
            var res = _check_var();
            if(res.status)
                _render();
            return res;
        }
    }
}();

var price = function(){

    var formatMoney = function(amount,decimalCount,decimal,thousands){
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;
        
            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
          } catch (e) {
            console.log(e)
          }
    }

    return {
        format: function(amount, decimalCount = 2, decimal = ".", thousands = ","){
            return formatMoney(amount,decimalCount,decimal,thousands);
        }
    }
}();