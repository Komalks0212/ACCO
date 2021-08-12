import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import Card from '../../components/UI/Card';
import * as cartActions from '../../store/actions/cart';
import * as ordersActions from '../../store/actions/orders';

const CartScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
  const userEmail = useSelector(state => state.auth.userEmail);
  
  //console.log('CartScreen :: userEmail:: ', useSelector(state => state.products));
 //console.log('CartScreen owner param :: ',ownerEmail , ownerId );
  const cartItems = useSelector(state => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
        studentEmail: userEmail,
        ownerEmail: state.cart.items[key].ownerEmail,
        ownerId: state.cart.items[key].ownerId,
        status : state.cart.items[key].status
        
      });  
      //console.log('Owner Email:: ',state.cart.items[key]);    
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });
  const dispatch = useDispatch();

  const sendOrderHandler = async () => {
    setIsLoading(true);
    console.log('CartScreen  cartItems ::  ',cartItems); 
    await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
  };
// console.log('cartTotalAmount:: ',cartTotalAmount);
// var value = Math.round(cartTotalAmount * 100) / 100;
// console.log('value:: ',value);
  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{' '}
          <Text style={styles.amount}>
         ${Math.round(cartTotalAmount * 100) / 100} 
        
          </Text>
        </Text>
        {isLoading ? ( <ActivityIndicator size='small' color={Colors.primary} /> ) : (
        <Button
          color={Colors.accent}
          title="Request Now"
          disabled={cartItems.length === 0}
          onPress={sendOrderHandler}
        /> )
      }
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.productId}
        renderItem={itemData => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            deletable
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: 'Your Cart'
};

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10
  },
  summaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18
  },
  amount: {
    color: Colors.primary
  }
});

export default CartScreen;
