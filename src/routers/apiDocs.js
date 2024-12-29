import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'js-yaml';

const router = express.Router();
const swaggerDocument = yaml.load(fs.readFileSync('./docs/openapi.yaml', 'utf8'));

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
