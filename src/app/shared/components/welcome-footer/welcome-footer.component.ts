import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome-footer',
  standalone: true,
  imports: [], // RouterLink eliminado
  template: `
    <footer>
      <p>&copy; 2025 Stickify. Todos los derechos reservados.</p>
    </footer>
  `,
  styleUrls: ['./welcome-footer.component.css']
})
export class WelcomeFooterComponent { }