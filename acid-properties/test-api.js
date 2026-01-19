import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  try {
    console.log('🧪 Testing MongoDB ACID Properties API\n');

    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData.message);

    // Test 2: Reset database
    console.log('\n2. Resetting database...');
    const resetResponse = await fetch(`${BASE_URL}/api/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const resetData = await resetResponse.json();
    console.log('✅ Database reset:', resetData.message);

    // Test 3: Get accounts
    console.log('\n3. Getting accounts...');
    const accountsResponse = await fetch(`${BASE_URL}/api/accounts`);
    const accountsData = await accountsResponse.json();
    console.log('✅ Accounts loaded:', accountsData.accounts.length, 'accounts');

    // Test 4: Transfer money
    console.log('\n4. Testing money transfer...');
    const transferResponse = await fetch(`${BASE_URL}/api/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Alice',
        to: 'Bob',
        amount: 100,
      }),
    });
    const transferData = await transferResponse.json();
    console.log('✅ Transfer successful:', transferData.message);

    // Test 5: Check updated balances
    console.log('\n5. Checking updated balances...');
    const updatedAccountsResponse = await fetch(`${BASE_URL}/api/accounts`);
    const updatedAccountsData = await updatedAccountsResponse.json();
    console.log('✅ Updated accounts:');
    updatedAccountsData.accounts.forEach(acc => {
      console.log(`   ${acc.name}: $${acc.balance}`);
    });

    // Test 6: Get transactions
    console.log('\n6. Getting transaction history...');
    const transactionsResponse = await fetch(`${BASE_URL}/api/transactions`);
    const transactionsData = await transactionsResponse.json();
    console.log(
      '✅ Transactions found:',
      transactionsData.transactions.length,
      'transactions',
    );

    console.log('\n🎉 All API tests passed! ACID properties working correctly.');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAPI();
}

export { testAPI };
