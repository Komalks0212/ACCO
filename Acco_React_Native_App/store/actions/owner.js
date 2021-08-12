import Owner from "../../models/owner";


export const OWNER_PROFILE = 'OWNER_PROFILE';

export const createOwnerProfile = (firstName, lastName, email, userType, permanentaddress, pzipcode, currentaddress, czipcode, phone, ownerdescription, ssn, selectedImage) => {
    return async (dispatch, getState ) => {
      //auth token logic
      const token = getState().auth.token;
      const userId = getState().auth.userId;
      const userType =  getState().auth.userType;
      const emailId = getState().auth.userEmail;
      console.log('createOwnerProfile method:: ', userId,userType, emailId);
      try{
        const response1 = await fetch(`https://my-app-guide.firebaseio.com/owner_profile/${userId}.json?auth=${token}`);
        if(!response1.ok){
          throw new Error('Something went wrong!');
        }  
        const resData1 = await response1.json();  
        console.log('If user exists:: ',resData1, userId);

        if(!resData1){
          console.log('create new user');
          const response = await fetch(`https://my-app-guide.firebaseio.com/owner_profile/${userId}.json?auth=${token}`, {
              method: 'POST',
              headers: {
               'Content-Type': 'application/json'
              },
                  body: JSON.stringify({          
                  firstName,
                  lastName,
                  userId: userId,
                  email: emailId,
                  userType: userType,
                  permanentaddress,
                  pzipcode,
                  currentaddress,
                  czipcode,
                  phone,
                  ownerdescription,
                  ssn,
                  selectedImage        
                  })
                });
               //console.log(response);
  
            //Just to print the json structure
            let jsonStruct = JSON.stringify({          
            firstName,
            lastName,
            userId: userId,
            email: emailId,
            userType: userType ,
            permanentaddress,
            pzipcode,
            currentaddress,
            czipcode,
            phone,
            ownerdescription,
            ssn,
            selectedImage
            });
            console.log("§§§§§§§§§§§§§§§§§ owner json structure:: ", jsonStruct);
            //Just to print the json structure

            const resData = await response.json();
            // console.log(resData);
  
            dispatch ( {
              type: OWNER_PROFILE,
              ownerData: {
                firstName: firstName,
                lastName: lastName,
                userId: userId,
                email: emailId,
                userType: userType,
                permanentaddress: permanentaddress,
                pzipcode: pzipcode,
                currentaddress: currentaddress,
                czipcode: czipcode,
                phone: phone,
                ownerdescription: ownerdescription,
                ssn: ssn,
                selectedImage: selectedImage
              }
            });
        }else{
          for(const key in resData1){
            const userExist = resData1[key].userId;
            if(userExist === userId){
              console.log('Patch the update request',userExist, key);
              const response = await fetch(`https://my-app-guide.firebaseio.com/owner_profile/${userId}/${key}.json?auth=${token}`, {
                method: 'PATCH',
                headers: {
                 'Content-Type': 'application/json'
                },
                    body: JSON.stringify({          
                      firstName: firstName,
                      lastName: lastName,
                      userId: userId,
                      email: emailId,
                      userType: userType,
                      permanentaddress: permanentaddress,
                      pzipcode:  pzipcode,
                      currentaddress: currentaddress,
                      czipcode: czipcode,
                      phone: phone,
                      ownerdescription: ownerdescription,
                      ssn: ssn,
                      selectedImage: selectedImage        
                    })
                  });
                 //console.log(response);
    
                  //Just to print the json structure
                  let jsonStruct = JSON.stringify({          
                    firstName: firstName,
                    lastName: lastName,
                    userId: userId,
                    email: emailId,
                    userType: userType,
                    permanentaddress: permanentaddress,
                    pzipcode:  pzipcode,
                    currentaddress: currentaddress,
                    czipcode: czipcode,
                    phone: phone,
                    ownerdescription: ownerdescription,
                    ssn: ssn,
                    selectedImage: selectedImage
                  });
                  console.log("§§§§§§§§§§§§§§§§§ owner json structure:: ", jsonStruct);
                  //Just to print the json structure
      
                  const resData = await response.json();
                  // console.log(resData);
    
                  dispatch ( {
                    type: OWNER_PROFILE,
                    ownerData: {
                      firstName: firstName,
                      lastName: lastName,
                      userId: userId,
                      email: emailId,
                      userType: userType,
                      permanentaddress: permanentaddress,
                      pzipcode: pzipcode,
                      currentaddress: currentaddress,
                      czipcode: czipcode,
                      phone: phone,
                      ownerdescription: ownerdescription,
                      ssn: ssn,
                      selectedImage: selectedImage
                    }
                  });
            }else{
              console.log('nothing');              
            }
          }
        }

      }catch(err){
        throw err;
      }
      // any async code 
     
     
    };  
  };