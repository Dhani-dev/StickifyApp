import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome-nav',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav>
      <a href="#" class="button">Explorar</a>
      <a [routerLink]="['/log-in']" class="button">Iniciar Sesión</a>
      <a [routerLink]="['/sign-in']" class="button primary">Regístrate</a>
    </nav>
  `,
  styleUrls: ['./welcome-nav.component.css']
})
export class WelcomeNavComponent { }