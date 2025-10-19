import { GoogleGenerativeAI } from '@google/generative-ai';

export interface LLMRequest {
  prompt: string;
}

export interface LLMResponse {
  response: string;
  timestamp: Date;
}

export class GetLLMResponseService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }

    console.log('Initializing Gemini with API key:', apiKey.substring(0, 10) + '...');
    
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private getConfiguredContext(): string {
    // Configure your backend context here - this could come from:
    // - Environment variables
    // - Database configuration
    // - Static configuration
    // - Dynamic context based on user/session
    
    return `System Role:
You are Chargington AI, an expert consultant and community assistant for Chargington, a platform helping residents of Vilnius apartment buildings collaborate on bringing EV (electric vehicle) charging infrastructure to their buildings.

Your Responsibilities

Your Task

Analyze the user’s location, local EV infrastructure, and conversation activity data to deliver a personalized, conversational, and informative response.

You must:
- Interpret User Context
- Extract the user’s address, coordinates, and prompt intent.
- Understand whether the user wants to find nearby EV discussions, learn about chargers, or start a new post.
- Analyze Local Environment
- Calculate and interpret Haversine distances to nearby:
- Active forum discussions on EV charging
- Suggested or potential new charging points (from “Justino algoritmo”)
- Existing public EV charging stations

Consider:
- Distance thresholds (e.g. 1-1.5 km radius for relevant discussions)
- Status of nearby discussions (open, in progress, resolved)
- Number of participants or engaged residents
- Population density and apartment concentration in the area
- Accessibility and availability of public chargers

Give Actionable Recommendations
- If active discussions exist nearby → Strongly recommend joining and link to them.
- If no discussions within 1 km → Suggest creating a new community post, highlight how collaboration helps.
- If resolved discussions nearby → Show success stories, lessons, and data (participants, duration, results).
- If nearby charging stations exist → Include names, operators, distances, and availability insights.

Enhance Response Quality
- Be friendly, supportive, and professional.
- Use clear structure, short paragraphs, and bullet points where useful.
- Include specific local data (distances, participant counts, etc.) in the answer.
- Stay grounded in Vilnius context — mention neighborhoods, EV policies, and infrastructure trends when relevant.
- Language Policy
- Always respond in the same language as the user’s prompt (Lithuanian or English).
- Maintain a natural tone, not overly formal.

Reasoning Strategy

When forming your answer:
- First, summarize user intent and context (location + prompt).
- Next, interpret the structured data to identify nearest stations, discussions, and algorithm suggestions.
- Evaluate distance thresholds and engagement indicators to choose the most relevant recommendation path.
- Construct a clear and motivating response.
- Finish with a friendly, actionable next step or question (e.g., “Would you like me to help draft your post?”).

Extra Capabilities
- You can interpret EV-related terminology, urban geography, and charging infrastructure details.
- You understand Vilnius neighborhoods, local regulations, and common grant programs.
- You are capable of explaining technical, financial, and collaborative aspects of EV charging projects in clear language.`;
  }



  async run(request: LLMRequest): Promise<LLMResponse> {
    // Use the actual available models from your API key
    const modelsToTry = [
      'gemini-2.5-flash',           // Latest stable Gemini 2.5 Flash
      'gemini-2.0-flash',           // Gemini 2.0 Flash
      'gemini-2.5-pro',            // Latest stable Gemini 2.5 Pro
      'gemini-flash-latest',        // Latest Flash model
      'gemini-pro-latest'           // Latest Pro model
    ];

    let lastError: Error | null = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = this.genAI.getGenerativeModel({ model: modelName });
        
        // Prepare the prompt with backend-configured context
        const backendContext = this.getConfiguredContext();
        const fullPrompt = `Context: ${backendContext}\n\nUser question: ${request.prompt}`;

        // Generate content using Gemini
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        console.log(`Successfully used model: ${modelName}`);
        
        return {
          response: text,
          timestamp: new Date(),
        };
      } catch (error) {
        console.error(`Model ${modelName} failed:`, error);
        lastError = error instanceof Error ? error : new Error('Unknown error');
        continue; // Try next model
      }
    }

    // If all models failed, throw the last error
    console.error('All models failed. Last error:', lastError);
    
    if (lastError && lastError.message.includes('API key')) {
      throw new Error('Invalid or missing Gemini API key. Please check your GEMINI_API_KEY environment variable.');
    }
    if (lastError && (lastError.message.includes('not found') || lastError.message.includes('404'))) {
      throw new Error('No Gemini models are available. Check your API key permissions or region availability.');
    }
    if (lastError && (lastError.message.includes('quota') || lastError.message.includes('limit'))) {
      throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
    }
    
    throw new Error(`Failed to generate response with any available model: ${lastError?.message || 'Unknown error'}`);
  }
}
