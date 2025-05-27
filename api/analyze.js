// api/analyze.js - Vercel serverless function
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url, scrapedData, tier } = req.body;
        
        if (tier !== 'premium') {
            return res.status(400).json({ error: 'Invalid tier' });
        }

        // Use environment variable (secure on server)
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        
        if (!OPENAI_API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        const prompt = createAIPrompt(url, scrapedData);
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{
                    role: "system",
                    content: "You are a professional business analyst. Create compelling, SEO-friendly content for llms.txt files."
                }, {
                    role: "user",
                    content: prompt
                }],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const aiContent = data.choices[0].message.content;
        
        // Parse AI response into structured format
        const suggestions = parseAIContent(aiContent);
        
        res.status(200).json({ success: true, suggestions });
        
    } catch (error) {
        console.error('AI Analysis error:', error);
        res.status(500).json({ 
            error: 'Analysis failed', 
            message: error.message 
        });
    }
}

function createAIPrompt(url, scrapedData) {
    return `
Analyze this website and create professional business information for an llms.txt file:

URL: ${url}
Title: ${scrapedData.title}
Meta Description: ${scrapedData.metaDescription}
Main Content: ${scrapedData.mainContent?.substring(0, 1000) || 'No content available'}
Navigation: ${scrapedData.navLinks?.join(', ') || 'No navigation found'}

Please provide a JSON response with these fields:
{
  "businessDescription": "2-3 compelling sentences about the business",
  "services": "List of main services/products (one per line)",
  "regions": "Geographic regions served",
  "contactInfo": "Contact information summary",
  "additionalInfo": "Key business highlights, achievements, or differentiators"
}

Make it professional, SEO-friendly, and suitable for AI model context.
    `;
}

function parseAIContent(content) {
    try {
        // Try to parse as JSON first
        const parsed = JSON.parse(content);
        return parsed;
    } catch (error) {
        // Fallback: parse text format
        return {
            businessDescription: extractSection(content, 'business', 'description'),
            services: extractSection(content, 'services', 'products'),
            regions: extractSection(content, 'regions', 'geographic'),
            contactInfo: extractSection(content, 'contact', 'email'),
            additionalInfo: extractSection(content, 'additional', 'highlights')
        };
    }
}

function extractSection(content, ...keywords) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (keywords.some(keyword => line.includes(keyword))) {
            // Return next few lines as content
            return lines.slice(i + 1, i + 4)
                .filter(l => l.trim())
                .join('\n')
                .trim();
        }
    }
    return '';
} 