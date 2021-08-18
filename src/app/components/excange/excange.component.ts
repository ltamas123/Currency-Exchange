import { Component, OnInit } from '@angular/core';
import { Currency } from 'src/app/interface/currencies';
import { ExcangeApiService } from 'src/app/services/excange-api.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-excange',
  templateUrl: './excange.component.html',
  styleUrls: ['./excange.component.css'],
})
export class ExcangeComponent implements OnInit {
  currencies: Currency[] = [];
  selectedFromCurrency!: Currency;
  selectedToCurrency!: Currency;
  value!: number;
  exchangeRate!: any;
  fromControl = new FormControl();
  toControl = new FormControl();
  amountControl = new FormControl();
  fromFilteredOptions!: Observable<Currency[]>;
  toFilteredOptions!: Observable<Currency[]>;

  constructor(private exchangeApi: ExcangeApiService) {}

  ngOnInit(): void {
    this.getCurrencies();
  }

  private _filter(value: any): Currency[] {
    const filterValue = value.simbol
      ? value.simbol.toLowerCase()
      : value.toLowerCase();

    return this.currencies.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  getCurrencies(): void {
    let curr: Currency[] = [];
    this.exchangeApi
      .getCurrencies()
      .pipe(
        map((data) =>
          Object.entries(data).forEach(([key, value]) =>
            this.currencies.push({ simbol: key, name: value })
          )
        )
      )
      .subscribe(() => this.filterOption());
  }

  filterOption(): void {
    this.fromFilteredOptions = this.fromControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.toFilteredOptions = this.toControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  getRate(): void {
    this.exchangeApi
      .getRate(this.selectedFromCurrency.simbol, this.selectedToCurrency.simbol)
      .subscribe(
        (data) => (this.exchangeRate = data[this.selectedToCurrency.simbol])
      );
  }

  exchnage(): void {
    this.getRate();
  }

  changeFromTo(): void {
    this.fromControl.setValue(this.selectedToCurrency);
    this.toControl.setValue(this.selectedFromCurrency);
    const temp = this.selectedFromCurrency;
    this.selectedFromCurrency = this.selectedToCurrency;
    this.selectedToCurrency = temp;
    this.getRate();
  }

  getOptionText(option: any) {
    return option ? option.name : null;
  }

  getValue(selecteCurrency: Currency, form: string): void {
    if (form === 'from') {
      this.selectedFromCurrency = selecteCurrency;
    } else {
      this.selectedToCurrency = selecteCurrency;
    }
  }
}
