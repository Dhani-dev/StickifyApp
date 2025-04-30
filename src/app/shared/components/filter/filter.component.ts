import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { MusicService } from '../../../services/music.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {
  @Output() filterChanged = new EventEmitter<any>();
  genres: string[] = [];
  artists: string[] = [];
  selectedGenres: string[] = [];
  selectedArtists: string[] = [];
  selectedYear: string = '';
  private genresSubscription: Subscription | undefined;
  private artistsSubscription: Subscription | undefined;

  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    this.genresSubscription = this.musicService.genres$.subscribe((updatedGenres: string[]) => {
      this.genres = updatedGenres;
    });

    this.artistsSubscription = this.musicService.artists$.subscribe((updatedArtists: string[]) => {
      this.artists = updatedArtists;
    });
  }

  ngOnDestroy(): void {
    if (this.genresSubscription) {
      this.genresSubscription.unsubscribe();
    }
    if (this.artistsSubscription) {
      this.artistsSubscription.unsubscribe();
    }
  }

  toggleFilter(type: string) {
    const filters = document.getElementById(`${type}Filters`);
    if (filters) filters.classList.toggle('show');
  }

  onGenreChange(genre: string, event: any) {
    event.target.checked ?
      this.selectedGenres.push(genre) :
      this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
    this.emitFilters();
  }

  onArtistChange(artist: string, event: any) {
    event.target.checked ?
      this.selectedArtists.push(artist) :
      this.selectedArtists = this.selectedArtists.filter(a => a !== artist);
    this.emitFilters();
  }

  onYearChange(event: any) {
    this.selectedYear = event.target.value;
    this.emitFilters();
  }

  private emitFilters() {
    this.filterChanged.emit({
      genres: this.selectedGenres,
      artists: this.selectedArtists,
      year: this.selectedYear
    });
  }
}