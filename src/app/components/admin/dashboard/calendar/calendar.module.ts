import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgModule,
  ]
})
export class CalendarModule { }
