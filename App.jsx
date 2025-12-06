// App.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { runQuery } from './src/db/dbService';

const App = () => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  // Function called when button is pressed
  const fetchDataDirectly = async () => {
    setLoading(true);
    setData([]);
    setColumns([]);
    try {
      const myQuery = "SELECT * FROM User_Master";

      console.log("Starting direct DB connection process...");
      const resultData = await runQuery(myQuery);

      console.log("Data received:", resultData);

      const finalData = resultData.recordset || resultData;

      if (finalData && finalData.length > 0) {
        // Extract column names from the first row
        const columnNames = Object.keys(finalData[0]);
        setColumns(columnNames);
      }

      setData(finalData);
    } catch (error) {
      Alert.alert("DB Error", error.message || "Failed to connect or query.");
    } finally {
      setLoading(false);
    }
  };

  // Render table header
  const renderTableHeader = () => {
    if (columns.length === 0) return null;
    return (
      <View style={styles.tableHeader}>
        {columns.map((col, index) => (
          <View key={index} style={styles.headerCell}>
            <Text style={styles.headerText}>{col}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Render each row
  const renderRow = ({ item, index }) => {
    const isEvenRow = index % 2 === 0;
    return (
      <View style={[styles.tableRow, isEvenRow ? styles.evenRow : styles.oddRow]}>
        {columns.map((col, colIndex) => (
          <View key={colIndex} style={styles.cell}>
            <Text style={styles.cellText} numberOfLines={2}>
              {item[col] !== null && item[col] !== undefined
                ? String(item[col])
                : '-'}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📊 User Master Table</Text>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={fetchDataDirectly}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Connecting...' : 'Fetch User Data'}
        </Text>
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4A90D9" />
          <Text style={styles.loaderText}>Fetching data from database...</Text>
        </View>
      )}

      {!isLoading && data.length > 0 && (
        <View style={styles.tableContainer}>
          <Text style={styles.resultCount}>
            Found {data.length} record{data.length !== 1 ? 's' : ''}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              {renderTableHeader()}
              <FlatList
                data={data}
                keyExtractor={(item, index) =>
                  item.id ? item.id.toString() : index.toString()
                }
                renderItem={renderRow}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </ScrollView>
        </View>
      )}

      {!isLoading && data.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>No data fetched yet</Text>
          <Text style={styles.emptySubtext}>
            Press the button above to fetch User_Master data
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#F5F7FA',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2C3E50',
  },
  button: {
    backgroundColor: '#4A90D9',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#A0C4E8',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loaderContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  loaderText: {
    marginTop: 10,
    color: '#7F8C8D',
    fontSize: 14,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  resultCount: {
    padding: 12,
    backgroundColor: '#E8F4FD',
    color: '#2980B9',
    fontWeight: '600',
    fontSize: 14,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#34495E',
    paddingVertical: 12,
  },
  headerCell: {
    width: 120,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  evenRow: {
    backgroundColor: '#FFFFFF',
  },
  oddRow: {
    backgroundColor: '#F8FAFB',
  },
  cell: {
    width: 120,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 13,
    color: '#2C3E50',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default App;