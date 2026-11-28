const previousSeniors = require('../models/previousYrBook.js');

const getSeniors = async (req, res) => {
    try {
        // Only return required fields
        const seniors = await previousSeniors.find({}, "full_name roll_no department");

        res.set("Cache-Control", "private, no-store");
        res.status(200).json({
            success: true,
            count: seniors.length,
            data: seniors,
        });
    } catch (error) {
        console.error("Error fetching seniors:", error);
        res.status(500).json({
            success: false,
            message: "Server Error while fetching seniors",
        });
    }
};

const getSenior = async (req, res) => {
  const roll_no = req.params.roll_no;
    if (!/^\d{1,15}$/.test(roll_no))
        return res.status(400).json({ success: false, message: "Invalid enrollment number" });

  try {
    const senior = await previousSeniors.findOne({ roll_no });

    if (!senior) {
      return res.status(404).json({
        success: false,
        message: "Senior not found",
      });
    }

    res.set("Cache-Control", "private, no-store");
    res.status(200).json({
      success: true,
      data: senior,
    });

  } catch (error) {
    console.error("Error fetching senior:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while fetching senior",
    });
  }
};

module.exports = { getSeniors, getSenior };
