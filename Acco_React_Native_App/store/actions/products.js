import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';
export const USER_PRODUCTS = 'USER_PRODUCTS';
export const PRODUCT_PAYMENT = 'PRODUCT_PAYMENT';

export const STATUS_AVAILABLE = "AVAILABLE";
export const STATUS_NOT_AVAILABLE = "NOT_AVAILABLE";
export const STATUS_REQUESTED = "REQUESTED";
export const STATUS_PAY_ENABLED = 'PAYMENT_ENABLED';
export const STATUS_CONFIRMED = 'BOOKING_CONFIRMED';

import {
  STATUS_ORDER_COMPLETE,
  STATUS_ORDER_APPROVED,
  STATUS_ORDER_REQUESTED,
  STATUS_ORDER_REJECTED
} from './orders';


export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const emailId = getState().auth.email;
    console.log('fetchProducts state :: ',getState().auth.email);

    // any async code 
    try{
   const response = await fetch('https://my-app-guide.firebaseio.com/property.json'
    );

    if(!response.ok){
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();
    //console.log('fetch method resData:: ',resData);
    const loadedProducts = [];
     
      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].title,
            //resData[key].imageUrl,
            resData[key].description,
            resData[key].price,
            resData[key].available_date,
            resData[key].propertyImg,
            resData[key].area,
            resData[key].address,
            resData[key].zipcode,
            resData[key].ownerEmail,
            resData[key].status            
            )
          );
      }
    dispatch({ type: SET_PRODUCTS, products: loadedProducts, userProducts: loadedProducts.filter(prod => prod.ownerId === userId) });
  } catch(err){
    throw err;
  }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    //auth token logic
    const token = getState().auth.token;
    const response = await fetch(`https://my-app-guide.firebaseio.com/property/${productId}.json?auth=${token}`,
     {
      method: 'DELETE'      
      }
    );

    if(!response.ok){
      throw new Error('Something went wrong!');
    }
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };  
};

export const createProduct = (title, description, price, available_date, propertyImg, area, address, zipcode) => {
  return async (dispatch, getState ) => {
    //auth token logic
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const emailId = getState().auth.userEmail;
    console.log('createProduct state :: ',getState().auth);
    // any async code 
   const response = await fetch(`https://my-app-guide.firebaseio.com/property.json?auth=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,        
        price,
        ownerId: userId, 
        ownerEmail: emailId,          //Mapping products to user while creation
        available_date,
        propertyImg,
        area,
        address,
        zipcode,
        status: STATUS_AVAILABLE
      })
    });

    //Just to print the json structure
    let createPropertyStruct =JSON.stringify({
      title,
      description,      
      price,
      ownerId: userId,  //Mapping products to user while creation
      ownerEmail: emailId,          //Mapping products to user while creation
      available_date,
      propertyImg,
      area,
      address,
      zipcode,
      status: STATUS_AVAILABLE
    });
    console.log("Add property json structure:: ",createPropertyStruct);
    //Just to print the json structure

    const resData = await response.json();
    //console.log(resData);

    dispatch ( {
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,        
        price,
        ownerId: userId,
        available_date,
        propertyImg,
        area,
        address,
        zipcode,
        emailId,
        status : STATUS_AVAILABLE
      }
    });
  };  
};

export const updateProduct = (id, title, description, available_date, propertyImg, area, address, zipcode) => {
  return async (dispatch, getState) => {
    //console.log("getState of complete store:::::",id, title);
    //auth token 
    const token = getState().auth.token;
    const emailId = getState().auth.userEmail;
    const response = await fetch(`https://my-app-guide.firebaseio.com/property/${id}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        description: description,        
        available_date: available_date,
        propertyImg: propertyImg,
        area: area,
        address: address,
        zipcode: zipcode,
        ownerEmail: emailId,
        status: STATUS_AVAILABLE        
      })
    });

    if(!response.ok){
      throw new Error('Something went wrong!');
    }

    dispatch( {
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title: title,
        description: description,        
        available_date: available_date,
        propertyImg: propertyImg,
        area: area,
        address: address,
        zipcode: zipcode,
        ownerEmail: emailId,
        status: STATUS_AVAILABLE
      }
    });

  };
  
};

