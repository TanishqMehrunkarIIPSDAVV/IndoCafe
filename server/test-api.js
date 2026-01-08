import axios from 'axios';

const testBackend = async () => {
  try {
    const API_URL = 'http://localhost:5000/api';
    console.log('1. Testing Connection to ' + API_URL);

    // 1. Get Outlets
    console.log('\nFetching outlets...');
    const outletsRes = await axios.get(`${API_URL}/public/outlets`);
    if (!outletsRes.data.success || outletsRes.data.data.length === 0) {
      console.error('No outlets found or API failed');
      return;
    }
    const outlet = outletsRes.data.data[0];
    console.log(`Outlet found: ${outlet.name} (${outlet._id})`);

    // 2. Get Menu
    console.log(`\nFetching menu for outlet ${outlet._id}...`);
    const menuRes = await axios.get(`${API_URL}/public/menu/${outlet._id}`);
    const menuItems = menuRes.data.data;
    if (menuItems.length === 0) {
      console.error('No menu items found');
      // proceed anyway strictly for order test if we can mock one, but better to use real one
    }
    const menuItemId =
      menuItems.length > 0 ? menuItems[0]._id : '000000000000000000000000';
    console.log(`Menu Item used: ${menuItemId}`);

    // 3. Create Order
    console.log('\nCreating Test Order...');
    const orderPayload = {
      outletId: outlet._id,
      items: [
        {
          menuItem: menuItemId,
          quantity: 1,
          modifiers: [],
        },
      ],
      totalAmount: 100,
    };

    const orderRes = await axios.post(`${API_URL}/public/orders`, orderPayload);
    console.log('Order Response:', JSON.stringify(orderRes.data, null, 2));
  } catch (error) {
    console.error(
      'Test Failed:',
      error.response ? error.response.data : error.message
    );
  }
};

testBackend();
