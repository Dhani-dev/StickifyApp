// profile.component.ts
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Song } from '../../shared/interfaces/song.interface';
import { SongRatings } from '../../shared/interfaces/song-ratings.interface';
import { Comment } from '../../shared/interfaces/comment.interface';
import { MusicService } from '../../services/music.service'; // Importa el servicio
import { Subscription } from 'rxjs';

interface UserProfile {
  username?: string | null;
  email?: string | null;
}

interface SavedPlaylist {
  id: string;
  name: string;
  trackIds: string[];
  type: 'user' | 'auto';
  createdAt: Date;
}

interface UserRating {
  songName?: string;
  rating: number;
}

interface UserComment {
  songName?: string;
  text: string;
  date: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private musicService = inject(MusicService); // Inyecta el servicio
  currentUser: UserProfile = {};
  savedPlaylists: SavedPlaylist[] = [];
  userRatings: UserRating[] = [];
  userComments: UserComment[] = [];
  allSongs: Song[] = [];
  private storedUserRatings: { [trackId: number]: SongRatings } = {};
  private storedSongComments: { [trackId: number]: Comment[] } = {};
  private songsSubscription: Subscription | undefined;

  constructor() { }

  ngOnInit(): void {
    this.loadUserData();
    this.loadSavedPlaylists();
    this.loadRatingsAndComments();
    this.subscribeToSongs(); // Suscríbete al observable de canciones
  }

  ngOnDestroy(): void {
    this.songsSubscription?.unsubscribe(); // Desuscríbete para evitar fugas de memoria
  }

  private subscribeToSongs(): void {
    this.songsSubscription = this.musicService.songs$.subscribe(songs => {
      this.allSongs = songs;
      console.log('All songs loaded in Profile:', this.allSongs);
    });
  }

  private loadUserData(): void {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUser = storedUser ? JSON.parse(storedUser) : {};
  }

  private loadSavedPlaylists(): void {
    const userId = this.currentUser.email || this.currentUser.username;
    if (userId) {
      const savedPlaylistsKey = `savedPlaylists_${userId}`;
      const storedPlaylistsString = localStorage.getItem(savedPlaylistsKey);
      this.savedPlaylists = storedPlaylistsString ? JSON.parse(storedPlaylistsString) : [];
      console.log('Saved playlists loaded:', this.savedPlaylists);
    } else {
      this.savedPlaylists = [];
    }
  }

  private loadRatingsAndComments(): void {
    const storedRatings = localStorage.getItem('songRatings');
    if (storedRatings) {
      this.storedUserRatings = JSON.parse(storedRatings);
      this.populateUserRatings();
    }

    const storedComments = localStorage.getItem('songComments');
    if (storedComments) {
      this.storedSongComments = JSON.parse(storedComments);
      this.populateUserComments();
    }

    const storedAllSongs = localStorage.getItem('allSongs');
    if (storedAllSongs) {
      this.allSongs = JSON.parse(storedAllSongs);
      console.log('All songs loaded from localStorage:', this.allSongs);
    }
  }

  private populateUserRatings(): void {
    if (this.currentUser.email || this.currentUser.username) {
      const userId = this.currentUser.email || this.currentUser.username;
      for (const trackIdStr in this.storedUserRatings) {
        if (this.storedUserRatings.hasOwnProperty(trackIdStr)) {
          const trackId = parseInt(trackIdStr, 10);
          const ratingsForTrack = this.storedUserRatings[trackId];
          if (ratingsForTrack && (ratingsForTrack[this.currentUser.email!] || ratingsForTrack[this.currentUser.username!])) {
            const rating = ratingsForTrack[this.currentUser.email!] || ratingsForTrack[this.currentUser.username!];
            let songName: string | undefined;
            const song = this.allSongs.find(s => s.trackId === trackId);
            if (song) {
              songName = song.trackName;
            }
            this.userRatings.push({ songName: songName || trackId.toString(), rating });
          }
        }
      }
    }
  }

  private populateUserComments(): void {
    if (this.currentUser.email) {
      for (const trackId in this.storedSongComments) {
        if (this.storedSongComments.hasOwnProperty(trackId)) {
          const commentsForTrack = this.storedSongComments[parseInt(trackId, 10)];
          if (commentsForTrack) {
            commentsForTrack.forEach(comment => {
              if (comment.user === this.currentUser.email || comment.user === this.currentUser.username) {
                let songName: string | undefined;
                const song = this.allSongs.find(s => s.trackId === parseInt(trackId, 10));
                if (song) {
                  songName = song.trackName;
                }
                this.userComments.push({ songName: songName || trackId, text: comment.text, date: comment.date });
              }
            });
          }
        }
      }
    }
  }

  getPlaylistCoverForProfile(playlist: { trackIds: string[] }): string {
    if (this.allSongs.length > 0 && playlist.trackIds.length > 0) {
      const firstSong = this.allSongs.find(song => String(song.trackId) === playlist.trackIds[0]);
      if (firstSong?.artworkUrl100) {
        return firstSong.artworkUrl100;
      } else {
      }
    }
    return '/banner.jpg';
  }

  logout(): void {
    this.authService.logOut();
  }
}