import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BookingItem = props => {

  const testHandler = () => {
   // console.log("BookingItem test ",props);
  }

  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <Text style={styles.mainText}>{props.title}</Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.priceText}>${props.amount}</Text>

        {props.approve && (
          <TouchableOpacity
          onPress={props.approve}
          style={styles.approveButton}>
        <Ionicons name={Platform.OS === 'android' ? 'md-checkmark-circle' : 'ios-checkmark-circle' } size={23} color="green" />
        </TouchableOpacity>

        )}
        
        {props.deletable && (
          <TouchableOpacity
            onPress= {props.onRemove}
            style={styles.deleteButton}
          >
            <Ionicons
              name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
              size={23}
              color="red"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    //width: 100,
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    //marginTop: 5
  },
  itemData: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantity: {
    fontFamily: 'open-sans',
    color: '#888',
    fontSize: 16
  },
  mainText: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
    //width:'150%'
  },
  priceText: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
    marginRight: 20
  },
  deleteButton: {
    //marginLeft: -120
    marginRight: 20
  },
  approveButton:{
    marginRight: 20
    //marginLeft: 50
  }
});

export default BookingItem;
