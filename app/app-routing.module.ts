import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinListComponent } from './coin-list/coin-list.component';
import { CoinDetailsComponent } from './coin-details/coin-details.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { StatisticsComponent } from './statistics/statistics.component';



const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'coins', component: CoinListComponent, canActivate: [AuthGuard] },
  { path: 'coins/:id', component: CoinDetailsComponent, canActivate: [AuthGuard] },
  { path: 'api/coins/years', redirectTo: '/coins' },
  { path: 'api/coins/countries', redirectTo: '/coins'},
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile/:userId', component: UserProfileComponent },
  { path: 'statistics/:userId', component: StatisticsComponent },

];


@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
