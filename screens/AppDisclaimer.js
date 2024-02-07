import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AppDisclaimer() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>
        Before beginning any exercise program, including the exercises and
        assessments within Fitlinez app, it is recommended that you consult with
        a physician or other healthcare professional to determine if it's right
        for your needs.
      </Text>

      <Text style={styles.text}>
        This is especially true if you (or your family) have a history of high
        blood pressure or heart disease, or if you have ever experienced chest
        pain when exercising, smoke, have high cholesterol, or have a bone or
        joint problem that could be made worse by a change in physical activity.
        Do not start this fitness program if your physician or healthcare
        provider advises against it.
      </Text>

      <Text style={styles.text}>
        The exercises and assessments provided by Fitlinez app are for
        informational purposes only and are not intended as a substitute for
        consultation, evaluation, or treatment by a healthcare professional.
        Participating in the exercises and assessments within this app is at
        your own risk.
      </Text>

      <Text style={styles.text}>
        The creators, producers, participants, and distributors of Fitlinez app
        disclaim any liabilities or loss, personal or otherwise, in connection
        with the exercises and advice herein. If you experience faintness,
        dizziness, pain, or shortness of breath at any time while exercising,
        you should stop immediately.
      </Text>

      <Text style={styles.text}>
        By using Fitlinez app, you acknowledge and agree that you have read and
        understand this disclaimer and that you agree to be bound by its terms.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  text: {
    textAlign: 'justify',
    marginBottom: 15,
  },
});