export const fetchOwnerProduct = () => {
  return async (dispatch, getState) => {
   //auth token logic
   const token = getState().auth.token;
   const userId = getState().auth.userId;
   const emailId = getState().auth.userEmail;
   console.log('fetchOwnerProduct');
    // any async code 
    try{
   const response = await fetch('https://my-app-guide.firebaseio.com/property.json'
    );

    if(!response.ok){
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();
    //console.log('fetchOwnerProduct method resData:: ',resData);
    const loadedProducts = [];
     
      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].title,            
            resData[key].description,
            resData[key].price,
            resData[key].available_date,
            resData[key].propertyImg,
            resData[key].area,
            resData[key].address,
            resData[key].zipcode,
            resData[key].ownerEmail,
            resData[key].status
            )
          );
      }
      //console.log('fetch method resData:: ',emailId);
    dispatch({ type: SET_PRODUCTS, products: loadedProducts, userProducts: loadedProducts.filter(prod => prod.ownerEmail === emailId) });
  } catch(err){
    throw err;
  }
  };
};

export const fetchApprovedProduct = (studentuserEmail, studentuserId) => {
  return async (dispatch, getState) => {

    const loadedProducts = []; 
    try{
      const productResponse =  await fetch('https://my-app-guide.firebaseio.com/property.json');
      const response = await fetch(`https://my-app-guide.firebaseio.com/orders/${studentuserId}.json`);
   
       if(!response.ok){
         throw new Error('Something went wrong!');
       }
   
       const resData = await response.json();  
       const prodResData = await productResponse.json();

       //first load all products
       for (const key in prodResData) 
       {
        loadedProducts.push(
          new Product(
            key,
            prodResData[key].ownerId,
            prodResData[key].title,
            //resData[key].imageUrl,
            prodResData[key].description,
            prodResData[key].price,
            prodResData[key].available_date,
            prodResData[key].propertyImg,
            prodResData[key].area,
            prodResData[key].address,
            prodResData[key].zipcode,
            prodResData[key].ownerEmail,
            STATUS_AVAILABLE //prodResData[key].status            
            )
          );
       }
         //console.log('fetchApprovedProduct loadedProducts :: ',loadedProducts);

         //console.log('fetchApprovedProduct orders of user :: ',resData);
         for (const orderKey in resData) 
         {
           //console.log('------>orderKey', orderKey);
           const order = resData[orderKey]; 
           for (const cartKey in order.cartItems) 
           {
              const cartItem = order.cartItems[cartKey];

              if(!cartItem)// || !(cartItem.status === STATUS_ORDER_APPROVED))
                  continue;
              
             // console.log('----->cartItem', cartItem.status);
              
              const pid = cartItem.productId;
              var index = loadedProducts.findIndex(x => x.id===pid);
              //index === -1 ? console.log(pid, "not found"): loadedProducts[index].status = STATUS_PAY_ENABLED;
              const cartProdRes = await fetch(`https://my-app-guide.firebaseio.com/property/${pid}.json`);
              if(!cartProdRes.ok){
                throw new Error('Something went wrong!');
              }
          
              const cartProdData = await cartProdRes.json();
              const cartProdStatus = cartProdData.status;

              if(!(index === -1))
              {
                  switch(cartItem.status)
                  {
                      case STATUS_ORDER_APPROVED:
                        if(!(cartProdStatus === STATUS_CONFIRMED))
                            loadedProducts[index].status = STATUS_PAY_ENABLED;
                        else
                            loadedProducts[index].status = STATUS_NOT_AVAILABLE;
                        break;
                      case STATUS_ORDER_REQUESTED:                        
                        if(!(cartProdStatus === STATUS_CONFIRMED))
                            loadedProducts[index].status = STATUS_ORDER_REQUESTED;
                        else
                            loadedProducts[index].status = STATUS_NOT_AVAILABLE;
                        index === -1 ? console.log(pid, "not found"): console.log('----->#######cartItem', loadedProducts[index].status);    
                        break;
                      case STATUS_ORDER_COMPLETE:
                        if((cartProdStatus === STATUS_CONFIRMED))
                            loadedProducts[index].status = STATUS_CONFIRMED;
                        break;

                  }
                  console.log('----->cartItem', loadedProducts[index].status);
              }
              
            }           
         }  
         dispatch({ type: USER_PRODUCTS, products: loadedProducts});
     }catch(err){
              throw err;
             }
  };
};


