const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");

const app = express();

// Middleware
app.use(express.json()); // For JSON requests
app.use(express.urlencoded({ extended: true })); // For URL-encoded form data
app.use(express.static("public"));
app.use(
  session({ secret: "your-secret", resave: false, saveUninitialized: true })
);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/auth_system")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  layer2_points: [{ x: Number, y: Number }],
  layer3_colors: [String],
  layer4_pattern: [Number],
  layer5_audioSequence: [String], // New field for audio sequence
  layer6_puzzle: [{ x: Number, y: Number }],
  layer7_emojiSequence: [String],
  layer8_pairings: { type: Map, of: String },
});
const User = mongoose.model("User", userSchema);

// Routes
// Serve index page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

// Serve registration pages
app.get("/register1.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "register1.html"))
);
app.get("/register2.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "register2.html"))
);
app.get("/register3.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "register3.html"))
);
app.get("/register4.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "register4.html"))
);
app.get("/register5.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "register5.html"))
); // New route for Layer 5
app.get("/register6.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "register6.html"))
);
app.get("/register7.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "register7.html"))
);
app.get("/register8.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "register8.html"))
);

// Serve login pages
app.get("/login1.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "login1.html"))
);
app.get("/login2.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "login2.html"))
);
app.get("/login3.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "login3.html"))
);
app.get("/login4.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "login4.html"))
);
app.get("/login5.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "login5.html"))
); // New route for Layer 5
app.get("/login6.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "login6.html"))
);
app.get("/login7.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "login7.html"))
);
app.get("/login8.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "login8.html"))
);

// Update select page route to include Layer 5
app.get("/select.html", (req, res) => {
  if (req.session.userId) {
    res.sendFile(path.join(__dirname, "public", "select.html"));
  } else {
    res.redirect("/");
  }
});

// Handle layer selection
app.post("/select", (req, res) => {
  const { layer } = req.body;
  res.redirect(`/login${layer}.html`);
});

// Registration Step 1: Text-based
app.post("/register/layer1", async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !email.endsWith("@gas.com")) {
    return res.status(400).json({ error: "Email must end with @gas.com" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User with this account exists" });
  }

  req.session.tempUser = {
    email,
    username,
    password,
  };
  res.redirect("/register2.html");
});

// Registration Step 2: Image-based
app.post("/register/layer2", (req, res) => {
  if (!req.body.points || req.body.points.trim() === "") {
    return res.status(400).json({ error: "No points marked" });
  }
  try {
    req.session.tempUser.layer2_points = JSON.parse(req.body.points);
    res.redirect("/register3.html");
  } catch (e) {
    res.status(400).json({ error: "Invalid points data" });
  }
});

// Registration Step 3: Color-based
app.post("/register/layer3", (req, res) => {
  if (!req.body.colors || req.body.colors.trim() === "") {
    return res.status(400).json({ error: "No colors selected" });
  }
  try {
    req.session.tempUser.layer3_colors = JSON.parse(req.body.colors);
    res.redirect("/register4.html");
  } catch (e) {
    res.status(400).json({ error: "Invalid colors data" });
  }
});

// Registration Step 4: Android Pattern
app.post("/register/layer4", (req, res) => {
  if (!req.body.pattern || req.body.pattern.trim() === "") {
    return res.status(400).json({ error: "No dots marked" });
  }
  try {
    req.session.tempUser.layer4_pattern = JSON.parse(req.body.pattern);
    res.redirect("/register5.html"); // Redirect to Layer 5
  } catch (e) {
    res.status(400).json({ error: "Invalid pattern data" });
  }
});

// Registration Step 5: Audio Sequence
app.post("/register/layer5", (req, res) => {
  if (!req.body.audioSequence || req.body.audioSequence.trim() === "") {
    return res.status(400).json({ error: "No audio sequence selected" });
  }
  try {
    req.session.tempUser.layer5_audioSequence = JSON.parse(
      req.body.audioSequence
    );
    res.redirect("/register6.html"); // Proceed to Layer 6
  } catch (e) {
    res.status(400).json({ error: "Invalid audio sequence data" });
  }
});

// Registration Step 6: Puzzle Piece
app.post("/register/layer6", async (req, res) => {
  if (!req.body.puzzle || req.body.puzzle.trim() === "") {
    return res.status(400).json({ error: "No puzzle pieces arranged" });
  }
  try {
    const puzzleData = JSON.parse(req.body.puzzle);
    if (!Array.isArray(puzzleData) || puzzleData.length !== 9) {
      throw new Error(
        "Puzzle data must be an array of 9 pieces with x, y coordinates"
      );
    }
    puzzleData.forEach((piece, index) => {
      if (
        !piece ||
        typeof piece.x !== "number" ||
        typeof piece.y !== "number"
      ) {
        throw new Error(`Invalid piece coordinates at index ${index}`);
      }
    });

    const {
      email,
      username,
      password,
      layer2_points,
      layer3_colors,
      layer4_pattern,
      layer5_audioSequence,
    } = req.session.tempUser;
    const layer6_puzzle = puzzleData;
    req.session.tempUser.layer6_puzzle = layer6_puzzle;
    res.redirect("/register7.html");
  } catch (e) {
    res.status(400).json({ error: `Invalid puzzle data: ${e.message}` });
  }
});

