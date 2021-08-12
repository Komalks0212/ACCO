import { OWNER_PROFILE } from '../actions/owner';
import Owner from "../../models/owner";

const initialState = {
    owners: []
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case OWNER_PROFILE:
        const newOwner = new Owner(action.ownerData.firstName,
            action.ownerData.lastName,             
            action.ownerData.userId, 
            action.ownerData.email,
            action.ownerData.userType, 
            action.ownerData.permanentaddress, 
            action.ownerData.pzipcode, 
            action.ownerData.currentaddress,
            action.ownerData.czipcode,
            action.ownerData.phone,
            action.ownerData.ownerdescription, 
            action.ownerData.ssn, 
            action.ownerData.selectedImage
            ); 
        return {
          ...state,
          owners: state.owners.concat(newOwner)
        };
    }
    return state;
  };

/* const initialState = {
    owners: []
};

export default (state = initialState, action) => {
    switch (action.type) {
      case OWNER_PROFILE:
        const newOwner = new Owner(action.ownerData.firstName,
          action.ownerData.lastName, 
          action.ownerData.email, 
          action.ownerData.userType, 
          action.ownerData.permanentaddress, 
          action.ownerData.pzipcode, 
          action.ownerData.currentaddress,
          action.ownerData.czipcode,
          action.ownerData.phone,
          action.ownerData.ownerdescription, 
          action.ownerData.ssn, 
          action.ownerData.imageUrl
          );
        return {
          ...state,
          owners: state.owners.concat(newOwner)
        };
    }
    return state;
}; */