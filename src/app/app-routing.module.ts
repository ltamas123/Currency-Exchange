import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExcangeComponent } from './components/excange/excange.component';
import { ExchangeRatesComponent } from './components/exchange-rates/exchange-rates.component';
const routes: Routes = [
  { path: '', component: ExcangeComponent },
  { path: 'exchange', component: ExcangeComponent },
  { path: 'exchange-rates', component: ExchangeRatesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
