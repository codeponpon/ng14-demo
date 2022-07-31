import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { NgProgressRouterModule } from 'ngx-progressbar/router';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { MaterialModule } from '../material.module';

import { ErrorCodeComponent } from './components/error-code/error-code.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

const MODULES: any[] = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  DragDropModule,
  NgProgressModule,
  NgProgressHttpModule,
  NgProgressRouterModule,
  MaterialModule,
  FlexLayoutModule,
  TranslateModule,
  NgxPermissionsModule,
  NgSelectModule,
];
const COMPONENTS: any[] = [ErrorCodeComponent, BreadcrumbComponent];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  exports: [...MODULES, ...COMPONENTS],
})
export class SharedModule {}
