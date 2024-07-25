// const initDB = () => {
//   db.transaction(
//     (tx) => {
//       tx.executeSql(
//         'CREATE TABLE IF NOT EXISTS totalWeight (id INTEGER PRIMARY KEY AUTOINCREMENT, weight REAL, reps INTEGER, category TEXT, exerciseId INTEGER, totalWeight REAL, title TEXT, itemIndex INTEGER,  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);'
//       );

//       // Add similar statements for other tables here.
//     },
//     (error) => {
//       console.log('Transaction error during table creation:', error);
//     },
//     () => {
//       //console.log('Tables created successfully');
//     }
//   );
// };

// db.transaction((tx) => {
//   tx.executeSql(
//     "SELECT name FROM sqlite_master WHERE type='table';",
//     [],
//     (_, { rows }) => {
//       //console.log('Tables:', JSON.stringify(rows));
//       const tables = [];
//       for (let i = 0; i < rows.length; i++) {
//         tables.push(rows.item(i).name);
//       }
//       //console.log('Table names:', tables);
//     }
//   );
// });

// export default initDB;
