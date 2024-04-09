import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent implements OnInit {
  @Input({required: true}) rating!: number;
  @Output() ratingChange = new EventEmitter<number>();
  auxRating!: number;

  ngOnInit(): void {
    this.auxRating = this.rating;
  }

  changeRating(rating: number) {
    this.ratingChange.emit(rating);
  }
}
