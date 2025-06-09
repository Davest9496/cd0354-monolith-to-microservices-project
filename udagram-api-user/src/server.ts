import cors from "cors";
import express from "express";
import { sequelize } from "./sequelize";

import { IndexRouter } from "./controllers/v0/index.router";

import bodyParser from "body-parser";
import { config } from "./config/config";
import { V0_USER_MODELS } from "./controllers/v0/model.index";

(async () => {
  console.log("🚀 Starting server initialization...");

  // Debug configuration
  console.log("📊 Configuration:");
  console.log("- Host:", config.host);
  console.log("- Database:", config.database);
  console.log("- Username:", config.username);
  console.log("- Dialect:", config.dialect);
  console.log("- JWT Secret:", config.jwt.secret ? "Set ✅" : "Missing ❌");

  try {
    // Test database connection
    console.log("🔌 Testing database connection...");
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Add models
    console.log("📋 Adding models...");
    await sequelize.addModels(V0_USER_MODELS);
    console.log(
      "✅ Models added:",
      [...V0_USER_MODELS].map((m) => m.name)
    );

    // Initialize database connection and create tables
    console.log("🗃️ Initialize database connection...");
    await sequelize.sync({ force: false }); // Set to true to recreate tables
    console.log("✅ Database synchronized successfully!");

    // List all tables
    console.log("📋 Checking created tables...");
    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();
    console.log("📊 Tables in database:", tables);

    if (tables.length === 0) {
      console.log("⚠️ No tables found! Trying to force sync...");
      await sequelize.sync({ force: true });
      const newTables = await queryInterface.showAllTables();
      console.log("📊 Tables after force sync:", newTables);
    }
  } catch (error) {
    console.error("❌ Database setup error:", error);
    console.error("Full error details:", JSON.stringify(error, null, 2));
    throw error;
  }

  const app = express();
  const port = process.env.PORT || 8080;

  app.use(bodyParser.json());

  app.use(
    cors({
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "X-Access-Token",
        "Authorization",
      ],
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      preflightContinue: true,
      origin: "*",
    })
  );

  app.use("/api/v0/", IndexRouter);

  // Root URI call
  app.get("/", async (req, res) => {
    res.send("/api/v0/");
  });

  // Health check endpoint
  app.get("/health", async (req, res) => {
    try {
      await sequelize.authenticate();
      const tables = await sequelize.getQueryInterface().showAllTables();
      res.json({
        status: "healthy",
        database: "connected",
        tables: tables,
        config: {
          host: config.host,
          database: config.database,
          username: config.username,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "unhealthy",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Start the Server
  app.listen(port, () => {
    console.log("🎉 Server started successfully!");
    console.log(`📍 server running ${config.url}`);
    console.log(`❤️ health check: ${config.url}/health`);
    console.log(`press CTRL+C to stop server`);
  });
})();
