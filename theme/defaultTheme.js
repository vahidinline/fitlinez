import { createTheme } from '@rneui/themed';

const DefaultTheme = createTheme({
  name: 'default',
  colors: {
    secondBackground: '#FFF3DA',
    success: '#228B22',
    background: '#FCF8FF',
    warning: '#FFA500',
    error: '#FF0000',
    button: '#5B5891',
    searchBackground: '#F0ECF4',
    secondary2: '#E4DFF9',
    buttonBackground: '#EBE7EF',
    disabled: '#F6F2FA',
    border: '#C8C5D0',
    secondary: '#5B5891',
    primary: '#f2f4f5',
    intermediatebg: '#C7E8ED',
    beginnerbg: '#D5F0B1',
    intermediateText: '#09596B',
    beginnerText: '#2E5C0E',

    text: '#47464F',
    lightPrimary: '#E3DFFF',
    grey: '#787680',
    grey0: '#43484d',
    grey2: '#5e6977',
    grey3: '#e5e5e5',
    white: '#fff',
    black: '#000',
    green: '#228B22',
    blue: '#0000FF',
    yellow: '#3E3B6C',
    orange: '#FFA500',
    purple: '#800080',
    pink: '#FFC0CB',
    brown: '#A52A2A',
    gold: '#FEA800',
  },

  Button: {
    titleStyle: {
      color: 'blue',
    },
  },
});

const SecondTheme = createTheme({
  name: 'second',
  colors: {
    secondary: '#3e3b6c',
    primary: '#696c3b',
    grey: '#D3D3D3',
    white: '#fff',
    black: '#000',
    red: '#FF0000',
    green: '#00FF00',
    blue: '#0000FF',
    yellow: '#3E3B6C',
    orange: '#FFA500',
    purple: '#800080',
    pink: '#FFC0CB',
    brown: '#A52A2A',
  },

  Button: {
    titleStyle: {
      color: 'red',
    },
  },
});

export { SecondTheme, DefaultTheme };
