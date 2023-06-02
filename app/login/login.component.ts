import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string;
  password: string;

  constructor(private userService: AuthenticationService, private router: Router) {
    this.email = '';
    this.password = '';
  }

  login() {
    const user = {
      email: this.email,
      password: this.password
    };

    // Perform login logic
    this.userService.login(user).subscribe(
      () => {
        // Login successful, navigate to the coin list
        this.router.navigate(['/coins']);
      },
      error => {
        // Login failed, handle the error
        console.error('Login failed:', error);
      }
    );
  }
}
