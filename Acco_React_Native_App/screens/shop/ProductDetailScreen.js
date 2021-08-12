import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = props => {
  const productId = props.navigation.getParam('productId');
  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  );
  const dispatch = useDispatch();
//console.log('selectedProduct:: ',selectedProduct);
  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.propertyImg }} />
      <View style={styles.actions}>
        <Button
          color={Colors.primary}
          title="Book"
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct));
          }}
        />
      </View>
      <View>
      <Text style={styles.titleText}> Price: 
      <Text style={styles.price} > ${selectedProduct.price}</Text></Text>
      
      <Text style={styles.titleText} > Property Description:</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>

      <Text style={styles.titleText} > Availability Date:</Text>
      <Text style={styles.description}> {selectedProduct.available_date}</Text> 

      <Text style={styles.titleText} > Area(In Sq mtr): </Text>
      <Text style={styles.description}> {selectedProduct.area}</Text>

      <Text style={styles.titleText} > Location: </Text>
      <Text style={styles.description}> {selectedProduct.address} , {selectedProduct.zipcode}</Text> 
      </View>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('productTitle'),
    
  };
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center'
  },
  price: {
    fontSize: 20,
    color: '#888',
    //textAlign: 'center',
    //marginVertical: 20,
    fontFamily: 'open-sans-bold',
    paddingBottom:20
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    //textAlign: 'center',
    //marginHorizontal: 20,
    paddingBottom:20
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
   // paddingBottom:20
  }
});

export default ProductDetailScreen;
