import { Text } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import React from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import convertToPersianNumbers from '../../api/PersianNumber';

function NutritionChart({
  fatPercentage,
  proteinPercentage,
  carbsPercentage,
  fatGrams,
  proteinGrams,
  carbsGrams,
  dailyCalories,
  i18n,
  RTL,
}) {
  const pieData = [
    { value: fatPercentage, color: '#177AD5', text: fatGrams },
    { value: proteinPercentage, color: '#79D2DE', text: proteinGrams },
    { value: carbsPercentage, color: '#ED6665', text: carbsGrams },
  ];
  const { theme } = useTheme();
  const renderDot = (color) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const renderLegendComponent = () => {
    return (
      <View
        style={{
          backgroundColor: theme.colors.primary,
          borderRadius: 10,
          padding: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 10,
            //backgroundColor: theme.colors.primary,
          }}>
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20,
            }}>
            {renderDot('#006DFF')}
            <Text style={{ color: 'white' }}>
              {i18n.t('dailyCalories')}: {dailyCalories}
            </Text>
          </View> */}
          <View
            style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
            {renderDot('#8F80F3')}
            <Text style={{ color: theme.colors.secondary }}>
              {i18n.t('fats')}: {fatGrams} g
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20,
            }}>
            {renderDot('#3BE9DE')}
            <Text style={{ color: theme.colors.secondary }}>
              {' '}
              {i18n.t('carbs')}: {carbsGrams} g
            </Text>
          </View>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
            {renderDot('#FF7F97')}
            <Text style={{ color: theme.colors.secondary }}>
              {' '}
              {i18n.t('protein')}: {proteinGrams} g
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        paddingVertical: 10,
        // backgroundColor: '#34448B',
        flex: 1,
      }}>
      <View
        style={{
          //margin: 20,
          // padding: 16,
          borderRadius: 20,
          // backgroundColor: '#232B5D',
        }}>
        {/* {renderLegendComponent()} */}
        <View style={{ padding: 0, alignItems: 'center' }}>
          <PieChart
            data={pieData}
            donut
            showGradient
            sectionAutoFocus
            radius={60}
            innerRadius={60}
            innerCircleColor={'transparent'}
            centerLabelComponent={() => {
              return (
                <View
                  style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: 22,
                      color: '#000',
                      fontFamily: 'Vazirmatn',
                    }}>
                    {convertToPersianNumbers(dailyCalories, RTL)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#000',
                      fontFamily: 'Vazirmatn',
                    }}>
                    {i18n.t('dailyCalories')}
                  </Text>
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default NutritionChart;
