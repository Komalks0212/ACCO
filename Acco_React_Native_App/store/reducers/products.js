import PRODUCTS from '../../data/dummy-data';
import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  SET_PRODUCTS,
  USER_PRODUCTS,
  PRODUCT_PAYMENT
} from '../actions/products';
import Product from '../../models/product';

const initialState = {
  availableProducts: [],
  userProducts: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId,
        action.productData.title,       
        action.productData.description,
        action.productData.price,
        action.productData.available_date,
        action.productData.propertyImg,
        action.productData.area,
        action.productData.address,
        action.productData.zipcode,
        action.productData.ownerEmail,
        action.productData.status
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct)
      };
    case UPDATE_PRODUCT:
      const productIndex = state.userProducts.findIndex(
        prod => prod.id === action.pid
      );
      const updatedProduct = new Product(
        action.pid,
        state.userProducts[productIndex].ownerId,
        action.productData.title,
        action.productData.description,
        state.userProducts[productIndex].price,
        action.productData.available_date,
        action.productData.propertyImg,
        action.productData.area,
        action.productData.address,
        action.productData.zipcode,
        action.productData.ownerEmail,
        action.productData.status
      );
      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productIndex] = updatedProduct;
      const availableProductIndex = state.availableProducts.findIndex(
        prod => prod.id === action.pid
      );
      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableProductIndex] = updatedProduct;
      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          product => product.id !== action.pid
        ),
        availableProducts: state.availableProducts.filter(
          product => product.id !== action.pid
        )
      };
    case USER_PRODUCTS:
        return{
          availableProducts: action.products,
          userProducts: state.userProducts
        }
    case PRODUCT_PAYMENT:
        return{
          availableProducts: action.products,
          userProducts: state.userProducts
        }
    case SET_PRODUCTS:
      return {        
        availableProducts: action.products,
        userProducts: action.userProducts
      };
  }
  return state;
};
 