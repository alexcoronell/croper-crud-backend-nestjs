# 🌱 Database Seeding Script

This script populates the Croper Management API database with initial test data.

## 📦 What it creates

- **1 Admin User**
  - Username: `admin`
  - Password: `admin12345`
  - Email: `admin@croper.com`
  - Role: `admin`

- **10 Customer Users**
  - Generated with realistic fake data
  - Password: `Password123!` (for all)
  - Role: `customer`

- **50 Products**
  - Various categories (Grains, Tools, Seeds, Livestock, Fertilizers, Pesticides)
  - Random prices between $10 and $500
  - Random stock between 50 and 1000 units

## 🚀 Usage

### Prerequisites

1. **MongoDB must be running**
   ```bash
   docker-compose up -d
   ```

2. **API server must be running**
   ```bash
   pnpm run start:dev
   ```

### Run the seeding script

From the project root:

```bash
# Using npm script (recommended)
pnpm run seed

# Or directly with node
node scripts/seed-database.js
```

## 📋 Output Example

```
🌱 Starting database seeding...

📋 Step 1: Creating admin user...
✓ Created user: admin (admin)

📋 Step 2: Creating 10 customer users...
✓ Created user: johndoe123 (customer)
✓ Created user: janesmith456 (customer)
✓ Created user: michaelbrown789 (customer)
...

📋 Step 3: Logging in as admin...
✓ Logged in as: admin

📋 Step 4: Creating 50 products...
✓ Created product: Premium Wheat
✓ Created product: Organic Corn
✓ Created product: Fresh Rice
...

✅ Database seeding completed successfully!

📊 Summary:
   - 1 Admin user created
   - 10 Customer users created
   - 50 Products created

🔐 Admin credentials:
   Username: admin
   Password: admin12345

💡 You can now login at: http://localhost:3000/docs
```

## 🔧 Configuration

You can modify the script to customize:

- Number of users/products
- Admin credentials
- Product categories
- Data generation logic

Edit `scripts/seed-database.js` and adjust the constants at the top of the file.

## ⚠️ Important Notes

- **Idempotent**: Running the script multiple times is safe. Existing users will be skipped.
- **Clean Database**: For a fresh start, drop the database before seeding:
  ```bash
  # Connect to MongoDB
  mongosh mongodb://localhost:27017/croper_db
  
  # Drop the database
  db.dropDatabase()
  
  # Exit
  exit
  ```

## 🐛 Troubleshooting

### Error: "ECONNREFUSED"
- Make sure MongoDB is running: `docker-compose up -d`
- Check MongoDB is accessible: `mongosh mongodb://localhost:27017`

### Error: "Failed to login"
- Ensure the API server is running: `pnpm run start:dev`
- Check the API is accessible: `curl http://localhost:3000/api/v1`

### Error: "User already exists"
- This is normal if you've run the script before
- The script will skip existing users and continue

## 📝 Technical Details

- **Pure JavaScript**: No external dependencies required
- **HTTP Client**: Uses Node.js built-in `http` module
- **Data Generation**: Custom faker-like generators
- **Error Handling**: Comprehensive error messages and recovery

## 🔗 Related

- [Main README](../README.md)
- [API Documentation](http://localhost:3000/docs)
- [MongoDB Express UI](http://localhost:8081)
