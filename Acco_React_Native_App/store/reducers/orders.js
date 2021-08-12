import { ADD_ORDER, SET_ORDERS, DELETE_ORDER, APPROVE_REQUEST } from '../actions/orders';
import Order from '../../models/order';
import UserOrder from '../../models/userOrder';

const initialState = {
  orders: [],
  userOrderItems: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS:
    return {
      orders: action.orders,
      userOrderItems: action.orderItems
    };
    case DELETE_ORDER:
      return {
        ...state,        
      };
      case APPROVE_REQUEST:
        return{
          ...state,
        };
    case ADD_ORDER:
      const newOrder = new Order(
        action.orderData.id,        
        action.orderData.items,
        action.orderData.amount,
        action.orderData.date
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder),
        userOrderItems: state.userOrderItems
      };
  }
  return state;
};
