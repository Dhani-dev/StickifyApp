// shared/services/playlist.service.ts
import { Injectable } from '@angular/core';
import { Song } from '../shared/interfaces/song.interface';
import { Playlist } from '../shared/interfaces/playlist.interface';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private userPlaylistsKey = 'userPlaylists';

  getUserPlaylists(): Playlist[] {
    const stored = localStorage.getItem(this.userPlaylistsKey);
    return stored ? JSON.parse(stored) : [];
  }

  createUserPlaylist(name: string, songs: Song[]): Playlist {
    const currentUser = localStorage.getItem('currentUser');
    const createdBy = currentUser ? JSON.parse(currentUser)?.username || JSON.parse(currentUser)?.email : 'Desconocido';

    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}`,
      name,
      trackIds: songs.map(s => s.trackId.toString()),
      type: 'user',
      createdAt: new Date(),
      createdBy: createdBy // Set the createdBy property
    };

    const playlists = this.getUserPlaylists();
    playlists.push(newPlaylist);
    localStorage.setItem(this.userPlaylistsKey, JSON.stringify(playlists));
    return newPlaylist;
  }

  generateAutoPlaylists(songs: Song[]): Playlist[] {
    const genres = [...new Set(songs.map(s => s.primaryGenreName))];

    return genres.map(genre => ({
      id: `auto-${genre.toLowerCase()}`,
      name: `${genre} Hits`,
      trackIds: songs
        .filter(s => s.primaryGenreName === genre)
        .slice(0, 20)
        .map(s => s.trackId.toString()),
      type: 'auto',
      createdAt: new Date()
    }));
  }

  getPlaylistSongs(playlist: Playlist, allSongs: Song[]): Song[] {
    return playlist.trackIds
      .map(id => allSongs.find(s => s.trackId.toString() === id))
      .filter(s => s) as Song[];
  }
}