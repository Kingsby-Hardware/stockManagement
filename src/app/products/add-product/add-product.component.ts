import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ProductService } from 'src/app/shared/services/product.service';
import { Product } from 'src/app/shared/models/product';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  /* #region  Global Variables */
  productForm: FormGroup;
  isSubmitted: boolean = false;
  disableSubmit: boolean = false;
  newProduct: Product;
  storedProduct: Product;
  updatedProduct: Product;
  pageTitle: string = "";
  /* #endregion */

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }



  ngOnInit() {

    this.productForm = this.formBuilder.group({
      productId: [""],
      name: ["", Validators.required],
      quantity: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      unit: ["", Validators.required]
    });

    this.route.paramMap.subscribe((params) => {
      const productId = params.get("productId");
      if (productId && productId != null) {
        this.pageTitle = "Update Product"
        this.getProductById(productId);
      }
      else {
        this.pageTitle = "Add Product"
      }
    });
  }

  getProductById(productId: string) {
    console.log("Inside getProductByID", productId);
    this.productService.getProductById(productId).subscribe(
      (res) => {
        if (res != null) {
          console.log("fetched by ID", JSON.stringify(res));
          this.pageTitle = `Update ${res.name}`;
          this.storedProduct = res;
          //Patch fetched values to the form.
          this.patchValues();
        } else {
          this.toastr.error("Failed to fetch Product", "Error");
        }
      },
      (error) => {
        this.toastr.error("Service Failure", "Error");
      }
    )
  }

  patchValues() {
    this.productForm.patchValue({
      productId: this.storedProduct._id,
      name: this.storedProduct.name,
      quantity: this.storedProduct.quantity,
      unit: this.storedProduct.unit,
    });
  }

  // convenience getter for easy access to form fields. For fetching error on HTML side.
  get f() {
    return this.productForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    var formValues = this.productForm.value;
    // Check if form values are valid.
    if (this.productForm.invalid) {
      console.log("Failed" + JSON.stringify(formValues));
      console.log(
        "Failed" + JSON.stringify(this.productForm.controls.getError)
      );
      return;
    }
    this.disableSubmit = true;
    console.log(formValues.productId);

    if (formValues.productId == "" || formValues.productId == null) {
      this.newProduct = {
        name: formValues.name,
        quantity: formValues.quantity,
        unit: formValues.unit
      };

      this.productService.addProduct(this.newProduct).subscribe(
        (out) => {
          if (out != null) {
            this.toastr.success("Product added successfully", "Success");
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
    } else {
      this.updatedProduct = {
        _id: formValues.productId,
        name: formValues.name,
        quantity: formValues.quantity,
        unit: formValues.unit
      };

      this.productService.updateProduct(this.updatedProduct).subscribe(
        (out) => {
          if (out != null) {
            this.toastr.success("Product updated successfully", "Success");
            this.onReset();
            this.router.navigate([""]);
          } else {
            //Toaster Error message.
            this.toastr.error("Failed to update product", "Failure");
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


  }

  // Method : Reset Form.
  onReset() {
    this.isSubmitted = false;
    this.disableSubmit = false;
    this.productForm.reset();
  }

  listProducts() {
    this.router.navigate([""]);
  }
}
