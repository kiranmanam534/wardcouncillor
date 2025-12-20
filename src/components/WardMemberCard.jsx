import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {Card, Title, Paragraph, Divider} from 'react-native-paper';

const logo = require('../assets/images/sixtep-logo.jpeg');
import {Colors} from '../constant/Colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// const WardMemberCard = ({wardMember, onPress}) => {
//   console.log('WardMemberCard', wardMember);
//   return (
//     <View style={styles.container}>
//       <Card style={styles.card}>
//         <View style={styles.box}>
//           {/* {wardMember?.Councillor_Picture ? (
//             <Image
//               source={{uri: wardMember?.Councillor_Picture}}
//               style={styles.img}
//             />
//           ) : (
//             <Icon name="user" size={100} color={Colors.blue} />
//           )} */}
//           <Icon name="user" size={100} color={Colors.blue} />
//         </View>
//         <Card.Content style={{paddingRight: 80, paddingTop: 20}}>
//           <View style={styles.cardContent}>
//             <Icon name="user" size={25} color={Colors.blue} />
//             <Title style={styles.title}>
//               {wardMember?.FirstName} {wardMember?.Surname}
//             </Title>
//           </View>

//           <View style={{flexDirection: 'row', paddingTop: 20}}>
//             <Text style={styles.contentText}>Ward No</Text>
//             <Text
//               style={{fontWeight: '800', fontSize: 15, color: Colors.black}}>
//               : {wardMember?.WardNo}
//             </Text>
//           </View>
//           <View style={{flexDirection: 'row', paddingTop: 10}}>
//             <Text style={styles.contentText}>Gender</Text>
//             <Text
//               style={{fontWeight: '800', fontSize: 15, color: Colors.black}}>
//               : {wardMember.Gender == 'M' ? 'Male' : 'Female'}
//             </Text>
//           </View>
//           <View style={{flexDirection: 'row', paddingTop: 10}}>
//             <Text style={styles.contentText}>Party</Text>
//             <Text
//               numberOfLines={5}
//               style={{fontWeight: '800', fontSize: 15, color: Colors.black}}>
//               : {wardMember?.Party}
//             </Text>
//           </View>
//           <View style={{flexDirection: 'row', paddingTop: 10}}>
//             <Text style={styles.contentText}>Email</Text>
//             <Text
//               style={{fontWeight: '800', fontSize: 15, color: Colors.black}}>
//               : {wardMember?.EmailAddress}
//             </Text>
//           </View>
//           <View style={{flexDirection: 'row', paddingTop: 10}}>
//             <Text style={styles.contentText}>Mobile</Text>
//             <Text
//               style={{
//                 fontWeight: '800',
//                 fontSize: 15,
//                 color: Colors.primary,
//                 textDecorationLine: 'underline',
//               }}>
//               : {wardMember?.Mobile}
//             </Text>
//           </View>
//           <View style={{flexDirection: 'row', paddingTop: 10}}>
//             <Text style={styles.contentText}>Home</Text>
//             <Text
//               style={{fontWeight: '800', fontSize: 15, color: Colors.black}}>
//               : -
//             </Text>
//           </View>
//           <View style={{flexDirection: 'row', paddingTop: 10}}>
//             <Text style={styles.contentText}>Work</Text>
//             <Text
//               style={{fontWeight: '800', fontSize: 15, color: Colors.black}}>
//               : -
//             </Text>
//           </View>
//         </Card.Content>
//         <Divider style={styles.divider} />
//         <Card.Content
//           style={[
//             styles.footer,
//             {
//               backgroundColor: Colors.blue,
//               borderBottomLeftRadius: 15,
//               borderBottomRightRadius: 15,
//               height: 50,
//               borderWidth: 2,
//               borderColor: Colors.yellow,
//               justifyContent: 'flex-end',
//               alignItems: 'center',
//             },
//           ]}>
//           {/* <Paragraph style={[styles.text, {fontSize: 15, paddingTop: 10}]}>
//             {wardMember.Gender == 'M' ? 'Male' : 'Female'}
//           </Paragraph> */}
//           <View style={{marginTop: 15}}>
//             <TouchableOpacity
//               onPress={onPress}
//               style={[
//                 styles.btn,
//                 {
//                   height: 30,
//                   width: 200,
//                   backgroundColor: Colors.white,
//                   borderRadius: 20,
//                 },
//               ]}>
//               <View
//                 style={{
//                   flex: 1,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   alignSelf: 'center',
//                   flexDirection: 'row',
//                   // marginHorizontal: -20,
//                 }}>
//                 <Icon name="hand-o-right" size={20} color={Colors.blue} />
//                 <Text
//                   style={[
//                     styles.text,
//                     {fontSize: 16, color: Colors.blue, paddingLeft: 5},
//                   ]}>
//                   Go To Dashboard
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </Card.Content>
//       </Card>
//     </View>
//   );
// };

