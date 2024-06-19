// util/numberConverter.js

const convertToPersianNumbers = (number, RTL) => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  if (RTL) {
    return number.toString().replace(/\d/g, (digit) => persianNumbers[digit]);
  } else {
    return number;
  }
};

export default convertToPersianNumbers;
