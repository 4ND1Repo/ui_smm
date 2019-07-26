"use strict";

window.formId = '#FMenu',
window.formModal = '#addMenu';
window.grid = '#datagrid-management-menu';

var KTForm = function(){
  var formId = window.formId,
      link = api_url+'/api/mst/menu/add',
      formRules = {};

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
            var data = $(formId).serializeArray();
            data.push({name:"nik", value:window.Auth.nik});
            data.push({name:"menu_page", value:window.Auth.page});
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
                            $(formId)[0].reset();
                            $('select').selectpicker('refresh');
                            KTGrid.reload();
                            KTParentMenu.get($('select[name="menu_page"]').val());
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
                },
                error: function(){

                }
            });
            return false;
        }
    });
  }

  var setRules = function(el,rule){
    $(el).rules("add", rule?rule:{required:true});
  }

  return {
    init: function(){
      this[formId.replace(/'#|.'/g,'')] = validation();
    },
    element: function(){
      return this[formId.replace(/'#|.'/g,'')]
    },
    rules: function(el, rules=null){
      setRules(el, rules);
    }
  };
}();

var KTGrid = function(){
  var gridId = window.grid,
      column = [{
            field: 'menu_icon',
            title: 'Icon',
            sortable: false,
            template: function(row){
                return '<i class="'+row.menu_icon+'"></i>';
            }
        }, {
            field: 'menu_name',
            title: 'Name'
        }, {
            field: 'page',
            title: 'For'
        }, {
            field: 'menu_url',
            title: 'URI'
        }, {
            field: 'parent',
            title: 'Parent'
        }, {
            field: 'action',
            title: 'Action',
            sortable: false,
            width: 60,
            overflow: 'visible',
            autoHide: false,
            class: 'text-center',
            template: function(row) {
                var btn = '\
                  <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.id_menu+'" title="Delete">\
                      <i class="la la-trash"></i>\
                  </a>\ ';
                return btn;
            },
        }],
      height = '550',
      url = api_url+'/api/mst/menu/grid',
      link_delete = api_url+'/api/mst/menu/delete',
      page = '10';

  var grid = function(){
    var genGrid = new myGrids(url, gridId, height, page);
    genGrid.set('column', column);
    genGrid.set('fn', function(){
      $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {
          $('.btn-delete').click(function(){
              Swal.fire({
                  title: 'Are you sure?',
                  text: "You can't get it back!",
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Ya',
                  cancelButtonText: 'Tidak',
              }).then((result) => {
                  if (result.value) {
                      $.ajax({
                          url: link_delete,
                          type: 'POST',
                          data: {'id':$(this).attr('id'),nik:window.Auth.nik},
                          success: function(r){
                              Swal.fire({
                                  title: 'Deleted!',
                                  text: 'Data was deleted.',
                                  type: 'success',
                                  showConfirmButton: false,
                                  timer: 1500
                              });
                              KTGrid.reload();
                              $('[name=find]')[0].focus();
                          },
                          error: function(){
                              console.log('error delete');
                          }
                      });
                  }
              });
          });
      });
    });
    // initiate
    genGrid.init();
    return genGrid.get('datatable');
  }

  return {
    init: function(){
      this[formId.replace(/'#|.'/g,'')] = grid();
    },
    element: function(){
      return this[formId.replace(/'#|.'/g,'')];
    },
    reload: function(){
      this[formId.replace(/'#|.'/g,'')].reload();
    }
  };
}();

var KTParentMenu = function(){
  var idParent = 'select[name="id_parent"]',
      link = api_url+"/api/mst/menu/parent",
      option = "";

  var getParent = function(pg){
    $.ajax({
      url: link,
      type: 'POST',
      data: {menu_page: pg},
      success: function(r){
        console.log(r);
        option = "<option value=''>-- Root --</option>";
        $.each(r.data, function(k,v){
          option += '<option value="'+v.id_menu+'" data-subtext="'+v.parent+'">'+v.menu_name+'</option>';
        });
        $(idParent).html(option);
        $(idParent).selectpicker('refresh');
      }
    });
  }
  return {
    get: function(pg){
      getParent(pg);
    }
  };
}();

jQuery(document).ready(function () {
    myStorage.set('auth');
    window.Auth = JSON.parse(myStorage.get());

    // initiate
    KTForm.init();
    KTGrid.init();

    // set Rules
    KTForm.rules('input[name=menu_name]',{required:true, maxlength:20});
    KTForm.rules('input[name=menu_url]',{required:true});
    KTForm.rules('select[name=menu_page]',{required:true});


    // get select contents
    // page_menu
    $.ajax({
      url:api_url+'/api/mst/page',
      type: 'GET',
      success: function(r){
        var option = "";
        $.each(r.data, function(k,v){
          option += '<option value="'+v.page_code+'">'+v.page_name+'</option>';
        });
        $('select[name="menu_page"]').html(option);

        // icon
        $.ajax({
          url: api_url+'/api/mst/icon',
          type: 'GET',
          success: function(r){
            option = "";
            $.each(r.data, function(k,v){
              option += '<option value="'+v.icon_name+'" data-icon="'+v.icon_name+'">'+v.icon_name+'</option>';
            });
            $('select[name="menu_icon"]').html(option);

            // generate parent menu
            KTParentMenu.get($('select[name="menu_page"]').val());
            $('select').selectpicker();
          }
        });
      }
    });

    $('select[name="menu_page"]').on('change', function(){
      var el = this;
      KTParentMenu.get($(el).val());
    });

    // submit form Icon
    $(window.formModal+' .btn-submit').on('click', function(){
      $(window.formId).submit();
    });
});
