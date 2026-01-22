import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({ providedIn: 'root' })
export class ExportService {

  private genreColors: Record<string, string> = {
    Rock: 'FFF3E5F5',     // light purple
    Pop: 'FFE3F2FD',      // light blue
    Jazz: 'FFE8F5E9',     // light green
    'Hip-Hop': 'FFFFF3E0' // light orange
  };

  exportExcel(rows: any[]) {
    const data = rows.map(r => ({
      Id: r.id,
      'Customer ID': r.customer?.customerId ?? '',
      'Customer Last Name': r.customer?.lastName ?? '',
      Format: r.format,
      Genre: r.genre
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    // Apply row fill colours (by Genre column)
    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let R = 1; R <= range.e.r; R++) { // start at 1 to skip header row
      const genreCell = ws[XLSX.utils.encode_cell({ r: R, c: 4 })]; // Genre is column 4 in our data
      const genre = genreCell?.v as string;
      const fill = this.genreColors[genre] ?? 'FFFFFFFF';

      for (let C = 0; C <= range.e.c; C++) {
        const addr = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[addr]) continue;
        ws[addr].s = {
          fill: { patternType: 'solid', fgColor: { rgb: fill } }
        };
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Records');

    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([out], { type: 'application/octet-stream' }), 'records.xlsx');
  }

  exportPdf(rows: any[]) {
    const doc = new jsPDF();

    const body = rows.map(r => ([
      r.id,
      r.customer?.customerId ?? '',
      r.customer?.lastName ?? '',
      r.format,
      r.genre
    ]));

    autoTable(doc, {
      head: [['Id', 'Customer ID', 'Customer Last Name', 'Format', 'Genre']],
      body,
      styles: { fontSize: 10 },
      didParseCell: (data) => {
        if (data.section !== 'body') return;
        const genre = (data.row.raw as any[])[4] as string;
        const hex = (this.genreColors[genre] ?? 'FFFFFFFF').replace(/^FF/, '#'); // '#RRGGBB'
        // jsPDF autotable wants RGB array; keep it simple:
        const rgb = this.hexToRgb(hex);
        if (rgb) data.cell.styles.fillColor = rgb;
      }
    });

    doc.save('records.pdf');
  }

  private hexToRgb(hex: string): [number, number, number] | null {
    const h = hex.replace('#', '');
    if (h.length !== 6) return null;
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return [r, g, b];
  }
}
