import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NgxSlideshowModule } from 'ngx-slideshow';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tiles = [
    {title: 'Monitor', cols: 3, rows: 1, color: 'lightblue'},
    {title: 'Config', cols: 1, rows: 2, color: 'lightgreen'},
    {title: 'Coming Soon ...', cols: 1, rows: 1, color: 'lightpink'},
    {title: 'Coming Soon ...', cols: 2, rows: 1, color: '#DDBDF1'},
  ];
  constructor() {

  }

  ngOnInit() {
  }

}
