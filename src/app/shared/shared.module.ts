import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { NgProgressRouterModule } from 'ngx-progressbar/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material.module';

import { ErrorCodeComponent } from './components/error-code/error-code.component';

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
];
const COMPONENTS: any[] = [ErrorCodeComponent];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  exports: [...MODULES, ...COMPONENTS],
})
export class SharedModule {}
