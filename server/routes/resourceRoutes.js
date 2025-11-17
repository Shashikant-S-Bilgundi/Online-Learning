import express from 'express';
import { addResource, getResources } from '../controllers/resourceController.js';

const resourceRouter = express.Router();

// GET /api/resources
resourceRouter.get("/", getResources);

// POST /api/resources
resourceRouter.post("/", addResource);

export default resourceRouter;