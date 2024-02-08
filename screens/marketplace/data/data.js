import { IconPremium, IconVerify } from '../filters/icons';

const duration = [
  {
    id: 1,
    name: '1 Month',
  },
  {
    id: 2,
    name: '3 Months',
  },
  {
    id: 3,
    name: '6 Months',
  },
  {
    id: 4,
    name: '1 Year',
  },
];
const targget = [
  {
    id: 1,
    name: 'all',
  },
  {
    id: 6,
    name: 'Core',
  },
  {
    id: 2,
    name: 'Upper Body',
  },
  {
    id: 3,
    name: 'Lower Body',
  },
  {
    id: 4,
    name: 'Full Body',
  },
];
const level = [
  {
    id: 1,
    name: 'all',
  },
  {
    id: 2,
    name: 'Beginner',
  },
  {
    id: 3,
    name: 'Intermediate',
  },
];
const days = [
  {
    id: 1,
    name: 'all',
  },
  {
    id: 2,
    name: '3 Days',
  },
  {
    id: 3,
    name: '4 Days',
  },
  {
    id: 4,
    name: '5 Days',
  },
];
const rate = [
  {
    id: 1,
    name: 'all',
  },
  {
    id: 2,
    name: '3',
  },
  {
    id: 3,
    name: '4',
  },
  {
    id: 4,
    name: '5',
  },
];
const status = [
  {
    id: 1,
    name: 'all',
  },
  {
    id: 2,
    name: 'Free',
    icon: <IconVerify />,
  },
  {
    id: 3,
    name: 'Premium',
    icon: <IconPremium />,
  },
];

const trainersList = [
  { id: 1, name: 'Trainer 1', img: 'https://picsum.photos/200/300' },
  { id: 2, name: 'Trainer 2', img: 'https://picsum.photos/200/300' },
  { id: 3, name: 'Trainer 3', img: 'https://picsum.photos/200/300' },
  { id: 4, name: 'Trainer 4', img: 'https://picsum.photos/200/300' },
  { id: 5, name: 'Trainer 5', img: 'https://picsum.photos/200/300' },
  { id: 6, name: 'Trainer 6', img: 'https://picsum.photos/200/300' },
  { id: 7, name: 'Trainer 7', img: 'https://picsum.photos/200/300' },
  { id: 8, name: 'Trainer 8', img: 'https://picsum.photos/200/300' },
];

const location = [
  {
    id: 1,
    name: 'all',
  },

  {
    id: 2,
    name: 'Gym',
  },
  {
    id: 3,
    name: 'Home',
  },
];

export { duration, targget, level, days, rate, status, trainersList, location };
