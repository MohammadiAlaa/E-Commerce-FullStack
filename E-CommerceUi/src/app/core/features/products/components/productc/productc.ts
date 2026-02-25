import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item } from '../../../../models/item.model';

@Component({
  selector: 'app-productc',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './productc.html',
  styleUrl: './productc.css',
})
export class Productc {
  @Input() data!: Item;
  @Output() item = new EventEmitter<any>();

  addButton: boolean = false;
  amount: number = 1;

  toggleAdd(event: MouseEvent) {
    event.stopPropagation();
    this.addButton = true;
  }

  add(event: MouseEvent) {
    event.stopPropagation();

    this.item.emit({ ...this.data, quantity: this.amount });

    this.addButton = false;
    this.amount = 1;
  }
}
