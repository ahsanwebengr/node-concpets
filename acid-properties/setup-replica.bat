@echo off
echo Initializing MongoDB Replica Set...
echo.

echo Connecting to MongoDB and initializing replica set...
mongosh --eval "rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'localhost:27017'}]})"

echo.
echo Replica set initialized! MongoDB is now ready for ACID transactions.
echo You can now run: npm start
pause