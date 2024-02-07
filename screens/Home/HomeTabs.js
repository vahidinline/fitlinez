import { ButtonGroup, Tab, TabView, useTheme } from '@rneui/themed';
import React, { useContext, useState } from 'react';
import LineChartWeight from '../../components/Charts/LineChart';
import { Dimensions, View } from 'react-native';
import BarChartWeight from '../../components/Charts/weightBar';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import LanguageContext from '../../api/langcontext';
import PerformanceChart from '../../components/Charts/performance';

function HomeTabs() {
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <View
      style={{
        height: Dimensions.get('window').height / 2.5,
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
        buttons={[`${i18n.t('weightChart')}`, `${i18n.t('performance')}`]}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          setSelectedIndex(value);
        }}
        containerStyle={{ marginBottom: 20, borderWidth: 0 }}
      />
      {selectedIndex === 0 && <BarChartWeight />}
      {selectedIndex === 1 && <PerformanceChart />}
    </View>
  );
}

export default HomeTabs;
