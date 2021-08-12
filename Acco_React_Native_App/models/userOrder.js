import moment from 'moment';

class UserOrder {
  constructor(id, product, profiles, price, date) {
    this.id = id;
    this.product = product;
    this.profiles = profiles;
    this.price = price;
    this.date = date;
  }

  get readableDate() {
    //   return this.date.toLocaleDateString('en-EN', {
    //       year: 'numeric',
    //       month: 'long',
    //       day: 'numeric',
    //       hour: '2-digit',
    //       minute: '2-digit'
    //   });
    return moment(this.date).format('MMMM Do YYYY, hh:mm');
  }
}

export default UserOrder;
