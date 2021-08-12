import React, { useState,  useEffect, useCallback } from 'react';
import { FlatList, Button, Platform, ActivityIndicator, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import Colors from '../../constants/Colors';


import {
  STATUS_AVAILABLE,
  STATUS_NOT_AVAILABLE,
  STATUS_REQUESTED,
  STATUS_PAY_ENABLED,
  STATUS_CONFIRMED,
  STATUS_PAY_COMPLETE
} from '../../store/actions/products';

import {
  STATUS_ORDER_COMPLETE,
  STATUS_ORDER_APPROVED,
  STATUS_ORDER_REQUESTED,
  STATUS_ORDER_REJECTED
} from '../../store/actions/orders';

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  //Pull to Refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [isPayClicked, setIsPayClicked] = useState(false);
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();
  const studentuserEmail = useSelector(state => state.auth.userEmail);
  const studentuserId = useSelector(state => state.auth.userId);
  //console.log('ProductsOverviewScreen :: ',studentuserEmail, studentuserId);

//load products by displaying a spinner and also error handled
  const loadProducts = useCallback (async () => {
    console.log('Load Products');
    setError(null);
    setIsRefreshing(true);
    setIsPayClicked(false);
    try{
     // await dispatch(productsActions.fetchProducts());
      await dispatch(productsActions.fetchApprovedProduct(studentuserEmail, studentuserId));
    } catch(err){
      setError(err.message);
    } 
    setIsRefreshing(false);   
  }, [dispatch, setIsLoading, setError]);


  const paymentHandler = (async (pid, studentId) => {
    console.log('Make Paymet', pid);
    try{
      //await dispatch(cartActions.makePayment(pid, studentId));
      await dispatch(productsActions.makeProductPayment(pid, studentId));
    } catch(err){
      setError(err.message);
    } 
    setIsPayClicked(true);
  });

  //Drawers are loaded only once when the app launches at the begining, to reload this page again we will have to use a Listener
  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', loadProducts);
    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]); 

//This is for the initial load
  useEffect(() => { 
    setIsLoading(true);   
    loadProducts().then(() => {
      setIsLoading(false);
    });    
  }, [dispatch, loadProducts]);


  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title      
    });
  };

  if(error){
    return ( 
      <View style= {styles.loadingIcon}>
        <Text>An error occurred!</Text> 
        <Button title="Try again" onPress={loadProducts} color={Colors.primary} ></Button>       
      </View>
      );
  }


  if(isLoading) {
    return ( 
    <View style= {styles.loadingIcon}>
      <ActivityIndicator size="large" color={Colors.primary}  />
    </View>
    );
  }

  if(!isLoading && products.length === 0){
    <View style= {styles.loadingIcon}>
      <Text>No Properties found. Maybe start adding!</Text>
    </View>

  }

  return (
    <FlatList
    //Pull to Refresh
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          //image={itemData.item.imageUrl}
          image={itemData.item.propertyImg}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
           {(itemData.item.status === STATUS_AVAILABLE) && <Button
            color={Colors.primary}
            title="Book"
            onPress={() => {              
                dispatch(cartActions.addToCart(itemData.item));             
                }}
           />}

          {(itemData.item.status === STATUS_ORDER_REQUESTED) && <Button
            color={Colors.secondary}
            title="Booked"
            onPress={() => {              
                //dispatch(cartActions.makePayment(itemData.item.id, studentuserId));             
               }}
          />}
          
          {(itemData.item.status === STATUS_CONFIRMED) && <Button
            color="green"
            title="Confirmed"
            onPress={() => {              
                //dispatch(cartActions.makePayment(itemData.item.id, studentuserId));             
               }}
          />}

          {(itemData.item.status === STATUS_PAY_ENABLED) && (!isPayClicked) && <Button
            color={isPayClicked ? "green" : "blue"}
            title={isPayClicked ? 'Confirmed' : 'Pay'}
            onPress={() => {paymentHandler(itemData.item.id, studentuserId)}}
          />}

          {(itemData.item.status === STATUS_NOT_AVAILABLE) && <Button
            color="red"
            title="Unavailable"
            onPress={() => {              
                //dispatch(cartActions.makePayment(itemData.item.id, studentuserId));             
               }}
          />}
        </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: 'All Property',
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
    ) ,
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        
        <Item
          title="Cart"
          iconName={Platform.OS === 'android' ? 'md-cart' : 'md-cart'}
          onPress={() => {
            navData.navigation.navigate('Cart');
          }}
        />
        
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  loadingIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }

});

export default ProductsOverviewScreen;
