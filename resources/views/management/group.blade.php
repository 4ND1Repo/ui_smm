<!-- begin:: Content Head -->
<div class="kt-subheader   kt-grid__item" id="kt_subheader">
    <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Management > Group</h3>
    </div>
</div>
<!-- end:: Content Head -->

<!-- begin:: Content -->
<div class="kt-content  kt-grid__item kt-grid__item--fluid" id="kt_content">

    <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
            <div class="kt-portlet__head-label">
                <span class="kt-portlet__head-icon">
                    <i class="kt-font-brand flaticon2-line-chart"></i>
                </span>
                <h3 class="kt-portlet__head-title">
                    Group
                </h3>
            </div>
            <div class="kt-portlet__head-toolbar">
                <div class="kt-portlet__head-wrapper">
                    <a href="javascript:;" class="btn btn-clean btn-icon-sm btn-back">
                        <i class="la la-long-arrow-left"></i>
                        Back
                    </a>
                    &nbsp;
                    <div class="dropdown dropdown-inline">
                        <button type="button" class="btn btn-brand btn-icon-sm" data-toggle="modal" data-target='#addGroup'>
                            <i class="flaticon2-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="kt-portlet__body">

            <!--begin: Search Form -->
            <div class="kt-form kt-form--label-right">
                <div class="row align-items-center">
                    <div class="col-xl-12 order-2 order-xl-1">
                        <div class="row align-items-center">
                            <div class="col-md-9">&nbsp;</div>
                            <div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
                                <div class="kt-input-icon kt-input-icon--left">
                                    <input type="text" class="form-control" placeholder="Search..." id="generalSearch" name="find">
                                    <span class="kt-input-icon__icon kt-input-icon__icon--left">
                                        <span><i class="la la-search"></i></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!--end: Search Form -->
        </div>
        <div class="kt-portlet__body kt-portlet__body--fit">

            <!--begin: Datatable -->
            <div class="kt-datatable" id="datagrid-management-groups"></div>
            <!--end: Datatable -->
        </div>
    </div>

</div>

<!-- modal for add group -->
<div class="modal fade" id="addGroup" tabindex="-1" role="dialog" aria-labelledby="Modal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="longModal">Group</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body">
                <form class="kt-form" id="FGroup">
                    <div class="row validated">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Group Name</label>
                                <input type="text" tabindex="1" name="group_name" class="form-control" placeholder="Group Name" autocomplete="off">
                            </div>
                            <div class="form-group">
                                <label>Page Menu</label>
                                <select name="page_code" tabindex="4" class="form-control" data-live-search="true"></select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Company</label>
                                <select name="company_code" tabindex="4" class="form-control" data-live-search="true"></select>
                            </div>
                            <div class="form-group">
                                <label>Department</label>
                                <select name="department_code" tabindex="4" class="form-control" data-live-search="true"></select>
                            </div>
                            <div class="form-group">
                                <label>Division</label>
                                <select name="division_code" tabindex="4" class="form-control" data-live-search="true"></select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" tabindex="8" class="btn btn-secondary" data-dismiss="modal">Back</button>
                <button type="button" tabindex="7" class="btn btn-primary btn-submit">Save</button>
            </div>
        </div>
    </div>
</div>

<!--end::Modal-->


<!-- modal for add user menu -->
<div class="modal fade" id="addUserMenu" tabindex="-1" role="dialog" aria-labelledby="Modal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="longModal">Role Menu</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body">
                <form class="kt-form" id="FUserMenu"></form>
            </div>
            <div class="modal-footer">
                <button type="button" tabindex="8" class="btn btn-secondary" data-dismiss="modal">Back</button>
                <button type="button" tabindex="7" class="btn btn-primary btn-submit">Save</button>
            </div>
        </div>
    </div>
</div>

<!--end::Modal-->
