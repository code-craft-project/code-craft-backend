import swaggerUI from "swagger-ui-express";
import swaggerDocument from "@/assets/swagger.json";

export const swaggerMiddlewares = {
    swaggerUIServe: swaggerUI.serve,
    swaggerUISetup: swaggerUI.setup(swaggerDocument)
};