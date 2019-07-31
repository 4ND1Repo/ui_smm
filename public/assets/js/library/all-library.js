// datagrid library with vertical scrollbar

var myGrid = function(){
    var column = null,
        url = null,
        page = 10,
        height = 400,
        fn = null,
        target = '.kt-datatable',
        datatable = null,
        _data = null,
        _find = "#generalSearch";

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
        if(ty == 'finder')
            _find = v;
    }

    var _render = function(){

        return $(target).KTDatatable({
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
				input: $(_find)
			},
            columns: column
        });
    }

    var _func = function(){
        if(typeof fn !== null)
            fn();
    }

    return {
        element: function(){
            return this[(target.replace("#",'',target)).replace(".",'',target)];
        },
        set: function(ty,v){
            _set(ty,v);
            return this;
        },
        init: function(){
            var res = _check_var();
            if(res.status){
                this[(target.replace("#",'',target)).replace(".",'',target)] = _render();
                _func();
            }
            return res;
        }
    }
}();

// get grid by class
class myGrids {
    constructor(u = null,t = '.kt-datatable', h = 400, p = 10){
        this._column = null;
        this._url = u;
        this._page = p;
        this._height = h;
        this._fn = null;
        this._target = t;
        this._datatable = null;
        this._data = null;
        this._find = "#generalSearch";
    }

    set = function(k,v){
        var key;

        if(key = this.#validation(k,v)){
            this[key] = v;
        }
    }

    #validation = function(k,v){
        if(typeof this['_'+k] == "undefined"){
            console.log("Your key : " + k + ", is not defined");
            return null;
        } else if(k == "fn"){
            if(typeof v !== 'function'){
                console.log("Your key : " + k + ", is not function");
                return null;
            }
        }
        return '_'+k;
    }

    #render = function(){
        this._datatable = $(this._target).KTDatatable({
			data: {
                type: 'remote',
				source: {
					read: {
                        url: this._url,
                        params: this._data
					}
				},
				pageSize: this._page,
				serverPaging: true,
				serverFiltering: true,
                serverSorting: true
			},
			layout: {
				scroll: true,
				height: this._height,
                footer: false,
                spinner: {
                    message: "Mohon menunggu..."
                }
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
				input: $(this._find)
			},
			columns: this._column,
        });

        if(typeof this._fn !== null)
            this['_fn']();
    }

    get = function(k){
        return (typeof this['_'+k] !== "undefined"?this['_'+k]:null);
    }

    init = function(){
        this.#render();
    }
}

// price forcmat
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

// infinite scroll

var KTInfinite = function(){

  var _configuration = function(el, c){
    if(typeof c === 'object'){
      Object.assign(el.config, c);
    }
  }

  var _get = function(el, v){
    return (typeof el.config[v] !== 'undefined'? el.config['v']: null);
  }

  var _render = function(el){
    $(el.config.element).scroll(function() {
        if($(el.config.element).scrollTop() + $(el.config.element).height() + 20 >= $(el.config.target).height()) {
            // _loading(true);
            if(typeof el.ajx !== 'object' && (typeof el.config.finish === 'undefined'))
              el.ajx = _load(el);
            if((typeof el.config.finish !== 'undefined') && (typeof el.config.end !== 'undefined') && $(el.config.target).find('.end-of-infinite').length == 0)
              $(el.config.target).append('<div class="end-of-infinite text-center kt-timeline-v2__item-text">'+el.config.end+"</div>");
        }
    });
  }

  var _load = function(el){
    _loading(el,true);
    return $.ajax({
      url: el.config.url,
      type: "POST",
      data: {last:el.config.last, length:(typeof el.config.length !== 'undefined'?el.config.length:5)},
      success: function(r){
        if(r.status){
          el.config.last = r.data.last;
          // halt if the end of content
          if(r.data.content.length == 0) el.config.finish = 1;

          if(typeof el.config.template === 'function'){
            r.data.content.forEach(function(v,k){
              $(el.config.target).append(el.config.template(v));
            });
          }
        }
        _loading(el,false);
        el.ajx = "";
      },
      error: function(){
        _loading(el,false);
        el.ajx = "";
      }
    });
  }

  var _loading = function(el,s){
    if(s) $(el.config.target).append('<div class="infinite-loading text-center">Loading...</div>');
    else $(el.config.target).find('.infinite-loading').remove();
  }

  return {
    init: function(c){
      this.config = {
        element: null,
        target: null,
        template: null,
        last: null
      },
      this.ajx = "";

      _configuration(this, c);
      _render(this);
      this['last'] = _get(this,'last');
      this['element'] = this;
    },
    reload: function(el){
      $(el.element).unbind('scroll');
      KTInfinite.init(el);
    }
  };
}();
