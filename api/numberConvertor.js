const convertPersianToArabicNumbers = (input) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let output = '';

  for (let i = 0; i < input.length; i++) {
    const index = persianDigits.indexOf(input[i]);
    if (index >= 0) {
      output += arabicDigits[index];
    } else {
      output += input[i];
    }
  }

  return output;
};

export default convertPersianToArabicNumbers;
