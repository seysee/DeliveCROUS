import { View, Text } from 'react-native';
import { Link, useSegments } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const menuItems = [
  { name: 'Accueil', icon: 'home', route: '/' },
  { name: 'Commandes', icon: 'list-alt', route: '/orders' },
  { name: 'Favoris', icon: 'heart', route: '/favorites' },
  { name: 'Compte', icon: 'user', route: '/account' },
];

export default function NavigationBar() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const activeSegment = useSegments()[0];

  return (
    <View
      style={{
        position: 'absolute',
        bottom: isDesktop ? 'auto' : 0,
        left: isDesktop ? 0 : 'auto',
        right: 0,
        height: isDesktop ? '100%' : 60,
        width: isDesktop ? 200 : '100%',
        flexDirection: isDesktop ? 'column' : 'row',
        backgroundColor: '#fff',
        borderTopWidth: isDesktop ? 0 : 1,
        borderRightWidth: isDesktop ? 1 : 0,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: isDesktop ? 20 : 0,
      }}>
      {menuItems.map((item) => (
        <Link href={item.route} key={item.name} style={{ alignItems: 'center' }}>
          <FontAwesome
            name={item.icon}
            size={24}
            color={activeSegment === item.route.replace('/', '') ? 'blue' : 'gray'}
          />
          <Text style={{ fontSize: 12, color: 'gray' }}>{item.name}</Text>
        </Link>
      ))}
    </View>
  );
}
