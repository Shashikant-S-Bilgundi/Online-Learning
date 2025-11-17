import express from 'express';
import { createDashboards, getAllDashboards } from '../controllers/DashboardController.js';

const dashboardRouter = express.Router();

dashboardRouter.get("/", getAllDashboards);
dashboardRouter.post("/", createDashboards);

export default dashboardRouter;