import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Admin } from 'app/shared/model/admin.model';
import { AdminService } from './admin.service';
import { AdminComponent } from './admin.component';
import { AdminDetailComponent } from './admin-detail.component';
import { AdminUpdateComponent } from './admin-update.component';
import { AdminDeletePopupComponent } from './admin-delete-dialog.component';
import { IAdmin } from 'app/shared/model/admin.model';

@Injectable({ providedIn: 'root' })
export class AdminResolve implements Resolve<IAdmin> {
  constructor(private service: AdminService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAdmin> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Admin>) => response.ok),
        map((admin: HttpResponse<Admin>) => admin.body)
      );
    }
    return of(new Admin());
  }
}

export const adminRoute: Routes = [
  {
    path: '',
    component: AdminComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Admins'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: AdminDetailComponent,
    resolve: {
      admin: AdminResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Admins'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: AdminUpdateComponent,
    resolve: {
      admin: AdminResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Admins'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: AdminUpdateComponent,
    resolve: {
      admin: AdminResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Admins'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const adminPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: AdminDeletePopupComponent,
    resolve: {
      admin: AdminResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Admins'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
