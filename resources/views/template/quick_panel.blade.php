            </div>
            <!-- end:: div begin content -->

            <!-- begin:: Footer -->
            <div class="kt-footer kt-grid__item kt-grid kt-grid--desktop kt-grid--ver-desktop" id="kt_footer">
                <div class="kt-footer__copyright">
                    2019&nbsp;&copy;&nbsp;<a href="javascript:;" target="_blank" class="kt-link">Sarana Makin Mulya</a>
                </div>
                <div class="kt-footer__menu">
                    <a href="javascript:;" target="_blank" class="kt-footer__menu-link kt-link">Tentang</a>
                    <a href="javascript:;" target="_blank" class="kt-footer__menu-link kt-link">Developer</a>
                    <a href="javascript:;" target="_blank" class="kt-footer__menu-link kt-link">Kontak</a>
                </div>
            </div>

            <!-- end:: Footer -->
        </div>
    </div>
</div>

<!-- end:: Page -->

<!-- begin::Quick Panel -->
<style>
  .kt-quick-panel {
    overflow-y: hidden !important;
  }
  .kt-quick-panel .kt-quick-panel__content {
    height: 100%;
  }
  .kt-quick-panel .kt-quick-panel__content .tab-content {
    height: 100%;
  }
  .kt-quick-panel .kt-quick-panel__content .tab-content .tab-pane.active.show {
    height: 100%;
  }
  .kt-quick-panel .kt-quick-panel__content .tab-content .tab-pane.active.show #complaint-list {
    height: 100%;
  }
  .kt-quick-panel .kt-quick-panel__content .tab-content .tab-pane.active.show .kt-notification {
    height: calc(100% - 166.56px);
  }
