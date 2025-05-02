import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Song } from '../../../shared/interfaces/song.interface';
import { Comment } from '../../../shared/interfaces/comment.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingService } from '../../../services/rating.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-song-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './song-modal.component.html',
  styleUrls: ['./song-modal.component.css']
})
export class SongModalComponent implements OnInit, OnChanges {
  private _song: Song | null = null;
  newCommentText: string = '';
  userRating: number = 0;
  @Input() currentUser: string | null = null;
  @Input() comments: Comment[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() rateSong = new EventEmitter<number>();
  @Output() submitComment = new EventEmitter<string>();

  @Input()
  set song(value: Song | null) {
    this._song = value;
    this.updateUserRating(); // Llama a la función cuando cambia la canción
  }
  get song(): Song | null {
    return this._song;
  }

  constructor(
    private ratingService: RatingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Asegurarse de tener el currentUser al inicializar el componente
    this.currentUser = this.authService.currentUser?.username ||
                        this.authService.currentUser?.email || null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Volver a actualizar la calificación si cambia el currentUser (aunque no es lo más común)
    if (changes['currentUser'] && this.song) {
      this.updateUserRating();
    }
  }

  private updateUserRating(): void {
    if (this.song && this.currentUser) {
      const ratings = this.ratingService.currentRatings[this.song.trackId];
      this.userRating = ratings?.[this.currentUser] || 0;
    } else {
      this.userRating = 0;
    }
  }

  onRate(rating: number): void {
    this.userRating = rating;
    this.rateSong.emit(rating);
  }

  onSubmitComment(): void {
    if (this.newCommentText.trim()) {
      this.submitComment.emit(this.newCommentText);
      this.newCommentText = '';
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
}