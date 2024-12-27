import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

type DBConnectionStatus = {
	isConnected: boolean;
};

const connectionStatus: DBConnectionStatus = {
	isConnected: false,
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error('DATABASE_URL is not defined in environment variables');
}

// Create the SQL client
const sql = neon(databaseUrl);

// Create the database instance
export const db = drizzle(sql);

// Function to check and log connection status
export function checkConnection() {
	if (connectionStatus.isConnected) {
		console.log('Database is already connected');
	} else {
		console.log('Connecting to the database...');
		connectionStatus.isConnected = true; // Marked as connected
	}
}

checkConnection();