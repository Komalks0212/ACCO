import React,  { useState, useEffect, useReducer, useCallback } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Button, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useDispatch, useSelector } from 'react-redux';

import HeaderButton from '../UI/HeaderButton';
import Colors from '../../constants/Colors';
import Input from '../UI/Input';
import * as ownerActions from '../../store/actions/owner';
//import ImagePicker from '../UI/ImagePicker';
import * as ImagePicker from 'expo-image-picker';


const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};





const OwnerScreen = props => {
  const userId = useSelector(state => state.auth.userId);
  const userEmail = useSelector(state => state.auth.userEmail);
  const userType = useSelector(state => state.auth.userType);
  const [isSave, setIsSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  //const prodId = props.navigation.getParam('productId');
  const [selectedImage, setSelectedImage] = useState();
  const [pickedImage, setPickedImage] = useState();
  //console.log('State Auth value in owner login', useSelector(state => state.auth));

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      firstName: '',
      lastName: '',
      email: '',      
      userType: '',
      permanentaddress: '',
      pzipcode: '',
      currentaddress: '',
      czipcode: '',
      phone: '',
      ownerdescription: '',
      ssn: '',
      imageUrl: '',
      selectedImage: ''

    },
    inputValidities: {
      firstName: false,
      lastName: false,
      email: false,      
      userType: false,
      permanentaddress: false,
      pzipcode: false,
      currentaddress: false,
      czipcode: false,
      phone: false,
      ownerdescription: false,
      ssn: false,
      imageUrl: false,
      selectedImage: false
    },
    formIsValid: false
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  
  /* const imageTakenHandler = imagePath => {
    setSelectedImage(imagePath);    
  }; */

  const _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      //allowsEditing: true,
      aspect: [4, 3],
    });
    //alert(result.uri);
    //console.log(result);   

    if (!result.cancelled) {
      setSelectedImage(result.uri);
      setPickedImage(result.uri);
    }
  };
  
  
  const saveHandler = async () => {
    let action;
    //if(!isSave){
      action =      
        ownerActions.createOwnerProfile(
          formState.inputValues.firstName,
          formState.inputValues.lastName,
          formState.inputValues.email,
          formState.inputValues.userType,
          formState.inputValues.permanentaddress,
          formState.inputValues.pzipcode,
          formState.inputValues.currentaddress,
          formState.inputValues.czipcode,
          formState.inputValues.phone,
          formState.inputValues.ownerdescription,
          formState.inputValues.ssn,
          //formState.inputValues.imageUrl,
          selectedImage  
               
      );
    //} 
    setError(null);  
    setIsLoading(true);
    //setIsSave(true);
    try{
      await dispatch(action);
      console.log("Before registration dispatch");
      props.navigation.navigate('UserProducts');
      console.log("After registration dispatch");


    } catch(err) {
      setError(err.message);
      setIsLoading(false);
    }    
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior="height"
    keyboardVerticalOffset={50}
  >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ScrollView>
    <View /* style={styles.screen} */>
      <Text style={styles.titleText}> Profile Registration Form: </Text>
    </View>
      <View style={styles.form}>
        <Input
          id="firstName"
          label="First Name"
          errorText="Please enter a valid First Name!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          onInputChange={inputChangeHandler}
         // initialValue={editedProduct ? editedProduct.title : ''}
          //initiallyValid={!!editedProduct}
          //required
        />
        <Input
          id="lastName"
          label="Last Name"
          errorText="Please enter a valid Last Name!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          onInputChange={inputChangeHandler}
         // initialValue={editedProduct ? editedProduct.title : ''}
          //initiallyValid={!!editedProduct}
          //required
        />
        <Input
          id="email"
          label="E-Mail"
          keyboardType="email-address"
          //required
          autoCapitalize="none"
          //errorText="Please enter a valid email address."
          onInputChange={inputChangeHandler}
          initialValue={userEmail}
        />  
        <Input
          id="userType"
          label="User Type"
          keyboardType="default"
          //required          
          autoCapitalize="none"
          //errorText="Please enter a valid email address."
          onInputChange={inputChangeHandler}
          initialValue={userType}
        />       
        <Input
          id="permanentaddress"
          label="Permanent Address"
          errorText="Please enter a Address!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          multiline
          numberOfLines={3}
          onInputChange={inputChangeHandler}
          //initialValue={editedProduct ? editedProduct.description : ''}
          //initiallyValid={!!editedProduct}
          //required
          minLength={5}
        />
        <Input
          id="pzipcode"
          label="Zipcode"
          errorText="Please enter a Zipcode!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          onInputChange={inputChangeHandler}
         // initialValue={editedProduct ? editedProduct.title : ''}
          //initiallyValid={!!editedProduct}
          //required
        />
        <Input
          id="currentaddress"
          label="Current Address"
          errorText="Please enter a Address!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          multiline
          numberOfLines={3}
          onInputChange={inputChangeHandler}
          //initialValue={editedProduct ? editedProduct.description : ''}
          //initiallyValid={!!editedProduct}
          //required
          minLength={5}
        />
        <Input
          id="czipcode"
          label="Zipcode"
          errorText="Please enter a Zipcode!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          onInputChange={inputChangeHandler}
         // initialValue={editedProduct ? editedProduct.title : ''}
          //initiallyValid={!!editedProduct}
          //required
        />              
        <Input
            id="phone"
            label="Phone-No"
            errorText="Please enter a valid phone no!"
            keyboardType="decimal-pad"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            required
            min={0.1}
        />        
        <Input
          id="ownerdescription"
          label="Owner Personal Description"
          errorText="Please enter a description!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          multiline
          numberOfLines={10}
          onInputChange={inputChangeHandler}
          //initialValue={editedProduct ? editedProduct.description : ''}
          //initiallyValid={!!editedProduct}
          //required
          minLength={5}
        />
         <Input
          id="ssn"
          label="SSN:"
          errorText="Please enter a SSN!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          onInputChange={inputChangeHandler}
         // initialValue={editedProduct ? editedProduct.title : ''}
          //initiallyValid={!!editedProduct}
          //required
        />     
         {/* <Input
            id="imageUrl"
            label="Passport Image Url"
            errorText="Please enter a valid image url!"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            //initialValue={editedProduct ? editedProduct.imageUrl : ''}
            //initiallyValid={!!editedProduct}
            //required
          /> */}
         {/*  <ImagePicker id="selectedImage" onImageTaken = {imageTakenHandler} /> */}

          
        
          <View style={{ marginTop: 20 }}>
               <Text style={styles.titleText}  label="Passport Image">Passport Image</Text>
          <View style={styles.imagePreview}>
              {!pickedImage ? ( <Text>Upload passport image</Text>
                ) : ( <Image style={styles.image} source={{uri: pickedImage}} />
              )}
           </View>           
          <Button id="passport" title="Select Image" color={Colors.primary} onPress={_pickImage} />           
         </View> 

          <View style={styles.buttonContainer}>
              <Button
                title="Save"
                color={Colors.accent}
                onPress= {saveHandler}
              />
            </View>
      </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    <View style={{ height: 30 }} />
    </KeyboardAvoidingView>
  );
};


OwnerScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');
    return {
      headerTitle: 'Owner Registration',
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Menu"
            iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
            onPress={() => {
              navData.navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      )
           /*  headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Cart"
            iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
            onPress={() => {
              navData.navigation.navigate('Cart');
            }}
          />
        </HeaderButtons>
      ) */
    };
  };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },form: {
    margin: 20
  },
  formControl: {
    width: '100%'
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  buttonContainer: {
    marginTop: 10
  },
  titleText: {
    marginTop:10,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1
  },
  image: {
    width: '100%',
    height: '100%'
  },
});

export default OwnerScreen;