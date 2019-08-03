import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AlertComponent } from './_directives';
import { AuthGuard } from './_guards';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AlertService, AuthenticationService, UserService } from './_services';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { VideoComponent } from './video/video.component';
import { HeaderComponent } from './header/header.component';
import { FaceAlertComponent } from './face-alert/face-alert.component';
import { CameraPanelComponent } from './camera-panel/camera-panel.component';
import { AffectivaEmotionsComponent } from './affectiva-emotions/affectiva-emotions.component';
import { FooterComponent } from './footer/footer.component';
import { VideoSourceComponent } from './video-source/video-source.component';
import { FaceRegistryComponent } from './face-registry/face-registry.component';
import { VehicleRegistryComponent } from './vehicle-registry/vehicle-registry.component';
import { CameraArrayComponent } from './camera-array/camera-array.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CameraListComponent } from './camera-list/camera-list.component';
import { WebcamDashboardComponent } from './webcam-dashboard/webcam-dashboard.component';
import { MapComponent } from './map/map.component';
import { Header2Component } from './header2/header2.component';
import { CustomerDetailsComponent } from './customers/customer-details/customer-details.component';
import { CustomersListComponent } from './customers/customers-list/customers-list.component';
import { CreateCustomerComponent } from './customers/create-customer/create-customer.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    VideoComponent,
    HeaderComponent,
    FaceAlertComponent,
    CameraPanelComponent,
    AffectivaEmotionsComponent,
    FooterComponent,
    VideoSourceComponent,
    FaceRegistryComponent,
    VehicleRegistryComponent,
    CameraArrayComponent,
    UserProfileComponent,
    CameraListComponent,
    WebcamDashboardComponent,
    MapComponent,
    Header2Component,
    CustomerDetailsComponent,
    CustomersListComponent,
    CreateCustomerComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // for database
    FormsModule,
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider
],
  bootstrap: [AppComponent]
})
export class AppModule { }
