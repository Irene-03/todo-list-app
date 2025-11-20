// MongoDB Initialization Script
// Creates default database and collections

db = db.getSiblingDB('todo-app');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'email', 'password'],
      properties: {
        username: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 30,
          description: 'Username must be 3-30 characters'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'Must be a valid email address'
        },
        password: {
          bsonType: 'string',
          description: 'Hashed password'
        },
        role: {
          enum: ['user', 'admin'],
          description: 'User role'
        }
      }
    }
  }
});

db.createCollection('todos', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['text', 'userId'],
      properties: {
        text: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 500,
          description: 'Task text'
        },
        userId: {
          bsonType: 'objectId',
          description: 'Reference to user'
        },
        done: {
          bsonType: 'bool',
          description: 'Completion status'
        },
        important: {
          bsonType: 'bool',
          description: 'Important flag'
        },
        priority: {
          enum: ['low', 'normal', 'high'],
          description: 'Priority level'
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.todos.createIndex({ userId: 1, done: 1 });
db.todos.createIndex({ userId: 1, important: 1 });
db.todos.createIndex({ userId: 1, dueDate: 1 });

print('✅ Database initialized successfully!');
