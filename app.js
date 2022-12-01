import http from "http";
import express from "express";
//data logging
import logger from "morgan";
//cors allows cross data communication across different domains.
import cors from "cors";

// mongo connectiond
import "./server/config/mongo.js";

import userRouter from "./server/routes/user.js";
import sariraRouter from "./server/routes/sarira.js";

const app = express();

const PORT = process.env.PORT || 5000;
app.set("port", PORT);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use("/users", userRouter);
app.use("/sarira", sariraRouter);
/** catch 404 and forward to error handler */
// app.use('*', (req, res) => {
//     return res.status(404).json({
//       success: false,
//       message: 'API endpoint doesnt exist'
//     })
//   });

/** Create HTTP server. */
const server = http.createServer(app);
server.listen(PORT);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
    console.log(`Listening on port:: http://localhost:${PORT}/`)
  });

