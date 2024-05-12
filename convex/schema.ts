import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const creatureFields = {
  imgUrl: v.string(),
  description: v.string(),
  stats: v.object({
    strength: v.number(),
    agility: v.number(),
    intelligence: v.number(),
  }),
  author: v.optional(v.string()),
  spriteStorageId: v.optional(v.id("_storage")),
  moveFunc: v.optional(v.string()),
};

export default defineSchema({
  creatures: defineTable(creatureFields),
});
