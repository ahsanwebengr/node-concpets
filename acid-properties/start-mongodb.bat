@echo off
echo Setting up MongoDB Replica Set for ACID Transactions...
echo.

echo Step 1: Starting MongoDB as single-node replica set...
mongod --config mongod.conf

echo.
echo MongoDB started. Now open a new terminal and run: setup-replica.bat
pause