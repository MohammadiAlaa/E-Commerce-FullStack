import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  standalone: true,
  template: `
    <select class="form-select shadow-sm" (change)="detectEvent($event)">
      <option value="" selected disabled>{{ title }}</option>

      <option value="all">All Products</option>

      @for (option of data; track option.id) {
        <option [value]="option.id">{{ option.name }}</option>
      } @empty {
        <option disabled>No Categories Found</option>
      }
    </select>
  `,
})
export class Select {
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Output() onSelectChange = new EventEmitter<any>();

  detectEvent(event: any) {
    this.onSelectChange.emit(event.target.value);
  }
}
