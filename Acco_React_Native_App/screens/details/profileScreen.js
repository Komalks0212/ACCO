import React, {useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import StudentRegistration from '../../components/shop/StudentRegistration';

import OwnerRegistration from '../../components/shop/OwnerRegistration';

const ProfileScreen = props => {
  const userType = useSelector(state => state.auth.userType);
  const userId = useSelector(state => state.auth.userId);
  const userAction = useSelector(state => state.auth.useraction);
  //const [isStudent, setIsStudent] = useState(false);
  let isStudent = userType==='student';
  
  if(userAction){
    //Registered user can directly go to properties page
    if(userType==='student')
        props.navigation.navigate('ViewProperites');
    else
        props.navigation.navigate('Properties');

  }

  //console.log('state param::::::::::: ',userAction);

  //console.log('~~~~~~~~~~~~~~~~~~:: ',useSelector(state => state.auth));

  //console.log('isStudent',isStudent);  

  return (
    <View style={styles.screen}>
      {/* <Text>This is a {userType} and  {isStudent.toString()} profile Screen!</Text> */}
      
      {isStudent? <StudentRegistration navigation={props.navigation}/>: <OwnerRegistration navigation={props.navigation}/>} 
 {/*  {isStudent && <StudentRegistration/>} 
  {!isStudent && <OwnerRegistration/> } */}
  </View>
    
  );
};

ProfileScreen.navigationOptions = navData => {
  return {
    headerTitle: "User Profile",
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
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => {
            navData.navigation.navigate('Cart');
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    /* justifyContent: 'center',
    alignItems: 'center' */
  }
});

export default ProfileScreen;