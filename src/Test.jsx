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


// const config = {
//   issuer: 'https://102.130.113.92:9443/oauth2/token',
//   clientId: 'ZfU9zZthjvNLV_gLXN1bNVlOUjoa',
//   // discoveryUrl :'https://102.130.113.92:9443/oauth2/token/.well-known/openid-configuration',
//   redirectUrl: 'wardcouncillor://oauth',  
//   scopes: ['openid', 'profile', 'address', 'phone'],
//   serviceConfiguration: {
// 		authorizationEndpoint: 'https://102.130.113.92:9443/oauth2/authorize',
// 		tokenEndpoint: 'https://102.130.113.92:9443/oauth2/accesstoken',
// 		revocationEndpoint: 'https://102.130.113.92:9443/oauth2/deauthorize',
//     // discoveryUrl :'https://102.130.113.92:9443/oauth2/token/.well-known/openid-configuration',
// 	}
// };

const config = {
  issuer: 'https://coeiamtest.ekurhuleni.gov.za',
  clientId: 'F7aubwPETI6TBfCGuUNajDtbreka',
  discoveryUrl :'https://coeiamtest.ekurhuleni.gov.za/.well-known/openid-configuration',
  redirectUrl: 'wardcouncillor://oauth',  
  scopes: ['openid', 'profile', 'address', 'phone'],
  serviceConfiguration: {
		authorizationEndpoint: 'https://coeiamtest.ekurhuleni.gov.za/oauth2/authorize',
		tokenEndpoint: 'https://coeiamtest.ekurhuleni.gov.za/oauth2/accesstoken',
		revocationEndpoint: 'https://coeiamtest.ekurhuleni.gov.za/oauth2/deauthorize',
    discoveryUrl :'https://coeiamtest.ekurhuleni.gov.za/.well-known/openid-configuration',
	}
};
const config2 = {
  issuer: 'https://coeiamtest.ekurhuleni.gov.za',
  clientId: 'F7aubwPETI6TBfCGuUNajDtbreka',
  redirectUrl: 'wardcouncillor://oauth',
  scopes: ['openid', 'profile', 'address', 'phone'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://coeiamtest.ekurhuleni.gov.za/oauth2/authorize',
    tokenEndpoint: 'https://coeiamtest.ekurhuleni.gov.za/oauth2/accesstoken',
    revocationEndpoint: 'https://coeiamtest.ekurhuleni.gov.za/oauth2/deauthorize',
  }
};

export default function Test() {

  const handleSubmitPress = async () => {
    console.log("here!!")
    try {
      const result = await authorize(config);
      // result includes accessToken, accessTokenExpirationDate and refreshToken
      console.log("*************");
      console.log("auth", result);
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