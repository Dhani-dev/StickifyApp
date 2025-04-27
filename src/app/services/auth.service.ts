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

  login(email: string, password: string): User | null {
    const users: User[] = [];
  
    // Buscar todos los usuarios guardados en localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
  
      const item = localStorage.getItem(key);
      if (!item) continue;
  
      try {
        const user: User = JSON.parse(item);
        if (user && user.email === email) {
          if (user.password === password) {
            return user;
          } else {
            Swal.fire({
              title: "Error",
              text: "Contraseña incorrecta",
              icon: "error",
              color: "#716add",
              backdrop: `rgba(0,0,123,0.4) left top no-repeat`
            });
            return null;
          }
        }
      } catch (error) {
        console.error('Error leyendo usuario:', error);
      }
    }
  
    Swal.fire({
      title: "Error",
      text: "Usuario no encontrado",
      icon: "error",
      color: "#716add",
      backdrop: `rgba(0,0,123,0.4) left top no-repeat`
    });
  
    return null;
  }  
}
