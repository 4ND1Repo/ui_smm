"use strict";

window.grid = '#datagrid-management-activity';

var KTGrid = function(){
  var gridId = window.grid,
      column = [{
            field: 'history_date',
            title: 'Tanggal Aktifitas'
        }, {
            field: 'nik',
            title: 'NIK'
        }, {
            field: 'activity_type',
            title: 'Aktifitas'
        }, {
            field: 'history_description',
            title: 'Keterangan'
        }, {
            field: 'action',
            title: 'Aksi',
            sortable: false,
            width: 120,
            overflow: 'visible',
            autoHide: false,
            class: 'text-center',
            template: function(row) {
                var btn = '';
                if(window.role.del == 1)
                  btn += '\
                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btn-delete" id="'+row.history_id+'" title="Delete">\
                        <i class="la la-trash"></i>\
                    </a>\ ';
                return btn;
            },
        }],
      height = '550',
      url = api_url+'/api/mng/activity/grid',
      link_delete = api_url+'/api/mng/activity/delete',
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
      this[window.grid.replace(/'#|.'/g,'')] = grid();
    },
    element: function(){
      return this[window.grid.replace(/'#|.'/g,'')];
    },
    reload: function(){
      this[window.grid.replace(/'#|.'/g,'')].reload();
    }
  };
}();


jQuery(document).ready(function () {
    // initiate
    KTGrid.init();
});
