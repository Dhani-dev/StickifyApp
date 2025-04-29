import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Para *ngIf
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  imports: [RouterModule, CommonModule, FilterComponent]
})
export class NavComponent {
  isHomePage = false; // Saber si se debe mostrar el filtro

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.urlAfterRedirects === '/home';
      }
    });
  }
}
