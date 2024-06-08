const express = require("express");

const router = new express.Router();

// Greetings :)
router
  .route("/")
  .get((res) => {
    res.send("Welcome to API Route!");
  })
  .post((res) => {
    res.status(200).json({
      code: 200,
      status: true,
      message: "Welcome to API Route!",
    });
  });

// login stuff, /api/login
router.post("/login", async (req, res) => {
  const { TOKEN, PREFIX } = req.body;

  if (!TOKEN || !PREFIX) {
    return res.status(400).json({
      code: 400,
      status: false,
      message: "Missing required parameters",
    });
  }

  try {
    // call login, to login ¯⁠\⁠_⁠(⁠ツ⁠)⁠_⁠/⁠¯
    require("../source/login")({
      TOKEN,
      PREFIX,
    });

    res.status(200);
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
