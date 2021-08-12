import React from 'react';
import { Platform, Text, SafeAreaView, Button, View, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';


import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';
import StudentScreen from '../components/shop/StudentRegistration';
import OwnerScreen from '../components/shop/OwnerRegistration';
import ProfileScreen from '../screens/details/profileScreen';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};

// navigator for student properties
const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (     
        <FontAwesome name="building" size={24} color="black" />
         
        // <Ionicons
        //    name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
        //   size={23}
        //   color={drawerConfig.tintColor}
        // />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

// navigator for property requests (bookings)
const RequestsNavigator = createStackNavigator(
  {
    Requests: OrdersScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons name="md-notifications" size={24} color="black" />
        // <Ionicons
        //   name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
        //   size={23}
        //   color={drawerConfig.tintColor}
        // />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

// navigator for owner properties (bookings)
const PropertiesNavigator = createStackNavigator(
    {
      UserProducts: UserProductsScreen,
      EditProduct: EditProductScreen
    },
    {
      navigationOptions: {
        drawerIcon: drawerConfig => (
          <Ionicons
            name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
            size={23}
            color={drawerConfig.tintColor}
          />
        )
      },
      defaultNavigationOptions: defaultNavOptions
    }
  );

// navigator for profile creation
const ProfileHomeNavigator = createStackNavigator(
  {
    Profiles: ProfileScreen      
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <MaterialCommunityIcons name="face-profile" size={24} color="black" />
        // <Ionicons
        //   name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
        //   size={23}
        //   color={drawerConfig.tintColor}
        // />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

// Drawer for profile screen
const ProfileNavigator = createDrawerNavigator(
  {
    Profile: ProfileHomeNavigator,
    ViewProperites: ProductsNavigator,
    //Admin: AdminNavigator
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary
    },
    contentComponent: props => {
      const dispatch = useDispatch();
      //Logic to add LOG OUT a custom button to the drawer
      return <View style={styles.customView}>
        <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
          <DrawerItems {...props} />
          <Button title="Logout" color={Colors.primary} onPress={() => {
            dispatch(authActions.logout());
            //props.navigation.navigate('Auth');
          }} />
        </SafeAreaView>
      </View>;

    }
  }
);

// Drawer for student property screen
const StudentNavigator = createDrawerNavigator(
  {
    Profile: ProfileHomeNavigator,
    ViewProperites: ProductsNavigator
    //Requests: RequestsNavigator
    //Admin: AdminNavigator
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary
    },
    contentComponent: props => {
      const dispatch = useDispatch();
      //Logic to add LOG OUT a custom button to the drawer
      return <View style={styles.customView}>
        <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
          <DrawerItems {...props} />
          <Button title="Logout" color={Colors.primary} onPress={() => {
            dispatch(authActions.logout());
            //props.navigation.navigate('Auth');
          }} />
        </SafeAreaView>
      </View>;

    }
  }
);

// Drawer for owner property screen
const OwnerNavigator = createDrawerNavigator(
  {
    //Products: ProductsNavigator,
    Profile: ProfileHomeNavigator,
    Properties: PropertiesNavigator,
    Requests: RequestsNavigator
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary
    },
    contentComponent: props => {
      const dispatch = useDispatch();
      //Logic to add LOG OUT a custom button to the drawer
      return <View style={styles.customView}>
        <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
          <DrawerItems {...props} />
          <Button title="Logout" color={Colors.primary} onPress={() => {
            dispatch(authActions.logout());
            //props.navigation.navigate('Auth');
          }} />
        </SafeAreaView>
      </View>;

    }
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions //Its sets the header title and color
  }
);
//createSwitchNavigator helps us not to go back to login page after login success.
const MainNavigator = createSwitchNavigator({
  //AsyncStorage.getItem() is throwing an promise issue
  //Startup: StartupScreen,
  Auth: AuthNavigator,  
  Profile: ProfileNavigator,
  Student: StudentNavigator, 
  Owner: OwnerNavigator 
});



const styles = StyleSheet.create({
  customView: {
    flex: 1,
    paddingTop: 30
    
  }

});

export default createAppContainer(MainNavigator);
