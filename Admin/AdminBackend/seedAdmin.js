const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Admin = require('./models/admin');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Create initial admins
const createAdmins = async () => {
    const adminsData = [
        { username: 'admin1', password: 'admin123' },
        { username: 'admin2', password: 'admin456' },
        { username: 'admin3', password: 'admin789' }
    ];

    try {
        for (let adminData of adminsData) {
            // Hash the password for each admin
            adminData.password = bcrypt.hashSync(adminData.password, 10);

            // Check if the admin already exists in the database to avoid duplicates
            const existingAdmin = await Admin.findOne({ username: adminData.username });
            if (!existingAdmin) {
                const admin = new Admin(adminData);
                await admin.save();
                console.log(`Admin ${adminData.username} created successfully`);
            } else {
                console.log(`Admin ${adminData.username} already exists`);
            }
        }
    } catch (error) {
        console.error('Error creating admins:', error);
    } finally {
        mongoose.connection.close();
    }
};

createAdmins();
