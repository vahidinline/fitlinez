import * as Notifications from 'expo-notifications';
import api from './api';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('messages.db');

async function schedulePushNotification({ title, body, data }) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: { seconds: 2 }, // Change the trigger time as needed
  });
}

const fetchMessageIds = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT _id FROM messages`,
        [],
        (_, resultSet) => {
          const ids = resultSet.rows._array.map((row) => row._id);
          resolve(ids);
        },
        (_, error) => reject(error)
      );
    });
  });
};

const fetchMessages = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM messages WHERE isDeleted = 0`,
        [],
        (_, resultSet) => {
          const messages = resultSet.rows._array;
          resolve(messages);
        },
        (_, error) => reject(error)
      );
    });
  });
};

const setupDatabaseAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS messages 
            (_id TEXT PRIMARY KEY, title TEXT, text TEXT, createdAt TEXT, sender TEXT, image TEXT, isRead INTEGER, isDeleted INTEGER);`,
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

const insertMessages = async (messages) => {
  const existingIds = await fetchMessageIds();
  const newMessages = messages.filter(
    (message) => !existingIds.includes(message._id)
  );

  // Begin database transaction
  db.transaction((tx) => {
    newMessages.forEach((message) => {
      // Check again to ensure _id does not exist before inserting
      if (!existingIds.includes(message._id)) {
        tx.executeSql(
          `INSERT INTO messages (_id, title, text, createdAt, sender, image, isRead, isDeleted) VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
          [
            message._id,
            message.title,
            message.text,
            message.createdAt,
            message.sender,
            message.image,
            0,
            0,
          ]
        );
      }
      schedulePushNotification({
        title: message.title,
        body: message.text,
      });
    });
  });
};

const markMessageAsRead = (_id) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(`UPDATE messages SET isRead = 1 WHERE _id = ?`, [_id]);
      return true;
    });
  } catch (error) {
    return false;
  }
};

const markMessageAsDeleted = (_id) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(`UPDATE messages SET isDeleted = 1 WHERE _id = ?`, [_id]);
      return true;
    });
  } catch (error) {
    return false;
  }
};

const deleteTable = (tableName) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(`DROP TABLE IF EXISTS ${tableName};`);
    });
  } catch (error) {}
};

const syncMessages = async () => {
  setupDatabaseAsync();

  try {
    const response = await api.get('/message');
    const apiMessages = response.data;
    const title = apiMessages[0]?.title;
    const body = apiMessages[0]?.text;
    //const localMessages = await fetchMessageIds();
    await insertMessages(apiMessages);

    //console.log('apiMessages', apiMessages);
  } catch (error) {
    console.error('Error syncing messages:', error);
  }
};

export {
  schedulePushNotification,
  syncMessages,
  fetchMessageIds,
  fetchMessages,
  markMessageAsRead,
  markMessageAsDeleted,
  deleteTable,
};