const WardMemberCard = ({wardMember, onPress}) => {
  console.log('WardMemberCard', wardMember);
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <View style={styles.box}>
              {wardMember?.councilloR_IMAGE ? (
                <Image
                  source={{uri: wardMember?.councilloR_IMAGE}}
                  style={styles.img}
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Icon name="user" size={70} color={Colors.blue} />
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.nameCard}>
          <Icon name="user-circle-o" size={24} color={Colors.blue} />
          <Title style={styles.title}>
            {wardMember?.name} {wardMember?.surname}
          </Title>
        </View>

        <Card.Content style={styles.contentSection}>
          <View style={styles.sectionTitle}>
            <Icon name="info-circle" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitleText}>Contact Information</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <View style={styles.iconCircle}>
                <Icon name="map-marker" size={16} color={Colors.yellow} />
              </View>
              <Text style={styles.infoLabel}>Ward No</Text>
              <Text style={styles.infoValue}>{wardMember?.warD_NO}</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.iconCircle}>
                <Icon name="venus-mars" size={16} color={Colors.yellow} />
              </View>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{wardMember?.gender}</Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Icon name="flag" size={18} color={Colors.blue} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Political Party</Text>
                <Text style={styles.detailValue} numberOfLines={2}>
                  {wardMember?.party}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Icon name="envelope" size={18} color={Colors.blue} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email Address</Text>
                <Text
                  style={[styles.detailValue, styles.linkText]}
                  numberOfLines={1}>
                  {wardMember?.username}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Icon name="mobile-phone" size={22} color={Colors.blue} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Mobile Number</Text>
                <Text style={[styles.detailValue, styles.linkText]}>
                  {wardMember?.cell}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Icon name="phone" size={18} color={Colors.blue} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Home Number</Text>
                <Text style={[styles.detailValue, styles.linkText]}>
                  {wardMember?.phone || 'Not Available'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Icon name="briefcase" size={18} color={Colors.blue} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Work Number</Text>
                <Text style={styles.detailValue}>Not Available</Text>
              </View>
            </View>
          </View>
        </Card.Content>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={onPress}
            style={styles.dashboardButton}
            activeOpacity={0.8}>
            <Icon name="tachometer" size={22} color={Colors.indigo} />
            <Text style={styles.buttonText}>GO TO DASHBOARD</Text>
            <Icon name="arrow-right" size={18} color={Colors.indigo} />
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
};

export default WardMemberCard;

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  card: {
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    backgroundColor: Colors.royalBlue,
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  profileImageContainer: {
    marginBottom: -50,
  },
  box: {
    width: screenWidth / 2.8,
    height: screenWidth / 2.8,
    borderWidth: 4,
    borderColor: Colors.yellow,
    borderRadius: screenWidth / 5.6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.yellow,
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  img: {
    width: screenWidth / 2.8 - 8,
    height: screenWidth / 2.8 - 8,
    resizeMode: 'cover',
    borderRadius: screenWidth / 5.6,
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F4FF',
  },
  nameCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 60,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.blue,
    ...Platform.select({
      ios: {
        shadowColor: Colors.blue,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  contentSection: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.blue,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.black,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  detailsSection: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#FAFBFC',
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.yellow,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F0FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: Colors.black,
    fontWeight: '700',
  },
  linkText: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  footer: {
    backgroundColor: Colors.white,
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  dashboardButton: {
    backgroundColor: Colors.yellow,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.blue,
    minWidth: 240,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.yellow,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonText: {
    color: Colors.indigo,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
});
