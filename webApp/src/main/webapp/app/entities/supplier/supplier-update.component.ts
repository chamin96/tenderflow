import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ISupplier, Supplier } from 'app/shared/model/supplier.model';
import { SupplierService } from './supplier.service';
import { IUser, UserService } from 'app/core';

@Component({
  selector: 'jhi-supplier-update',
  templateUrl: './supplier-update.component.html'
})
export class SupplierUpdateComponent implements OnInit {
  supplier: ISupplier;
  isSaving: boolean;

  users: IUser[];

  editForm = this.fb.group({
    id: [],
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.pattern('^[^@s]+@[^@s]+.[^@s]+$')]],
    user: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected supplierService: SupplierService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ supplier }) => {
      this.updateForm(supplier);
      this.supplier = supplier;
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(supplier: ISupplier) {
    this.editForm.patchValue({
      id: supplier.id,
      firstName: supplier.firstName,
      lastName: supplier.lastName,
      email: supplier.email,
      user: supplier.user
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const supplier = this.createFromForm();
    if (supplier.id !== undefined) {
      this.subscribeToSaveResponse(this.supplierService.update(supplier));
    } else {
      this.subscribeToSaveResponse(this.supplierService.create(supplier));
    }
  }

  private createFromForm(): ISupplier {
    const entity = {
      ...new Supplier(),
      id: this.editForm.get(['id']).value,
      firstName: this.editForm.get(['firstName']).value,
      lastName: this.editForm.get(['lastName']).value,
      email: this.editForm.get(['email']).value,
      user: this.editForm.get(['user']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISupplier>>) {
    result.subscribe((res: HttpResponse<ISupplier>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

  trackUserById(index: number, item: IUser) {
    return item.id;
  }
}
