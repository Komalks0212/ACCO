import Order from "../../models/order";
import Product from "../../models/product";
import Student from "../../models/student";
import UserOrder from '../../models/userOrder';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';
export const DELETE_ORDER = 'DELETE_ORDER';
export const APPROVE_REQUEST = 'APPROVE_REQUEST';

export const STATUS_ORDER_COMPLETE = 'ORDER_COMPLETE';
export const STATUS_ORDER_APPROVED = 'ORDER_APPROVED';
export const STATUS_ORDER_REQUESTED = 'ORDER_REQUESTED';
export const STATUS_ORDER_REJECTED = 'ORDER_REJECTED';


export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
	//auth token logic
	const token = getState().auth.token;
	const userId = getState().auth.userId;
	const studentEmail = getState().auth.userEmail;
	//To store the order details on a server
	const date = new Date();
	console.log('addOrder method');
	//const response = await fetch(`https://my-app-guide.firebaseio.com/orders/${userId}.json?auth=${token}`, 
	const response = await fetch(`https://my-app-guide.firebaseio.com/orders/${userId}.json?auth=${token}`, 
	{
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json'
	  },
	  body: JSON.stringify({
		cartItems,
		totalAmount,
		date: date.toDateString()
	  })
	});

	if(!response.ok){
	  throw new Error('Something went wrong!');
	}

	const resData = await response.json();
   //console.log(resData);

	dispatch({
	type: ADD_ORDER,
	orderData: { id: resData.name, items: cartItems, amount: totalAmount, date: date },
	orderItems: {}
  });
};
};

export const fetchOrders = () => {
  return async (dispatch, getState) => {
	const userId = getState().auth.userId;
	const ownerEmail = getState().auth.userEmail;
	const token = getState().auth.token;

	// any async code 
	console.log('#########FetchOrders:: ');

	try
	{
		const response = await fetch(`https://my-app-guide.firebaseio.com/orders.json`);

		if(!response.ok){
		throw new Error('Something went wrong!');
		}

		const resData = await response.json();
		const loadedOrders = [];
		let loadedOrderItems = {}; // contains all orders specific to the properties of this owner. For each owner specific property ther is a list of users who have booked it.
	 
	  	for (const userKey in resData) 
	  	{
			const user = resData[userKey]; // this is also the student profile db id

			// retrieve user profile
			const studentProfileResponse = await fetch(`https://my-app-guide.firebaseio.com/student_profile/${userKey}.json`);
			if(!studentProfileResponse.ok){
				throw new Error('Something went wrong!');
			}
			const studentProfileData = await studentProfileResponse.json();
			let studentProfile;

			for(const entryKey in studentProfileData)
			{
				studentProfile = studentProfileData[entryKey];
			}
			const student = new Student(studentProfile.firstName, 
			studentProfile.lastName,
			studentProfile.userId, 
			studentProfile.email, 
			studentProfile.userType, 
			studentProfile.permanentaddress, 
			studentProfile.pzipcode, 
			studentProfile.currentaddress,
			studentProfile.czipcode,
			studentProfile.phone,
			studentProfile.studentdescription, 
			studentProfile.imageUrl,
			studentProfile.selectedDoc,
			studentProfile.selectedImage);
			//end of user profile 

			//console.log('######### Order item:: ', userKey, resData[userKey]);
			for (const orderKey in user) 
			{
				const order = user[orderKey]
			
				// console.log("-------------->", orderKey, order.cartItems);
				for (const cartKey in order.cartItems) 
				{
					const cartItem = order.cartItems[cartKey]
					if(!cartItem)
						continue;
					// console.log('######### Fetch Cart item:: ', cartItem.productId);
					const pid = cartItem.productId;
					const token = getState().auth.token;
					// console.log('pid::: ',pid);
					const cartResponse = await fetch(`https://my-app-guide.firebaseio.com/property/${pid}.json`);
					if(!cartResponse.ok)
					{
						throw new Error("Something went wrong!, unable to fetch property ", pid);
					}
					const cartProdData = await cartResponse.json();
					if(!cartProdData)
						continue;    
					if( ownerEmail === cartProdData.ownerEmail)
					{
						// console.log(cartProdData.ownerEmail);
						// console.log('loadedOrderItems[pid]>>>>>>>>>>>>>> ',loadedOrderItems[pid]);
						if (loadedOrderItems[pid]) 
						{
							//check for duplicate entry
							var index = loadedOrderItems[pid].profiles.findIndex(x => x.email===studentProfile.email);
							index === -1 ? loadedOrderItems[pid].profiles.push(student):console.log(studentProfile.email, "already present");
							/* for(const stud in loadedOrderItems[pid].profiles)
							{
							// console.log('*** ',loadedOrderItems[pid].profiles[stud].email);
							// console.log('### ',studentProfile.email);
								if(!(studentProfile.email === loadedOrderItems[pid].profiles[stud].email))
								{
									loadedOrderItems[pid].profiles.push(student);
								}
							//  console.log('loadedOrderItems::: ',loadedOrderItems[pid]);
							} */
							//loadedOrderItems[pid].profiles.push(student);
						}
						else
						{
							const prod = new Product(
							pid,
							cartProdData.ownerId,
							cartProdData.title,
							//cartProdData.imageUrl,
							cartProdData.description,
							cartProdData.price,
							cartProdData.available_date,
							cartProdData.propertyImg,
							cartProdData.area,
							cartProdData.address,
							cartProdData.zipcode,
							cartProdData.ownerEmail,
							cartProdData.status            
							);
							loadedOrderItems = { ...loadedOrderItems, [pid]: { product: prod, profiles: [student], date: order.date}};
							loadedOrders.push(prod);
						}
					// console.log('loadedOrderItems::: ',loadedOrderItems);
					}
				}          
			}
	  	}

		const userOrders = [];
		for (const prodKey in loadedOrderItems){
			const product = loadedOrderItems[prodKey].product;
			const profiles = loadedOrderItems[prodKey].profiles;
			const date = loadedOrderItems[prodKey].date;
	
			userOrders.push(new UserOrder(prodKey, product, profiles, product.price, date));
		}
	 	// console.log(">>>>>>>>>>>>>: ", userOrders);

		dispatch({ type: SET_ORDERS, orders: loadedOrders, orderItems: userOrders });
  } catch(err){
	throw err;
  }
  };
};

