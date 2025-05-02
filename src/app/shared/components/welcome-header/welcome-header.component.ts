import { Component } from '@angular/core';
import { WelcomeNavComponent } from '../welcome-nav/welcome-nav.component';

@Component({
  selector: 'app-welcome-header',
  standalone: true,
  imports: [WelcomeNavComponent],
  template: `
    <header>
      <div class="logo">
        <img src="icoStickify.png" class="logo-img">Stickify
      </div>
      <app-welcome-nav class="top-right-buttons"></app-welcome-nav>
    </header>
  `,
  styleUrls: ['./welcome-header.component.css']
})
export class WelcomeHeaderComponent { }