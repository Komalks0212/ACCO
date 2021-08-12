import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Text
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector, connect } from 'react-redux';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

import authReducer from '../../store/reducers/auth';
import { createStore } from 'redux';

//const store = createStore(authReducer);


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



const AuthScreen = props => {
  const[isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  //const state = store.getState();
  //const authState = useSelector(state => state.auth);
  const dispatch = useDispatch();
  //console.log(">>>>>>>>>>>Store data:", authState, authState.userType);
  //console.log(">>>>>>>>>>>Store data:", store.getState());

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
      userType: '',
      useraction: ''
    },
    inputValidities: {
      email: false,
      password: false,
      userType: false,
      useraction: false
    },
    formIsValid: false
  });


  useEffect(() => {
    if(error) {
      Alert.alert('Am Error Occurred!', error, [{text: 'Okay'}]);
    }
  }, [error]);



  const authHandler = async ({ userId, userType }) => {
    let action;
    if(isSignup){
      action =      
        authActions.signup(
          formState.inputValues.email,
          formState.inputValues.password,
          formState.inputValues.userType        
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password,
        formState.inputValues.useraction
        );
    }  
    setError(null);  
    setIsLoading(true);
    try{
      await dispatch(action);
      
      props.navigation.navigate('Profile');

    } catch(err) {
      setError(err.message);
      setIsLoading(false);
    }    
  };

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


  return (
    <KeyboardAvoidingView
      behavior="height"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            {isSignup &&
            <Input
              id="userType"
              label="User Type"
              keyboardType="default"
              required
              autoCapitalize="none"
              errorText="Please user Type."
              onInputChange={inputChangeHandler}
              initialValue=""
            />}
           {isSignup && 
           <Text style={styles.titleText}   label="">Please enter user type as 'student' or 'owner'</Text>
            }
            <View style={styles.buttonContainer}>
              {isLoading ? ( <ActivityIndicator size='small' colors={Colors.primary} /> ) : (  <Button title={isSignup ? 'Sign Up' : 'Login'} color={Colors.primary} onPress={authHandler} /> )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                color={Colors.accent}
                onPress={() => {
                  setIsSignup(prevState => !prevState);
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

//Page Title
AuthScreen.navigationOptions = {
  headerTitle: 'Acco - Accommodation finder'
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 10
  },
  buttonContainer: {
    marginTop: 10
  },
  titleText: {
    marginTop:10,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10
  }
});



export default AuthScreen;

