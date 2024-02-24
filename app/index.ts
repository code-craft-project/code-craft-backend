import 'dotenv/config';
import 'module-alias/register';
import express from "express";

import { swaggerMiddlewares } from '@/infrastructure/swagger-ui';

const PORT = process.env.PORT || 3000;

const app = express();

app.use('/api-docs', swaggerMiddlewares.swaggerUIServe,swaggerMiddlewares.swaggerUISetup);

app.listen(PORT, () => {
    console.log(`Server is up running on port ${PORT}`);
});