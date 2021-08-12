import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  Button,  TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';

import * as ImagePicker from 'expo-image-picker';
//import DateTimePicker from '@react-native-community/datetimepicker';

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

const EditProductScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [selectedImage, setSelectedImage] = useState();
  const [pickedImage, setPickedImage] = useState();


  const prodId = props.navigation.getParam('productId');
  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
     // imageUrl: editedProduct ? editedProduct.imageUrl : '',
      description: editedProduct ? editedProduct.description : '',
      price: editedProduct ? editedProduct.price: '',
      available_date: editedProduct ? editedProduct.available_date: '',      
      area: editedProduct ? editedProduct.area : '',
      address: editedProduct ? editedProduct.address : '',
      zipcode: editedProduct ? editedProduct.zipcode : ''
    },
    inputValidities: {
      title: editedProduct ? true : false,
     // imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
      available_date: editedProduct ? true : false,     
      area: editedProduct ? true : false,
      address: editedProduct ? true : false,
      zipcode: editedProduct ? true : false


    },
    formIsValid: editedProduct ? true : false
  });


useEffect(() => {
  if (error) {
    Alert.alert('An error occurred!', error, [{text: 'Okay'}]);
  }
}, [error]);

  const submitHandler = useCallback(async () => {
    //console.log('formState.formIsValid:: ',formState.formIsValid);
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        { text: 'Okay' }
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try{
      if (editedProduct) {
        await dispatch(
           productsActions.updateProduct(
             prodId,
             formState.inputValues.title,
             formState.inputValues.description,            
             formState.inputValues.available_date,  
             selectedImage,           
             formState.inputValues.area,
             formState.inputValues.address,
             formState.inputValues.zipcode
           )
         );
       } else {
        await dispatch(
           productsActions.createProduct(
             formState.inputValues.title,
             formState.inputValues.description,           
             formState.inputValues.price,
             formState.inputValues.available_date, 
             selectedImage,           
             formState.inputValues.area,
             formState.inputValues.address,
             formState.inputValues.zipcode
           )
         );
       }
       props.navigation.goBack();
    }catch (err) {
      setError(err.message);
    }
    
    setIsLoading(false);
    
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

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
      //console.log('selectedImage::: ',selectedImage);
    }
  };
  
  

  
  
  
  if(isLoading){
    return ( 
    <View style={styles.loadingIcon}> 
      <ActivityIndicator size='large' color={Colors.primary} />
    </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="height"
      keyboardVerticalOffset={50}
    >
       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            errorText="Please enter a valid title!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.title : ''}
            initiallyValid={!!editedProduct}
            required
          />
         {/*  <Input
            id="imageUrl"
            label="Image Url"
            errorText="Please enter a valid image url!"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.imageUrl : ''}
            initiallyValid={!!editedProduct}
            required
          /> */}
         {editedProduct ? null : ( 
            <Input
              id="price"
              label="Price"
              errorText="Please enter a valid price!"
              keyboardType="decimal-pad"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              required
              min={0.1}
            />
         )} 
          <Input
            id="description"
            label="Description"
            errorText="Please enter a valid description!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.description : ''}
            initiallyValid={!!editedProduct}
            required
            minLength={5}
          />
          <Input
            id="available_date"
            label="Availability Date From"
            errorText="Please enter a valid date format!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"            
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.available_date : ''}
            initiallyValid={!!editedProduct}
            required
          />
          <View style={{ marginTop: 20 }}>
               <Text style={styles.titleText}  label="Property Image">Property Pictures</Text>
          <View style={styles.imagePreview}>
              {!pickedImage ? ( <Text>Upload property images</Text>
                ) : ( <Image style={styles.image} source={{uri: pickedImage}} />
              )}
           </View>           
          <Button id="propertyImg" title="Select Image" color={Colors.primary} onPress={_pickImage} />           
         </View> 
         <Input
            id="area"
            label="Property Dimension (in Sq mtr)"
            errorText="Please enter a valid property dimension!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.area : ''}
            initiallyValid={!!editedProduct}
            required            
          />
          <Input
          id="address"
          label="Address"
          errorText="Please enter a Address!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"          
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.address : ''}
          initiallyValid={!!editedProduct}
          required
          minLength={5}
        />
        <Input
          id="zipcode"
          label="Zipcode"
          errorText="Please enter a Zipcode!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.zipcode : ''}
          initiallyValid={!!editedProduct}
          required
        />

        </View>
      </ScrollView>
      </TouchableWithoutFeedback>
      <View style={{ height: 30 }} />
    </KeyboardAvoidingView>
  );
};

EditProductScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('productId')
      ? 'Edit Property'
      : 'Add Property',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  form: {
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
  loadingIcon:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'    
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

export default EditProductScreen;
