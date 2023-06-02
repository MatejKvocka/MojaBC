import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoinService } from 'src/services/coin.service';

@Component({
  selector: 'app-coin-details',
  templateUrl: './coin-details.component.html',
  styleUrls: ['./coin-details.component.css']
})
export class CoinDetailsComponent implements OnInit {
  coin: any;

  constructor(private route: ActivatedRoute, private coinService: CoinService) { }

  ngOnInit() {
    const coinId = this.route.snapshot.paramMap.get('id');
    if (coinId) {
      this.coinService.getCoinById(coinId).subscribe((data: any) => {
        console.log('Coin Details:', data); // Check if the coin details are logged correctly

        let imageUrl = 'assets/images/default.jpg';  // default image URL
        if (data.img_url && typeof data.img_url === 'string') {
          const parts = data.img_url.split('/');
          const filename = parts[parts.length - 1];  // Take the last element of the array
          imageUrl = 'assets/images/' + filename;
        }

        this.coin = {
          ...data, 
          img_url: imageUrl
        };
      });
    }
    
  }
  goBack() {
    window.history.back();
  }
}
