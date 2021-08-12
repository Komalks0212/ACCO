import Student from "../../models/student";


export const STUDENT_PROFILE = 'STUDENT_PROFILE';

export const createStudentProfile = (firstName, lastName, email, userType, permanentaddress, pzipcode, currentaddress, czipcode,phone,studentdescription,  selectedDoc, selectedImage) => {
    return async (dispatch, getState ) => {
      //auth token logic
      const token = getState().auth.token;
      const userId = getState().auth.userId;
      const userType =  getState().auth.userType;
      const emailId = getState().auth.userEmail;
      // any async code 
     //const response = await fetch(`https://my-app-guide.firebaseio.com/student_profile.json?auth=${token}`, {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>createStudentProfile', userId);
      try{
        const response1 = await fetch(`https://my-app-guide.firebaseio.com/student_profile/${userId}.json`);
        
        if(!response1.ok){
          throw new Error('Something went wrong!');
        }
  
        const resData1 = await response1.json();  
        console.log('If user exists:: ',resData1, userId);

        if(!resData1){
          console.log('create new user');
          const response = await fetch(`https://my-app-guide.firebaseio.com/student_profile/${userId}.json?auth=${token}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({          
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
              studentdescription,         
              selectedDoc,
              selectedImage       
            })
          });
      
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
            studentdescription,        
            selectedDoc,
            selectedImage         
          });
          console.log("student profile json:",jsonStruct);
          //Just to print the json structure     
     
          const resData = await response.json();
         // console.log("Response: ",resData);
      
          dispatch ( {
            type: STUDENT_PROFILE,
            studentData: {
              
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
              studentdescription: studentdescription,          
              selectedDoc: selectedDoc,
              selectedImage: selectedImage
                          
            }
          });
        }
        else{
          for(const key in resData1){
            const userExist = resData1[key].userId;
            if(userExist === userId){
              console.log('Patch the update request',userExist, key);
              const response = await fetch(`https://my-app-guide.firebaseio.com/student_profile/${userId}/${key}.json`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({          
                  firstName: firstName,
                  lastName: lastName,
                  userId: userId,
                  email: emailId,
                  userType: userType ,
                  permanentaddress: permanentaddress,
                  pzipcode: pzipcode,
                  currentaddress: currentaddress,
                  czipcode: czipcode,
                  phone: phone,
                  studentdescription: studentdescription,         
                  selectedDoc: selectedDoc,
                  selectedImage: selectedImage       
                })
              });
          
              //Just to print the json structure
              let jsonStruct = JSON.stringify({          
                firstName: firstName,
                  lastName: lastName,
                  userId: userId,
                  email: emailId,
                  userType: userType ,
                  permanentaddress: permanentaddress,
                  pzipcode: pzipcode,
                  currentaddress: currentaddress,
                  czipcode: czipcode,
                  phone: phone,
                  studentdescription: studentdescription,         
                  selectedDoc: selectedDoc,
                  selectedImage: selectedImage        
              });
              console.log("student profile  updated json:",jsonStruct);
              //Just to print the json structure     
         
              const resData = await response.json();
             // console.log("Response: ",resData);
          
              dispatch ( {
                type: STUDENT_PROFILE,
                studentData: {                  
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
                  studentdescription: studentdescription,          
                  selectedDoc: selectedDoc,
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
      






    };
    
  };