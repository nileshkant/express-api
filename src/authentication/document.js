import mongoose, { Schema } from 'mongoose';

/**
 * @example
 * {
 *   username: 'shyam-chen',
 *   password: '3345678',
 *   email: 'shyam.chen@gmail.com',
 *   role: 'user',
 *   permissions: [
 *     {
 *       route: '/foo',
 *       operations: ['create', 'read', 'update', 'delete'],
 *     },
 *     {
 *       route: '/bar',
 *       operations: ['read'],
 *     },
 *   ],
 * }
 */
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator(value) {
        return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(value);
      },
      message: ({ value }) => `${value} is not a valid email format`,
    },
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  permissions: [
    {
      route: String,
      operations: {
        type: [String],
        enum: ['create', 'read', 'update', 'delete'],
      },
    },
  ],
});

const accountType = new Schema({
  kind: {
    type: String,
    enum: ['internal', 'google', 'facebook'],
    default: 'internal'
  },
  uid: {
    type: String,
    required: function() { return this.kind !== 'internal'; }
  },
  password: {
    type: String,
    required: function() { return this.kind === 'internal'; }
  }
});

const userMultiAccountSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    validate: {
      validator(value) {
        return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(value);
      },
      message: ({ value }) => `${value} is not a valid email format`,
    },
    required: true,
    unique: true,
  },
  accounts: [accountType],
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  permissions: [
    {
      route: String,
      operations: {
        type: [String],
        enum: ['create', 'read', 'update', 'delete'],
      },
    },
  ],
});

export const MultiAccountUser = mongoose.model('MultiAccountUser', userMultiAccountSchema);

export const User = mongoose.model('User', userSchema);
