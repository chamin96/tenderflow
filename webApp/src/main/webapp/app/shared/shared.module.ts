import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TenderFlowSharedLibsModule, TenderFlowSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [TenderFlowSharedLibsModule, TenderFlowSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [TenderFlowSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TenderFlowSharedModule {
  static forRoot() {
    return {
      ngModule: TenderFlowSharedModule
    };
  }
}
