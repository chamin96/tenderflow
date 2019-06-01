import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAdmin } from 'app/shared/model/admin.model';
import { AdminService } from './admin.service';

@Component({
  selector: 'jhi-admin-delete-dialog',
  templateUrl: './admin-delete-dialog.component.html'
})
export class AdminDeleteDialogComponent {
  admin: IAdmin;

  constructor(protected adminService: AdminService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.adminService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'adminListModification',
        content: 'Deleted an admin'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-admin-delete-popup',
  template: ''
})
export class AdminDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ admin }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(AdminDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.admin = admin;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/admin', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/admin', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
