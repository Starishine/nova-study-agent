import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    sessionToken: process.env.AWS_SESSION_TOKEN!,
  },
});

console.log("Key:", process.env.AWS_ACCESS_KEY_ID);
// Don't log the full secret, maybe just the first few chars to verify it exists
console.log("Secret Exists?", !!process.env.AWS_SECRET_ACCESS_KEY);

export async function POST(req: Request) {
  const currentDate = new Date().toLocaleDateString();

  console.log("Received request to /api/generate");
  const { assignment, deadline } = await req.json();
  console.log("Received assignment:", assignment);
  console.log("Received deadline:", deadline);
  console.log("Current date:", currentDate);


  // Prompt engineering with strict output constraints to ensure we get a clean, structured plan without any extraneous text
  const prompt = `
    You are an expert academic planner. Your goal is to create a highly efficient, realistic execution plan for the given assignment and deadline.

    ASSIGNMENT DETAILS:
    - Task: ${assignment}
    - Deadline: ${deadline}
    - Current Date: ${currentDate}

    OUTPUT CONSTRAINTS:
    1. STRICTLY NO PREAMBLE OR POSTAMBLE. Do not output conversational filler like "Here is your plan" or "Good luck!". Start directly with the schedule.
    2. Be concise. Limit task descriptions to 1-2 brief, action-oriented sentences.
    3. Structure the timeline logically (by hours, days, or weeks) scaling to the time available before the deadline.
    4. Enforce cognitive load balance. Explicitly alternate high-intensity tasks (drafting, complex logic, heavy reading) with low-intensity tasks (formatting, reviewing, organizing). Mandate specific short breaks.

    REQUIRED FORMAT:
    Use clean Markdown headings for time blocks (e.g., ### Week 1 / ### Day 1/ ## Hour 1).
    Under each heading, use bullet points in this exact format:
    * **[Estimated Time] Task Name:** Brief, actionable description.
  `;

  try {
    const command = new ConverseCommand({
      modelId: "us.amazon.nova-2-lite-v1:0",
      messages: [
        {
          role: "user",
          content: [{ text: prompt }],
        },
      ],
      inferenceConfig: {
        temperature: 0.4,
        maxTokens: 800,
      },
    });

    const response = await client.send(command);
    console.log("Raw response from Bedrock:", JSON.stringify(response, null, 2));

    const text = response.output?.message?.content?.[0]?.text;

    return Response.json({ result: text });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}
