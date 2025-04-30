// playlist.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { MusicService } from '../../services/music.service';
import { PlaylistService } from '../../services/playlist.service';
import { Song } from '../../shared/interfaces/song.interface';
import { Playlist } from '../../shared/interfaces/playlist.interface';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Añade esto

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [NavComponent, NgFor, NgIf, FormsModule, CommonModule],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  private musicService = inject(MusicService);
  private playlistService = inject(PlaylistService);

  userPlaylists: Playlist[] = [];
  autoPlaylists: Playlist[] = [];
  allSongs: Song[] = [];
  showModal = false;
  newPlaylistName = '';
  selectedSongs: Song[] = [];

  ngOnInit() {
    this.loadPlaylists();
    this.musicService.songs$.subscribe(songs => {
      this.allSongs = songs;
      this.autoPlaylists = this.playlistService.generateAutoPlaylists(songs);
    });
  }

  loadPlaylists() {
    this.userPlaylists = this.playlistService.getUserPlaylists();
  }

  getPlaylistSongs(playlist: Playlist): Song[] {
    return this.playlistService.getPlaylistSongs(playlist, this.allSongs);
  }

  toggleSongSelection(song: Song) {
    const index = this.selectedSongs.findIndex(s => s.trackId === song.trackId);
    index > -1 ? this.selectedSongs.splice(index, 1) : this.selectedSongs.push(song);
  }

  createPlaylist() {
    if (this.newPlaylistName && this.selectedSongs.length > 0) {
      this.playlistService.createUserPlaylist(this.newPlaylistName, this.selectedSongs);
      this.loadPlaylists();
      this.closeModal();
    }
  }

  openModal() {
    this.showModal = true;
    this.selectedSongs = [];
    this.newPlaylistName = '';
  }

  closeModal() {
    this.showModal = false;
  }

  getPlaylistCover(playlist: Playlist): string {
    const firstSong = this.getPlaylistSongs(playlist)[0];
    if (!firstSong) return './assets/default-cover.jpg';

    // Forzar tamaño 100x100 para imágenes de iTunes
    if (firstSong.artworkUrl100?.includes('mzstatic.com')) {
      return firstSong.artworkUrl100.replace(/100x100bb.jpg$/, '100x100bb.jpg');
    }

    // Para imágenes subidas por usuarios (asumiendo que son URLs)
    return `${firstSong.artworkUrl100}?width=100&height=100`;
  }

  savePlaylistToProfile(playlist: Playlist) {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      const userId = currentUser.email || currentUser.username;
      if (userId) {
        const playlistToSave = {
          id: playlist.id,
          name: playlist.name,
          trackIds: playlist.trackIds,
          type: playlist.type,
          createdAt: playlist.createdAt
        };
  
        const savedPlaylistsKey = `savedPlaylists_${userId}`;
        const storedPlaylistsString = localStorage.getItem(savedPlaylistsKey);
        const storedPlaylists = storedPlaylistsString ? JSON.parse(storedPlaylistsString) : [];
  
        const existingPlaylistIndex = storedPlaylists.findIndex(
          (saved: { id: string }) => saved.id === playlistToSave.id
        );
  
        if (existingPlaylistIndex === -1) {
          storedPlaylists.push(playlistToSave);
          localStorage.setItem(savedPlaylistsKey, JSON.stringify(storedPlaylists));
          alert(`Playlist "${playlist.name}" guardada en tu perfil.`);
        } else {
          alert(`La playlist "${playlist.name}" ya está guardada en tu perfil.`);
        }
      } else {
        alert('No se pudo identificar al usuario para guardar la playlist.');
      }
    } else {
      alert('No se pudo guardar la playlist. Usuario no encontrado.');
    }
  }
}