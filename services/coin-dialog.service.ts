import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CoinDialogComponent } from 'src/app/coin-dialog/coin-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CoinDialogService {
  constructor(private dialog: MatDialog) {}

  openCoinDialog(coin: any) {
    this.dialog.open(CoinDialogComponent, {
      width: '400px',
      data: coin
    });
  }
}