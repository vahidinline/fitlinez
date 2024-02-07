import { ButtonGroup, Tab, TabView, useTheme } from '@rneui/themed';
import React, { useContext, useState } from 'react';
import LineChartWeight from '../../components/Charts/LineChart';
import { Dimensions, SafeAreaView, View } from 'react-native';
import BarChartWeight from '../../components/Charts/weightBar';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import LanguageContext from '../../api/langcontext';
import PerformanceChart from '../../components/Charts/performance';

function StatisticsIndex() {
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        paddingTop: 100,
        // heiTopght: Dimensions.get('window').height / 2.5,
      }}>
      <ButtonGroup
        buttonContainerStyle={{
          backgroundColor: theme.colors.background,
          borderColor: 'transparent',
          borderWidth: 0,
        }}
        selectedButtonStyle={{
          backgroundColor: theme.colors.background,
          borderColor: 'transparent',
          borderWidth: 3,
          borderBottomColor: theme.colors.secondary,
          borderTopEndRadius: 10,
          borderTopStartRadius: 10,
        }}
        innerBorderStyle={{}}
        textStyle={{
          color: theme.colors.grey0,
          fontWeight: '500',
          fontSize: 14,
          backgroundColor: theme.colors.background,
        }}
        selectedTextStyle={{
          color: theme.colors.secondary,
          fontWeight: '500',
          fontSize: 14,
          backgroundColor: theme.colors.background,
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

export default StatisticsIndex;
