export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const MAKE_PAYMENT = 'MAKE_PAYMENT';
import {
  STATUS_AVAILABLE,
  STATUS_PAY_ENABLED,
  STATUS_CONFIRMED,
  STATUS_PAY_COMPLETE
} from '../actions/products';

import {
  STATUS_ORDER_COMPLETE,
  STATUS_ORDER_APPROVED,
  STATUS_ORDER_REQUESTED,
  STATUS_ORDER_REJECTED
} from '../actions/orders';


export const addToCart = product => {
  return { type: ADD_TO_CART, product: product };
};

export const removeFromCart = productId => {
  return { type: REMOVE_FROM_CART, pid: productId };
};

export const makePayment = (productId, studentuserId) => {
  //const productId = product.productId;
  return async (dispatch, getState) => {
    try{
      const productResponse =  await fetch(`https://my-app-guide.firebaseio.com/property/${productId}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: STATUS_CONFIRMED
        })
      });
      
      if(!productResponse.ok){
        throw new Error('Something went wrong!');
      }

      /* const prodResponse =  await fetch(`https://my-app-guide.firebaseio.com/property/${productId}.json`);
      if(!prodResponse.ok){
        throw new Error('Something went wrong!');
      }
        
      const prodData = await prodResponse.json();
      const prod = new Product(
        productId,
        prodData.ownerId,
        prodData.title,
        //resData[key].imageUrl,
        prodData.description,
        prodData.price,
        prodData.available_date,
        prodData.propertyImg,
        prodData.area,
        prodData.address,
        prodData.zipcode,
        prodData.ownerEmail,
        prodData.status            
        ); */


      const response = await fetch(`https://my-app-guide.firebaseio.com/orders/${studentuserId}.json`);
   
       if(!response.ok){
         throw new Error('Something went wrong!');
       }
   
       const resData = await response.json();  
       for (const orderKey in resData) 
         {
           console.log('------>orderKey', orderKey);
           const order = resData[orderKey]; // this is also the student profile db id
           for (const cartKey in order.cartItems) 
           {
              const cartItem = order.cartItems[cartKey];
              if(!cartItem || !(cartItem.status === STATUS_ORDER_APPROVED) || !(cartItem.productId === productId))
                  continue;
              
                  const response = await fetch(`https://my-app-guide.firebaseio.com/orders/${studentuserId}/${orderKey}/cartItems/${cartKey}.json`,
                  {
                     method: 'PATCH',
                     headers: {
                         'Content-Type': 'application/json'
                      },
                     body: JSON.stringify({
                       status: STATUS_ORDER_COMPLETE     
                    })      
                  });
                  
              /* console.log('----->cartItem', cartItem.status);
              const pid = cartItem.productId;
              const orderstatus = cartItem.status;
              var index = loadedProducts.findIndex(x => x.id===pid);
              console.log('----->cartItem', loadedProducts[index].status);
              index === -1 ? console.log(pid, "not found"): loadedProducts[index].status = statusPay;
              console.log('----->cartItem', loadedProducts[index].status); */
            }           
         }  

      
         dispatch({ type: MAKE_PAYMENT, pid: productId});
     }catch(err){
              throw err;
             }
  };
};