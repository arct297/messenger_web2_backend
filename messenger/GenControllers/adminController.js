const Log = require('../models/Log');
const path = require('path');

exports.drawLogStatsPage = (req, res) => {
    const pagePath = path.join(__dirname, '..', 'frontend', 'logstats.html');
    res.sendFile(pagePath);
};


exports.getLogsStats = async (req, res) => {
  try {
    const stats = await Log.aggregate([
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = stats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    console.error("Error в getLogsStats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};














