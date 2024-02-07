import { Button, ButtonGroup, Tab, TabView, useTheme } from '@rneui/themed';
import React, { useContext, useState } from 'react';
import LineChartWeight from '../../components/Charts/LineChart';
import { Dimensions, View } from 'react-native';
import BarChartWeight from '../../components/Charts/weightBar';
import MiddleStart from './middleStart';
import HomeMiddle from './homeMiddle';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import CategoryList from './categoryList';
import { useNavigation } from '@react-navigation/native';
import HomeTabs from './HomeTabs';

function HomeTop({ currentPlan, woroutCategories }) {
  const navigation = useNavigation();
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(currentPlan ? 1 : 0);
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <View
      style={{
        height: Dimensions.get('window').height,
      }}>
      <ButtonGroup
        buttonContainerStyle={{
          backgroundColor: theme.colors.primary,
          borderColor: 'transparent',
          borderWidth: 0,
        }}
        selectedButtonStyle={{
          backgroundColor: theme.colors.secondary,
          borderColor: 'transparent',
          borderWidth: 3,
          borderBottomColor: theme.colors.orange,
          borderTopEndRadius: 10,
          borderTopStartRadius: 10,
        }}
        innerBorderStyle={{}}
        selectedTextStyle={{
          color: theme.colors.primary,
          fontWeight: 'bold',
          fontSize: 16,
        }}
        disabledSelectedStyle={{
          color: theme.colors.grey0,
        }}
        buttons={[
          `${i18n.t('yourPlan')}`,
          `${i18n.t('setNewPlan')}`,
          `${i18n.t('statistics')}`,
        ]}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          setSelectedIndex(value);
        }}
        containerStyle={{ marginBottom: 20, borderWidth: 0 }}
      />
      {selectedIndex === 2 && <HomeTabs />}
      {selectedIndex === 0 && (
        <HomeMiddle
          data={currentPlan}
          setSelectedIndex={setSelectedIndex}
          img={currentPlan?.image}
          currentPlan={currentPlan}
        />
      )}
      {selectedIndex === 1 && (
        <View>
          <MiddleStart />
          <Button
            onPress={() => navigation.navigate('packageNavigator')}
            title={i18n.t('seeAll')}
            icon={{
              name: 'dumbbell',
              type: 'font-awesome-5',
              size: 15,
              color: 'white',
            }}
            iconRight
            iconContainerStyle={{ marginLeft: 10 }}
            titleStyle={{ fontWeight: '700' }}
            buttonStyle={{
              backgroundColor: theme.colors.secondary,
              borderColor: 'transparent',
              borderWidth: 0,
              borderRadius: 30,
            }}
            containerStyle={{
              margin: 10,
            }}
          />
          <CategoryList data={woroutCategories} view={false} />
        </View>
      )}
    </View>
  );
}

export default HomeTop;
