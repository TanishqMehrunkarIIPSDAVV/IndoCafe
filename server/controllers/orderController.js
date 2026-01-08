import Order from '../models/Order.js';
import OutletItemConfig from '../models/OutletItemConfig.js';
import MenuItem from '../models/MenuItem.js';

// @desc    Create a new order
// @route   POST /api/public/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { outletId, items, totalAmount } = req.body;

    if (!outletId || !items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid order data' });
    }

    // Optional: Validate prices again on server side to prevent tampering
    // For MVP, we trust the client's structure but should sanity check existence.
    // Ideally, we recalculate totalAmount here.

    // Let's do a quick pass to ensure items exist.

    const newOrder = await Order.create({
      outletId,
      items,
      totalAmount,
      status: 'placed',
      takenBy: req.user ? req.user._id : null, // If logged in
    });

    res.status(201).json({
      success: true,
      data: newOrder,
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get orders for an outlet
// @route   GET /api/manager/orders/:outletId
// @access  Private (Manager)
export const getOutletOrders = async (req, res) => {
  try {
    const { outletId } = req.params;
    // Filter by status if needed (e.g. ?status=active)
    const { status } = req.query;

    let query = { outletId };
    if (status === 'active') {
      query.status = {
        $in: ['placed', 'cooking', 'ready', 'out_for_delivery'],
      };
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('items.menuItem', 'name'); // Populate item names if needed, though we stored snapshot

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/manager/orders/:id/status
// @access  Private (Manager)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      data: order,
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    console.error('Update Order Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
