import { AfterViewInit, OnInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Currency } from 'src/app/interface/currencies';
import { ExcangeApiService } from 'src/app/services/excange-api.service';
import { map, startWith } from 'rxjs/operators';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.css'],
})
export class ExchangeRatesComponent implements OnInit, AfterViewInit {
  currencies: Currency[] = [];
  selectedCurrency: Currency | undefined;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['currency', 'value'];
  pickedDate: string = '0';
  errorMsg: string | undefined;

  filteredCurrency!: Observable<Currency[]>;
  inputControl = new FormControl();

  constructor(private exchangeApi: ExcangeApiService) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getCurrencies();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getCurrencies(): void {
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
    this.filteredCurrency = this.inputControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: any): Currency[] {
    const filterValue = value.simbol
      ? value.simbol.toLowerCase()
      : value.toLowerCase();

    return this.currencies.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  onDatePick(event: any): void {
    const momentDate = new Date(event);
    const formattedDate = _moment(momentDate).format('YYYY-MM-DD');
    this.pickedDate = formattedDate;
    this.selectedCurrency &&
      this.getAllRates(this.selectedCurrency.simbol, this.pickedDate);
  }

  getAllRates(currency: string, timeStamp: string = 'latest'): void {
    let allRates: any = [];
    this.errorMsg = undefined;
    if (!this.validateDate(timeStamp)) {
      return;
    }
    this.exchangeApi
      .getAllRates(currency, timeStamp)
      .pipe(
        map((data) =>
          Object.entries(data[currency]).forEach(([key, value]) =>
            allRates.push({ currency: key, value: value })
          )
        )
      )
      .subscribe(() => (this.dataSource.data = allRates));
  }

  validateDate(timeStamp: string): boolean {
    if (timeStamp === 'latest') {
      return true;
    }
    if (timeStamp >= _moment().format('YYYY-MM-DD')) {
      this.errorMsg = 'Choose a valid date';
      return false;
    } else if (timeStamp <= '2020-11-22') {
      this.errorMsg = "Date can't be less than 2020.11.22";
      return false;
    }
    return true;
  }

  getValue(selecteCurrency: Currency): void {
    this.selectedCurrency = selecteCurrency;
    if (this.pickedDate !== '0') {
      this.getAllRates(selecteCurrency.simbol, this.pickedDate);
    } else {
      this.getAllRates(selecteCurrency.simbol);
    }
  }
  getOptionText(option: any) {
    return option ? option.name : null;
  }
}
