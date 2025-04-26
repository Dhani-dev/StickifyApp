import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../shared/interfaces/user.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  registryForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    repeatPassword: ['', [Validators.required]]
  });

  onRegistry(): void {

    try {
      const { username, email, password, repeatPassword } = this.registryForm.getRawValue();

      // Validar campos vacíos
      if (!username || !email || !password) {
        console.warn('Validación fallida: Campos vacíos');
        Swal.fire(
          {
            title: "Campos vacíos",
            text: "Por favor, complete todos los campos",
            color: "#716add",
            backdrop: `
            rgba(0,0,123,0.4)
            left top
            no-repeat
          `,
            icon: "error"
          });
        return;
      }

      // Validar que las contraseñas coincidan
      if (password !== repeatPassword) {
        Swal.fire(
          {
            title: "Error",
            text: "Las contraseñas no coinciden",
            color: "#716add",
            backdrop: `
              rgba(0,0,123,0.4)
              left top
              no-repeat
            `,
            icon: "error"
          });
        return;
      }

      // Validar si el email ya está registrado
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(user => user.email === email)) {
        console.warn(`Intento de registro con email existente: ${email}`);
        Swal.fire(
          {
            title: "Correo electrónico incorrecto",
            text: "Este correo electrónico ya está registrado",
            color: "#716add",
            backdrop: `
          rgba(0,0,123,0.4)
          left top
          no-repeat
        `,
            icon: "error"
          });
        return;
      }

      // Crear el usuario (sin el campo repeatPassword)
      const { repeatPassword: _, ...user } = this.registryForm.getRawValue() as User & { repeatPassword: string };

      const success = this.authService.registry(user);

      if (success) {
        this.registryForm.reset();
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error en registro:', error);
      alert('Ocurrió un error durante el registro');
    }
  }
}
