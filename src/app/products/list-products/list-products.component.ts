import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { productRoutes, salesRoutes } from 'src/app/shared/appConfig';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit, AfterViewInit, OnDestroy {

  /* #region  Global variables */
  // Datatable properties..
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  timerSubscription: Subscription;
  products: Product[];
  /* #endregion */
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) { }

  ngOnInit() {

    //Set Datatable options.
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      autoWidth: false,
      responsive: true,
      processing: true,
    };

    this.getProducts();

  }

  getProducts() {
    console.log("getProducts method called");
    this.productService.getProducts()
      .subscribe(
        (res) => {
          console.log("Fetched products: ", JSON.stringify(res));
          if (res != null) {
            this.products = res;
            this.rerender();
          }
          else {
            this.toastr.error("Failed to Fetch Products.", "Error");
          }
        },
        (error) => {
          // On Error.
          console.error("Service Failure", error);
          // Toaster Error: Failed to fetch products.
          this.toastr.error(error, "Service Failure");
        }
      )
  }

  addProduct(){
    this.router.navigate([`${productRoutes.Base}/${productRoutes.Add}`]);
  }

  updateProduct(productId: string){
    this.router.navigate([`${productRoutes.Base}/${productRoutes.Update}`, productId]);
  }

  deleteProduct(product: Product){
    Swal.fire({
      title: `Delete ${product.name} ?`,
      text: "You will not be able to recover this product!",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {
        
        this.productService.deleteProduct(product._id).subscribe(
          (res) => {
            console.log("Success Output : " + JSON.stringify(res));
            if (res!= null) {
              // Remove row from table.
              this.products = this.products.filter(({_id}) => _id !== product._id);
              console.log("Removed product from table.");
              this.rerender();
              
              // Success message through swal or toaster.
              Swal.fire(
                "Deleted!",
                `${product.name} has been deleted.`,
                "success"
              );
            } else {
              // Toaster Erorr message.
              this.toastr.error(`Failed to delete ${product.name}.`, "Error");
            }
          },
          error => {
            // On Error.
            console.error("Service Failure", error);
            // Toaster Error: Failed to fetch consumer.
            this.toastr.error(error, "Service Failure");
          }
        );
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Product is not deleted.", "error");
      }
    });
  }

  addSale(){
    this.router.navigate([`${salesRoutes.Base}/${salesRoutes.Add}`]);
  }

  // Method: Refreshes the datatable.
  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();

    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

}
