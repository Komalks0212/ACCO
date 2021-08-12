import React, { useState,  useEffect, useCallback } from 'react';
import { FlatList, Button, Platform, Alert, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch} from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = props => {
  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  
  const loadProducts = useCallback (async () => {
    console.log('Load Products');
    setError(null);
    setIsRefreshing(true);
    try{
      console.log('Inside Try');
      await dispatch(productsActions.fetchOwnerProduct());
    } catch(err){
      setError(err.message);
    } 
    setIsRefreshing(false);   
  }, [dispatch, setIsLoading, setError]);


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

if(!isLoading && userProducts.length === 0){
  <View style= {styles.loadingIcon}>
    <Text>No Properties found. Maybe start adding!</Text>
  </View>

}


  const editProductHandler = id => {
    props.navigation.navigate('EditProduct', { productId: id });
  };

  const deleteHandler = (id) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(productsActions.deleteProduct(id));
        }
      }
    ]);
  };

  if(userProducts.length === 0){
    return <View style={styles.message}>
      <Text>No Properties found. Please create! </Text>
    </View>
  }


  return (
    <FlatList
    onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.propertyImg}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
        >
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() => {
              editProductHandler(itemData.item.id);
            }}
          />
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={deleteHandler.bind(this, itemData.item.id)}
          />
        </ProductItem>
      )}
    />
  );
};

UserProductsScreen.navigationOptions = navData => {
  return {
    headerTitle: 'My Property',
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
    headerRight: () =>(
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => {
            navData.navigation.navigate('EditProduct');
          }}
        />
      </HeaderButtons>
    )
  };
};



const styles = StyleSheet.create({
  message: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'    
  }
});

export default UserProductsScreen;
