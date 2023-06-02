import { Component } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  name: string;
  email: string;
  password: string;

  constructor(private authService: AuthenticationService, private router: Router) {
    this.name = '';
    this.email = '';
    this.password = '';
  }

  register() {
    const user = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    // Perform registration logic
    this.authService.register(user).subscribe(
      () => {
        // Registration successful, redirect to the appropriate page
        this.router.navigate(['/coins']);
      },
      error => {
        console.error('Registration failed:', error);
      }
    );
  }
}
