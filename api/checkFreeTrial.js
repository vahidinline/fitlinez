const checkFreeTrial = (userAuth) => {
  if (!userAuth || !userAuth.date) {
    // Handle the case when userAuth is null or date is undefined
    return false;
  }
  const { date } = userAuth;
  //console.log('userAuth', userAuth);
  const today = new Date();
  const start = new Date(date);
  if (isNaN(start.getTime())) {
    // Handle the case when the date parsing fails
    return false;
  }
  const diffTime = Math.abs(today - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const daysLeft = 14 - diffDays;

  const result = daysLeft > 0 ? true : false;
  // console.log('daysLeft', daysLeft);
  return result;
};
export default checkFreeTrial;
