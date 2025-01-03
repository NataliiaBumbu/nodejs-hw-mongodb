import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'js-yaml';

// Завантаження документації з openapi.yaml
const swaggerDocument = yaml.load(fs.readFileSync('./docs/openapi.yaml', 'utf8'));

// Middleware для Swagger
export const swaggerDocs = swaggerUi.setup(swaggerDocument);

export const swaggerServe = swaggerUi.serve;
