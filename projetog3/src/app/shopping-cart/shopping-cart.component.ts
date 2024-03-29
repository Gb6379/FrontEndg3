import { Product } from './../model/Product';
import { Carrinho } from './../model/Carrinho';
import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../service/token-storage.service';

import { CarrinhoItem } from '../model/CarrinhoItem';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  productList!: Carrinho;
  products: any;
  idUser: any;

  constructor(
    private shopping_cart: ShoppingCartService,
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit() {
    this.idUser = this.tokenStorage.getUserId;
    this.shopping_cart
      .findById1({ header: this.tokenStorage.getToken })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.productList = res;
        },
        error: (error) => {
          alert(error);
        },
        complete: () => {
          console.log('Request Completed');
        },
      });
    this.total();

    this.products = this.productList.cartItems;
  }

  //Add product to Cart
  addToCart(product: any) {
    this.shopping_cart.addItem({
      product_id: product.id,
      header: this.tokenStorage.getToken,
    });
    this.shopping_cart
      .findById1({ header: this.tokenStorage.getToken })
      .subscribe((carrinho) => {
        this.products = carrinho;
      });
  }

  //Remove a Product from Cart
  removeFromCart(product: any) {
    this.shopping_cart.removeItemCart({
      product_id: product.id,
      header: this.tokenStorage.getToken,
    });
    this.shopping_cart
      .findById1({ header: this.tokenStorage.getToken })
      .subscribe((carrinho) => {
        this.products = carrinho;
      });
  }

  //Calculate Total
  total() {
    if (this.productList.cartItems === undefined) {
    } else {
      this.productList.cartItems!.forEach((item) => {
        this.productList.totalCost! += item.product!.price! * item.quantity!;
      });
    }
  }

  checkout() {
    localStorage.setItem(
      'cart_total',
      JSON.stringify(this.productList.totalCost)
    );
    this.router.navigate(['/Payment']);
  }
}
