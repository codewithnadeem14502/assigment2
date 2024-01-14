const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/codesDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Code Schema
const codeSchema = new mongoose.Schema({
  value: { type: String, unique: true },
  expiry: { type: Date, default: () => new Date(Date.now() + 1 * 60 * 1000) },
});

const Code = mongoose.model("Code", codeSchema);

app.use(bodyParser.json());
app.use(cors());

app.get("/api/codes", async (req, res) => {
  try {
    const newCode = await Code.create({ value: generateCode() });
    res.json({ code: newCode.value });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to check and use the code
app.post("/api/codes/use", async (req, res) => {
  const { code } = req.body;
  console.log("code ", code);

  try {
    const existingCode = await Code.findOne({ value: code });

    console.log("Existing code from DB:", existingCode == null);

    if (existingCode == null || !existingCode) {
      console.log("Code not found");
      res.status(400).json({ error: "Enter a valid code" });
    } else if (existingCode.expiry && existingCode.expiry < new Date()) {
      //   const timestampString = existingCode.expiry;
      //   const timestamp = new Date(timestampString);
      //   const current = new Date();
      //   console.log(timestamp + "==" + current);
      console.log("Code expired");
      res.status(400).json({ error: "The code has expired" });
    } else {
      console.log(existingCode);
      res.json({ message: "Code is correct" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function generateCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
