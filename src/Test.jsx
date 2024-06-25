import {
  Image, StyleSheet, Platform, Button,
  View,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';

import {
  authorize,
  refresh,
  revoke,
  prefetchConfiguration,
} from 'react-native-app-auth';

import { Buffer } from "buffer";




const config_new = {
  issuer: 'https://coeiamtest.ekurhuleni.gov.za/oauth2/token',
  clientId: 'F7aubwPETI6TBfCGuUNajDtbreka',
  redirectUrl: 'wardcouncillor:/oauthredirect',
  additionalParameters: {},
  // scopes: ['openid', 'profile', 'email','groups','role'],
  scopes: ['openid', 'profile', 'email'],
};


export default function Test() {

  const handleSubmitPress = async () => {
    console.log("here!!")
    try {
      // authenticate()
      const authState = await authorize(config_new);
      console.log(authState);
      const jwtBody = authState.idToken.split('.')[1];
      const base64 = jwtBody.replace('-', '+').replace('_', '/');
      const decodedJwt = Buffer.from(base64, 'base64');
      const data = JSON.parse(decodedJwt.toString('ascii'));
      //Alert.alert('DATA: ', JSON.stringify(data));
      console.log('====================================');
      console.log(JSON.stringify(data));
      console.log('====================================');
      // result includes accessToken, accessTokenExpirationDate and refreshToken
      console.log("*************");
    } catch (error) {
      console.log("******authorizeError*******");
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      // console.log(JSON.stringify(error));
      //Alert.alert('Failed to log in', ""+JSON.stringify(error));
    }
  }



  return (
    <View>
      <View style={styles.titleContainer}>
        <Text type="title">Welcome!</Text>
      </View>
      <View style={styles.stepContainer}>
        <Text type="subtitle">SSO WSO2 IAM</Text>
        <Button
          title="SSO"
          onPress={handleSubmitPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});