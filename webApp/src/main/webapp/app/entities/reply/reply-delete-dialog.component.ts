import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IReply } from 'app/shared/model/reply.model';
import { ReplyService } from './reply.service';

@Component({
  selector: 'jhi-reply-delete-dialog',
  templateUrl: './reply-delete-dialog.component.html'
})
export class ReplyDeleteDialogComponent {
  reply: IReply;

  constructor(protected replyService: ReplyService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.replyService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'replyListModification',
        content: 'Deleted an reply'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-reply-delete-popup',
  template: ''
})
export class ReplyDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ reply }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(ReplyDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.reply = reply;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/reply', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/reply', { outlets: { popup: null } }]);
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
