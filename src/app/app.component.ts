import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'marmoraria-sao-carlos';

  constructor(private primeNgConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    this.primeNgConfig.ripple = true;

    const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];

    if (navigation && navigation.type === 'reload') {
      console.log('Página atualizada com F5');
    } else {
      window.location.reload();
    }
  }
}
