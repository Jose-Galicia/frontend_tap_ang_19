const express = require("express");
const path = require("path");

const app = express();
const distPath = path.join(__dirname, "dist/frontend-tap-ang-19/browser");

app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});