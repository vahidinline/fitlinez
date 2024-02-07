import FitAlert from '../components/Alert';

const PremiumChecker = (userLevel, setVisible) => {
  // console.log('PremiumChecker -> userLevel', userLevel, setVisible);
  if (userLevel === 1) {
    //console.log('PremiumChecker -> userLevel', userLevel);
    setVisible(true);
    // return true;
  } else {
    //console.log('PremiumChecker -> userLevel', userLevel);
    setVisible(false);
    // return false;
  }
};

export default PremiumChecker;
