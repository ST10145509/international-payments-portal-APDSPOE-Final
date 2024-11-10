import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const employees = [
  {
    fullName: 'John Smith',
    accountNumber: '9876543210',
    idNumber: '1234567890123',
    email: 'john.smith@bank.com',
    password: 'Employee123!',
    role: 'employee'
  },
  {
    fullName: 'Sarah Johnson',
    accountNumber: '9876543211',
    idNumber: '1234567890124',
    email: 'sarah.johnson@bank.com',
    password: 'Employee123!',
    role: 'employee'
  },
  {
    fullName: 'Michael Chen',
    accountNumber: '9876543212',
    idNumber: '1234567890125',
    email: 'michael.chen@bank.com',
    password: 'Employee123!',
    role: 'employee'
  },
  {
    fullName: 'Emma Williams',
    accountNumber: '9876543213',
    idNumber: '1234567890126',
    email: 'emma.williams@bank.com',
    password: 'Employee123!',
    role: 'employee'
  },
  {
    fullName: 'David Brown',
    accountNumber: '9876543214',
    idNumber: '1234567890127',
    email: 'david.brown@bank.com',
    password: 'Employee123!',
    role: 'employee'
  }
];

const seedEmployees = async () => {
  try {
    await connectDB();
    
    // Clear existing employees
    await User.deleteMany({ role: 'employee' });
    
    // Create employees
    await User.create(employees);
    
    console.log('Employees seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding employees:', error);
    process.exit(1);
  }
};

seedEmployees();
