import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoinService } from 'src/services/coin.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  userId: string | null = null;
  totalPercentage: number = 0;
  coinsPerCountry: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private coinService: CoinService
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId'); // Make sure this is the correct parameter name;

    if (this.userId === null) {
      console.error('User ID is null');
      return;
    }
    this.coinService.getCollectedCoinStats(this.userId)
      .subscribe((stats: any) => {
        this.totalPercentage = (stats.totalCoinsCollected / stats.totalCoins) * 100;

        for (let country in stats.coinsPerCountry) {
          const totalCoins = stats.totalCoinsPerCountry.find((item: any) => item._id === country)?.count || 0;
          this.coinsPerCountry.push({
            name: country,
            collectedPercentage: (stats.coinsPerCountry[country] / totalCoins) * 100
          });
        }
      });
  }
}
