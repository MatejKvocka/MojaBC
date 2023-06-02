// navigation.component.ts
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/services/authentication.service';
import { NavbarService } from 'src/services/navbar.service'; // change the path if needed

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  userId: string | null = null;
  showNav = true;
  private subscription!: Subscription;

  @ViewChild('drawer', { static: false }) drawer!: MatSidenav;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private navbarService: NavbarService
  ) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe(userPayload => {
      if(userPayload){
        this.userId = userPayload.userId;
      }
    });

    this.subscription = this.navbarService.showNav$.subscribe(show => this.showNav = show);

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