// Registration Step 7: Emoji Sequence
app.post("/register/layer7", async (req, res) => {
  if (!req.body.emojiSequence || req.body.emojiSequence.trim() === "") {
    return res.status(400).json({ error: "No emoji sequence provided" });
  }
  try {
    req.session.tempUser.layer7_emojiSequence = JSON.parse(
      req.body.emojiSequence
    );
    res.redirect("/register8.html");
  } catch (e) {
    res.status(400).json({ error: "Invalid emoji sequence data" });
  }
});

// Registration Step 8: Name Pairing
app.post("/register/layer8", async (req, res) => {
  if (!req.body.pairings || req.body.pairings.trim() === "") {
    return res.status(400).json({ error: "No pairings provided" });
  }
  try {
    const pairingsData = JSON.parse(req.body.pairings);
    if (Object.keys(pairingsData).length !== 3) {
      throw new Error("Must pair all 3 names");
    }

    const {
      email,
      username,
      password,
      layer2_points,
      layer3_colors,
      layer4_pattern,
      layer5_audioSequence,
      layer6_puzzle,
      layer7_emojiSequence,
    } = req.session.tempUser;
    const layer8_pairings = pairingsData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      username,
      password: hashedPassword,
      layer2_points,
      layer3_colors,
      layer4_pattern,
      layer5_audioSequence,
      layer6_puzzle,
      layer7_emojiSequence,
      layer8_pairings,
    });
    await user.save();
    req.session.tempUser = null;
    res.redirect("/index.html");
  } catch (e) {
    res.status(400).json({ error: `Invalid pairings data: ${e.message}` });
  }
});

// Login Identification
app.post("/identify", async (req, res) => {
  const { identifier } = req.body || {};
  if (!identifier) {
    return res.status(400).json({ error: "No identifier provided" });
  }
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });
  if (user) {
    req.session.userId = user._id;
    res.redirect("/select.html");
  } else {
    res.status(400).json({ error: "User not found" });
  }
});

// Login Layer 1: Text-based
app.post("/login/layer1", async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    req.session.authenticated = true;
    res.redirect("/home.html");
  } else {
    res.status(401).json({ error: "Incorrect password" });
  }
});

// Login Layer 2: Image-based
app.post("/login/layer2", async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!req.body.points) {
    return res.status(400).json({ error: "No points marked" });
  }
  try {
    const inputPoints = JSON.parse(req.body.points);
    const tolerance = 10;
    const matches = user.layer2_points.every((stored, i) => {
      const input = inputPoints[i];
      return (
        input &&
        Math.abs(stored.x - input.x) <= tolerance &&
        Math.abs(stored.y - input.y) <= tolerance
      );
    });
    const pointsRemaining = user.layer2_points.length - inputPoints.length;
    if (matches && inputPoints.length === user.layer2_points.length) {
      req.session.authenticated = true;
      res.redirect("/home.html");
    } else if (inputPoints.length !== user.layer2_points.length) {
      res.status(400).json({
        error: `${pointsRemaining} point/s remaining to be marked.`,
      });
    } else {
      res.status(400).json({ error: "Incorrect points" });
    }
  } catch (e) {
    res.status(400).json({ error: "Invalid points data" });
  }
});

// Login Layer 3: Color-based
app.post("/login/layer3", async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!req.body.colors) {
    return res.status(400).json({ error: "No colors selected" });
  }
  try {
    const inputColors = JSON.parse(req.body.colors);
    const colorsRemaining = user.layer3_colors.length - inputColors.length;
    if (JSON.stringify(inputColors) === JSON.stringify(user.layer3_colors)) {
      req.session.authenticated = true;
      res.redirect("/home.html");
    } else if (inputColors.length !== user.layer3_colors.length) {
      res.status(400).json({
        error: `${colorsRemaining} color/s remaining to be selected.`,
      });
    } else {
      res.status(400).json({ error: "Incorrect pattern" });
    }
  } catch (e) {
    res.status(400).json({ error: "Invalid colors data" });
  }
});

// Login Layer 4: Android Pattern
app.post("/login/layer4", async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!req.body.pattern) {
    return res.status(400).json({ error: "No pattern provided" });
  }
  try {
    const inputPattern = JSON.parse(req.body.pattern);
    const dotsRemaining = user.layer4_pattern.length - inputPattern.length;
    if (JSON.stringify(inputPattern) === JSON.stringify(user.layer4_pattern)) {
      req.session.authenticated = true;
      res.redirect("/home.html");
    } else if (inputPattern.length !== user.layer4_pattern.length) {
      res.status(400).json({
        error: `${dotsRemaining} dot/s remaining to be marked.`,
      });
    } else {
      res.status(400).json({ error: "Incorrect pattern" });
    }
  } catch (e) {
    res.status(400).json({ error: "Invalid pattern data" });
  }
});

