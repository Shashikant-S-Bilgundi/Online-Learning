import express from 'express';
import { createGrant, deleteGrant, getGrants, updateGrant } from '../controllers/grantController.js';

const grantRouter = express.Router();

grantRouter.get("/", getGrants);
grantRouter.post("/", createGrant);
grantRouter.put("/:id", updateGrant);
grantRouter.delete("/:id", deleteGrant);

export default grantRouter;