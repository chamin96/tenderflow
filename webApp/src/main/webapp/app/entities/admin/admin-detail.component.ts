import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAdmin } from 'app/shared/model/admin.model';

@Component({
  selector: 'jhi-admin-detail',
  templateUrl: './admin-detail.component.html'
})
export class AdminDetailComponent implements OnInit {
  admin: IAdmin;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ admin }) => {
      this.admin = admin;
    });
  }

  previousState() {
    window.history.back();
  }
}
