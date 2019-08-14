"use strict";

window.formId = '#FGroup',
window.formModal = '#addGroup';
window.grid = '#datagrid-management-groups';

var KTForm = function(){
  var formId = window.formId,
      link = api_url+'/api/mng/user/group/',
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
            // block ui modal
            var target = window.formModal+' .modal-content', ln="";
            ln = link + (($(window.formModal).find('.btn-submit')[0].hasAttribute('edit'))?'edit':'add');

            KTApp.block(target, {
                overlayColor: '#000000',
                type: 'v2',
                state: 'primary',
                message: 'Processing...'
            });

            $.ajax({
                url: ln,
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
                            if($(window.formModal).find('.btn-submit')[0].hasAttribute('edit')){
                              $(window.formModal).modal('hide');
                            }
                            KTGrid.reload();
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
            field: 'group_code',
            title: 'Group Code'
        }, {
            field: 'group_name',
            title: 'Name'
        }, {
            field: 'page_name',
            title: 'Page'
        }, {
            field: 'company_name',
            title: 'Company'
        }, {
            field: 'department_name',
            title: 'Department'
        }, {
            field: 'division_name',
            title: 'Division'
        }, {
            field: 'action',
            title: 'Action',
            sortable: false,
            width: 120,
            overflow: 'visible',
            autoHide: false,
            class: 'text-center',
            template: function(row) {
                var btn = '\
                  <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-edit" id="'+row.group_code+'" title="Edit">\
                      <i class="la la-pencil"></i>\
                  </a>\
                  <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-role" id="'+row.group_code+'" title="Role menu">\
                      <i class="la la-list-alt"></i>\
                  </a>\
                  <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.group_code+'" title="Delete">\
                      <i class="la la-trash"></i>\
                  </a>\ ';
                return (row.company_code == null && row.department_code == null && row.division_code == null)?"":btn;
            },
        }],
      height = '550',
      url = api_url+'/api/mng/user/group/grid',
      link_delete = api_url+'/api/mng/user/group/delete',
      link_find = api_url+'/api/mng/user/group/find',
      link_role = api_url+'/api/mng/user/group/role',
      page = '10';

  var grid = function(){
    var genGrid = new myGrids(url, gridId, height, page);
    genGrid.set('column', column);
    genGrid.set('fn', function(){
      $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {
          $('.btn-role').click(function(){
              var el = this;
              $.ajax({
                  url: link_role,
                  type: 'POST',
                  data: {id:$(el).attr('id')},
                  success: function(r){
                    if(r.status){

                      $("#FUserMenu").html('<div class="row"><div class="col-9 text-center">Menu</div><div class="col-1 text-center"><i class="la la-plus"></i></div><div class="col-1 text-center"><i class="la la-pencil"></i></div><div class="col-1 text-center"><i class="la la-trash"></i></div></div>').append(KTUserMenu.generate(r.data));
                      // get id menu by group id
                      console.log();
                      $.ajax({
                        url: api_url + '/api/mng/user/group/menu',
                        type: 'POST',
                        data: {group_code:$(el).attr('id')},
                        success: function(r){
                          if(r.status){
                            KTUserMenu.action(r.data);
                            $('#addUserMenu .btn-submit').attr('group_code',$(el).attr('id'));
                          }
                        }
                      });
                    }
                  }
              });
              $('#addUserMenu').modal('show');
          });

          $('.btn-edit').click(function(){
              $.ajax({
                  url: link_find+'/'+$(this).attr('id'),
                  type: 'GET',
                  success: function(r){
                      if(r.status){
                        var data = r.data;
                        KTSelectDepartment.get(data.company_code);
                        KTSelectDivision.get(data.company_code,data.department_code);

                        $(window.formId).append('<input type="hidden" name="group_code" value="'+data.group_code+'">');
                        $(window.formId+' input[name=group_name]').val(data.group_name);
                        $(window.formId+' select[name=page_code]').val(data.page_code).selectpicker('refresh');
                        $(window.formId+' select[name=company_code]').val(data.company_code).selectpicker('refresh');
                        KTSelectDepartment.element().done(function(){
                          $(window.formId+' select[name=department_code]').val(data.department_code).selectpicker('refresh');
                        });
                        KTSelectDivision.element().done(function(){
                          $(window.formId+' select[name=division_code]').val(data.division_code).selectpicker('refresh');
                        });
                        $('.btn-submit').attr('edit',1);

                        $(window.formModal).modal('show');
                      }
                  },
                  error: function(){
                      console.log('error find');
                  }
              });
          });

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

var KTUserMenu = function(){
  var _render = function(m,n){
    var mn = "", l = n;
    n=0;
    m.forEach(function(v,k){
      mn += '<div class="row">';
      mn += '<div class="col-9">\
      <label class="kt-checkbox">\
      <input type="checkbox" class="menu" data-id="'+v.id_menu+'" data-parent="'+v.id_parent+'" name="menu['+v.id_menu+']">';
      if(l > 0){
        for(var i=0; i<=l; i++){
          mn += "&nbsp;";
        }
        mn += "--&nbsp;";
      }
      mn += v.menu_name;
      mn += '<span></span>\
      </label>\
      </div>';

      // add checkbox
      mn += '<div class="col-1">';
      mn += (v.id_parent !== null || typeof v.children === 'undefined')?'<label class="kt-checkbox">\
        <input type="checkbox" class="add" data-id="'+v.id_menu+'" data-parent="'+v.id_parent+'" name="add['+v.id_menu+']" title="Add"><span></span>\
      </label>': "&nbsp;";
      mn += '</div>';

      // edit checkbox
      mn += '<div class="col-1">';
      mn += (v.id_parent !== null || typeof v.children === 'undefined')?'<label class="kt-checkbox">\
        <input type="checkbox" class="edit" data-id="'+v.id_menu+'" data-parent="'+v.id_parent+'" name="edit['+v.id_menu+']" title="Edit"><span></span>\
      </label>': "&nbsp;";
      mn += '</div>';

      // delete checkbox
      mn += '<div class="col-1">';
      mn += (v.id_parent !== null || typeof v.children === 'undefined')?'<label class="kt-checkbox">\
        <input type="checkbox" class="del" data-id="'+v.id_menu+'" data-parent="'+v.id_parent+'" name="del['+v.id_menu+']" title="Delete"><span></span>\
      </label>': "&nbsp;";
      mn += '</div>';

      mn += "</div>";
      if(typeof v.children !== 'undefined')
        mn += KTUserMenu.generate(v.children,l+1);
    });
    return mn
  }

  var _fn = function(f){
    $('input[type=checkbox]').change(function(){
      if($(this).is(":checked")){
        // check if this menu have child
        if($("input.menu[data-parent="+$(this).data('id')+"]").length > 0){
          $("input.menu[data-parent="+$(this).data('id')+"]").prop('checked',true);
          $("input.add[data-parent="+$(this).data('id')+"]").prop('checked',true);
          $("input.edit[data-parent="+$(this).data('id')+"]").prop('checked',true);
          $("input.del[data-parent="+$(this).data('id')+"]").prop('checked',true);
        } else {
          // if a children
          if($(this).data('parent') !== 'null' && $(this).hasClass('menu')){
            $('input[data-id='+$(this).data('parent')+']').prop('checked',true);
            $("input.add[data-id="+$(this).data('id')+"]").prop('checked',true);
            $("input.edit[data-id="+$(this).data('id')+"]").prop('checked',true);
            $("input.del[data-id="+$(this).data('id')+"]").prop('checked',true);
          } else {
            // checked menu
            $('input[data-id='+$(this).data('id')+'].menu').prop('checked',true);

            // checked parent
            if($('input[data-parent='+$(this).data('parent')+'].menu').length > 0){
              $('input[data-id='+$(this).data('parent')+'].menu').prop('checked',true);
            }
          }
        }
      } else {
        // check if this menu have child
        if($("input.menu[data-parent="+$(this).data('id')+"]").length > 0){
          $("input.menu[data-parent="+$(this).data('id')+"]").prop('checked',false);
          $("input.add[data-parent="+$(this).data('id')+"]").prop('checked',false);
          $("input.edit[data-parent="+$(this).data('id')+"]").prop('checked',false);
          $("input.del[data-parent="+$(this).data('id')+"]").prop('checked',false);
        } else {
          // if a children
          if($(this).data('parent') !== 'null' && $(this).hasClass('menu')){
            if($("input.menu[data-parent="+$(this).data('parent')+"]:checked").length == 0){
              $('input[data-id='+$(this).data('parent')+']').prop('checked',false);
            }
            $("input.add[data-id="+$(this).data('id')+"]").prop('checked',false);
            $("input.edit[data-id="+$(this).data('id')+"]").prop('checked',false);
            $("input.del[data-id="+$(this).data('id')+"]").prop('checked',false);
          } else {
            // check action is uncheck
            if(($("input[data-id="+$(this).data('id')+"]:checked").length-1) <= 0){
              $("input.menu[data-id="+$(this).data('id')+"]").prop('checked', false);
              // check menu is uncheck
              if($("input.menu[data-parent="+$(this).data('parent')+"]:checked").length <= 0){
                $("input.menu[data-id="+$(this).data('parent')+"]").prop('checked', false);
              }
            }
          }
        }
      }
    });

    if(typeof f === 'object'){
      if(f.length > 0){
        f.forEach(function(v,k){
          $('input.menu[data-id="'+v.id_menu+'"]').prop('checked', true);
          if(typeof v.add !== 'undefined')
          $('input.add[data-id="'+v.id_menu+'"]').prop('checked', (v.add==1?true:false));
          if(typeof v.edit !== 'undefined')
          $('input.edit[data-id="'+v.id_menu+'"]').prop('checked', (v.edit==1?true:false));
          if(typeof v.del !== 'undefined')
          $('input.del[data-id="'+v.id_menu+'"]').prop('checked', (v.del==1?true:false));
        });
      }
    }
  }

  return {
    generate: function(m,n=0){
      return _render(m,n);
    },
    action: function(f={}){
      _fn(f);
    }
  };
}();

var KTSelectDepartment = function(){
  var element = 'select[name=department_code]',
      element_child = 'select[name="division_code"]';

  var _get = function(v){
    var option = '<option value="">-- None --</option>';
    if(v != ""){
      return $.ajax({
        url: api_url+'/api/mst/department',
        type: 'POST',
        data: {company_code:v},
        async: false,
        success: function(r){
          $.each(r.data, function(k,v){
            option += '<option value="'+v.department_code+'">'+v.department_name+'</option>';
          });
          $(element).html(option);
          $(element_child).html('<option value="">-- None --</option>');
          $(element+', '+element_child).selectpicker('refresh');
        }
      });
    } else {
      $(element).html(option);
      $(element_child).html('<option value="">-- None --</option>');
      $(element+', '+element_child).selectpicker('refresh');
    }
  }
  return {
    get: function(v=""){
      this['department'] = _get(v);
    },
    element: function(){
      return this['department'];
    }
  };
}();

var KTSelectDivision = function(){
  var element = 'select[name=division_code]';

  var _get = function(c,v){
    var option = '<option value="">-- None --</option>';
    if(c != "" && v != ""){
      return $.ajax({
        url: api_url+'/api/mst/division',
        type: 'POST',
        data: {company_code: c, department_code: v},
        async: false,
        success: function(r){
          $.each(r.data, function(k,v){
            option += '<option value="'+v.division_code+'">'+v.division_name+'</option>';
          });
          $(element).html(option);
          $(element).selectpicker('refresh');
        }
      });
    } else {
      $(element).html(option);
      $(element).selectpicker('refresh');
    }
  }
  return {
    get: function(c="",v=""){
      this['division'] = _get(c,v);
    },
    element: function(){
      return this['division'];
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
    KTForm.rules('input[name=group_name]',{required:true, maxlength:100});

    // page
    $.ajax({
      url: api_url+'/api/mst/page',
      type: 'GET',
      success: function(r){
        var option = "";
        $.each(r.data, function(k,v){
          option += '<option value="'+v.page_code+'">'+v.page_name+'</option>';
        });
        $('select[name="page_code"]').html(option);

        $.ajax({
          url: api_url+'/api/mst/company',
          type: 'GET',
          success: function(r){
            var option = "";
            $.each(r.data, function(k,v){
              option += '<option value="'+v.company_code+'">'+v.company_name+'</option>';
            });
            $('select[name="company_code"]').html(option);
            $('select').selectpicker();
            // get first company
            KTSelectDepartment.get($('select[name="company_code"]').val());
          }
        });
      }
    });

    // department
    $('select[name="company_code"]').on('change', function(){
      KTSelectDepartment.get($(this).val());
    });

    // division
    $('select[name="department_code"]').on('change', function(){
      KTSelectDivision.get($('select[name="company_code"]').val(),$(this).val());
    });

    // hide Modal
    $(window.formModal).on('hide.bs.modal', function(){
      $(window.formId)[0].reset();
      $(window.formId).find('input[name=group_code]').remove();
      $(window.formId+' select').selectpicker('refresh');
      $(window.formModal+' .btn-submit').removeAttr('edit');
    });

    // submit form Icon
    $(window.formModal+' .btn-submit').on('click', function(){
      $(window.formId).submit();
    });


    $('#addUserMenu .btn-submit').click(function(){
      var target = $('#addUserMenu .modal-content'),
          data = $('#FUserMenu').serializeArray();

      data.push({name:'group_code', value:$(this).attr('group_code')});
      KTApp.block(target, {
          overlayColor: '#000000',
          type: 'v2',
          state: 'primary',
          message: 'Processing...'
      });

      $.ajax({
        url: api_url+'/api/mng/user/group/genRole',
        type: 'POST',
        data: data,
        success: function(r){
          console.log(r);
          if(r.status){
            Swal.fire({
                title: 'Success!',
                text: 'Generate new Role.',
                type: 'success',
                showConfirmButton: false,
                timer: 1500
            });
            $('#addUserMenu').modal('hide');
          }
          KTApp.unblock(target);
        },
        error: function(e){
          KTApp.unblock(target);
        }
      });
    });
});
