import type { Express } from "express";

export async function registerAIRoutes(app: Express): Promise<void> {
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context, conversationHistory } = req.body;
      const apiKey = process.env.OPENAI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          error: "AI service not configured. Please set OPENAI_API_KEY environment variable.",
        });
      }

      // System prompt for business consultant
      const systemPrompt = `You are an expert business consultant AI specializing in ROI analysis and business strategy. 
You have access to the user's business metrics and data.
Provide actionable, data-driven insights and recommendations.
Be concise but thorough in your analysis.
If asked about metrics in the dashboard data provided, reference specific numbers.
Help the user understand their business performance and suggest improvements.
Format responses clearly with bullet points when appropriate.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: message },
      ];

      // Add context about their business data if available
      let contextMessage = "";
      if (context) {
        contextMessage = `\n\nCurrent Business Context:\n`;
        if (context.globalRoi) {
          contextMessage += `- Overall ROI Score: ${context.globalRoi.overallScore}/100\n`;
          contextMessage += `- Financial ROI: ${context.globalRoi.dimensions.financial}/100\n`;
          contextMessage += `- Operational ROI: ${context.globalRoi.dimensions.operational}/100\n`;
          contextMessage += `- Market ROI: ${context.globalRoi.dimensions.market}/100\n`;
          contextMessage += `- Strategic ROI: ${context.globalRoi.dimensions.strategic}/100\n`;
        }
        if (context.financialMetrics) {
          contextMessage += `- Revenue: $${context.financialMetrics.revenue.toLocaleString()}\n`;
          contextMessage += `- Net Profit: $${context.financialMetrics.netProfit.toLocaleString()}\n`;
          contextMessage += `- Gross Margin: ${(context.financialMetrics.grossMargin * 100).toFixed(1)}%\n`;
          contextMessage += `- Cash Runway: ${context.financialMetrics.cashRunway} months\n`;
        }
        if (context.customerIntelligence) {
          contextMessage += `- CAC: $${context.customerIntelligence.cac}\n`;
          contextMessage += `- LTV: $${context.customerIntelligence.ltv}\n`;
          contextMessage += `- LTV/CAC Ratio: ${context.customerIntelligence.ltvCacRatio.toFixed(2)}x\n`;
          contextMessage += `- Retention Rate: ${context.customerIntelligence.retentionRate}%\n`;
        }
      }

      const finalMessage = message + contextMessage;
      messages[messages.length - 1].content = finalMessage;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        return res.status(response.status).json({
          error: "Failed to get AI response",
          details: errorData.error?.message,
        });
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

      res.json({ response: aiResponse });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}
