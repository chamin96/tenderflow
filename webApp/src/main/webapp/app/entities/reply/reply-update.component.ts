import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IReply, Reply } from 'app/shared/model/reply.model';
import { ReplyService } from './reply.service';
import { ITender } from 'app/shared/model/tender.model';
import { TenderService } from 'app/entities/tender';
import { ISupplier } from 'app/shared/model/supplier.model';
import { SupplierService } from 'app/entities/supplier';

@Component({
  selector: 'jhi-reply-update',
  templateUrl: './reply-update.component.html'
})
export class ReplyUpdateComponent implements OnInit {
  reply: IReply;
  isSaving: boolean;

  tenders: ITender[];

  suppliers: ISupplier[];

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    responseInfo: [null, [Validators.required]],
    tender: [],
    supplier: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected replyService: ReplyService,
    protected tenderService: TenderService,
    protected supplierService: SupplierService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ reply }) => {
      this.updateForm(reply);
      this.reply = reply;
    });
    this.tenderService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ITender[]>) => mayBeOk.ok),
        map((response: HttpResponse<ITender[]>) => response.body)
      )
      .subscribe((res: ITender[]) => (this.tenders = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.supplierService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ISupplier[]>) => mayBeOk.ok),
        map((response: HttpResponse<ISupplier[]>) => response.body)
      )
      .subscribe((res: ISupplier[]) => (this.suppliers = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(reply: IReply) {
    this.editForm.patchValue({
      id: reply.id,
      date: reply.date != null ? reply.date.format(DATE_TIME_FORMAT) : null,
      responseInfo: reply.responseInfo,
      tender: reply.tender,
      supplier: reply.supplier
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const reply = this.createFromForm();
    if (reply.id !== undefined) {
      this.subscribeToSaveResponse(this.replyService.update(reply));
    } else {
      this.subscribeToSaveResponse(this.replyService.create(reply));
    }
  }

  private createFromForm(): IReply {
    const entity = {
      ...new Reply(),
      id: this.editForm.get(['id']).value,
      date: this.editForm.get(['date']).value != null ? moment(this.editForm.get(['date']).value, DATE_TIME_FORMAT) : undefined,
      responseInfo: this.editForm.get(['responseInfo']).value,
      tender: this.editForm.get(['tender']).value,
      supplier: this.editForm.get(['supplier']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReply>>) {
    result.subscribe((res: HttpResponse<IReply>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackTenderById(index: number, item: ITender) {
    return item.id;
  }

  trackSupplierById(index: number, item: ISupplier) {
    return item.id;
  }
}
