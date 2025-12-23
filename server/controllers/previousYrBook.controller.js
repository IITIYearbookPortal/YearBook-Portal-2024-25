const previousSeniors = require('../models/previousYrBook.js');

const getSeniors = async (req, res) => {
    console.log("hi")
    try {
        // Only return required fields
        const seniors = await previousSeniors.find({}, "full_name roll_no department");

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

  try {
    const senior = await previousSeniors.findOne({ roll_no });

    if (!senior) {
      return res.status(404).json({
        success: false,
        message: "Senior not found",
      });
    }

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
