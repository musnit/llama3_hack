import { query, action, mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const createCreature = action({
  args: {
    storageId: v.id("_storage"),
    author: v.optional(v.string()),
  },
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});