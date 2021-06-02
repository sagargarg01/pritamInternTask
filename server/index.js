const app = require("./app");
const db = require("./config/mongoose");
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`Server started on PORT 8000`);
});
