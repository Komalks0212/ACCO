import Student from "../../models/student";
import { STUDENT_PROFILE } from '../actions/student';

const initialState = {
    students: []
  };

  export default (state = initialState, action) => {
    switch (action.type) {
      case STUDENT_PROFILE:
        const newStudent = new Student(action.studentData.firstName, 
          action.studentData.lastName, 
          action.studentData.userId,
          action.studentData.email, 
          action.studentData.userType, 
          action.studentData.permanentaddress, 
          action.studentData.pzipcode, 
          action.studentData.currentaddress,
          action.studentData.czipcode,
          action.studentData.phone,
          action.studentData.studentdescription,           
          action.studentData.selectedDoc,
          action.studentData.selectedImage
          );
        return {
          ...state,
          students: state.students.concat(newStudent)
        };
    }
  
    return state;
  };