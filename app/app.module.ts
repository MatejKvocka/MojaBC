import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { CoinListComponent } from './coin-list/coin-list.component';
import { HttpClientModule } from '@angular/common/http';
import { NavigationComponent } from './navigation/navigation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { CoinDialogComponent } from './coin-dialog/coin-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CoinDetailsComponent } from './coin-details/coin-details.component';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { MatInputModule } from '@angular/material/input';
import { LogoutComponent } from './logout/logout.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';






@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    CoinListComponent,
    NavigationComponent,
    CoinDialogComponent,
    CoinDetailsComponent,
    RegistrationComponent,
    LoginComponent,
    LogoutComponent,
    UserProfileComponent,
    StatisticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatDialogModule,
    MatCardModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule
  ],  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
