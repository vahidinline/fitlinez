const checkFreeTrial = (userAuth) => {
  const { date } = userAuth;
  //console.log('userAuth', userAuth);
  const today = new Date();
  const start = new Date(date);
  const diffTime = Math.abs(today - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const daysLeft = 14 - diffDays;

  const result = daysLeft > 0 ? true : false;

  return result;
};
export default checkFreeTrial;
