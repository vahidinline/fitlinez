import React from 'react';
import { render } from '@testing-library/react-native';
import WorkoutAgenda from './index.js';

// Mock the useContext hook to return a test language
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => ({ userLanguage: 'en' }),
}));

// Mock the useTheme hook to return a test theme
jest.mock('@rneui/themed', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        lightPrimary: '#000',
        background: '#fff',
        secondary: '#000',
        border: '#000',
        text: '#000',
        grey1: '#000',
      },
    },
  }),
}));

// Mock the useNavigation hook
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => jest.fn(),
}));

// Mock the Dimensions module
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Dimensions: {
    get: jest.fn().mockReturnValue({ height: 800, width: 375 }),
  },
}));

describe('WorkoutAgenda', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<WorkoutAgenda />);

    // Add your assertions here
  });
});
