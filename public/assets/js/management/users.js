
"use strict";

window.formId = '#FUser',
window.formModal = '#addUser';
window.grid = '#datagrid-management-users';

var KTForm = function(){
  var formId = window.formId,
      link = api_url+'/api/account/user/',
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
            var linkProccess = link+($(window.formModal+" .btn-submit")[0].hasAttribute('edit')?'edit':'add');

            var data = $(formId).serializeArray();
            data.push({name:"nik", value:window.Auth.nik});
            data.push({name:"menu_page", value:window.Auth.page});
            $.ajax({
                url: linkProccess,
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
                            $('input[name="username"]').parent().find('div').remove();
                            if($(window.formModal+" .btn-submit")[0].hasAttribute('edit'))
                              $(window.formModal).modal('hide');
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

  var setRemoveRules = function(el,rule){
    if(rule !== null)
      $(el).rules("remove", rule);
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
    },
    removeRules: function(el, rules=null){
      setRemoveRules(el, rules);
    }
  };
}();

var KTGrid = function(){
  var gridId = window.grid,
      column = [{
            field: 'nik',
            title: 'NIK'
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
            field: 'status_label',
            title: 'Status',
            template: function(row){
                var status = {
                    "ST01": {'title': 'Success', 'class': ' kt-badge--success'},
                    "ST00": {'title': 'Danger', 'class': ' kt-badge--danger'},
                };
                return '<span class="kt-badge ' + (typeof status[row.status_code] !== 'undefined'?status[row.status_code].class:'') + ' kt-badge--inline kt-badge--pill">' + row.status_label + '</span>';
            }
        }, {
            field: 'action',
            title: 'Action',
            sortable: false,
            width: 80,
            overflow: 'visible',
            autoHide: false,
            class: 'text-center',
            template: function(row) {
                var btn = '\
                  <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-edit" id="'+row.nik+'" title="Edit">\
                      <i class="la la-pencil"></i>\
                  </a>\ ';
                  btn += '\
                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.nik+'" title="Delete">\
                        <i class="la la-trash"></i>\
                    </a>\ ';
                return (row.company_code == null && row.department_code == null && row.division_code == null)?"":btn;
            },
        }],
      height = '550',
      url = api_url+'/api/account/user/grid',
      link_edit = api_url+'/api/account/user/edit',
      link_find = api_url+'/api/account/user/find',
      link_delete = api_url+'/api/account/user/delete',
      page = '10';

  var grid = function(){
    var genGrid = new myGrids(url, gridId, height, page);
    genGrid.set('column', column);
    genGrid.set('fn', function(){
      $('.kt-datatable').on('kt-datatable--on-layout-updated', function() {
          $('.btn-edit').click(function(){
              $.ajax({
                  url: link_find+"/"+$(this).attr('id'),
                  type: 'GET',
                  success: function(r){
                      if(r.status == 1){
                        KTSelectDepartment.get(r.data.company_code);
                        KTSelectDivision.get(r.data.company_code,r.data.department_code);

                        // set value
                        $('select[name=company_code]').val(r.data.company_code).selectpicker('refresh');
                        KTSelectDepartment.element().done(function(){
                          $('select[name=department_code]').val(r.data.department_code).selectpicker('refresh');
                        });
                        KTSelectDivision.element().done(function(){
                          $('select[name=division_code]').val(r.data.division_code).selectpicker('refresh');
                        });
                        $('input[name=username]').val(r.data.nik);
                        $(window.formModal+' .btn-submit').attr('edit',1);
                        $('input[name="username"]').prop('readonly', true);
                        $(window.formModal).modal('show');
                      }
                  },
                  error: function(){
                      console.log('error find data');
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
    KTForm.rules('input[name=nik]',{required:true, maxlength:20});
    KTForm.rules('input[name=password]',{maxlength:12, minlength: 4});
    KTForm.rules('input[name=repassword]',{equalTo:'input[name=password]'});
    KTForm.rules('select[name=company_code]',{required:true});


    // get select contents
    // company
    $.ajax({
      url:api_url+'/api/mst/company',
      type: 'GET',
      success: function(r){
        var option = '<option value="">-- Choose One --</option>';
        $.each(r.data, function(k,v){
          option += '<option value="'+v.company_code+'">'+v.company_name+'</option>';
        });
        $('select[name="company_code"]').html(option);
        $('select[name="company_code"]').selectpicker();
      }
    });

    $('select[name="department_code"], select[name="division_code"]').selectpicker();

    // department
    $('select[name="company_code"]').on('change', function(){
      KTSelectDepartment.get($(this).val());
    });

    // division
    $('select[name="department_code"]').on('change', function(){
      KTSelectDivision.get($('select[name="company_code"]').val(),$(this).val());
    });

    // check NIK
    var _elNik;
    $('input[name="username"]').on('keyup', function(){
      if(!$(window.formModal+' .btn-submit')[0].hasAttribute('edit')){
        if(typeof _elNik == 'object') _elNik.abort();
        var _el = this;
        _elNik = $.ajax({
          url: api_url+'/api/account/user/check',
          type: 'POST',
          data: {nik:$(_el).val()},
          success: function(r){
            if(r.status){
              $(_el).parent().find('div').remove();
              if(r.data.count > 0){
                $(_el).parent().append('<div class="invalid-feedback">NIK unavailable (Next ID : '+r.data.last+')</div>');
              } else
                $(_el).parent().append('<div class="valid-feedback">NIK available</div>');
            }
            console.log(r);
          }
        });
      }
    });

    $(window.formModal).on('hide.bs.modal', function(){
      var _elCompany = 'select[name=company_code]',
          _elDepartment = 'select[name=department_code]';
      $(window.formId)[0].reset();
      $(_elCompany).val("").selectpicker('refresh');
      KTSelectDepartment.get($(_elCompany).val());
      KTSelectDivision.get($(_elCompany).val(),$(_elDepartment).val());
      $(window.formModal+' .btn-submit').removeAttr('edit');
      $('input[name="username"]').parent().find('div').remove();
      KTForm.element().resetForm();
      $(formId).find('.invalid-feedback').remove();
    });

    $(window.formModal).on('show.bs.modal', function(){
      // validation for password
      var btnSubmit = window.formModal+' .btn-submit';
      console.log($(btnSubmit)[0].hasAttribute('edit'));
      if($(btnSubmit)[0].hasAttribute('edit'))
        KTForm.removeRules('input[name=password]','required');
      else
        KTForm.rules('input[name=password]',{required:true});
    });

    // submit form Icon
    $(window.formModal+' .btn-submit').on('click', function(){
      $(window.formId).submit();
    });
});
