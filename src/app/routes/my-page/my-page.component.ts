import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PreloaderService } from '@core';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.css'],
})
export class MyPageComponent implements OnInit, AfterViewInit {
  constructor(private preloader: PreloaderService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.preloader.hide();
  }
}
