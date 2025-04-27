import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-log-in',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onLogin(): void {
    try {
      const { email, password } = this.loginForm.getRawValue();

      if (!email || !password) {
        console.warn('Validación fallida: Campos vacíos en login');
        Swal.fire({
          title: "Campos Vacíos",
          text: "Por favor, complete todos los campos",
          icon: "warning",
          color: "#716add",
          backdrop: `rgba(0,0,123,0.4) left top no-repeat`
        });
        return;
      }

      const user = this.authService.login(email, password);

      if (user) {
        // Guardar usuario en el SessionStorage
        sessionStorage.setItem('userLogged', JSON.stringify(user));
        console.log('Sesión iniciada:', user);

        Swal.fire({
          title: "Éxito",
          text: "Inicio de sesión exitoso",
          icon: "success",
          color: "#716add",
          backdrop: `rgba(0,0,123,0.4) left top no-repeat`
        }).then(() => {
          this.router.navigate(['/home']);
        });
      }

    } catch (error) {
      console.error('Error en login:', error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error durante el inicio de sesión",
        icon: "error",
        color: "#716add",
        backdrop: `rgba(0,0,123,0.4) left top no-repeat`
      });
    }
  }
}
