import { Button, Chip, Text } from '@rneui/themed';
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';

const UserLevelSelector = () => {
  const [answers, setAnswers] = useState([]);

  const handleAnswerSelection = (questionIndex, answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = answer;
    setAnswers(updatedAnswers);
  };

  const Question = ({ question, answers, questionIndex }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const handleSelect = (answer) => {
      setSelectedAnswer(answer);
      handleAnswerSelection(questionIndex, answer);
    };

    return (
      <SafeAreaView>
        <Text>{question}</Text>
        {answers.map((answer, index) => (
          <Chip
            key={index}
            icon={selectedAnswer === answer ? 'check' : 'close'}
            selected={selectedAnswer === answer}
            onPress={() => handleSelect(answer)}>
            {answer}
          </Chip>
        ))}
      </SafeAreaView>
    );
  };

  return (
    <View>
      <Question
        question="What is your primary fitness goal?"
        answers={[
          'Weight loss',
          'Muscle building',
          'Improving cardiovascular endurance',
          'General fitness',
        ]}
        questionIndex={0}
      />

      <Question
        question="How many days per week are you willing to commit to your workouts?"
        answers={['1-2 days', '3-4 days', '5-6 days', '7 days']}
        questionIndex={1}
      />

      <Question
        question="Do you have any equipment available for your workouts?"
        answers={[
          'Yes, I have access to a fully equipped gym',
          'Yes, I have some basic equipment at home',
          'No, I prefer bodyweight exercises only',
        ]}
        questionIndex={2}
      />

      <Question
        question="Are there any specific areas of your body that you would like to focus on?"
        answers={[
          'Upper body (arms, chest, back)',
          'Lower body (legs, glutes)',
          'Core (abs, obliques)',
          'Full body (total body workout)',
        ]}
        questionIndex={3}
      />

      <Question
        question="Do you have any physical limitations, injuries, or health conditions that we should consider when designing your workout plan?"
        answers={[
          "No, I don't have any limitations or health conditions",
          'Yes, I have a previous injury that requires modifications',
          'Yes, I have a specific health condition that requires specialized exercises',
        ]}
        questionIndex={4}
      />

      <Question
        question="How much time can you allocate for each workout session?"
        answers={[
          '15-30 minutes',
          '30-45 minutes',
          '45-60 minutes',
          'More than 60 minutes',
        ]}
        questionIndex={5}
      />

      {/* <Button onPress={() => console.log(answers)}>Submit</Button> */}
    </View>
  );
};

export default UserLevelSelector;
