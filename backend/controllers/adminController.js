import Order from '../models/Order.js';
import User from '../models/User.js';
import Food from '../models/Food.js';

/**
 * Get Comprehensive Admin Dashboard Metrics
 * Route: GET /api/admin/metrics
 * Access: Private (Admin Only)
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getDashboardMetrics = async (req, res) => {
  try {
    // 1. Total Revenue Aggregation (excluding cancelled orders)
    const revenueAggregation = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' }
        }
      }
    ]);

    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // 2. Total Orders Count
    const totalOrders = await Order.countDocuments();

    // 3. Active Users Count (total registered customers)
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Distinct users who have actively placed at least one non-cancelled order
    const activeOrderingUsers = (
      await Order.distinct('userId', { status: { $ne: 'Cancelled' } })
    ).length;

    // 4. Total Food Items Count
    const totalFoodItems = await Food.countDocuments();

    // 5. Orders by Status Breakdown (Aggregation)
    const orderStatusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Map status breakdown into a clean key-value object
    const statusCounts = {
      foodProcessing: 0,
      outForDelivery: 0,
      delivered: 0,
      cancelled: 0
    };

    orderStatusBreakdown.forEach((item) => {
      const statusKey = item._id ? item._id.toLowerCase().replace(/\s+/g, '') : 'unknown';
      if (statusKey === 'foodprocessing') statusCounts.foodProcessing = item.count;
      else if (statusKey === 'outfordelivery') statusCounts.outForDelivery = item.count;
      else if (statusKey === 'delivered') statusCounts.delivered = item.count;
      else if (statusKey === 'cancelled') statusCounts.cancelled = item.count;
    });

    // 6. Recent Orders (Latest 5 orders for dashboard feed)
    const recentOrders = await Order.find()
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      message: 'Dashboard metrics retrieved successfully',
      metrics: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalUsers,
        activeOrderingUsers,
        totalFoodItems,
        statusCounts,
        orderStatusBreakdown
      },
      recentOrders
    });
  } catch (error) {
    console.error('Error in getDashboardMetrics controller:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate dashboard metrics',
      error: error.message
    });
  }
};
