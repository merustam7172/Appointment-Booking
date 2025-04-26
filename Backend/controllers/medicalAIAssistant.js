
import {Client} from "@gradio/client"

let client;

// Initialize client once
async function initClient() {
  if (!client) {
    client = await Client.connect("ruslanmv/Medical-Llama3-v2", {
      hf_token: process.env.HF_TOKEN,
    });
  }
}

const chatWithMedicalBot = async (req, res) => {
  const { message, system_message, max_tokens, temperature, top_p } = req.body;

  try {
    await initClient();

    const result = await client.predict("/chat", {
      message: message || "Hello!!",
      system_message:
        system_message ||
        "You are a Medical AI Assistant. Please be thorough and provide an informative answer.",
      max_tokens: max_tokens || 512,
      temperature: temperature || 0.8,
      top_p: top_p || 0.9,
    });

    console.log(result)

    res.json({ response: result.data });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Failed to get response from Medical AI." });
  }
};

export default chatWithMedicalBot
