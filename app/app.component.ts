import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarService } from 'src/services/navbar.service'; // change the path if needed

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bakalarka';

  constructor(private router: Router, private navbarService: NavbarService) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.navbarService.toggleNav(event.urlAfterRedirects !== '/login' && event.urlAfterRedirects !== '/register');
    });
  }
}
