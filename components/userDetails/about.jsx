import { SafeAreaView, View } from 'react-native';
import { Button, Card, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import Header from '../header';
const AboutApp = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Header title="About Application" />
      <Card containerStyle={{ backgroundColor: '#eee' }}>
        <Card.Title style={{ color: '#000', fontSize: 10, flexWrap: 'wrap' }}>
          About Application
        </Card.Title>
        <Text style={{ color: '#000', fontSize: 10, flexWrap: 'wrap' }}>
          This application is developed for the purpose of providing a platform
          for the users to track their daily workout and excersice routine for
          Fitlinez Members
        </Text>

        <Text style={{ color: '#000', fontSize: 10, flexWrap: 'wrap' }}>
          App Version:
        </Text>
      </Card>
      <Button
        title="Back to Profile"
        type="outline"
        onPress={() => navigation.navigate('Profile')}
      />
    </SafeAreaView>
  );
};

export default AboutApp;
