const express = require("express");
const path = require("path");

const app = express();
// Corrected path to match your build output
const distPath = path.join(__dirname, "dist/frontend_tap_ang_19/browser");

app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});