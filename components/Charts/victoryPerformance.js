import { Text, useTheme } from '@rneui/themed';
import React, { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';
import { VictoryPie, VictoryAnimation, VictoryLabel } from 'victory-native';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import { material } from './theme';

const VictoryPerformances = ({ finalValue, refs }) => {
  //console.log('finalValue', finalValue);
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const getData = (newPercent) => {
    return [
      { x: 1, y: newPercent },
      { x: 2, y: 100 - newPercent },
    ];
  };

  const [percent, setPercent] = useState(0);
  const [data, setData] = useState(getData(0));

  useEffect(() => {
    let newPercent = percent;
    const interval = setInterval(() => {
      if (newPercent < finalValue) {
        newPercent += finalValue - newPercent;
      } else {
        clearInterval(interval);
      }
      setData(getData(newPercent));
      setPercent(newPercent);
    }, 2000);

    return () => clearInterval(interval);
  }, [finalValue]);

  return (
    <View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <VictoryPie
          animate={{ duration: 1000 }}
          width={refs ? 150 : 350}
          height={refs ? 150 : 350}
          data={data}
          theme={material}
          innerRadius={refs ? 40 : 100}
          labels={() => null}
          cornerRadius={5}
          style={{
            data: {
              fill: ({ datum }) => {
                const color = datum.y > 51 ? 'green' : 'red';
                return datum.x === 1 ? color : 'transparent';
              },
            },
          }}
        />
        <Text
          style={{
            fontSize: refs ? 10 : 15,
            fontWeight: 'bold',
            position: 'absolute',
            top: refs ? 55 : 130,
            backgroundColor: 'transparent',
            color: refs ? theme.colors.white : theme.colors.secondary,
          }}>
          {i18n.t('myPerformance')}
        </Text>
        <Text
          style={{
            fontSize: refs ? 10 : 30,
            fontWeight: 'bold',
            position: 'absolute',
            backgroundColor: 'transparent',
            color: refs ? theme.colors.white : theme.colors.secondary,
          }}>
          {`${percent.toFixed(2)}%`}
        </Text>
      </View>
    </View>
  );
};

export default VictoryPerformances;
