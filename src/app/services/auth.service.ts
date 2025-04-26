import { Injectable, signal } from '@angular/core';
import { User } from '../shared/interfaces/user.interface';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isSignedUser = signal(this.isUserLogged());

  constructor() { }

  registry(user: User): boolean {
    // Verificar si ya existe un usuario con el mismo username
    if (localStorage.getItem(user.username)) {
      Swal.fire(
        {
          title: "Error",
          text: "Este nombre de usuario ya está registrado",
          color: "#716add",
          backdrop: `
          rgba(0,0,123,0.4)
          left top
          no-repeat
        `,
          icon: "error"
        });
      return false;
    }

    // Guardar cada usuario individualmente usando su username como clave
    localStorage.setItem(user.username, JSON.stringify(user));
    Swal.fire(
      {
        title: "Éxito",
        text: "Registro exitoso",
        color: "#716add",
        backdrop: `
        rgba(0,0,123,0.4)
        left top
        no-repeat
      `,
        icon: "success"
      });
    return true;
  }

  private isUserLogged(): boolean {
    return !!sessionStorage.getItem('userLogged');
  }
}
