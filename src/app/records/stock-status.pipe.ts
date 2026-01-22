import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockStatus',
  standalone: true,
})
export class StockStatusPipe implements PipeTransform {
  transform(qty: number | null | undefined): string {
    const n = Number(qty ?? 0);
    if (n > 3) return 'In Stock';
    if (n >= 1) return 'Low Stock';
    return 'Out of Stock';
  }
}
