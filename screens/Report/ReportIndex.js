import React, { useEffect } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Text, useTheme } from '@rneui/themed';
import { useState } from 'react';
import Header from '../../components/header';
import { DataTable } from 'react-native-paper';
import LanguageContext from '../../api/langcontext';
import { useContext } from 'react';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import getAllWorkoutHistory from '../../api/getAllHistory';
import { userWorkoutHistory } from '../../api/workoutSessionTracker';
import AuthContext from '../../api/context';

function ReportIndex() {
  const [userHisoricalData, setUserHistoricalData] = useState([]);
  //console.log('userHisoricalData', userHisoricalData);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([4, 6, 10]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  const { userLanguage } = useContext(LanguageContext);
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, userHisoricalData.length);
  const { theme } = useTheme();
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
  };

  const handleHistoryData = async () => {
    const res = await userWorkoutHistory(userId);
    if (res) {
      setUserHistoricalData(res);
    }
    //
  };

  useEffect(() => {
    handleHistoryData();
    getAllWorkoutHistory()
      .then((result) => {
        setUserHistoricalData(result.rows._array);
      })
      .catch((error) => {
        // Handle the error
        return [];
      });
  }, []);
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
      }}>
      <View
        style={{
          //flex: 1,
          height: '100%',
          backgroundColor: theme.colors.background,
          //justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Header title={i18n.t('history')} />

        <DataTable
          style={{
            backgroundColor: theme.colors.background,
          }}>
          <DataTable.Header>
            <DataTable.Title>{i18n.t('exercices')}</DataTable.Title>
            <DataTable.Title numeric>
              {i18n.t('weight')} * {i18n.t('reps')}
            </DataTable.Title>

            <DataTable.Title numeric>{i18n.t('date')}</DataTable.Title>
          </DataTable.Header>

          {userHisoricalData.slice(from, to).map((item) => (
            <DataTable.Row key={item.id}>
              <DataTable.Cell>{item.title}</DataTable.Cell>
              <DataTable.Cell numeric>
                {item.weight}*{item.weight}
              </DataTable.Cell>

              <DataTable.Cell numeric>
                {formatDate(item.timestamp)}
              </DataTable.Cell>
            </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(userHisoricalData.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${userHisoricalData.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel={'Rows per page'}
          />
        </DataTable>
      </View>
    </SafeAreaView>
  );
}

export default ReportIndex;
