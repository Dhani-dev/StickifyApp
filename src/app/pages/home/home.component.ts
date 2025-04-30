import { Component, OnInit, ElementRef, ViewChild, inject, DoCheck } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { Song } from '../../shared/interfaces/song.interface';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { AsideComponent } from '../../shared/components/aside/aside.component';
import { CommonModule } from '@angular/common';
import { Comment } from '../../shared/interfaces/comment.interface';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { SongRatings } from '../../shared/interfaces/song-ratings.interface'; // Asegúrate de crear esta interfaz
import { RatedSong } from '../../shared/interfaces/rated-song.interface'; // Asegúrate de crear esta interfaz

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [HeaderComponent, NavComponent, AsideComponent, CommonModule, FormsModule],
  styleUrls: ['./home.component.css', './home-modal.component.css']
})
export class HomeComponent implements OnInit, DoCheck {
  allSongs: Song[] = [];
  filteredSongs: Song[] = [];
  currentSearchTerm: string = 'music';
  selectedSong: Song | null = null;
  @ViewChild('songModal') songModal!: ElementRef;
  userRatings: { [trackId: number]: SongRatings } = {}; // Almacena calificaciones por usuario
  songComments: { [trackId: number]: Comment[] } = {};
  newCommentText: string = '';
  private authService = inject(AuthService);
  currentUser: string | null = null;
  topRatedSongsList: RatedSong[] = [];

