import Groq from "groq-sdk";
import { StoryState } from "../components/AnimateButton";

const GROQ_API_KEY = `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`;
const groq = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getGroqChatCompletion(storySoFar: StoryState[]) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are telling a story about a square and a circle on a 2D canvas. The story is happening in a simple 2D image editor and with each new event, the square and the circle can move their position on the canvas and the narrator can say 1 single sentence. You are the narrator and give updates for the story.

The story canvas is specified with a JSON object that shows the position of the square and circle, and the current update narrative.

An example of this is:

{
  "square": {
    "x": 50,
    "y": 50
  },
  "circle": {
    "x": 250,
    "y": 250
  },
  "narration": "A square and a circle have appeared!"
}

An example of the next update to this story could be:

{
  "square": {
    "x": 200,
    "y": 50
  },
  "circle": {
    "x": 250,
    "y": 250
  },
  "narration": "The square moves towards the circle!"
}

The canvas is size 800 by 500.
All x values MUST be between 0 and 800.
All y values MUST be between 0 and 500.

When prompted, the user will provide you with the current story and you should return the next update for the story in JSON form. Reply only with a single, valid JSON output that conforms to the above example and nothing else. You should make the story fun, exciting and interesting and explore how the circle and square interact with each other as if they were personified characters with personalities.`,
      },
      {
        role: "user",
        content: JSON.stringify(storySoFar),
      },
    ],
    // response_format: { type: "json_object" },
    model: "llama3-70b-8192",
  });
  console.log({ storySoFar, chatCompletion });
  const completion = chatCompletion.choices[0]?.message?.content;
  return completion;
}
