class CartItem {
  constructor(quantity, productPrice, productTitle, sum, ownerEmail, ownerId, status) {
    this.quantity = quantity;
    this.productPrice = productPrice;
    this.productTitle = productTitle;
    this.sum = sum;
    this.ownerEmail = ownerEmail;
    this.ownerId = ownerId;
    this.status = status;
  }
}

export default CartItem;
