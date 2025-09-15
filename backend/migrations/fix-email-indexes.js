import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixEmailIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/innoverse');
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Check if users collection exists
    const collections = await db.listCollections({ name: 'users' }).toArray();
    if (collections.length === 0) {
      console.log('ℹ️ Users collection does not exist yet. It will be created when first user is added.');
      return;
    }

    const collection = db.collection('users');

    // Get existing indexes
    const indexes = await collection.indexes();
    console.log('📋 Current indexes:', indexes.map(idx => idx.key));

    // Drop the simple email index if it exists
    try {
      await collection.dropIndex('email_1');
      console.log('✅ Dropped simple email index');
    } catch (error) {
      console.log('ℹ️ Simple email index not found (already dropped)');
    }

    // Ensure compound index exists
    try {
      await collection.createIndex(
        { email: 1, role: 1 }, 
        { 
          unique: true, 
          name: 'email_1_role_1_compound' 
        }
      );
      console.log('✅ Created compound email+role unique index');
    } catch (error) {
      console.log('ℹ️ Compound index already exists');
    }

    // Verify final indexes
    const finalIndexes = await collection.indexes();
    console.log('📋 Final indexes:', finalIndexes.map(idx => ({ key: idx.key, unique: idx.unique })));

    console.log('✅ Email index migration completed successfully');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the migration
fixEmailIndexes();