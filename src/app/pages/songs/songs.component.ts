// songs.component.ts
import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { FormsModule } from '@angular/forms';
import { MusicService } from '../../services/music.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Song } from '../../shared/interfaces/song.interface';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [NavComponent, FormsModule, CommonModule],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.css'
})
export class SongsComponent {
  @ViewChild('artistName') artistNameInput!: ElementRef;
  @ViewChild('trackName') trackNameInput!: ElementRef;
  @ViewChild('collectionName') collectionNameInput!: ElementRef;
  @ViewChild('primaryGenreName') primaryGenreNameInput!: ElementRef;
  @ViewChild('artworkFile') artworkFileInput!: ElementRef;

  private musicService = inject(MusicService);
  private router = inject(Router);

  async uploadSong(): Promise<void> {
    const artistName = this.artistNameInput.nativeElement.value.trim();
    const trackName = this.trackNameInput.nativeElement.value.trim();
    const collectionName = this.collectionNameInput.nativeElement.value.trim();
    const primaryGenreName = this.primaryGenreNameInput.nativeElement.value.trim();
    const artworkFile: File = this.artworkFileInput.nativeElement.files[0];

    if (!artistName || !trackName || !collectionName || !primaryGenreName || !artworkFile) {
      alert('Por favor, completa todos los campos y selecciona un archivo de imagen.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const artworkUrl = reader.result as string;

      const newSong: Song = {
        artistName: artistName,
        trackName: trackName,
        collectionName: collectionName,
        primaryGenreName: primaryGenreName,
        artworkUrl100: artworkUrl,
        releaseDate: new Date().toISOString(),
        trackId: Date.now(),
        collectionId: Date.now() + 1,
        artistId: Date.now() + 2,
        isUserUpload: true
      };

      this.musicService.addSong(newSong); // Usar el método del servicio para agregar la canción

      alert(`La canción "${trackName}" de ${artistName} ha sido subida con éxito.`);
      this.router.navigate(['/home']);
    };

    reader.readAsDataURL(artworkFile);
  }
}