import { ADD_TO_CART, REMOVE_FROM_CART, MAKE_PAYMENT } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import CartItem from '../../models/cart-item';
import { DELETE_PRODUCT } from '../actions/products';

import {
  STATUS_ORDER_COMPLETE,
  STATUS_ORDER_APPROVED,
  STATUS_ORDER_REQUESTED,
  STATUS_ORDER_REJECTED
} from '../actions/orders';

import {
  STATUS_AVAILABLE,
  STATUS_PAY_ENABLED,
  STATUS_CONFIRMED,
  STATUS_PAY_COMPLETE
} from '../actions/products';

const initialState = {
  items: {},
  totalAmount: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;
      const ownerEmail = addedProduct.ownerEmail;
      const ownerId = addedProduct.ownerId;
      const status = STATUS_ORDER_REQUESTED;

      let updatedOrNewCartItem;
      

      if (state.items[addedProduct.id]) {
        return {
          ...state,
          items: { ...state.items},
          totalAmount: parseFloat(state.totalAmount)
        };
        // already have the item in the cart
        /* updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice           
        ); 
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice); */
        console.log('prodPrice::: ',prodPrice);
      } else {
      
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice, ownerEmail, ownerId, status );
        console.log('prodPrice::: ',prodPrice, ownerId, ownerEmail, status );
      }
      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
        totalAmount: parseFloat(state.totalAmount) + parseFloat(prodPrice)
              
      };
    case REMOVE_FROM_CART:
      const selectedCartItem = state.items[action.pid];
      const currentQty = selectedCartItem.quantity;
      let updatedCartItems;
      if (currentQty > 1) {
        // need to reduce it, not erase it
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          parseFloat(selectedCartItem.sum) - parseFloat(selectedCartItem.productPrice)
        );
        updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.pid];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: parseFloat(state.totalAmount) - parseFloat(selectedCartItem.productPrice)
      };
    case ADD_ORDER:
      return initialState;
    case MAKE_PAYMENT:
        if (state.items[action.pid]) {
          state.items[action.pid].status = STATUS_ORDER_COMPLETE;
          //action.product.status = STATUS_CONFIRMED;
          return state;
        }
    case DELETE_PRODUCT:
      if (!state.items[action.pid]) {
        return state;
      }
      const updatedItems = { ...state.items };
      const itemTotal = state.items[action.pid].sum;
      delete updatedItems[action.pid];
      return {
        ...state,
        items: updatedItems,
        totalAmount: parseFloat(state.totalAmount) - parseFloat(itemTotal)
      };
      
          


  }

  return state;
};