export const makeProductPayment = (productId, studentuserId) => {
  //const productId = product.productId;
  const loadedProducts = []; 

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

      const prodResponse =  await fetch(`https://my-app-guide.firebaseio.com/property.json`);

      if(!prodResponse.ok){
        throw new Error('Something went wrong!');
      }
      const prodResData = await prodResponse.json();
      //first load all products
       for (const key in prodResData) 
       {
        loadedProducts.push(
          new Product(
            key,
            prodResData[key].ownerId,
            prodResData[key].title,
            //resData[key].imageUrl,
            prodResData[key].description,
            prodResData[key].price,
            prodResData[key].available_date,
            prodResData[key].propertyImg,
            prodResData[key].area,
            prodResData[key].address,
            prodResData[key].zipcode,
            prodResData[key].ownerEmail,
            STATUS_AVAILABLE //prodResData[key].status            
            )
          );
       }


      const response = await fetch(`https://my-app-guide.firebaseio.com/orders/${studentuserId}.json`);
   
       if(!response.ok){
         throw new Error('Something went wrong!');
       }
   
       const resData = await response.json();  
       for (const orderKey in resData) 
         {
          // console.log('------>orderKey', orderKey);
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
        
        
         //Read the orders table again for a particular student
         const orderResponse = await fetch(`https://my-app-guide.firebaseio.com/orders/${studentuserId}.json`);
         const orderResData = await orderResponse.json();

         for (const orderKey in orderResData) 
         {
           // console.log('------>orderKey', orderKey);
           const order = orderResData[orderKey]; 
           for (const cartKey in order.cartItems) 
           {
              const cartItem = order.cartItems[cartKey];

              if(!cartItem)// || !(cartItem.status === STATUS_ORDER_APPROVED))
                  continue;
              
             // console.log('----->cartItem', cartItem.status);
              
              const pid = cartItem.productId;
              var index = loadedProducts.findIndex(x => x.id===pid);
              //index === -1 ? console.log(pid, "not found"): loadedProducts[index].status = STATUS_PAY_ENABLED;
              const cartProdRes = await fetch(`https://my-app-guide.firebaseio.com/property/${pid}.json`);
              if(!cartProdRes.ok){
                throw new Error('Something went wrong!');
              }
          
              const cartProdData = await cartProdRes.json();
              const cartProdStatus = cartProdData.status;

              if(!(index === -1))
              {
                  switch(cartItem.status)
                  {
                      case STATUS_ORDER_APPROVED:
                        if(!(cartProdStatus === STATUS_CONFIRMED))
                            loadedProducts[index].status = STATUS_PAY_ENABLED;
                        else
                            loadedProducts[index].status = STATUS_NOT_AVAILABLE;
                        break;
                      case STATUS_ORDER_REQUESTED:
                        if(!(cartProdStatus === STATUS_CONFIRMED))
                            loadedProducts[index].status = STATUS_ORDER_REQUESTED;
                        else
                            loadedProducts[index].status = STATUS_NOT_AVAILABLE;
                        index === -1 ? console.log(pid, "not found"): console.log('----->#######cartItem', loadedProducts[index].status);
                        break;
                      case STATUS_ORDER_COMPLETE:
                        if((cartProdStatus === STATUS_CONFIRMED))
                            loadedProducts[index].status = STATUS_CONFIRMED;
                        break;

                  }
                 // console.log('----->cartItem', loadedProducts[index].status);
              }
              
            }           
         } 
      
         dispatch({ type: PRODUCT_PAYMENT, products: loadedProducts});
     }catch(err){
              throw err;
             }
  };
};