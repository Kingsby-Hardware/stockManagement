import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './dashboard/home/home.component';
import { ListProductsComponent } from './products/list-products/list-products.component';
import { productRoutes, salesRoutes } from './shared/appConfig';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ListSalesComponent } from './sales/list-sales/list-sales.component';
import { SalesFormComponent } from './sales/sales-form/sales-form.component';

const routes: Routes = [
  {
    path: "", component: HomeComponent,
    children: [
      { path: "", component: ListProductsComponent },
      {path: `${productRoutes.Base}/${productRoutes.Add}`, component: AddProductComponent},
      {path: `${productRoutes.Base}/${productRoutes.Update}/:productId`, component: AddProductComponent},
      { path: `${salesRoutes.Base}/${salesRoutes.List}`, component: ListSalesComponent },
      {path: `${salesRoutes.Base}/${salesRoutes.Add}`, component: SalesFormComponent},
      {path: `${salesRoutes.Base}/${salesRoutes.Update}/:salesId`, component: SalesFormComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
