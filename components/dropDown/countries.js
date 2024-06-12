import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { I18n } from 'i18n-js';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import Countries from '../../data/Countries';

const DropdownCountries = ({
  setLocation,
  containerStyle,
  iconStyle,
  textStyle,
}) => {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [value, setValue] = useState(null);

  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text
          style={[
            styles.label,
            isFocus && { color: 'blue', fontFamily: 'Vazirmatn' },
          ]}>
          {i18n.t('selectCountry')}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }, textStyle]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={Countries}
        search
        maxHeight={300}
        labelField="name"
        valueField="emoji"
        placeholder={!isFocus ? ` ${i18n.t('selectCountry')}` : '...'}
        searchPlaceholder="Search..."
        placeholderStyle={{ fontFamily: 'Vazirmatn' }}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.name);
          setIsFocus(false);
          setLocation(item.name);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={[styles.icon, iconStyle]}
            color={isFocus ? 'blue' : 'black'}
            name="earth"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default DropdownCountries;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontFamily: 'Vazirmatn',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    fontFamily: 'Vazirmatn',
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white',
  },
  iconStyle: {
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
