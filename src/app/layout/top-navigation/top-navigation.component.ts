import { Component, OnInit } from '@angular/core';
import { productRoutes, salesRoutes } from 'src/app/shared/appConfig';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  listProduct = "";
  listSales = `/${salesRoutes.Base}/${salesRoutes.List}`;

}
