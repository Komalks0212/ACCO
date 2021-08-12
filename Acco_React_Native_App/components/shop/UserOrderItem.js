import React, { useState } from 'react';
import { ScrollView,FlatList, View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Button,  Platform} from 'react-native';
import { useSelector, useDispatch} from 'react-redux';

import BokingItem from './BookingItem';
import * as orderActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';
import Card from '../UI/Card';

const UserOrderItem = props => {
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();

  const [profiles, setProfiles] = useState(props.profiles);
  
  const deleteProfileByEmail = (profile, product) => {
    const filteredProfiles = profiles.filter(item => item.email !== profile.email);
    console.log("<<<<<<<<<< Before:", profiles);
    setProfiles(filteredProfiles);
    console.log("<<<<<<<<<< After:", profiles);
    
    dispatch(orderActions.removeFromOrders(profile.email, product));
  }

  const approveProfile = (profile, product) => {
    console.log("approveProfile ",profile.email);
    dispatch(orderActions.approvedProfileUpdateStatus(profile.email,product));
  }


  return (
    <Card style={styles.product}>        
          <View >
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: props.image }} />
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.price}>${props.price}</Text>
            </View>
            </View>
          <Button
        color={Colors.primary}
        title={showDetails ? 'Hide Details' : 'Show Details'}
        onPress={() => {
          setShowDetails(prevState => !prevState);
        }}
      />
      
      {showDetails && (
  <View style={styles2.detailItems}>
    
    {profiles.map(profileItem => (
      <BokingItem
        key={profileItem.email}
        quantity= {"1"}
        amount= {props.price}
        title={profileItem.email}
        deletable={true}
        approve={true}
        onRemove={() => {
          deleteProfileByEmail(profileItem, props.product);
        }}
        approve={() => {
          approveProfile(profileItem, props.product);
        }}
      />
    ))}
  </View>
  )}
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    height: 500,
    padding: 10,
    margin: 20,
    paddingBottom: 50,
    flex: 1
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden'
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  details: {
    alignItems: 'center',
    height: '10%',
    padding: 10
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
    marginVertical: 2
  },
  price: {
    fontFamily: 'open-sans',
    fontSize: 14,
    color: '#888',
    marginVertical: 2,
    paddingBottom: 50
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '23%',
    paddingHorizontal: 20
  },
  detailItems: {
    width: '100%'
  }
});

const styles2 = StyleSheet.create({
  orderItem: {
    margin: 20,
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15
  },
  totalAmount: {
    fontFamily: 'open-sans-bold',
    fontSize: 16
  },
  date: {
    fontSize: 16,
    fontFamily: 'open-sans',
    color: '#888'
  },
  detailItems: {
    width: '100%',
    //paddingBottom: 200,
    //flex: 1
  }
});

export default UserOrderItem;
