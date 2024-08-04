import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaymentService } from '../../payment.service';
import { AuthService } from '../../api/services/auth/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cardItem: { totalPrice: number, itemsWithQuantity: any[] } = { totalPrice: 0, itemsWithQuantity: [] };
  userId: any;

  constructor(private http: HttpClient, private paymentService: PaymentService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUserInfo().pipe(
      catchError(error => {
        console.error('Error fetching user info:', error);
        return throwError(error);
      })
    ).subscribe(
      (userInfo: any) => {
        this.userId = userInfo?.id;
        if (this.userId) {
          this.checkout();
        } else {
          console.error('User ID not found.');
        }
      }
    );
    this.loadCartItems();
  }

  loadCartItems() {
    let storedCardItem: any = localStorage.getItem('cardItem');
    if (storedCardItem) {
      let cartFromStorage = JSON.parse(storedCardItem);
      this.cardItem = this.calculateTotalPriceWithQuantity(cartFromStorage);
    }
  }

  checkout(): void {
    // Step 1: Calculate total price
    const total = this.calculateTotalPrice();
  
    // Step 2: Obtain user info using AuthService
    this.authService.getInfo().subscribe(
      (userInfo: any) => {
        if (userInfo && userInfo.id) {
          const userId = userInfo.id;
  
          // Step 3: Get cartId from localStorage
          const cartId = localStorage.getItem('cartId');
  
          // Step 4: Check if total, userId, and cartId are defined and valid
          if (total !== undefined && userId && cartId) {
            // Step 5: Call the API with the correct total, userId, and cartId
            this.paymentService.pay(total, userId, +cartId).subscribe(
              (response) => {
                // Handle successful response
                console.log('Checkout successful:', response);
                
                // Optionally, clear the cart after successful payment
                this.clearCart();
              },
              (error: any) => { // Specify the type for the error parameter
                // Handle error response
                console.error('Checkout error:', error);
              }
            );
          } else {
            console.error('Unable to proceed with checkout: total, userId, or cartId is undefined');
          }
        } else {
          console.error('User info not available or user ID not found');
        }
      },
      (error: any) => { // Specify the type for the error parameter
        console.error('Error fetching user info:', error);
        // Handle error if necessary
      }
    );
  }
  
  

  
  // Add a method to clear the cart after successful payment
  clearCart(): void {
    localStorage.removeItem('cardItem');
    this.cardItem = { totalPrice: 0, itemsWithQuantity: [] };
  }
  
  

  calculateTotalPriceWithQuantity(items: any[]) {
    let totalPrice = 0;
    let itemMap: { [key: string]: any } = {};
    let isItemCalculated: { [key: string]: boolean } = {};

    items.forEach(item => {
        if (item && typeof item.coursePrice === 'number') { // Kiểm tra xem coursePrice là một số
            let key = item.courseTitle.toLowerCase();

            if (!isItemCalculated[key]) { // Kiểm tra xem mục đã được tính toán chưa
                if (!itemMap[key]) {
                    itemMap[key] = { ...item, quantity: 1 };
                    totalPrice += item.coursePrice * 1; // Sử dụng coursePrice trực tiếp mà không cần thay thế
                } else {
                    itemMap[key].quantity = 1; // Cố định quantity là 1
                    totalPrice += item.coursePrice * 1; // Sử dụng coursePrice trực tiếp mà không cần thay thế
                }
                isItemCalculated[key] = true; // Đánh dấu mục đã được tính toán
            }
        }
    });

    return { totalPrice, itemsWithQuantity: Object.values(itemMap) };
}

calculateTotalPrice(): number {
  return this.cardItem.itemsWithQuantity.reduce((total: number, item: any) => {
    // Check if the item and its price are defined and valid
    if (item && typeof item.price === 'string') {
      // Remove the dollar sign from the price and convert it to a number
      const priceWithoutDollarSign = item.price.replace('$', '');
      const price = parseFloat(priceWithoutDollarSign);
      
      // Add the price to the total if it's a valid number
      if (!isNaN(price)) {
        return total + price;
      }
    }
    return total;
  }, 0);
}


  removeItem(index: number): void {
    this.cardItem.itemsWithQuantity.splice(index, 1);
    localStorage.setItem('cardItem', JSON.stringify(this.cardItem.itemsWithQuantity));
    this.loadCartItems();
  }

  updateTotalPrice(): void {
    const totalPrice = this.calculateTotalPrice();
  }
}
