import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { AddCustomerComponent } from './components/admin/dashboard/add-customer/add-customer.component';
import { CalendarComponent } from './components/admin/dashboard/calendar/calendar.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ListCustomerComponent } from './components/admin/dashboard/list-customer/list-customer.component';
import { EditCustomerComponent } from './components/admin/dashboard/add-customer/edit-customer.component';
import { RegistrosComponent } from './components/admin/dashboard/registros/registros.component';
import { AgendaComponent } from './components/admin/dashboard/agenda/agenda.component';
import { LoginComponent } from './components/admin/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'admin', component: AdminComponent,
    children: [
      { path: 'login', component: LoginComponent },
      {
        path: 'dashboard', component: DashboardComponent,
        children: [
          { path: 'addCustomer', component: AddCustomerComponent },
          { path: 'listCustomer', component: ListCustomerComponent },
          { path: 'calendar', component: CalendarComponent },
          { path: 'editCustomer/:id', component: EditCustomerComponent },
          { path: 'registros', component: RegistrosComponent },
          { path: 'agenda', component: AgendaComponent },
        ]
      },
    ]
  },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }