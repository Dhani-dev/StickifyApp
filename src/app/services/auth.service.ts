import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  username?: string;
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'currentUser';

  constructor(private router: Router) {
    this.currentUser = localStorage.getItem('currentUser') 
      ? JSON.parse(localStorage.getItem('currentUser')!) 
      : null;
  }

  get users(): User[] {
    const usersString = localStorage.getItem(this.USERS_KEY);
    return usersString ? JSON.parse(usersString) : [];
  }

  set users(users: User[]) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  get currentUser(): User | null {
    const currentUserString = localStorage.getItem(this.CURRENT_USER_KEY);
    return currentUserString ? JSON.parse(currentUserString) : null;
  }

  set currentUser(user: User | null) {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  signUp(userData: User): boolean {
    const { username, email, password } = userData;
    if (!username || !email || !password) {
      console.warn('Validación fallida: Campos vacíos');
      return false;
    }

    const users = this.users;
    if (users.some(user => user.email === email)) {
      console.warn(`Intento de registro con email existente: ${email}`);
      return false;
    }

    const newUser = { username, email, password };
    this.users = [...users, newUser];
    console.log('Nuevo usuario registrado:', newUser);
    return true;
  }

  logIn(credentials: Pick<User, 'email' | 'password'>): boolean {
    const { email, password } = credentials;
    if (!email || !password) {
      console.warn('Validación fallida: Campos vacíos en login');
      return false;
    }

    const user = this.users.find(user => user.email === email);
    console.log('Usuario encontrado:', user);

    if (!user) {
      console.warn(`Intento de login con email no registrado: ${email}`);
      return false;
    }

    if (user.password !== password) {
      console.warn('Contraseña incorrecta para:', email);
      return false;
    }

    this.currentUser = user;
    console.log('Sesión iniciada - Usuario actual:', user);
    return true;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  logOut(): void {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.router.navigate(['/log-in']);
    console.log("Sesión cerrada");
  }
}