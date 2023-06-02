// navbar.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private showNav = new BehaviorSubject<boolean>(true);
  showNav$ = this.showNav.asObservable();

  toggleNav(val: boolean) {
    this.showNav.next(val);
  }
}
