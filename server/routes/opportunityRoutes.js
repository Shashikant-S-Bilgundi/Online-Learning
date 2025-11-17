import express from 'express';
import { getOpportunities, getOpportunityById } from '../controllers/opportunityController.js';

const opportunityRouter = express.Router();

// GET /api/opportunities
opportunityRouter.get("/", getOpportunities);

// GET /api/opportunities/:id
opportunityRouter.get("/:id", getOpportunityById);

export default opportunityRouter;