  // Variables de paginación
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPagesArray: number[] = [];

  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    this.musicService.songs$.subscribe(songs => {
      this.loadInitialSongs();
      this.loadRatingsAndComments();
      this.getCurrentUser();
      this.loadInitialData();
    });  
  }

  ngDoCheck(): void {
    this.emitTopRatedSongs(); // Emitir las canciones mejor calificadas en cada ciclo de detección de cambios
  }

  private loadInitialData(): void {
    this.musicService.fetchSongs().subscribe(songs => {
      this.allSongs = songs;
      this.filteredSongs = [...this.allSongs];
      this.updatePagination();
      this.emitTopRatedSongs();
    });
  }

  private getCurrentUser(): void {
    this.currentUser = this.authService.currentUser?.username || this.authService.currentUser?.email || null;
  }

  private loadRatingsAndComments(): void {
    const storedRatings = localStorage.getItem('songRatings'); // Cambiado a 'songRatings'
    if (storedRatings) {
      this.userRatings = JSON.parse(storedRatings);
    }
    const storedComments = localStorage.getItem('songComments');
    if (storedComments) {
      this.songComments = JSON.parse(storedComments);
    }
  }

  private saveRatingsAndComments(): void {
    localStorage.setItem('songRatings', JSON.stringify(this.userRatings)); // Cambiado a 'songRatings'
    localStorage.setItem('songComments', JSON.stringify(this.songComments));
  }

  private loadInitialSongs(): void {
    this.musicService.fetchSongs(this.currentSearchTerm).subscribe({
      next: (songs) => {
        this.allSongs = songs;
        this.filteredSongs = [...this.allSongs];
        this.updatePagination();
        this.emitTopRatedSongs(); // Emitir las canciones al cargar inicialmente
      },
      error: (err) => console.error('Error loading songs:', err)
    });
  }

  onFilterChange(filters: any): void {
    let filtered = this.allSongs.filter(song => {
      const yearMatch = !filters.year ||
        new Date(song.releaseDate).getFullYear().toString() === filters.year;
      const genreMatch = filters.genres.length === 0 ||
        filters.genres.includes(song.primaryGenreName);
      const artistMatch = filters.artists.length === 0 ||
        filters.artists.includes(song.artistName);

      return yearMatch && genreMatch && artistMatch;
    });

    if (filtered.length === 0 && filters.genres.length > 0) {
      const genreQuery = filters.genres.join('+');
      this.currentSearchTerm = genreQuery;
      this.musicService.fetchSongs(genreQuery).subscribe({
        next: (newSongs) => {
          this.allSongs = [...this.allSongs, ...newSongs];
          this.filteredSongs = newSongs;
          this.updatePagination();
          this.currentPage = 1;
        },
        error: (err) => console.error('Error searching new songs:', err)
      });
    } else {
      this.filteredSongs = filtered;
      this.updatePagination();
      this.currentPage = 1;
    }
  }

  onSearchTermChanged(searchTerm: string): void {
    const lowerSearchTerm = searchTerm.toLowerCase();
    this.filteredSongs = this.allSongs.filter(song =>
      song.trackName.toLowerCase().includes(lowerSearchTerm) ||
      song.artistName.toLowerCase().includes(lowerSearchTerm)
    );
    this.updatePagination();
    this.currentPage = 1;
  }

  getAverageRatingForSong(trackId: number): number {
    if (this.userRatings[trackId]) {
      const ratings = Object.values(this.userRatings[trackId]);
      if (ratings.length > 0) {
        const sum = ratings.reduce((acc, curr) => acc + curr, 0);
        return sum / ratings.length;
      }
    }
    return 0;
  }

  private getRatedSongs(): RatedSong[] {
    return Object.keys(this.userRatings)
      .map(trackIdStr => {
        const trackId = parseInt(trackIdStr, 10);
        const song = this.allSongs.find(s => s.trackId === trackId);
        const averageRating = this.getAverageRatingForSong(trackId);
        return song && averageRating > 0 ? { song, averageRating } : null;
      })
      .filter((ratedSong): ratedSong is RatedSong => ratedSong !== null)
      .sort((a, b) => b.averageRating - a.averageRating);
  }

  private emitTopRatedSongs(): void {
    const topRated = this.getRatedSongs().slice(0, 5); // Obtener las 5 mejores
    this.topRatedSongsList = topRated;
  }

  openModal(song: Song): void {
    this.selectedSong = song;
    this.populateModalDetails(song);
    this.songModal.nativeElement.style.display = 'block';
  }

  closeModal(): void {
    this.selectedSong = null;
    this.newCommentText = '';
    this.songModal.nativeElement.style.display = 'none';
  }

  rateSong(rating: number): void {
    if (this.selectedSong && this.currentUser) {
      if (!this.userRatings[this.selectedSong.trackId]) {
        this.userRatings[this.selectedSong.trackId] = {};
      }
      this.userRatings[this.selectedSong.trackId][this.currentUser] = rating;
      this.saveRatingsAndComments();
      this.populateModalDetails(this.selectedSong); // Re-render para actualizar las estrellas en el modal
    }
  }

  submitComment(): void {
    if (this.selectedSong && this.newCommentText.trim() && this.currentUser) {
      const newComment: Comment = {
        user: this.currentUser,
        text: this.newCommentText.trim(),
        date: Date.now()
      };
      if (!this.songComments[this.selectedSong.trackId]) {
        this.songComments[this.selectedSong.trackId] = [];
      }
      this.songComments[this.selectedSong.trackId].push(newComment);
      this.newCommentText = '';
      this.saveRatingsAndComments();
      this.populateModalDetails(this.selectedSong); // Re-render para mostrar el nuevo comentario
    }
  }

  getUserRatingForSong(): number {
    if (this.selectedSong && this.currentUser && this.userRatings[this.selectedSong.trackId]?.[this.currentUser]) {
      return this.userRatings[this.selectedSong.trackId][this.currentUser];
    }
    return 0;
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

  getCommentsForSong(): Comment[] {
    return this.selectedSong && this.songComments[this.selectedSong.trackId] ?
           this.songComments[this.songComments[this.selectedSong.trackId]?.length > 0 ? this.selectedSong.trackId : -1] : [];
  }

  private populateModalDetails(song: Song): void {
    const modalDetailsDiv = document.getElementById('modalSongDetails');
    if (modalDetailsDiv && song && this.currentUser) {
      const userRating = this.getUserRatingForSong();
      const stars = Array(5).fill('').map((_, index) => `
        <span class="star" data-rating="${index + 1}"
              style="color: ${index < userRating ? '#FFD700' : '#ccc'};
              cursor: pointer; font-size: 1.5em;">
          ★
        </span>
      `).join('');

      modalDetailsDiv.innerHTML = `
        <img src="${song.artworkUrl100}" alt="${song.trackName}" style="max-width: 100px; height: auto; float: left; margin-right: 10px;">
        <h3>${song.artistName} - ${song.trackName}</h3>
        <p><strong>Género:</strong> ${song.primaryGenreName}</p>
        <p><strong>Álbum:</strong> ${song.collectionName}</p>
        <div class="rating-stars">${stars}</div>
      `;

      const starElements = modalDetailsDiv.querySelectorAll('.rating-stars .star');
      starElements.forEach(star => {
        star.addEventListener('click', () => {
          const ratingValue = parseInt(star.getAttribute('data-rating') || '0', 10);
          this.rateSong(ratingValue);
        });
      });

      const modalCommentsDiv = document.getElementById('modalComments');
      if (modalCommentsDiv) {
        modalCommentsDiv.innerHTML = this.getCommentsForSong().map(comment => `
          <div class="comment">
            <p>${comment.text}</p>
            <small>${comment.user} - ${new Date(comment.date).toLocaleDateString()}</small>
          </div>
        `).join('');
      }
    } else if (modalDetailsDiv && song) {
      // Si no hay currentUser, no mostrar estrellas interactivas
      modalDetailsDiv.innerHTML = `
        <img src="${song.artworkUrl100}" alt="${song.trackName}" style="max-width: 100px; height: auto; float: left; margin-right: 10px;">
        <h3>${song.artistName} - ${song.trackName}</h3>
        <p><strong>Género:</strong> ${song.primaryGenreName}</p>
        <p><strong>Álbum:</strong> ${song.collectionName}</p>
      `;
      const modalCommentsDiv = document.getElementById('modalComments');
      if (modalCommentsDiv) {
        modalCommentsDiv.innerHTML = this.getCommentsForSong().map(comment => `
          <div class="comment">
            <p>${comment.text}</p>
            <small>${comment.user} - ${new Date(comment.date).toLocaleDateString()}</small>
          </div>
        `).join('');
      }
    }
  }

  private updatePagination(): void {
    const totalPages = Math.ceil(this.filteredSongs.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPagesArray.length) {
      this.currentPage = page;
    }
  }

  getPaginatedSongs(): Song[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredSongs.slice(startIndex, startIndex + this.itemsPerPage);
  }
}