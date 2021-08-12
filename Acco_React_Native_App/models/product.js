class Product {
  constructor(id, ownerId, title, description, price, available_date, selectedImage, area, address, zipcode, email, status) {
    this.id = id;
    this.ownerId = ownerId;   
    this.title = title;
    this.description = description;
    this.price = price;
    this.available_date = available_date;
    this.propertyImg = selectedImage;
    this.area = area;
    this.address = address;
    this.zipcode = zipcode;
    this.ownerEmail = email;
    this.status = status;
  }
}

export default Product;
