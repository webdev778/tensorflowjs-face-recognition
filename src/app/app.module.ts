import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { VideoComponent } from './video/video.component';
import { CnnComponent } from './cnn/cnn.component';
import { HeaderComponent } from './header/header.component';
import { DangerAlertComponent } from './danger-alert/danger-alert.component';
import { FaceAlertComponent } from './face-alert/face-alert.component';
import { IdentifiedObjectsComponent } from './identified-objects/identified-objects.component';
import { CameraPanelComponent } from './camera-panel/camera-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    VideoComponent,
    CnnComponent,
    HeaderComponent,
    DangerAlertComponent,
    FaceAlertComponent,
    IdentifiedObjectsComponent,
    CameraPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