// Login Layer 5: Audio Sequence
app.post("/login/layer5", async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!req.body.audioSequence) {
    return res.status(400).json({ error: "No audio sequence selected" });
  }
  try {
    const inputSequence = JSON.parse(req.body.audioSequence);
    const audiosRemaining =
      user.layer5_audioSequence.length - inputSequence.length;
    if (
      JSON.stringify(inputSequence) ===
      JSON.stringify(user.layer5_audioSequence)
    ) {
      req.session.authenticated = true;
      res.redirect("/home.html");
    } else if (inputSequence.length !== user.layer5_audioSequence.length) {
      res.status(400).json({
        error: `${audiosRemaining} audio/s remaining to be selected.`,
      });
    } else {
      res.status(400).json({ error: "Incorrect audio sequence" });
    }
  } catch (e) {
    res.status(400).json({ error: "Invalid audio sequence data" });
  }
});

// Login Layer 6: Puzzle Piece
app.post("/login/layer6", async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!req.body.puzzle) {
    return res.status(400).json({ error: "No puzzle pieces arranged" });
  }
  try {
    const inputPuzzle = JSON.parse(req.body.puzzle);
    if (!Array.isArray(inputPuzzle) || inputPuzzle.length !== 9) {
      throw new Error(
        "Puzzle data must be an array of 9 pieces with x, y coordinates"
      );
    }
    const tolerance = 20;
    const matches = user.layer6_puzzle.every((stored, i) => {
      const input = inputPuzzle[i];
      return (
        input &&
        Math.abs(stored.x - input.x) <= tolerance &&
        Math.abs(stored.y - input.y) <= tolerance
      );
    });
    const piecesRemaining = user.layer6_puzzle.length - inputPuzzle.length;
    if (matches && inputPuzzle.length === user.layer6_puzzle.length) {
      req.session.authenticated = true;
      res.redirect("/home.html");
    } else if (inputPuzzle.length !== user.layer6_puzzle.length) {
      res.status(400).json({
        error: `${piecesRemaining} piece/s remaining to be placed.`,
      });
    } else {
      res.status(400).json({ error: "Incorrect puzzle arrangement" });
    }
  } catch (e) {
    res.status(400).json({ error: `Invalid puzzle data: ${e.message}` });
  }
});

// Login Layer 7: Emoji Sequence
app.post("/login/layer7", async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!req.body.emojiSequence) {
    return res.status(400).json({ error: "No emoji sequence provided" });
  }
  try {
    const inputSequence = JSON.parse(req.body.emojiSequence);
    const emojisRemaining =
      user.layer7_emojiSequence.length - inputSequence.length;
    if (
      JSON.stringify(inputSequence) ===
      JSON.stringify(user.layer7_emojiSequence)
    ) {
      req.session.authenticated = true;
      res.redirect("/home.html");
    } else if (inputSequence.length !== user.layer7_emojiSequence.length) {
      res.status(400).json({
        error: `${emojisRemaining} emoji/s remaining to be selected.`,
      });
    } else {
      res.status(400).json({ error: "Incorrect emoji sequence" });
    }
  } catch (e) {
    res.status(400).json({ error: "Invalid emoji sequence data" });
  }
});

// Login Layer 8: Name Pairing
app.post("/login/layer8", async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!req.body.pairings) {
    return res.status(400).json({ error: "No pairings provided" });
  }
  try {
    const inputPairings = JSON.parse(req.body.pairings);
    if (Object.keys(inputPairings).length !== 3) {
      throw new Error("Must pair all 3 names");
    }
    const isMatch =
      Object.keys(user.layer8_pairings).length === 3 &&
      Object.entries(inputPairings).every(
        ([key, value]) => user.layer8_pairings.get(key) === value
      );
    const pairsRemaining = 3 - Object.keys(inputPairings).length;
    if (isMatch) {
      req.session.authenticated = true;
      res.redirect("/home.html");
    } else if (Object.keys(inputPairings).length !== 3) {
      res.status(400).json({
        error: `${pairsRemaining} pair/s remaining to be made.`,
      });
    } else {
      res.status(400).json({ error: "Incorrect pairings" });
    }
  } catch (e) {
    res.status(400).json({ error: `Invalid pairings data: ${e.message}` });
  }
});

// Homepage (protected)
app.get("/home.html", (req, res) => {
  if (req.session.authenticated) {
    res.sendFile(path.join(__dirname, "public", "home.html"));
  } else {
    res.redirect("/");
  }
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(3000, () => console.log("Server running on port 3000"));
