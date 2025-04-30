
import { Component, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { Song } from '../../shared/interfaces/song.interface';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { AsideComponent } from '../../shared/components/aside/aside.component';
import { CommonModule } from '@angular/common';  // Añadir esto

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [HeaderComponent, NavComponent, AsideComponent,CommonModule ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  songs: Song[] = [];

  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    this.musicService.fetchSongs('rock').subscribe((songs) => {
      this.songs = songs;
    });
  }
}
