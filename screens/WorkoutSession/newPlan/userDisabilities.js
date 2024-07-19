// import { useState } from 'react';
// import { SafeAreaView } from 'react-native';
// import { Chip } from '@rneui/themed';

// //create list of disabilities related to workout

// const UserLevelSelector = () => {
//   const [userLevels, setUserLevels] = useState(userLevel);

//   const handleSelect = (id) => {
//     const newLevels = userLevels.map((item) => {
//       if (item.id === id) {
//         return { ...item, selected: true };
//       }
//       return { ...item, selected: false };
//     });
//     setUserLevels(newLevels);
//   };

//   return (
//     <SafeAreaView>
//       {userLevels.map((item) => {
//         return (
//           <Chip
//             key={item.id}
//             icon={item.selected ? 'check' : 'close'}
//             selected={item.selected}
//             onPress={() => {
//               handleSelect(item.id);
//             }}>
//             {item.name}
//           </Chip>
//         );
//       })}
//     </SafeAreaView>
//   );
// };

// export default UserLevelSelector;

import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { Chip } from '@rneui/themed';

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
        <h3>{question}</h3>
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
    <div>
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

      {/* Add more Question components for the remaining questions */}

      <button onClick={() => console.log(answers)}>Submit</button>
    </div>
  );
};

export default UserLevelSelector;
