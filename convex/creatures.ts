import { query, action, mutation } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const createCreature = action({
  args: {

  },
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});