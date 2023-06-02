import { Component, OnInit } from '@angular/core';
import { CoinService } from 'src/services/coin.service';
import { CoinDialogService } from 'src/services/coin-dialog.service';
import { AuthenticationService } from 'src/services/authentication.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.css']
})
export class CoinListComponent implements OnInit {
  coins: any[] = [];
  groupedCoins: { [key: string]: any[] } = {};
  years: string[] = [];
  countries: string[] = [];
  selectedYear: string = '';
  selectedCountry: string = '';
  user: any;
  coinCollected: boolean[] = [];  // this will keep track of each coin's collected status


  constructor(private coinService: CoinService, private dialogService: CoinDialogService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.getCoins();
    this.getYears();
    this.getCountries();
    this.getUserInfo();
    this.updateCollectedCoins(); // Call the method here
  }

  getCoins() {
    this.coinService.getCoins().subscribe(
      coins => {
        this.coins = coins.map(coin => {
          let imageUrl = 'assets/images/default.jpg';
          if (coin.img_url && typeof coin.img_url === 'string') {
            const parts = coin.img_url.split('/');
            const filename = parts[parts.length - 1];
            imageUrl = 'assets/images/' + filename;
          }
          
          return {
            ...coin,
            img_url: imageUrl,
            collected: false  // Set initial collected status to false
          };
        });

        this.groupByCountry(this.coins); // Call the function here after updating this.coins
        this.updateCollectedCoins();
      },
      error => console.error('Error retrieving coins:', error)
    );
}

  initializeCoinCollectedArray() {
    this.coinCollected = new Array(this.coins.length).fill(false);

    // Update the coinCollected array based on the collected coins
    if (this.user && this.user.userId) {
      this.coinService.getCollectedCoins(this.user.userId).subscribe(
        collectedCoins => {
          // Create a set of collected coin IDs
          const collectedCoinIds = new Set(collectedCoins.map((coin: { _id: any; }) => coin._id));

          // Update the collected status of each coin
          this.coins.forEach((coin, index) => {
            this.coinCollected[index] = collectedCoinIds.has(coin._id);
          });
        },
        error => {
          console.error('Error retrieving collected coins:', error);
        }
      );
    }
  }


  updateCollectedCoins() {
    if (this.user && this.user.userId) {
      this.coinService.getCollectedCoins(this.user.userId).subscribe(
        collectedCoins => {
          // Create a set of collected coin IDs
          const collectedCoinIds = new Set(collectedCoins.map((coin: { _id: any; }) => coin._id));

          // Update the collected status of each coin
          this.coins.forEach((coin, index) => {
            coin.collected = collectedCoinIds.has(coin._id);
          });

          // Update the coinCollected array
          this.initializeCoinCollectedArray();
        },
        error => {
          console.error('Error retrieving collected coins:', error);
        }
      );
    } else {
      this.coins.forEach(coin => {
        coin.collected = false; // Set all coins' collected status to false if no user is logged in
      });
      this.initializeCoinCollectedArray(); // Update the coinCollected array
    }
  }

  groupByCountry(coins = this.coins) {
    this.groupedCoins = coins.reduce((grouped, coin) => {
      const key = coin.country;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(coin);
      return grouped;
    }, {});
}

  

  getYears() {
    this.coinService.getCoinYears().subscribe(
      years => {
        this.years = years;
      },
      error => console.error('Error retrieving years:', error)
    );
  }

  getCountries() {
    this.coinService.getCoinCountries().subscribe(
      countries => {
        this.countries = countries;
      },
      error => console.error('Error retrieving countries:', error)
    );
  }

  filterCoins() {
    let filteredCoins = [...this.coins]; 
  
    if (this.selectedYear) {
      filteredCoins = filteredCoins.filter(coin => coin.year === this.selectedYear);
    }
  
    if (this.selectedCountry) {
      filteredCoins = filteredCoins.filter(coin => coin.country === this.selectedCountry);
    }
  
    this.groupByCountry(filteredCoins); 
  }
  

  clearFilters() {
    this.selectedYear = '';
    this.selectedCountry = '';
    this.groupByCountry();
  }

  openCoinDialog(coin: any) {
    this.dialogService.openCoinDialog(coin);
  }

  markAsCollected(coinId: string, index: number) {
    if (this.user && this.user.userId) {
      this.coinService.collectCoin(this.user.userId, coinId).subscribe(
        () => {
          console.log('Coin added to collection:', coinId);
          this.coinCollected[index] = true;  // update the collected status
        },
        error => {
          console.log('Could not collect coin:', error);
        }
      );
    } else {
      console.error('User ID not found');
    }
  }

  checkboxChange(coinId: string, collected: boolean, event:any): void {
    let checkboxState = event.target.checked;  // get the current state of the checkbox
    
    if (checkboxState) {
      this.coinService.collectCoin(this.user.userId, coinId).subscribe(
        () => {
          console.log('Coin added to collection:', coinId);
          collected = true;  // update the collected status
        },
        error => {
          console.log('Could not collect coin:', error);
        }
      );
    } else {
      this.coinService.removeCoin(this.user.userId, coinId).subscribe(
        () => {
          console.log('Coin deleted from collection:', coinId);
          collected = false;  // update the collected status
        },
        error => {
          console.log('Could not delete coin:', error);
        }
      );
    }
  }
  

  removeFromCollection(coinId: string, index: number) {
    if (this.user && this.user.userId) {
      this.coinService.removeCoin(this.user.userId, coinId).subscribe(
        () => {
          console.log('Coin deleted from collection:', coinId);
          this.coinCollected[index] = false;  // update the collected status
        },
        error => {
          console.log('Could not remove coin:', error);
        }
      );
    } else {
      console.error('User ID not found');
    }
  }

  getUserInfo() {
    this.authService.getUserInfo().subscribe(
      userInfo => {
        this.user = userInfo;
        this.updateCollectedCoins(); // Update collected coins when user info is retrieved
      },
      error => {
        console.error('Error retrieving user info:', error);
      }
    );
  }

}
