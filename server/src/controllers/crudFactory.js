import mongoose from "mongoose";
import { pick } from "../utils/helpers.js";

/**
 * Admin CRUD for a model. `fields` is the whitelist of writable keys.
 */
export function createCrud(Model, { fields, sort }) {
  const validId = (req, res) => {
    if (mongoose.isValidObjectId(req.params.id)) return true;
    res.status(400).json({ message: "Invalid identifier" });
    return false;
  };

  return {
    list: async (_req, res) => res.json({ items: await Model.find().sort(sort).lean() }),

    create: async (req, res) => {
      const item = await Model.create(pick(req.body, fields));
      res.status(201).json({ item });
    },

    update: async (req, res) => {
      if (!validId(req, res)) return;
      const item = await Model.findByIdAndUpdate(
        req.params.id,
        { $set: pick(req.body, fields) },
        { new: true, runValidators: true }
      );
      if (!item) return res.status(404).json({ message: "Not found" });
      res.json({ item });
    },

    remove: async (req, res) => {
      if (!validId(req, res)) return;
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ message: "Not found" });
      res.json({ ok: true });
    }
  };
}
