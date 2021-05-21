import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { AddCustomerComponent } from './components/admin/dashboard/add-customer/add-customer.component';
import { CalendarComponent } from './components/admin/dashboard/calendar/calendar.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ListCustomerComponent } from './components/admin/dashboard/list-customer/list-customer.component';
import { EditCustomerComponent } from './components/admin/dashboard/add-customer/edit-customer.component';

const routes: Routes = [
  { path: 'admin', component: AdminComponent},
  { path: 'dashboard', component: DashboardComponent,
    children: [
      {path: 'addCustomer', component: AddCustomerComponent},
      {path: 'listCustomer', component: ListCustomerComponent},
      {path: 'calendar', component: CalendarComponent},
      {path: 'editCustomer/:id', component: EditCustomerComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }