"use strict";

var KTFormPO = function(){
  var formId = '#FPO',
      link_add = api_url+"/api/pur/req/po/process",
      formRules = {},
      formModal = '#addPo';

  var validation = function(){
    return $( formId ).validate({
        // define validation rules
        rules: formRules,

        //display error alert on form submit
        invalidHandler: function(event, validator) {
            swal.fire({
                "title": "",
                "text": "Mohon periksa kembali inputan anda.",
                "type": "error",
                "confirmButtonClass": "btn btn-secondary",
                "onClose": function(e) {
                    console.log('on close event fired!');
                }
            });

            event.preventDefault();
        },

        submitHandler: function (form) {
            var link = link_add,
                err = false;

            var data = $(formId).serializeArray();
            data.push({name:"nik", value:window.Auth.nik});
            data.push({name:"page_code", value:window.Auth.page});
            data.push({name:"page_code_destination", value:'pur'});

            // validate form if not set
            $(".supplier.tt-input").each(function(k,v){
              if($(v).val() != ''){
                var dt = $(v).parent().parent().prev().find('.date-picker');
                if($(dt).val() == ''){
                  toastr.warning('Tanggal belum di isi');
                  err = true;
                  $(dt).focus();
                  return false;
                }
              }
            });

            $(".date-picker").each(function(k,v){
              if($(v).val() != ''){
                var sp = $(v).parent().next().find('.supplier.tt-input');
                console.log(sp);
                if($(sp).val() == ''){
                  toastr.warning('Supplier belum di isi');
                  err = true;
                  $(sp).focus();
                  return false;
                }
              }
            });


            if(!err){
              // block ui modal
              var target = formModal+' .modal-content';
              KTApp.block(target, {
                  overlayColor: '#000000',
                  type: 'v2',
                  state: 'primary',
                  message: 'Processing...'
              });
  
              $.ajax({
                  url: link,
                  type: "POST",
                  data: data,
                  success: function(r){
                      if(r.status){
                          swal.fire({
                              title: "",
                              text: r.message,
                              type: "success",
                              showConfirmButton: false,
                              timer: 1500
                          }).then((res) => {
                              $('#FPO .list-body').html('');
                              $(formModal).modal('hide');
                              myGrid.element().reload();
                              console.log('Success');
                              // send notification to target
                              $.ajax({
                                url: api_url+'/api/mng/user/notification/add',
                                type: 'POST',
                                data:{notification_to:r.data.to, notification_from:window.Auth.nik, notification_content:'PO '+r.data.po_code+' sedang diproses', notification_url:'/wh/req/po', notification_icon: "fa fa-book kt-font-success"},
                                success: function(r){
                                  console.log(r);
                                }
                              });
                          });
                      } else {
                          swal.fire({
                              title: "",
                              text: r.message,
                              type: "warning",
                              showConfirmButton: false,
                              timer: 1500
                          }).then((res) => {
                              console.log('failed');
                          });
                      }
                      KTApp.unblock(target);
                  },
                  error: function(){
                      swal.fire({
                          title: "",
                          text: "Kesalahan sistem",
                          type: "error",
                          showConfirmButton: false,
                          timer: 1500
                      }).then((res) => {
                          console.log('failed');
                      });
                      KTApp.unblock(target);
                  }
              });
            }
            return false;
        }
    });
  }

  var setRules = function(rule){
    $(rule).rules("add", {required:true, min: 0.01});
  }

  return {
    init: function(){
      console.log('init form');
      this[formId.replace(/'#|.'/g,'')] = validation();
    },
    element: function(){
      return this[formId.replace(/'#|.'/g,'')];
    },
    rules: function(r){
      console.log('set rule');
      setRules(r);
    }
  }
}();

var KTGridPO = function(){
    var _el,
        gridId = "#datagrid-pur-po",
        height = '550',
        url = api_url+'/api/pur/req/po/grid',
        link_find = api_url+'/api/pur/req/po/find/',
        link_delete = api_url+'/api/pur/req/po/delete',
        link_cancel = api_url+'/api/pur/req/po/cancel',
        page = '10';

    var _KTDatatable = function(){
        myGrid.set('target', gridId);
        myGrid.set('height', height);
        myGrid.set('url', url);
        myGrid.set('page', page);
        myGrid.set('column',
            [{
                field: 'po_code',
                title: 'Kode PO'
            }, {
                field: 'po_date',
                title: 'Tanggal',
                template: function(row){
                  var tmp = row.po_date.split('-');
                  return (tmp.length > 1?(tmp[2]+"/"+tmp[1]+"/"+tmp[0]):row.po_date);
                }
            }, {
                field: 'create_by',
                title: 'pembuat'
            }, {
                field: 'page_name',
                title: 'Dari'
            }, {
                field: 'sum_item',
                title: 'jumlah item'
            }, {
                field: 'status_label',
                title: 'Status',
                template: function(row){
                    var status = {
                        "ST06": {'title': 'Pending', 'class': 'kt-badge--brand'},
                        "ST09": {'title': 'Delivered', 'class': ' kt-badge--danger'},
                        "ST04": {'title': 'Canceled', 'class': ' kt-badge--primary'},
                        "ST05": {'title': 'Success', 'class': ' kt-badge--success'},
                        5: {'title': 'Info', 'class': ' kt-badge--info'},
                        "ST03": {'title': 'Danger', 'class': ' kt-badge--danger'},
                        "ST02": {'title': 'Warning', 'class': ' kt-badge--warning'},
                    };
                    return '<span class="kt-badge ' + (typeof status[row.status] !== 'undefined'?status[row.status].class:'') + ' kt-badge--inline kt-badge--pill">' + row.status_label + '</span>';
                }
            }, {
                field: 'reason',
                title: 'Alasan'
            }, {
                field: 'action',
                title: 'Aksi',
                sortable: false,
                width: 110,
                overflow: 'visible',
                autoHide: false,
                class: 'text-center',
                template: function(row) {
                    var btn = [];
                    if(window.role.edit == 1)
                      btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-detail" id="'+row.po_code+'" title="Proses PO">\
                          <i class="la la-automobile"></i>\
                      </a>');

                    if(window.role.del == 1)
                      btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-cancel" id="'+row.po_code+'" title="Batalkan PO">\
                          <i class="la la-remove text-danger"></i>\
                      </a>');

                    if((['ST02','ST05']).indexOf(row.status) != -1)
                      btn.push('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-print" id="'+row.po_code+'" title="Print PO">\
                          <i class="la la-print"></i>\
                      </a>');

                    btn = myGrid.action(btn);
                    return btn;
                },
            }]
        );
        myGrid.set('data',{page_code:window.Auth.page});
        myGrid.set('function', function(){
            $('input[name="in[start]"]').on('change', function() {
                myGrid.element().search($(this).val(), 'start_date');
            });
    
            $('input[name="in[end]"]').on('change', function() {
              myGrid.element().search($(this).val(), 'end_date');
            });
            // function buttin on datatable grid
            $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {
                var ajx = null;

                $('.btn-cancel').click(function(){
                  Swal.fire({
                      title: 'Anda yakin?',
                      // text: "untuk membatalkan transaksi ini!",
                      type: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Ya',
                      cancelButtonText: 'Tidak',
                      html: 'Isi alasan pembatalan :<br/><textarea rows="3" id="reason" name="reason" class="form-control form-control-sm"></textarea>',
                      preConfirm: (res) => {

                        if($('#reason').val().length > 0) return true;

                        swal.fire({
                            title: "",
                            text: "Mohon input alasannya",
                            type: "warning",
                            showConfirmButton: false,
                            timer: 1500
                        });

                        return false;
                      }
                  }).then((result) => {
                      console.log(result);
                      console.log($('#reason').val());
                      if (result.value) {
                          var el = this;
                          $.ajax({
                              url: link_cancel,
                              type: 'POST',
                              data: {po_code:$(el).attr('id'),reason:$('#reason').val(),nik:window.Auth.nik},
                              success: function(r){
                                  Swal.fire({
                                      title: 'Dibatalkan!',
                                      text: 'Transaksi telah dibatalkan.',
                                      type: 'success',
                                      showConfirmButton: false,
                                      timer: 1500
                                  });
                                  _el.reload();
                                  $('[name=find]')[0].focus();

                                  // send notification to target
                                  $.ajax({
                                    url: api_url+'/api/mng/user/notification/add',
                                    type: 'POST',
                                    data:{notification_to:$(el).parent().parent().parent().children('[data-field="create_by"]').text(), notification_from:window.Auth.nik, notification_content:'PO '+$(el).attr('id')+' dibatalkan', notification_url:'/wh/req/po', notification_icon: "fa fa-book kt-font-danger"},
                                    success: function(r){
                                      console.log(r);
                                    }
                                  });
                              },
                              error: function(){
                                  console.log('error delete');
                              }
                          });
                      }
                  });
                });

                $('.btn-print').click(function(){
                  var el = this,
                      data = {
                    api: api_url,
                    nik: window.Auth.nik,
                    po_code: $(el).attr('id')
                  };
                  // get supplier collection
                  $.ajax({
                      url: api_url+"/api/pur/req/po/supplier",
                      type: "POST",
                      data: {po_code:$(el).attr('id')},
                      success: function(r){
                          if(r.status){
                              if(r.data.length > 0){
                                  r.data.forEach(function(v,k){
                                      Object.assign(data, {supplier_code:v});
                                      KTDownload.post(location.href + '/print', data);
                                  });
                              }
                          }
                      }
                  });
                });

                $('.btn-detail').click(function(){
                    if(ajx != null) ajx.abort();
                    ajx = $.ajax({
                        url: link_find+$(this).attr('id'),
                        type: 'GET',
                        success: function(res){
                            if(res.status){
                                var data = res.data,
                                    tmpHtml = '',
                                    date = new Date();
                                    date.setDate(date.getDate());

                                if(typeof data.purchase_order == "object"){
                                  $.each(data.purchase_order_detail, function(k,v){
                                    tmpHtml = "";
                                    // get data from po detail
                                    tmpHtml += '<div id="'+v.po_code+'" did="'+v.pod_code+'" class="po-row data'+(v.urgent==1?' text-danger':'')+'" style="margin:0;">';
                                    // split data po detail
                                    tmpHtml += '<div><i class="fa fa-plus split"></i></div>';
                                    // detail stock
                                    var stock_data = '('+v.stock_code+') ';
                                    stock_data += v.stock_name;
                                    stock_data += (v.stock_size!='' && v.stock_size!=null?' '+v.stock_size:'');
                                    stock_data += (v.stock_type!='' && v.stock_type!=null?' '+v.stock_type:'');
                                    stock_data += (v.stock_brand!='' && v.stock_brand!=null?' '+v.stock_brand:'');
                                    stock_data += (v.stock_color!='' && v.stock_color!=null?' '+v.stock_color:'');

                                    tmpHtml += '<div data-toggle="kt-tooltip" data-placement="top" data-original-title="'+stock_data+'" data-skin="dark">';
                                    tmpHtml += stock_data;
                                    if(v.po_notes !== null && v.po_notes !== "")
                                      tmpHtml += '<br/>Keterangan :<br/>'+v.po_notes;
                                    tmpHtml += '</div>';
                                    // Urgenity
                                    tmpHtml += '<div class="text-center">'+(v.urgent==1?'<i class="fa fa-check"></i>':'&nbsp;')+'</div>';
                                    // PIC
                                    tmpHtml += '<div class="typeahead"><input type="text" class="form-control form-control-sm po-pic" name="data['+v.po_code+']['+v.pod_code+'][pic]" value="'+(v.po_pic == null?'':v.po_pic)+'" placeholder="PIC" title="PIC"></div>';
                                    // input qty
                                    tmpHtml += '<div class="text-right">'+price.format(v.po_qty,0,',','.')+'</div>';
                                    // input income qty
                                    tmpHtml += '<div class="text-right">'+price.format((v.po_qty-v.qty),0,',','.')+'</div>';
                                    // input measure
                                    tmpHtml += '<div class="text-center">'+v.measure_type+'</div>';
                                    tmpHtml += '<div class=""><input type="text" class="form-control form-control-sm date-picker" name="data['+v.po_code+']['+v.pod_code+'][date]" value="'+(v.po_date_delivery == null?'':v.po_date_delivery)+'" placeholder="Tanggal Terima" title="Tanggal Terima" readonly></div>';
                                    tmpHtml += '<div class="typeahead"><input type="text" class="form-control form-control-sm supplier" name="data['+v.po_code+']['+v.pod_code+'][supplier]" value="'+(v.supplier_code == null?'':v.supplier_code+' - '+v.supplier_name)+'" placeholder="Supplier" title="Supplier"></div>';
                                    tmpHtml += '<div class=""><input type="text" class="form-control form-control-sm numberonly pricing" name="data['+v.po_code+']['+v.pod_code+'][price]" value="'+(v.stock_price == null?'':v.stock_price)+'" data-id="'+v.pod_code+'" data-skin="dark" data-toggle="kt-tooltip" data-container="body" data-placement="top" data-original-title="" placeholder="Harga" title="Harga"></div>';
                                    tmpHtml += '<div class=""><input type="text" class="form-control form-control-sm numberonly" name="data['+v.po_code+']['+v.pod_code+'][qty]" value="'+v.po_qty+'" placeholder="Tersedia" title="Tersedia"></div>';
                                    tmpHtml += '</div>';
                                    $('#FPO .po-table').append(tmpHtml);
                                    // datepicker
                                    $('input[name="data['+v.po_code+']['+v.pod_code+'][date]"]').datepicker({
                                        format: "dd/mm/yyyy",
                                        pickTime: false,
                                        startDate: date,
                                        clearBtn: true,
                                        autoclose: true
                                    }).on('hide',function(event){
                                      	event.preventDefault();
                                      	event.stopPropagation();
                                    });

                                    // autocomplete
                                    var map = {};
                                    var res = [],
                                    PicAutocomplete = $('[name="data['+v.po_code+']['+v.pod_code+'][pic]"]').typeahead(null, {
                                        name: 'pic',
                                        source: function(query,psc){
                                            $.ajax({
                                                url: api_url+'/api/account/user/autocomplete',
                                                type: 'POST',
                                                data: {find:query},
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
                                            data = selection.split(' - ');
                                        PicAutocomplete.typeahead('val',map[selection]);
                                    });

                                    // supplier autocomplete
                                    $('input[name="data['+v.po_code+']['+v.pod_code+'][supplier]"]').typeahead(null, {
                                        name: 'stock_name',
                                        source: function(query,psc){
                                            $.ajax({
                                                url: api_url+'/api/mst/supplier/autocomplete',
                                                type: 'POST',
                                                data: {find:query},
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
                                    });
                                    // masking number format
                                    $('input[name="data['+v.po_code+']['+v.pod_code+'][price]"], input[name="data['+v.po_code+']['+v.pod_code+'][qty]"]').inputmask('decimal', {
                                        rightAlignNumerics: false
                                    });

                                    // check last update price is higher or not
                                    var ajx = "";
                                    $('input[name="data['+v.po_code+']['+v.pod_code+'][price]"]').on('keyup', function(){
                                      var el = this;
                                      if(typeof ajx === 'object'){
                                        ajx.abort();
                                      }
                                      $(el).attr('title','');

                                      if($('input[name="data['+v.po_code+']['+$(el).data('id')+'][supplier]"]').val() !== ""){
                                        ajx = $.ajax({
                                          url: api_url+'/api/pur/req/po/check_price',
                                          type: 'POST',
                                          data: {main_stock_code: $(el).data('id'), supplier_code:$('input[name="data['+v.po_code+']['+$(el).data('id')+'][supplier]"]').val()},
                                          success: function(r){
                                            $(el).attr('data-original-title',"");
                                            $(el).removeClass('is-higher');
                                            $(el).parent().removeClass('is-higher');
                                            $(el).removeClass('is-lower');
                                            $(el).parent().removeClass('is-lower');

                                            if(r.status){
                                              if(parseFloat($(el).val()) > r.data){
                                                $(el).attr('data-original-title','harga sebelumnya : '+r.data);
                                                if(!$(el).hasClass('is-higher'))
                                                  $(el).addClass('is-higher');
                                                if(!$(el).parent().hasClass('is-higher'))
                                                  $(el).parent().addClass('is-higher');
                                              } else if(parseFloat($(el).val()) < r.data){
                                                $(el).attr('data-original-title','harga sebelumnya : '+r.data);
                                                if(!$(el).hasClass('is-lower'))
                                                  $(el).addClass('is-lower');
                                                if(!$(el).parent().hasClass('is-lower'))
                                                  $(el).parent().addClass('is-lower');
                                              }
                                            }
                                          }
                                        }).done(function(){
                                          $('input[data-toggle="kt-tooltip"]').tooltip({
                                            trigger: "hover",
                                            template: '<div class="tooltip tooltip-dark" role="tooltip">\
                                            <div class="arrow"></div>\
                                            <div class="tooltip-inner"></div>\
                                            </div>'
                                          });
                                        });
                                      }
                                    });
                                  });

                                  $("input[name=req_take_nik]").on('dblclick', function(){
                                    $(this).prop('readonly',false);
                                  });

                                  $('#FPO .data div[data-toggle="kt-tooltip"]').tooltip({
                                    trigger: "hover",
                                    template: '<div class="tooltip tooltip-dark" role="tooltip">\
                                        <div class="arrow"></div>\
                                        <div class="tooltip-inner"></div>\
                                    </div>'
                                  });

                                  // begin: split function for new task to PIC
                                  $('.split').click(function(){
                                    // destroy event before create new element
                                    $('input.supplier, input.po-pic').typeahead('destroy');
                                    $('input.date-picker').datepicker('destroy');
                                    console.log($('input.numberonly'));
                                    $('input.numberonly').inputmask('remove');
                                    console.log($(this).parent().parent().attr('last_id'));
                                    if(typeof $(this).parent().parent().attr('last_id') == 'undefined')
                                      $(this).parent().parent().attr('last_id',0);

                                    var el = this,
                                    row = $(el).parent().parent()[0].outerHTML;
                                    // remove did
                                    row = row.replace($(el).parent().parent().attr('did'),'new');
                                    row = row.replace('[pic]','[new]['+$(el).parent().parent().attr('last_id')+'][pic]');
                                    row = row.replace('[qty]','[new]['+$(el).parent().parent().attr('last_id')+'][qty]');
                                    row = row.replace('[date]','[new]['+$(el).parent().parent().attr('last_id')+'][date]');
                                    row = row.replace('[supplier]','[new]['+$(el).parent().parent().attr('last_id')+'][supplier]');
                                    row = row.replace('[price]','[new]['+$(el).parent().parent().attr('last_id')+'][price]');
                                    row = row.replace('<div><i class="fa fa-plus split"></i></div>', '<div><i class="fa fa-trash" onclick="$(this).parent().parent().remove()"></i></div>');
                                    $(row).insertAfter($(el).parent().parent());
                                    // increment last_id
                                    $(el).parent().parent().attr('last_id',(parseInt($(el).parent().parent().attr('last_id'))+1));
                                    
                                    // autocomplete
                                    var map = {};
                                    var res = [],
                                    PicAutocomplete = $('.po-pic').typeahead(null, {
                                        name: 'pic',
                                        source: function(query,psc){
                                            $.ajax({
                                                url: api_url+'/api/account/user/autocomplete',
                                                type: 'POST',
                                                data: {find:query},
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
                                            data = selection.split(' - ');

                                        $(event.target).typeahead('val',map[selection]);
                                    });
                                    // event for datepicker
                                    $('input.date-picker').datepicker({
                                        format: "dd/mm/yyyy",
                                        pickTime: false,
                                        startDate: date,
                                        clearBtn: true,
                                        autoclose: true
                                    }).on('hide',function(event){
                                        event.preventDefault();
                                        event.stopPropagation();
                                    });

                                    // event for supplier
                                    $('input.supplier').typeahead(null, {
                                        name: 'supplier',
                                        source: function(query,psc){
                                            $.ajax({
                                                url: api_url+'/api/mst/supplier/autocomplete',
                                                type: 'POST',
                                                data: {find:query},
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
                                    });
                                    // masking event
                                    $('input.numberonly').inputmask('decimal', {
                                        rightAlignNumerics: false
                                    });
                                    // check last update price is higher or not
                                    var ajx = "";
                                    $('input.pricing').on('keyup', function(){
                                      var el = this,
                                          spl_name = ($(this).attr('name')).replace('[price]','[supplier]');

                                      if(typeof ajx === 'object'){
                                        ajx.abort();
                                      }
                                      $(el).attr('title','');

                                      if($('input[name="'+spl_name+'"]').val() !== ""){
                                        ajx = $.ajax({
                                          url: api_url+'/api/pur/req/po/check_price',
                                          type: 'POST',
                                          data: {main_stock_code: $(el).data('id'), supplier_code:$('input[name="'+spl_name+'"]').val()},
                                          success: function(r){
                                            $(el).attr('data-original-title',"");
                                            $(el).removeClass('is-higher');
                                            $(el).parent().removeClass('is-higher');
                                            $(el).removeClass('is-lower');
                                            $(el).parent().removeClass('is-lower');

                                            if(r.status){
                                              if(parseFloat($(el).val()) > r.data){
                                                $(el).attr('data-original-title','harga sebelumnya : '+r.data);
                                                if(!$(el).hasClass('is-higher'))
                                                  $(el).addClass('is-higher');
                                                if(!$(el).parent().hasClass('is-higher'))
                                                  $(el).parent().addClass('is-higher');
                                              } else if(parseFloat($(el).val()) < r.data){
                                                $(el).attr('data-original-title','harga sebelumnya : '+r.data);
                                                if(!$(el).hasClass('is-lower'))
                                                  $(el).addClass('is-lower');
                                                if(!$(el).parent().hasClass('is-lower'))
                                                  $(el).parent().addClass('is-lower');
                                              }
                                            }
                                          }
                                        }).done(function(){
                                          $('input[data-toggle="kt-tooltip"]').tooltip({
                                            trigger: "hover",
                                            template: '<div class="tooltip tooltip-dark" role="tooltip">\
                                            <div class="arrow"></div>\
                                            <div class="tooltip-inner"></div>\
                                            </div>'
                                          });
                                        });
                                      }
                                    });

                                  });
                                  // end: split function

                                  $('#addPo').modal('show');
                                }
                            }
                        },
                        error: function(){
                            console.log('error getting data');
                        }
                    });
                });
            });


        });
        myGrid.init();
        _el = myGrid.element();
    }
    return {
        init: function(){
            _KTDatatable();
        },
        element: function(){
            return _el;
        }
    }
}();

var KTDateRange = function(){
    var dateRange = function(opt){
        if(typeof opt.elStart !== 'undefined' && typeof opt.elEnd !== 'undefined'){
            $(opt.elStart).on('changeDate', function(selected) {
                if($(this).val() != ""){
                    var startDate = new Date(selected.date.valueOf());
                    $(opt.elEnd).datepicker('setStartDate', startDate);
                    if($(opt.elStart).val() > $(opt.elEnd).val()){
                        $(opt.elEnd).val($(opt.elStart).val());
                    }
                }
            });
            $(opt.elEnd).on('changeDate', function(selected) {
                if($(this).val() != ""){
                    var endDate = new Date(selected.date.valueOf());
                    $(opt.elStart).datepicker('setEndDate', endDate);
                    if($(opt.elStart).val() > $(opt.elEnd).val()){
                        $(opt.elStart).val($(opt.elEnd).val());
                    }
                }
            });
        }
    }
    return {
        set: function(opt){
            new dateRange(opt);
        }
    };
}();

$(document).ready(function(){
    // initiate
    KTGridPO.init();
    KTFormPO.init();
    KTDateRange.set({elStart:'[name="in[start]"]', elEnd:'[name="in[end]"]'});

    $("#addPo").on('hide.bs.modal', function(){
      $('#FPO .po-table .data').remove();
    });

    // submit form PO
    $('#addPo .btn-submit').on('click', function(){
      $('#FPO').submit();
    });

    // export excel
    $('[data-export=excel]').on('click', function(){
      var data = {
        api: api_url,
        page_code: window.Auth.page,
        query: {
          find:$('#generalSearch').val(),
          status:$('.filter [name=status]').val()
        }
      };

      if($('[name="in[start]"]').val() != "")
        Object.assign(data.query, {start_date:$('[name="in[start]"]').val()});
      if($('[name="in[end]"]').val() != "")
        Object.assign(data.query, {end_date:$('[name="in[end]"]').val()});

      if($('.kt-datatable th.kt-datatable__cell--sorted').length > 0){
        var tmp = {
            'sort' : {
              field: $('.kt-datatable th.kt-datatable__cell--sorted')[0].dataset.field,
              sort: $('.kt-datatable th.kt-datatable__cell--sorted')[0].dataset.sort
            }
        };
        Object.assign(data,tmp);
      }
      KTDownload.post(base_url + '/' + window.Auth.page + '/export/excel/req/po_pur', data);
    });
});
