import express from "express";
import userRoute from "./resources/user/routes/user.routes.js";
import eventRoute from "./resources/user/routes/event.routes.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to ODS 2024 Api ");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/dashboard", eventRoute);


export default app;
