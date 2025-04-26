import { AfterViewInit, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const exploreButton = document.querySelector('.button[href="#"]');

    if (exploreButton) {
      exploreButton.addEventListener('click', (e) => {
        e.preventDefault();

        const nextSection = document.querySelector('.features');
        if (nextSection) {
          window.scrollTo({
            top: nextSection.getBoundingClientRect().top + window.scrollY - 50,
            behavior: 'smooth'
          });
        }
      });
    }
  }
}