</style>
<div id="kt_quick_panel" class="kt-quick-panel">
    <a href="javascript:;" class="kt-quick-panel__close" id="kt_quick_panel_close_btn"><i class="flaticon2-delete"></i></a>
    <div class="kt-quick-panel__nav">
        <ul class="nav nav-tabs nav-tabs-line nav-tabs-bold nav-tabs-line-3x nav-tabs-line-brand  kt-notification-item-padding-x" role="tablist">
            <li class="nav-item active">
                <a class="nav-link active" data-toggle="tab" href="#kt_quick_panel_tab_my_complaint" role="tab">Komplain Saya</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#kt_quick_panel_tab_complaint" role="tab">Komplain</a>
            </li>
            {{-- <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#kt_quick_panel_tab_settings" role="tab">Settings</a>
            </li> --}}
        </ul>
    </div>
    <div class="kt-quick-panel__content">
        <div class="tab-content">
            <div class="tab-pane fade show kt-scroll active" id="kt_quick_panel_tab_my_complaint" role="tabpanel">
                <form id="FComplaint">
                  <div class="col-sm-12">
                    <div class="row">
                      <div class="col-sm-6">
                        <div class="form-group form-group-sm">
                          <div class="typeahead">
                            <input type="text" class="form-control form-control-sm" name="complaint_to" placeholder="Kepada siapa?">
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group form-group-sm">
                          <select name="complaint_type" class="form-control form-control-sm">
                            <option value="CMPT001">Biasa</option>
                            <option value="CMPT002">Sedang</option>
                            <option value="CMPT003">Berat</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-sm-12">
                        <div class="form-group form-group-sm">
                          <textarea rows='4' class="form-control form-control-sm" name="complaint_description" placeholder="Isi Komplain"></textarea>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-sm-12">
                        <div class="form-group form-group-sm float-left">
                          <div class="kt-checkbox-list">
                            <label class="kt-checkbox kt-checkbox--warning">
                              <input type="checkbox" name="complaint_anonymous" value="1"> User Anonim
                              <span></span>
                            </label>
                          </div>
                        </div>
                        <div class="form-group form-group-sm float-right">
                          <input type="submit" class="btn btn-sm btn-wide btn-outline-warning" value="Kirim">
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <div class="kt-notification">
                    <a href="javascript:;" class="kt-notification__item">
                        <div class="kt-notification__item-icon">
                            <i class="flaticon2-line-chart kt-font-success"></i>
                        </div>
                        <div class="kt-notification__item-details">
                            <div class="kt-notification__item-title">
                                New order has been received
                            </div>
                            <div class="kt-notification__item-time">
                                2 hrs ago
                            </div>
                        </div>
                    </a>
                    <a href="javascript:;" class="kt-notification__item kt-notification__item--read">
                        <div class="kt-notification__item-icon">
                            <i class="flaticon2-safe kt-font-primary"></i>
                        </div>
                        <div class="kt-notification__item-details">
                            <div class="kt-notification__item-title">
                                Company meeting canceled
                            </div>
                            <div class="kt-notification__item-time">
                                19 hrs ago
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            <div class="tab-pane fade kt-scroll" id="kt_quick_panel_tab_complaint" role="tabpanel">
              <div id='complaint-list' class="col-sm-12">
                <div class="kt-timeline-v2">
									<div class="kt-timeline-v2__items  kt-padding-top-25 kt-padding-bottom-30">
										<div class="kt-timeline-v2__item">
											<span class="kt-timeline-v2__item-time">10:00</span>
											<div class="kt-timeline-v2__item-cricle">
												<i class="fa fa-genderless kt-font-danger"></i>
											</div>
											<div class="kt-timeline-v2__item-text  kt-padding-top-5">
												Lorem ipsum dolor sit amit,consectetur eiusmdd tempor<br>
												incididunt ut labore et dolore magna
											</div>
										</div>
										<div class="kt-timeline-v2__item">
											<span class="kt-timeline-v2__item-time">12:45</span>
											<div class="kt-timeline-v2__item-cricle">
												<i class="fa fa-genderless kt-font-success"></i>
											</div>
											<div class="kt-timeline-v2__item-text kt-timeline-v2__item-text--bold">
												AEOL Meeting With
											</div>
											<div class="kt-list-pics kt-list-pics--sm kt-padding-l-20">
												<a href="#"><img src="./assets/media/users/100_4.jpg" title=""></a>
												<a href="#"><img src="./assets/media/users/100_13.jpg" title=""></a>
												<a href="#"><img src="./assets/media/users/100_11.jpg" title=""></a>
												<a href="#"><img src="./assets/media/users/100_14.jpg" title=""></a>
											</div>
										</div>
										<div class="kt-timeline-v2__item">
											<span class="kt-timeline-v2__item-time">14:00</span>
											<div class="kt-timeline-v2__item-cricle">
												<i class="fa fa-genderless kt-font-brand"></i>
											</div>
											<div class="kt-timeline-v2__item-text kt-padding-top-5">
												Make Deposit <a href="#" class="kt-link kt-link--brand kt-font-bolder">USD 700</a> To ESL.
											</div>
										</div>
										<div class="kt-timeline-v2__item">
											<span class="kt-timeline-v2__item-time">16:00</span>
											<div class="kt-timeline-v2__item-cricle">
												<i class="fa fa-genderless kt-font-warning"></i>
											</div>
											<div class="kt-timeline-v2__item-text kt-padding-top-5">
												Lorem ipsum dolor sit amit,consectetur eiusmdd tempor<br>
												incididunt ut labore et dolore magna elit enim at minim<br>
												veniam quis nostrud
											</div>
										</div>
										<div class="kt-timeline-v2__item">
											<span class="kt-timeline-v2__item-time">17:00</span>
											<div class="kt-timeline-v2__item-cricle">
												<i class="fa fa-genderless kt-font-info"></i>
											</div>
											<div class="kt-timeline-v2__item-text kt-padding-top-5">
												Placed a new order in <a href="#" class="kt-link kt-link--brand kt-font-bolder">SIGNATURE MOBILE</a> marketplace.
											</div>
										</div>
										<div class="kt-timeline-v2__item">
											<span class="kt-timeline-v2__item-time">16:00</span>
											<div class="kt-timeline-v2__item-cricle">
												<i class="fa fa-genderless kt-font-brand"></i>
											</div>
											<div class="kt-timeline-v2__item-text kt-padding-top-5">
												Lorem ipsum dolor sit amit,consectetur eiusmdd tempor<br>
												incididunt ut labore et dolore magna elit enim at minim<br>
												veniam quis nostrud
											</div>
										</div>
										<div class="kt-timeline-v2__item">
											<span class="kt-timeline-v2__item-time">17:00</span>
											<div class="kt-timeline-v2__item-cricle">
												<i class="fa fa-genderless kt-font-danger"></i>
											</div>
											<div class="kt-timeline-v2__item-text kt-padding-top-5">
												Received a new feedback on <a href="#" class="kt-link kt-link--brand kt-font-bolder">FinancePro App</a> product.
											</div>
										</div>
										<div class="kt-timeline-v2__item">
											<span class="kt-timeline-v2__item-time">15:30</span>
											<div class="kt-timeline-v2__item-cricle">
												<i class="fa fa-genderless kt-font-danger"></i>
											</div>
											<div class="kt-timeline-v2__item-text kt-padding-top-5">
												New notification message has been received on <a href="#" class="kt-link kt-link--brand kt-font-bolder">LoopFin Pro</a> product.
											</div>
										</div>
									</div>
								</div>
              </div>
            </div>
            <div class="tab-pane kt-quick-panel__content-padding-x fade kt-scroll" id="kt_quick_panel_tab_settings" role="tabpanel">
                <form class="kt-form">
                    <div class="kt-heading kt-heading--sm kt-heading--space-sm">Customer Care</div>
                    <div class="form-group form-group-xs row">
                        <label class="col-8 col-form-label">Enable Notifications:</label>
                        <div class="col-4 kt-align-right">
                            <span class="kt-switch kt-switch--success kt-switch--sm">
                                <label>
                                    <input type="checkbox" checked="checked" name="quick_panel_notifications_1">
                                    <span></span>
                                </label>
                            </span>
                        </div>
                    </div>
                    <div class="form-group form-group-xs row">
                        <label class="col-8 col-form-label">Enable Case Tracking:</label>
                        <div class="col-4 kt-align-right">
                            <span class="kt-switch kt-switch--success kt-switch--sm">
                                <label>
                                    <input type="checkbox" name="quick_panel_notifications_2">
                                    <span></span>
                                </label>
                            </span>
                        </div>
                    </div>
                    <div class="form-group form-group-last form-group-xs row">
                        <label class="col-8 col-form-label">Support Portal:</label>
                        <div class="col-4 kt-align-right">
                            <span class="kt-switch kt-switch--success kt-switch--sm">
                                <label>
                                    <input type="checkbox" checked="checked" name="quick_panel_notifications_2">
                                    <span></span>
                                </label>
                            </span>
                        </div>
                    </div>
                    <div class="kt-separator kt-separator--space-md kt-separator--border-dashed"></div>
                    <div class="kt-heading kt-heading--sm kt-heading--space-sm">Reports</div>
                    <div class="form-group form-group-xs row">
                        <label class="col-8 col-form-label">Generate Reports:</label>
                        <div class="col-4 kt-align-right">
                            <span class="kt-switch kt-switch--sm kt-switch--danger">
                                <label>
                                    <input type="checkbox" checked="checked" name="quick_panel_notifications_3">
                                    <span></span>
                                </label>
                            </span>
                        </div>
                    </div>
                    <div class="form-group form-group-xs row">
                        <label class="col-8 col-form-label">Enable Report Export:</label>
                        <div class="col-4 kt-align-right">
                            <span class="kt-switch kt-switch--sm kt-switch--danger">
                                <label>
                                    <input type="checkbox" name="quick_panel_notifications_3">
                                    <span></span>
                                </label>
                            </span>
                        </div>
                    </div>
                    <div class="form-group form-group-last form-group-xs row">
                        <label class="col-8 col-form-label">Allow Data Collection:</label>
                        <div class="col-4 kt-align-right">
                            <span class="kt-switch kt-switch--sm kt-switch--danger">
                                <label>
                                    <input type="checkbox" checked="checked" name="quick_panel_notifications_4">
                                    <span></span>
                                </label>
                            </span>
                        </div>
                    </div>
                    <div class="kt-separator kt-separator--space-md kt-separator--border-dashed"></div>
                    <div class="kt-heading kt-heading--sm kt-heading--space-sm">Memebers</div>
                    <div class="form-group form-group-xs row">
                        <label class="col-8 col-form-label">Enable Member singup:</label>
                        <div class="col-4 kt-align-right">
                            <span class="kt-switch kt-switch--sm kt-switch--brand">
                                <label>
                                    <input type="checkbox" checked="checked" name="quick_panel_notifications_5">
                                    <span></span>
                                </label>
                            </span>
                        </div>
                    </div>
                    <div class="form-group form-group-xs row">
                        <label class="col-8 col-form-label">Allow User Feedbacks:</label>
                        <div class="col-4 kt-align-right">
                            <span class="kt-switch kt-switch--sm kt-switch--brand">
                                <label>
                                    <input type="checkbox" name="quick_panel_notifications_5">
                                    <span></span>
                                </label>
                            </span>
                        </div>
                    </div>
                    <div class="form-group form-group-last form-group-xs row">
                        <label class="col-8 col-form-label">Enable Customer Portal:</label>
                        <div class="col-4 kt-align-right">
                            <span class="kt-switch kt-switch--sm kt-switch--brand">
                                <label>
                                    <input type="checkbox" checked="checked" name="quick_panel_notifications_6">
                                    <span></span>
                                </label>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- end::Quick Panel -->

<!-- begin::Scrolltop -->
<div id="kt_scrolltop" class="kt-scrolltop">
    <i class="fa fa-arrow-up"></i>
</div>
<!-- end::Scrolltop -->