export const removeFromOrders = (email, product) => {
  return async (dispatch, getState) => {
	//auth token logic
	//const token = getState().auth.token;
	console.log('removeFromOrders input param:: ', email, product.id);
	const userProductId = product.id;
	try{
	  	const response = await fetch(`https://my-app-guide.firebaseio.com/orders.json`);   
		if(!response.ok){
			throw new Error('Something went wrong!');
		}   
	   	const resData = await response.json();      
		
		 for (const userKey in resData) 
		 {
		   	const user = resData[userKey]; // this is also the student profile db id
   
			// retrieve user profile
			const studentProfileResponse = await fetch(`https://my-app-guide.firebaseio.com/student_profile/${userKey}.json`);
			if(!studentProfileResponse.ok){
				throw new Error('Something went wrong!');
			}

			const studentProfileData = await studentProfileResponse.json();
			let studentProfile;
   
			for(const entryKey in studentProfileData)
			{
				studentProfile = studentProfileData[entryKey];
			}
		  //	console.log('#########removeFromOrders Order item:: ', userKey, resData[userKey]);
		   	const key = resData[userKey];
		   	//console.log('key::::: ',key);
		   	for (const orderKey in user) 
		   	{
				const order = user[orderKey];             
	
				for (const cartKey in order.cartItems) 
				{
					//console.log('cartKey:: ',cartKey);
					const cartItem = order.cartItems[cartKey]
					if(!cartItem)
						continue;
					//console.log('######### Cart item:: ', cartItem.productId);
					const pid = cartItem.productId;
					const studentEmail = cartItem.studentEmail;
					if(userProductId === pid && email === studentEmail ){
					//console.log('Remove the cartKey',cartKey);
					const response = await fetch(`https://my-app-guide.firebaseio.com/orders/${userKey}/${orderKey}/cartItems/${cartKey}.json`,
					{
						method: 'DELETE'      
					});              
					if(!response.ok){
						throw new Error('Something went wrong!');
					}
					}else{
					//console.log('No delete operation');
					}
					const token = getState().auth.token;
					//console.log('pid::: ',pid);
				}
				}
			}
	   

	/**/
	dispatch({ type: DELETE_ORDER }); 
  } catch(err){
	throw err;
  }
  };  
};

export const approvedProfileUpdateStatus = (email, product) => {
  return async (dispatch, getState) => { 
	console.log('approvedProfileUpdateStatus input param:: ', email, product.id);
	const ownerProductId = product.id;
	const statusApproved = STATUS_ORDER_APPROVED;
	try{
	  const response = await fetch(`https://my-app-guide.firebaseio.com/orders.json`);
   
	   if(!response.ok){
		 throw new Error('Something went wrong!');
	   }
   
	   const resData = await response.json();      
		
		 for (const userKey in resData) 
		 {
		   const user = resData[userKey]; // this is also the student profile db id
   
		   // retrieve user profile
		   const studentProfileResponse = await fetch(`https://my-app-guide.firebaseio.com/student_profile/${userKey}.json`);
		   if(!studentProfileResponse.ok){
			 throw new Error('Something went wrong!');
		   }

		   const studentProfileData = await studentProfileResponse.json();
		   let studentProfile;
   
		   for(const entryKey in studentProfileData)
		   {
			 studentProfile = studentProfileData[entryKey];
		   }
		  // console.log('#########removeFromOrders Order item:: ', userKey, resData[userKey]);
		   const key = resData[userKey];
		   //console.log('key::::: ',key);
		   for (const orderKey in user) 
		   {
			 const order = user[orderKey]             
   
			 for (const cartKey in order.cartItems) 
			 {
				//console.log('cartKey:: ',cartKey);
				const cartItem = order.cartItems[cartKey]
				if(!cartItem)
					continue;
				//console.log('######### Cart item:: ', cartItem.productId);
				const pid = cartItem.productId;
				if(ownerProductId === pid && studentProfile.email === email){
				  //Update the status from Requested to Approved.
				   //console.log('Remove the cartKey',cartKey);
				   const response = await fetch(`https://my-app-guide.firebaseio.com/orders/${userKey}/${orderKey}/cartItems/${cartKey}.json`,
				   {
					  method: 'PATCH',
					  headers: {
						  'Content-Type': 'application/json'
					   },
					  body: JSON.stringify({
						status: statusApproved       
					 })      
				   });              
				  if(!response.ok){
					throw new Error('Something went wrong!');
				  }                 
			 }
			}
		  }
	   
		}
	
	dispatch({ type: APPROVE_REQUEST }); 
  } catch(err){
	throw err;
  }
  };
};