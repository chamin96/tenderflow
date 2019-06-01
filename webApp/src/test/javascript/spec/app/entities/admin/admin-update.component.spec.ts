/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TenderFlowTestModule } from '../../../test.module';
import { AdminUpdateComponent } from 'app/entities/admin/admin-update.component';
import { AdminService } from 'app/entities/admin/admin.service';
import { Admin } from 'app/shared/model/admin.model';

describe('Component Tests', () => {
  describe('Admin Management Update Component', () => {
    let comp: AdminUpdateComponent;
    let fixture: ComponentFixture<AdminUpdateComponent>;
    let service: AdminService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TenderFlowTestModule],
        declarations: [AdminUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(AdminUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AdminUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AdminService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Admin(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Admin();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
