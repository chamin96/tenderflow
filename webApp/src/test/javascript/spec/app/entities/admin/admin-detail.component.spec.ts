/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TenderFlowTestModule } from '../../../test.module';
import { AdminDetailComponent } from 'app/entities/admin/admin-detail.component';
import { Admin } from 'app/shared/model/admin.model';

describe('Component Tests', () => {
  describe('Admin Management Detail Component', () => {
    let comp: AdminDetailComponent;
    let fixture: ComponentFixture<AdminDetailComponent>;
    const route = ({ data: of({ admin: new Admin(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TenderFlowTestModule],
        declarations: [AdminDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(AdminDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AdminDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.admin).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
