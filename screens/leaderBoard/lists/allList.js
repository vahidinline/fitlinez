import { Text, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { IconMedal } from '../../marketplace/filters/icons';

const ListItems = ({ user, index }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <View style={styles.item} key={user.id}>
        <View style={styles.itemLeft}>
          <Text style={styles.itemText}>{user.rank} - </Text>
          <Text style={styles.itemText}>{user.userName}</Text>
        </View>
        <View style={styles.itemRight}>
          <IconMedal />
          <Text style={styles.itemText}>{user.point}</Text>
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      marginHorizontal: 10,
      backgroundColor: theme.colors.background,
      marginBottom: 10,
    },
    itemRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    container: {
      width: '100%',
    },

    itemText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
    },
  });

export default ListItems;
