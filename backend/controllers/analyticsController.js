const Complaint = require('../models/Complaint');

exports.getAnalytics = async (req, res) => {
  try {
    const [statusStats, categoryStats, priorityStats, recentTrend] = await Promise.all([
      Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Complaint.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Complaint.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
    ]);

    const total = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: 'resolved' });

    res.json({
      total,
      resolutionRate: total ? ((resolved / total) * 100).toFixed(1) : 0,
      statusStats,
      categoryStats,
      priorityStats,
      recentTrend
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
