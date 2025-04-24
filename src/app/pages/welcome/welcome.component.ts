import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
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