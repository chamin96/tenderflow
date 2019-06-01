import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { ITender, Tender } from 'app/shared/model/tender.model';
import { TenderService } from './tender.service';
import { IAdmin } from 'app/shared/model/admin.model';
import { AdminService } from 'app/entities/admin';

@Component({
  selector: 'jhi-tender-update',
  templateUrl: './tender-update.component.html'
})
export class TenderUpdateComponent implements OnInit {
  tender: ITender;
  isSaving: boolean;

  admins: IAdmin[];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    description: [],
    info: [],
    infoContentType: [],
    admin: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected tenderService: TenderService,
    protected adminService: AdminService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ tender }) => {
      this.updateForm(tender);
      this.tender = tender;
    });
    this.adminService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IAdmin[]>) => mayBeOk.ok),
        map((response: HttpResponse<IAdmin[]>) => response.body)
      )
      .subscribe((res: IAdmin[]) => (this.admins = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(tender: ITender) {
    this.editForm.patchValue({
      id: tender.id,
      title: tender.title,
      description: tender.description,
      info: tender.info,
      infoContentType: tender.infoContentType,
      admin: tender.admin
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field: string, isImage) {
    return new Promise((resolve, reject) => {
      if (event && event.target && event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        if (isImage && !/^image\//.test(file.type)) {
          reject(`File was expected to be an image but was found to be ${file.type}`);
        } else {
          const filedContentType: string = field + 'ContentType';
          this.dataUtils.toBase64(file, base64Data => {
            this.editForm.patchValue({
              [field]: base64Data,
              [filedContentType]: file.type
            });
          });
        }
      } else {
        reject(`Base64 data was not set as file could not be extracted from passed parameter: ${event}`);
      }
    }).then(
      () => console.log('blob added'), // sucess
      this.onError
    );
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const tender = this.createFromForm();
    if (tender.id !== undefined) {
      this.subscribeToSaveResponse(this.tenderService.update(tender));
    } else {
      this.subscribeToSaveResponse(this.tenderService.create(tender));
    }
  }

  private createFromForm(): ITender {
    const entity = {
      ...new Tender(),
      id: this.editForm.get(['id']).value,
      title: this.editForm.get(['title']).value,
      description: this.editForm.get(['description']).value,
      infoContentType: this.editForm.get(['infoContentType']).value,
      info: this.editForm.get(['info']).value,
      admin: this.editForm.get(['admin']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITender>>) {
    result.subscribe((res: HttpResponse<ITender>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

  trackAdminById(index: number, item: IAdmin) {
    return item.id;
  }
}
