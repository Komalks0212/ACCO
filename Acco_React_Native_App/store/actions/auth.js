//import { AsyncStorage } from '@react-native-community/async-storage';

export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

let timer;
//export const AUTHENTICATE = 'AUTHENTICATE';


/* export const authenticate = (userId, token) => {
  return { type: AUTHENTICATE, userId: userId, token: token };

}; */

export const signup = (email, password, userType) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBd7b9LDam--0Sy0exPbnZ4YcldDmGwUyE',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          userType: userType,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      console.log(errorResData);
      const errorId = errorResData.error.message;
      let message = 'something went wrong!';
      if(errorId === 'EMAIL_EXISTS'){
        message = 'This email already exists!';
      } 
      throw new Error(message);
    }
   
    const response1 = await fetch(
      'https://my-app-guide.firebaseio.com/users.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          userType
        })
      }
    );

    const resData = await response.json();
    const resData1 = await response1.json();
    //console.log("#########:",resData);
    //console.log("#########:",resData1);
   // dispatch(authenticate(resData.localId, resData.idToken));
  
    //dispatch(setLogoutTimer({expirationTime: parseInt(resData.expiresIn) * 1000}));
    dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId, userType: userType, userEmail: resData['email'] });
 
   
    //After SignUp call the saveDataToStorage() to store the data to device and also check when the token expires or is valid.
    /* const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
    saveDataToStorage(resData.idToken, resData.localId, expirationDate); */
  };
};


export const login = (email, password, userType) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBd7b9LDam--0Sy0exPbnZ4YcldDmGwUyE',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      console.log(errorResData);
      const errorId = errorResData.error.message;
      let message = 'something went wrong!';
      if(errorId === 'EMAIL_NOT_FOUND'){
        message = 'This email could not be found!';

      } else if(errorId === 'INVALID_PASSWORD'){
        message = 'The Password entered is incorrect';
      }
      throw new Error(message);
    }
    const resData = await response.json();

    try{
      const response1 = await fetch('https://my-app-guide.firebaseio.com/users.json'
       );
   
       if(!response1.ok){
         throw new Error('Something went wrong!');
       }
   
       const resData1 = await response1.json();
       //console.log(resData1);
       var queryUserType;
       var loginaction;
       const targetUser = [];
       //console.log(resData);
       /*for (const key in resData) {
        console.log(">>>>>>>>>Responsedata:", key, resData[key]);
        targetUser.push(resData[key].email);
           
       }*/
       targetUser.push(resData['email'])
       
        for (const key in resData1) {
          //console.log(">>>>>>>>>Querydata:", resData1[key].email);
          if(resData1[key].email == targetUser[0])
          {
            queryUserType = resData1[key].userType;
            loginaction = 'loginaction';
          }
        }
       // console.log("##############");
        console.log("TargetUser: ", targetUser);
        console.log("QueryUserType: ", queryUserType);
       // console.log("##############");
     } catch(err){
       throw err;
     }


    //console.log(resData);
    //dispatch(authenticate(resData.localId, resData.idToken));
   // dispatch(setLogoutTimer({expirationTime: parseInt(resData.expiresIn) * 1000}));
    dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId, userType: queryUserType, useraction: resData.registered, userEmail: resData['email'] });
    //After login call the saveDataToStorage() to store the data to device and also check when the token expires or is valid.
    /* const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
    saveDataToStorage(resData.idToken, resData.localId, expirationDate); */
  };
};

//Auto Logout logic
export const logout = () => {
  clearLogoutTimer();
  //AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer); //built in func in .js
  }
};

/* const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime  );
  };
}; */




//Auto Login logic is throwing error in android
//Using AsyncStorage to save data on hard drive of the device and also to auto login using the token info 
/* const saveDataToStorage = (token, userId) => {
  AsyncStorage.setItem('userData', JSON.stringify({
    token: token,
    userId: userId,
    expiryDate: expirationDate.toISOString()
  })
  );
}; */