import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ProductService } from 'src/app/shared/services/product.service';
import { Product } from 'src/app/shared/models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { Sales } from 'src/app/shared/models/Sales';
import { SalesService } from 'src/app/shared/services/sales.service';
import { salesRoutes } from 'src/app/shared/appConfig';

@Component({
  selector: 'app-sales-form',
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.css']
})
export class SalesFormComponent implements OnInit {

  salesForm: FormGroup;
  items: FormArray;
  products: Product[];
  isSubmitted: boolean = false;
  disableSubmit: boolean = false;
  newSales: Sales;
  pageTitle = "Add Sales";

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private salesService: SalesService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.salesForm = this.formBuilder.group({
      salesId: [""],
      consumer: ["", Validators.required],
      date: ["", Validators.required],
      items: this.formBuilder.array([this.createItem()])
    });

    this.getProducts();
    
  }

  get f() {
    return this.salesForm.controls;
  }

  get i() {
    return this.salesForm.controls.items.errors;
  }

  listSales(){
    this.router.navigate([`${salesRoutes.Base}/${salesRoutes.List}`]);
  }

  onSubmit(){
    this.isSubmitted = true;
    var formValues = this.salesForm.value;
    console.log(JSON.stringify(formValues));
    if (this.salesForm.invalid) {
      console.log("Failed" + JSON.stringify(formValues));
      console.log(
        "Failed" + JSON.stringify(this.salesForm.controls.getError)
      );
      return;
    }
    this.disableSubmit = true;
    this.newSales = {
      consumer: formValues.consumer,
      date: formValues.date,
      items: formValues.items.map((item) => ({
        productId : item.productName[0].id,
        productName: item.productName[0].text,
        quantity: item.quantity
      }))
    };

    console.log("Sales Object", JSON.stringify(this.newSales));
    

    this.salesService.addSale(this.newSales).subscribe(
      (out) => {
        if (out != null) {
          this.toastr.success("Sales added successfully", "Success");
          console.log("add sales ouput", JSON.stringify(out));
          
          this.onReset();
        } else {
          //Toaster Error message.
          this.toastr.error("Failed to add product", "Failure");
        }
      },
      (error) => {
        //On Error.
        console.error("Service Failure", error);
        //Toaster Error
        this.toastr.error(error, "Service Failure");
      }
    );
  }

  getProducts() {
    console.log("getProducts method called");
    this.productService.getProducts()
      .subscribe(
        (res) => {
          console.log("Fetched products: ", JSON.stringify(res));
          if (res != null) {
            
            this.products = res.map((p) => ({
              id: p._id,
              text: p.name,
            }));
            
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

  createItem(): FormGroup {
    return this.formBuilder.group({
      productId: [""],
      productName: ["", Validators.required],
      quantity: ["", [Validators.required, Validators.pattern("^[0-9]*$")]]
    });
  }

  addItem(): void {
    this.items = this.salesForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  removeItem(index): void {
    this.items = this.salesForm.get('items') as FormArray;
    this.items.removeAt(index);
  }

  // Method : Reset Form.
  onReset() {
    this.isSubmitted = false;
    this.disableSubmit = false;
    this.salesForm.reset();
  }

}
