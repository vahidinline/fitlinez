// import Realm from 'realm';
// import axios from 'axios';

// const ITEM_SCHEMA = 'Workout';

// const WorkoutSchema = {
//   name: 'Workout',
//   properties: {
//     _id: 'string',
//     active: 'bool',
//     day: 'string',
//     img: 'string',
//     name: 'string',
//     __v: 'int',
//   },
//   primaryKey: '_id',
// };

// const databaseOptions = {
//   path: 'myapp.realm',
//   schema: [WorkoutSchema],
//   schemaVersion: 0,
// };

// export const fetchAndStoreData = async () => {
//   try {
//     const realm = await Realm.open(databaseOptions);
//     console.log('Realm opened', realm);
//     realm.write(() => {
//       console.log('Realm write');
//       data.forEach((item) => {
//         realm.create(
//           'Workout',
//           {
//             _id: item._id,
//             active: item.active === 'true',
//             day: item.day,
//             img: item.img,
//             name: item.name,
//             __v: item.__v,
//           },
//           true
//         );
//       });
//     });
//     console.log('Data stored successfully!');
//   } catch (error) {
//     console.log('Error storing data: ', error);
//   }
// };
