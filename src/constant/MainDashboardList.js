import {Colors} from './Colors';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

export const MainDashboardList = [
  {
    id: 1,
    title: 'Hotspots',
    icon: (
      <MaterialIcon name="wifi-tethering" size={50} color={Colors.blue} />
    ),
    name:'Hotspot'
  },
  {
    id: 2,
    title: 'Road Clouser',
    icon: <MaterialIcon name="warning" size={50} color={Colors.blue} />,
    name:'RoadClouser'
  },
  {
    id: 3,
    title: 'Meetings',
    icon: (
      <MaterialIcon
        name="supervised-user-circle"
        size={50}
        color={Colors.blue}
      />
    ),
    name:'Meetings'
  },
  {
    id: 4,
    title: 'Missing Person',
    icon: (
      <MaterialIcon name="person-search" size={50} color={Colors.blue} />
    ),
    name:'MissingPerson'
  },
  {
    id: 5,
    title: 'Workshops',
    icon: (
      <MaterialCommunityIcons
        name="electron-framework"
        size={50}
        color={Colors.blue}
      />
    ),
    name:'Workshop'
  },
  {
    id: 6,
    title: 'Healthcare',
    icon: <FontAwesome5 name="first-aid" size={50} color={Colors.blue} />,
    name:'Healthcare'
  },
  {
    id: 7,
    title: 'Warnings',
    icon: (
      <MaterialCommunityIcons
        name="bell-alert-outline"
        size={50}
        color={Colors.blue}
      />
    ),
    name:'Warnings'
  },
  // {
  //   id: 8,
  //   title: '',
  //   icon: '',
  //   name:''
  // },
  // {
  //   id: 9,
  //   title: '',
  //   icon: '',
  //   name:''
  // },
  // Add more data as needed
];


export const MayorOustandingDashboardList = [
  {
    id: 1,
    title: 'Summary',
    icon: (
      <MaterialCommunityIcons name="tablet-dashboard" size={50} color={Colors.blue} />
    ),
    name:'Summary'
  },
  {
    id: 2,
    title: 'Ward wise list',
    icon: <MaterialIcon name="list-alt" size={50} color={Colors.blue} />,
    name:'WardList'
  },
  {
    id: 3,
    title: 'Category wise list',
    icon: (
      <MaterialIcon
        name="category"
        size={50}
        color={Colors.blue}
      />
    ),
    name:'CategoryList'
  }
];
