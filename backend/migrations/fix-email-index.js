import mongoose from 'mongoose';
import User from '../src/models/user.model.js';

async function fixEmailIndex() {
  try {
    console.log('🔧 Starting email index migration...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/innoverse';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Drop the conflicting email index if it exists
    try {
      await User.collection.dropIndex('email_1');
      console.log('✅ Dropped email_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️ email_1 index does not exist, skipping...');
      } else {
        console.log('⚠️ Error dropping email_1 index:', error.message);
      }
    }

    // Ensure compound index exists
    try {
      await User.collection.createIndex(
        { email: 1, role: 1 }, 
        { unique: true, name: 'email_role_unique' }
      );
      console.log('✅ Created compound unique index: email_role_unique');
    } catch (error) {
      if (error.code === 85) {
        console.log('ℹ️ Compound index already exists');
      } else {
        console.log('⚠️ Error creating compound index:', error.message);
      }
    }

    // List current indexes
    const indexes = await User.collection.indexes();
    console.log('📋 Current indexes:');
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('✅ Email index migration completed successfully');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixEmailIndex()
    .then(() => {
      console.log('🎉 Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export default fixEmailIndex;