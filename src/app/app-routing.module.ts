import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { DashboardComponent } from './dashboard';
import { LoginComponent } from './login';
import { AffectivaEmotionsComponent } from './affectiva-emotions';
import { RegisterComponent } from './register';
import { WebcamDashboardComponent } from './webcam-dashboard';
import { CameraArrayComponent } from './camera-array';
import { UserProfileComponent } from './user-profile';
import { AuthGuard } from './_guards';
import { CreateCustomerComponent } from './customers/create-customer/create-customer.component';
import { CustomersListComponent } from './customers/customers-list/customers-list.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'webcam', component: WebcamDashboardComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'emotions', component: AffectivaEmotionsComponent },
  { path: 'add_camera', component: CameraArrayComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'customers', component: CustomersListComponent },
  { path: 'add', component: CreateCustomerComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

