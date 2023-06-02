import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-coin-dialog',
  templateUrl: './coin-dialog.component.html',
  styleUrls: ['./coin-dialog.component.css']
})
export class CoinDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public coin: any) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  
  }


