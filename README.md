# 🤖 AI-Powered LLMs.txt Generator

An intelligent web application that automatically analyzes websites and generates structured `llms.txt` files using AI-powered content extraction and suggestions.

## ✨ Key Features

### 🧠 **AI-Powered Auto-Population**
- **Smart URL Analysis**: Enter any website URL and let AI analyze the content
- **Intelligent Content Extraction**: Automatically extracts business information, services, and contact details
- **AI-Generated Suggestions**: Creates professional descriptions and service lists based on website content
- **Editable Results**: Review and customize all AI-generated content before finalizing

### 🎯 **Advanced Functionality**
- **Multi-Proxy Web Scraping**: Uses multiple CORS proxies for reliable content access
- **Pattern Recognition**: Identifies services, regions, and business highlights using smart algorithms
- **Real-time Field Status**: Shows which fields are AI-generated vs. user-edited
- **Regeneration Options**: Re-analyze and get fresh AI suggestions anytime

### 💫 **User Experience**
- **One-Click Analysis**: Simply paste a URL and click "Analyze & Auto-Fill"
- **Visual Feedback**: Loading states, success animations, and clear status indicators
- **Copy & Download**: Instant clipboard copying and file download
- **Responsive Design**: Perfect on desktop and mobile devices

## 🚀 Live Demo

Visit the live application: [Your Vercel URL will be here after deployment]

## 🎬 How It Works

1. **🔍 Enter URL**: Paste any website URL into the analyzer
2. **🤖 AI Analysis**: Click "Analyze & Auto-Fill" to let AI scrape and analyze the site
3. **✏️ Review & Edit**: AI populates all fields - edit anything you want to change
4. **📄 Generate**: Click "Generate LLMs.txt" to create your formatted file
5. **💾 Export**: Copy to clipboard or download as `llms.txt`

## 🛠️ Technical Features

### AI Content Extraction
- **Title & Meta Analysis**: Extracts page titles and meta descriptions
- **Navigation Parsing**: Identifies services from menu items and navigation
- **Content Analysis**: Processes main content areas for business information
- **Contact Detection**: Finds email addresses, phone numbers, and contact info
- **Geographic Recognition**: Identifies service regions and locations

### Smart Algorithms
- **Service Keyword Detection**: Recognizes business services and offerings
- **Company Name Extraction**: Intelligently determines company names
- **Highlight Identification**: Finds key business achievements and features
- **Content Filtering**: Removes irrelevant content like cookies notices

## 📁 Project Structure

```
llmstxt/
├── index.html          # Main HTML with AI-powered form
├── style.css           # Enhanced styling with AI indicators
├── script.js           # AI analysis and content generation
├── .gitignore          # Git ignore rules
├── vercel.json         # Vercel deployment configuration
└── README.md           # This file
```

## 🛠️ Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/glowleaf/llmstxt.git
   cd llmstxt
   ```

2. **Open in your browser:**
   Simply open `index.html` in your web browser, or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```

3. **Test the AI features:**
   - Try analyzing different websites
   - Edit the generated content
   - Test the regeneration feature

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy AI-powered llms.txt generator"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [https://vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click **"New Project"**
   - Import your `llmstxt` repository
   - Click **"Deploy"**

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

## 🎨 Customization

### AI Analysis Settings
Edit `script.js` to customize:
- CORS proxy endpoints
- Content extraction patterns
- Service keyword recognition
- AI suggestion algorithms

### Styling
Edit `style.css` to customize:
- AI status indicators
- Loading animations
- Color schemes
- Responsive breakpoints

### Content Structure
The generated `llms.txt` follows this structure:
- Company header with URL and date
- AI-generated business description
- Extracted services/products list
- Geographic coverage (if detected)
- Contact information (if found)
- Additional business highlights
- Instructions for AI models

## 🔧 Advanced Features

### Multi-Proxy Support
The app uses multiple CORS proxies for reliable access:
- `api.allorigins.win`
- `corsproxy.io`
- `cors-anywhere.herokuapp.com`

### Content Extraction Patterns
- **Service Detection**: Recognizes 20+ service-related keywords
- **Contact Parsing**: Regex patterns for emails and phone numbers
- **Geographic Recognition**: Identifies location mentions and service areas
- **Business Highlights**: Extracts years of experience, awards, certifications

### Field Status Tracking
- 🤖 **AI Generated**: Shows content created by AI analysis
- ✏️ **User Edited**: Indicates fields modified by the user
- 🔄 **Regeneration**: Option to get fresh AI suggestions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/ai-enhancement`)
3. Commit your changes (`git commit -m 'Add AI enhancement'`)
4. Push to the branch (`git push origin feature/ai-enhancement`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Related Links

- [LLMs.txt Official Site](https://llmstxt.org)
- [Vercel Documentation](https://vercel.com/docs)
- [CORS Proxy Services](https://github.com/Rob--W/cors-anywhere)

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the [LLMs.txt documentation](https://llmstxt.org)
- Test with different websites to see AI analysis in action

---

**Made with ❤️ and 🤖 AI for the developer community** 