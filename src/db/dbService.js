import MSSQL from 'react-native-mssql';

const config = {
    server: '136.232.118.110', // e.g., '192.168.1.100' or a public IP
    port: 1433, // The TCP port your SQL server is listening on
    username: 'sa', // Note: react-native-mssql uses 'username' not 'user'
    password: 'topface',
    database: 'SARP',
    connectionTimeout: 15000, // 15 seconds to give up
    requestTimeout: 15000 // 15 seconds for a query to finish
};

// Helper function to run a query
export const runQuery = async (sqlQuery) => {
    try {
        // Establish connection
        const connection = await MSSQL.connect(config);

        if (connection) {
            console.log("Attempting query...");
            // Execute Query
            const result = await MSSQL.executeQuery(sqlQuery);

            // Always close connection when done to free up server resources
            await MSSQL.close();

            console.log("Query successful, connection closed.");
            return result;
        } else {
            throw new Error("Could not establish connection object");
        }
    } catch (error) {
        // Ensure connection is closed even if query fails
        try {
            await MSSQL.close();
        }
        catch (e) { /* ignore close error */ }

        console.error("Database Error:", error);
        throw error; // Re-throw so the UI component handles it
    }
};