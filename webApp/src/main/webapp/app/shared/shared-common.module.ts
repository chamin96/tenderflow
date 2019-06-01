import { NgModule } from '@angular/core';

import { TenderFlowSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
  imports: [TenderFlowSharedLibsModule],
  declarations: [JhiAlertComponent, JhiAlertErrorComponent],
  exports: [TenderFlowSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class TenderFlowSharedCommonModule {}
