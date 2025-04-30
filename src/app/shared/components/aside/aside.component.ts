import { Component, Input, OnInit } from '@angular/core';
import { Song } from '../../../shared/interfaces/song.interface';
import { CommonModule } from '@angular/common'; // Importa CommonModule

interface RatedSong {
  song: Song;
  averageRating: number;
}

@Component({
  selector: 'app-aside',
  imports: [CommonModule], // Añade CommonModule al array de imports
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent implements OnInit {
  @Input() topRatedSongs: RatedSong[] = [];

  ngOnInit(): void {
    console.log('Top Rated Songs recibidas en Aside:', this.topRatedSongs);
  }

  getStarArray(averageRating: number): string[] {
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return [
      ...Array(fullStars).fill('★'),
      ...(hasHalfStar ? ['½'] : []), // Puedes usar '½' o un icono de media estrella
      ...Array(emptyStars).fill('☆'), // Puedes usar '☆' o un icono de estrella vacía
    ];
  }
}