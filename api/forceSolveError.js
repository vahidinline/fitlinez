import * as Updates from 'expo-updates';
import Bugsnag from '@bugsnag/expo';

/**
 * Function to forcefully handle and solve errors by reloading the app.
 * @param {Function} resetUserAuth - Function to reset user authentication state.
 */
export const forceSolveError = async (resetUserAuth) => {
  try {
    // Optionally, you can perform any clean-up actions here, such as resetting user state
    if (resetUserAuth) {
      resetUserAuth(null); // Reset user authentication state
    }

    // Log the error handling action (if needed)
    Bugsnag.notify(new Error('Force solve error initiated, app will reload.'));

    // Attempt to reload the app
    await Updates.reloadAsync();
  } catch (error) {
    console.error('Failed to reload the app:', error);
    // Notify Bugsnag about the failure
    Bugsnag.notify(error);
    // Optionally, display an error message or take another action
  }
};
