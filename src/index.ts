import { Application } from "express";
import { authenticateDependenciesAvailability } from "./external/Authenticators";
import app from "./server";
import connectToMongoDB from "./infrastructure/database/connection";

const PORT_SERVER = process.env.PORT_SERVER || 3000;

function configureHealthRoutes(app: Application) {
  app.get("/health", async (_, res) => res.status(200).json({}));

  app.get("/health/liveness", async function (_, res) {
    return res.status(200).json({});
  });

  app.get("/health/readiness", async function (_, res) {
    try {
      if (!(await authenticateDependenciesAvailability()))
        return res.status(500).json({});

      return res.status(200).json({});
    } catch (error) {
      return res.status(500).json({});
    }
  });
}

async function init() {
  await connectToMongoDB();


  configureHealthRoutes(app);

  const server = app.listen(PORT_SERVER, () => {
    console.log(`Server running on port ${PORT_SERVER}`);
    console.log(
      `Documentação da API disponível em http://localhost:${PORT_SERVER}/api-docs`
    );
  });

  process.on("SIGINT", function onSigint() {
    console.info(
      "SIGINT (ctrl-c in docker). Graceful shutdown",
      new Date().toISOString()
    );
    shutdown();
  });

  process.on("SIGTERM", function onSigterm() {
    console.info(
      "SIGTERM (docker container stop). Graceful shutdown",
      new Date().toISOString()
    );
    shutdown();
  });

  function shutdown() {
    server.close(function onServerClosed(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      process.exit(0);
    });
  }
}

init();
