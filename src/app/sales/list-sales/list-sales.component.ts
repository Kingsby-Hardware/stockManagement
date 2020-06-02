import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { productRoutes, salesRoutes } from 'src/app/shared/appConfig';
import { SalesService } from 'src/app/shared/services/sales.service';
import { Sales } from 'src/app/shared/models/Sales';

@Component({
  selector: 'app-list-sales',
  templateUrl: './list-sales.component.html',
  styleUrls: ['./list-sales.component.css']
})
export class ListSalesComponent implements OnInit, AfterViewInit, OnDestroy {
 /* #region  Global variables */
  // Datatable properties..
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  timerSubscription: Subscription;
  sales: Sales[];
  showModal: boolean = false;
  viewSale: Sales;
  /* #endregion */
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private salesService:SalesService
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

    this.getSales();

  }

  view(sale:Sales){
    this.showModal = true;
    this.viewSale = sale;
  }
  closeModal(){
    this.showModal = false;
  }
  getSales() {
    console.log("getSales method called");
    this.salesService.getSales()
      .subscribe(
        (res) => {
          console.log("Fetched sales: ", JSON.stringify(res));
          if (res != null) {
            this.sales = res;
            this.rerender();
          }
          else {
            this.toastr.error("Failed to Fetch Sales.", "Error");
          }
        },
        (error) => {
          // On Error.
          console.error("Service Failure", error);
          // Toaster Error: Failed to fetch sales.
          this.toastr.error(error, "Service Failure");
        }
      )
  }

  addSale(){
    this.router.navigate([`${salesRoutes.Base}/${salesRoutes.Add}`]);
  }

  deleteSale(sale: Sales){
    Swal.fire({
      title: `Delete Sales for ${sale.consumer} ?`,
      text: "You will not be able to recover this sales!",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {
        
        this.salesService.deleteSale(sale._id).subscribe(
          (res) => {
            console.log("Success Output : " + JSON.stringify(res));
            if (res!= null) {
              // Remove row from table.
              this.sales = this.sales.filter(({_id}) => _id !== sale._id);
              console.log("Removed sale from table.");
              this.rerender();
              
              // Success message through swal or toaster.
              Swal.fire(
                "Deleted!",
                `Sale for ${sale.consumer} has been deleted.`,
                "success"
              );
            } else {
              // Toaster Erorr message.
              this.toastr.error(`Failed to delete Sale for ${sale.consumer}.`, "Error");
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
        Swal.fire("Cancelled", "Sale is not deleted.", "error");
      }
    });
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
