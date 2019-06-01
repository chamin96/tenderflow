import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IAdmin } from 'app/shared/model/admin.model';
import { AccountService } from 'app/core';
import { AdminService } from './admin.service';

@Component({
  selector: 'jhi-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit, OnDestroy {
  admins: IAdmin[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected adminService: AdminService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.adminService
      .query()
      .pipe(
        filter((res: HttpResponse<IAdmin[]>) => res.ok),
        map((res: HttpResponse<IAdmin[]>) => res.body)
      )
      .subscribe(
        (res: IAdmin[]) => {
          this.admins = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInAdmins();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IAdmin) {
    return item.id;
  }

  registerChangeInAdmins() {
    this.eventSubscriber = this.eventManager.subscribe('adminListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
