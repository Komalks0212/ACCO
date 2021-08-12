class Student {
    constructor(firstName, lastName,  userId, email, userType, permanentaddress, pzipcode, currentaddress, czipcode,phone,studentdescription, selectedDoc, selectedImage) {
      //this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.userId = userId;
      this.email = email;
      this.userType = userType;
      this.permanentaddress = permanentaddress;
      this.pzipcode= pzipcode;
      this.currentaddress = currentaddress;
      this.czipcode = czipcode;
      this.phone = phone;
      this.studentdescription = studentdescription;      
      this.selectedDoc = selectedDoc;
      this.selectedImage = selectedImage;
    }
  }
  
  export default Student;