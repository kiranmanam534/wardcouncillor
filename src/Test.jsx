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


const config1 = {
  issuer: 'https://102.130.113.92:9443/oauth2/token',
  clientId: 'ZfU9zZthjvNLV_gLXN1bNVlOUjoa',
  // discoveryUrl :'https://102.130.113.92:9443/oauth2/token/.well-known/openid-configuration',
  redirectUrl: 'wardcouncillor://oauth',  
  scopes: ['openid', 'profile', 'address', 'phone'],
  serviceConfiguration: {
		authorizationEndpoint: 'https://102.130.113.92:9443/oauth2/authorize',
		tokenEndpoint: 'https://102.130.113.92:9443/oauth2/accesstoken',
		revocationEndpoint: 'https://102.130.113.92:9443/oauth2/deauthorize',
    // discoveryUrl :'https://102.130.113.92:9443/oauth2/token/.well-known/openid-configuration',
	}
};

const config = {
  issuer: 'https://coeiamtest.ekurhuleni.gov.za',
  clientId: 'F7aubwPETI6TBfCGuUNajDtbreka',
  redirectUrl: 'com.wardcouncillor://oauth',
  scopes: ['openid', 'profile', 'email'],
};

const config11 = {
  issuer: 'https://coeiamtest.ekurhuleni.gov.za',
  clientId: 'F7aubwPETI6TBfCGuUNajDtbreka',
  // discoveryUrl :'https://coeiamtest.ekurhuleni.gov.za/.well-known/openid-configuration',
  redirectUrl: 'com.wardcouncillor://oauth',  
  scopes: ['openid', 'profile', 'address', 'phone'],
  serviceConfiguration: {
		authorizationEndpoint: 'https://coeiamtest.ekurhuleni.gov.za/oauth2/authorize',
		tokenEndpoint: 'https://coeiamtest.ekurhuleni.gov.za/oauth2/accesstoken',
		revocationEndpoint: 'https://coeiamtest.ekurhuleni.gov.za/oauth2/deauthorize',
    // discoveryUrl :'https://coeiamtest.ekurhuleni.gov.za/.well-known/openid-configuration',
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


  const authenticate = async () => {
    try {
      const response = await fetch('https://coeiamtest.ekurhuleni.gov.za/oauth2/authorize', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        body: JSON.stringify({
          issuer: 'https://coeiamtest.ekurhuleni.gov.za',
          clientId: 'F7aubwPETI6TBfCGuUNajDtbreka',
          redirectUrl: 'wardcouncillor://oauth',
          scopes: ['openid', 'profile', 'address', 'phone'],
          serviceConfiguration: {
            authorizationEndpoint: 'https://coeiamtest.ekurhuleni.gov.za/oauth2/authorize',
            tokenEndpoint: 'https://coeiamtest.ekurhuleni.gov.za/oauth2/accesstoken',
            revocationEndpoint: 'https://coeiamtest.ekurhuleni.gov.za/oauth2/deauthorize',
          }
        }),
      });
      console.log('====================================');
      console.log(response);
      console.log('====================================');
      const responseData = await response.text();
      console.log('Raw response:', responseData);
      const result = JSON.parse(responseData); // Assuming JSON response
      console.log('Parsed result:', result);
    } catch (error) {
      console.error('Error fetching or parsing response:', JSON.stringify(error));
    }
  };



  const handleSubmitPress = async () => {
    console.log("here!!")
    try {
      authenticate()
      // const result = await authorize(config);
      // // result includes accessToken, accessTokenExpirationDate and refreshToken
      // console.log("*************");
      // console.log("auth", result);
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