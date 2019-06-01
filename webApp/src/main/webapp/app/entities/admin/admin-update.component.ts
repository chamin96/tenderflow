import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IAdmin, Admin } from 'app/shared/model/admin.model';
import { AdminService } from './admin.service';
import { IUser, UserService } from 'app/core';

@Component({
  selector: 'jhi-admin-update',
  templateUrl: './admin-update.component.html'
})
export class AdminUpdateComponent implements OnInit {
  admin: IAdmin;
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
    protected adminService: AdminService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ admin }) => {
      this.updateForm(admin);
      this.admin = admin;
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(admin: IAdmin) {
    this.editForm.patchValue({
      id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      user: admin.user
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const admin = this.createFromForm();
    if (admin.id !== undefined) {
      this.subscribeToSaveResponse(this.adminService.update(admin));
    } else {
      this.subscribeToSaveResponse(this.adminService.create(admin));
    }
  }

  private createFromForm(): IAdmin {
    const entity = {
      ...new Admin(),
      id: this.editForm.get(['id']).value,
      firstName: this.editForm.get(['firstName']).value,
      lastName: this.editForm.get(['lastName']).value,
      email: this.editForm.get(['email']).value,
      user: this.editForm.get(['user']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdmin>>) {
    result.subscribe((res: HttpResponse<IAdmin>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
