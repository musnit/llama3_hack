import { action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { creatureFields } from "./schema";
import { OpenAI } from "openai";
import { models } from "./models";
import * as fal from "@fal-ai/serverless-client";
import { genCode } from "./codegen";
import { Groq } from "groq-sdk";

fal.config({
  credentials: models.fal_workflow.apiKey, // or a function that returns a string
});

const openai = new OpenAI({
  apiKey: models.openai_vision.apiKey,
});
const groq = new Groq({
  apiKey: models.groq_llama.apiKey,
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const createCreature = action({
  args: {
    storageId: v.id("_storage"),
    author: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Step 0: get url
    const imgUrl = (await ctx.storage.getUrl(args.storageId))!;

    // Step 1: Ask OpenAI for a detailed description of the image as a creature
    const descriptionResponse = await openai.chat.completions.create({
      model: models.openai_vision.model,
      messages: [
        {
          role: "system",
          content: "Please describe this image as a creature.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Please describe the following image" },
            {
              type: "image_url",
              image_url: {
                url: imgUrl,
              },
            },
          ],
        },
      ],
    });
    const creatureDescription = descriptionResponse.choices[0].message.content!;

    // Step 2: Generate the image using DALL-E 3 with the description
    const stream = await fal.stream("workflows/huevosabio/sam", {
      input: {
        prompt: creatureDescription,
      },
    });

    for await (const event of stream) {
      console.log(event);
    }

    const result = await stream.done();
    const spriteUrl = result["output"]["image"]["url"];

    // Step 3: Store the image in storage and get the storageId
    // Download the image
    const spriteResponse = await fetch(spriteUrl);
    const image = await spriteResponse.blob();

    // Store the image in Convex
    const spriteStorageId = await ctx.storage.store(image);

    // Step 4: Create the stats of the creature
    const creatureStats = {
      strength: Math.floor(Math.random() * 100),
      agility: Math.floor(Math.random() * 100),
      intelligence: Math.floor(Math.random() * 100),
    };

    // Step 5: Create _move function for creature
    const moveFunc = await genCode(groq, creatureDescription);

    // Step 5: Store the creature along with its URL and save it
    const creature = {
      description: creatureDescription,
      imgUrl: spriteUrl,
      spriteStorageId: spriteStorageId,
      stats: creatureStats,
      author: args.author || "Unknown",
      moveFunc,
    };
    const creatureId: Id<"creatures"> = await ctx.runMutation(
      api.creatures.addCreature,
      creature,
    );

    return { creatureId, creature };
  },
});

export const addCreature = mutation({
  args: creatureFields,
  handler: async (ctx, args) => {
    const creatureId = await ctx.db.insert("creatures", args);
    return creatureId;
  },
});
