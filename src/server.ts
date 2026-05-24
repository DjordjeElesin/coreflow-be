import express from "express";
import cors from "cors";
import env from "./config/env";
import router from "./modules";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", router);

app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`));
