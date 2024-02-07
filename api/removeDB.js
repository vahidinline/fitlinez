const dropDatabases = (name) => {
  console.log('dropDatabases', name);
  const db = SQLite.openDatabase('name.db');

  db.transaction((tx) => {
    tx.executeSql(
      `DROP TABLE IF EXISTS ${name}`,
      [],
      () => {
        alert(`Your plan has been reset`);
      },
      (error) => {
        alert(`Failed to drop database ${name}: ${error.message}`);
      }
    );
  });
};

export { dropDatabases };
