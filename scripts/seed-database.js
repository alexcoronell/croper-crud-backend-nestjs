/**
 * Database Seeding Script
 * 
 * This script populates the database with initial data:
 * - 1 Admin user (username: admin, password: admin12345)
 * - 10 Customer users with faker data
 * - 50 Products with faker data
 * 
 * Usage:
 *   node scripts/seed-database.js
 * 
 * Requirements:
 *   - MongoDB running on localhost:27017
 *   - API server running on localhost:3000
 */

const https = require('https');
const http = require('http');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1/';
const ADMIN_USER = {
    fullName: 'Administrator',
    username: 'admin',
    email: 'admin@croper.com',
    password: 'admin12345',
    role: 'admin'
};

// Faker-like data generators
const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Olivia', 'Robert', 'Sophia'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const productCategories = ['Grains', 'Tools', 'Seeds', 'Livestock', 'Fertilizers', 'Pesticides'];
const productAdjectives = ['Premium', 'Organic', 'Fresh', 'Quality', 'Natural', 'Certified', 'Professional', 'Advanced'];
const productTypes = ['Wheat', 'Corn', 'Rice', 'Barley', 'Oats', 'Soybean', 'Cotton', 'Tomato', 'Potato', 'Carrot'];

// Utility functions
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(array) {
    return array[randomInt(0, array.length - 1)];
}

function randomFloat(min, max, decimals = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateUsername(firstName, lastName) {
    return `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomInt(100, 999)}`;
}

function generateEmail(firstName, lastName) {
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
}

function generateCustomerUser() {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);

    return {
        fullName: `${firstName} ${lastName}`,
        username: generateUsername(firstName, lastName),
        email: generateEmail(firstName, lastName),
        password: 'Password123!',
        role: 'customer'
    };
}

function generateProduct() {
    const adjective = randomElement(productAdjectives);
    const type = randomElement(productTypes);
    const category = randomElement(productCategories);
    const uniqueId = randomInt(1000, 9999);

    return {
        name: `${adjective} ${type} #${uniqueId}`,
        description: `High-quality ${adjective.toLowerCase()} ${type.toLowerCase()} for agricultural use. Perfect for farming and cultivation.`,
        price: randomFloat(10, 500),
        stock: randomInt(50, 1000),
        category: category,
    };
}

// HTTP request helper with cookie support
let cookieJar = ''; // Store cookies between requests

function makeRequest(method, path, data = null, useCookies = false) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, API_BASE_URL);
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // Add cookies to request if we have them
        if (useCookies && cookieJar) {
            options.headers['Cookie'] = cookieJar;
        }

        const client = url.protocol === 'https:' ? https : http;

        const req = client.request(url, options, (res) => {
            let body = '';

            // Capture Set-Cookie headers
            if (res.headers['set-cookie']) {
                cookieJar = res.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');
            }

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    const response = body ? JSON.parse(body) : {};

                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(response);
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${response.message || body}`));
                    }
                } catch (error) {
                    reject(new Error(`Failed to parse response: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// Seeding functions
async function createUser(userData) {
    try {
        const response = await makeRequest('POST', 'user/register', userData);
        console.log(`✓ Created user: ${userData.username} (${userData.role})`);
        return response;
    } catch (error) {
        if (error.message.includes('already exists')) {
            console.log(`⚠ User ${userData.username} already exists, skipping...`);
            return null;
        }
        throw error;
    }
}

async function createBootstrapAdmin(userData) {
    try {
        const response = await makeRequest('POST', 'user/bootstrap-admin', userData);
        console.log(`✓ Created bootstrap admin: ${userData.username}`);
        return response;
    } catch (error) {
        if (error.message.includes('already exists')) {
            console.log(`⚠ Admin user already exists, skipping...`);
            return null;
        }
        throw error;
    }
}

async function loginUser(username, password) {
    try {
        const response = await makeRequest('POST', 'auth/login', { username, password }, false);
        console.log(`✓ Logged in as: ${username}`);
        return true; // Cookie is now stored in cookieJar
    } catch (error) {
        console.error(`✗ Failed to login as ${username}:`, error.message);
        throw error;
    }
}

async function createProduct(productData) {
    try {
        const response = await makeRequest('POST', 'product', productData, true); // Use cookies
        console.log(`✓ Created product: ${productData.name}`);
        return response;
    } catch (error) {
        console.error(`✗ Failed to create product ${productData.name}:`, error.message);
        throw error;
    }
}

// Main seeding function
async function seedDatabase() {
    console.log('\n🌱 Starting database seeding...\n');

    try {
        // Step 1: Create admin user using bootstrap endpoint
        console.log('📋 Step 1: Creating admin user...');
        await createBootstrapAdmin(ADMIN_USER);
        console.log('');

        // Step 2: Create customer users
        console.log('📋 Step 2: Creating 10 customer users...');
        const customerPromises = [];
        for (let i = 0; i < 10; i++) {
            const customerData = generateCustomerUser();
            customerPromises.push(createUser(customerData));
        }
        await Promise.all(customerPromises);
        console.log('');

        // Step 3: Login as admin to get cookie
        console.log('📋 Step 3: Logging in as admin...');
        await loginUser(ADMIN_USER.username, ADMIN_USER.password);
        console.log('');

        // Step 4: Create products using cookie authentication
        console.log('📋 Step 4: Creating 50 products...');
        const productPromises = [];
        for (let i = 0; i < 50; i++) {
            const productData = generateProduct();
            productPromises.push(createProduct(productData));
        }
        await Promise.all(productPromises);
        console.log('');

        // Summary
        console.log('✅ Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log('   - 1 Admin user created');
        console.log('   - 10 Customer users created');
        console.log('   - 50 Products created');
        console.log('\n🔐 Admin credentials:');
        console.log(`   Username: ${ADMIN_USER.username}`);
        console.log(`   Password: ${ADMIN_USER.password}`);
        console.log('\n💡 You can now login at: http://localhost:3000/docs\n');

    } catch (error) {
        console.error('\n❌ Seeding failed:', error.message);
        console.error('\n💡 Make sure:');
        console.error('   1. MongoDB is running (docker-compose up -d)');
        console.error('   2. API server is running (pnpm run start:dev)');
        console.error('   3. API is accessible at http://localhost:3000\n');
        process.exit(1);
    }
}

// Run the seeding
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase };
