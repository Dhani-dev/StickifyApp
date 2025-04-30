// log-in.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router,RouterLink  } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-log-in',
  imports: [ReactiveFormsModule,RouterLink ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) return;

    const credentials = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    const success = this.authService.logIn(credentials);
    
    if (success) {
      await Swal.fire({
        title: "Éxito",
        text: "Inicio de sesión exitoso!",
        icon: "success",
        color: "#716add",
        backdrop: `rgba(0,0,123,0.4) left top no-repeat`
      });
      this.router.navigate(['/home']);
    }
  }
}