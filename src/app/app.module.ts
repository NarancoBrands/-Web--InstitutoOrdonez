import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { JwPaginationModule } from 'jw-angular-pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxFileDropModule } from 'ngx-file-drop';

//componentes
import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { MenuLateralComponent } from './components/admin/dashboard/menu-lateral/menu-lateral.component';
import { MenuTopComponent } from './components/admin/dashboard/menu-top/menu-top.component';
import { AddCustomerComponent } from './components/admin/dashboard/add-customer/add-customer.component';
import { EditCustomerComponent } from './components/admin/dashboard/add-customer/edit-customer.component';
import { ListCustomerComponent } from './components/admin/dashboard/list-customer/list-customer.component';
import { CalendarComponent } from './components/admin/dashboard/calendar/calendar.component';
import { RegistrosComponent } from './components/admin/dashboard/registros/registros.component';
import { AgendaComponent } from './components/admin/dashboard/agenda/agenda.component';
import { LoginComponent } from './components/admin/login/login.component';

//imports calendario
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import { FlatpickrModule } from 'angularx-flatpickr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as moment from 'moment';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

//http


export function momentAdapterFactory() {
  return adapterFactory(moment);
};

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    DashboardComponent,
    MenuLateralComponent,
    MenuTopComponent,
    AddCustomerComponent,
    ListCustomerComponent,
    CalendarComponent,
    EditCustomerComponent,
    RegistrosComponent,
    AgendaComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: momentAdapterFactory,
    }),
    ToastrModule.forRoot(),
    HttpClientModule,
    JwPaginationModule,
    NgxPaginationModule,
    NgxFileDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
