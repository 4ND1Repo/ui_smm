"use strict";

window.formId = '#FIcon',
window.formModal = '#addIcon';
window.grid = '#datagrid-master-icon';

var KTForm = function(){
  var formId = window.formId,
      link = api_url+'/api/mst/icon/add',
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
            data.push({name:"page_code", value:window.Auth.page});
            // block ui modal
            var target = window.formModal+' .modal-content';
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
                            $(formId+' .icon-view i').attr('class', '');
                            $(formId)[0].reset();
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
            field: '#',
            title: '#',
            sortable: false,
            width: 20,
            template: function(row){
              return '<i class="'+row.icon_name+'"></i>';
            }
        }, {
            field: 'icon_name',
            title: 'Icon Name'
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
                  <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.icon_id+'" title="Delete">\
                      <i class="la la-trash"></i>\
                  </a>\ ';
                return btn;
            },
        }],
      height = '550',
      url = api_url+'/api/mst/icon/grid',
      link_delete = api_url+'/api/mst/icon/delete',
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

jQuery(document).ready(function () {
    myStorage.set('auth');
    window.Auth = JSON.parse(myStorage.get());

    // initiate
    KTForm.init();
    KTGrid.init();

    // generate view icon
    $('input[name=icon_name]').on('keyup', function(){
        var el = this;
        $(window.formId+" .icon-view  i").attr('class', $(el).val());
    });

    // set Rules
    KTForm.rules('input[name=icon_name]',{required:true, maxlength:50});

    // submit form Icon
    $(window.formModal+' .btn-submit').on('click', function(){
      $(window.formId).submit();
    });
});
