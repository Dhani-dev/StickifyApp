import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Song } from '../shared/interfaces/song.interface';


@Injectable({
  providedIn: 'root'
})
export class MusicService {
  constructor(private http: HttpClient) { }

  fetchSongs(searchTerm: string = 'music') {
    return this.http.get(`https://itunes.apple.com/search?term=${searchTerm}&limit=100`).pipe(
      map((data: any) => {
        return data.results.map((song: any) => ({
          trackId: song.trackId,
          artistName: song.artistName,
          trackName: song.trackName,
          primaryGenreName: song.primaryGenreName,
          collectionName: song.collectionName,
          artworkUrl100: song.artworkUrl100,
          releaseDate: song.releaseDate,
          isUserUpload: false
        } as Song));
      })
    );
  }
}