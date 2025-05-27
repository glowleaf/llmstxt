# 🤖 LLMs.txt Generator

A minimal static web application for generating structured `llms.txt` files to help AI models better understand your business.

## 🌟 Features

- **Simple Form Interface**: Easy-to-use form for entering business information
- **Real-time Generation**: Instantly generates properly formatted `llms.txt` content
- **Copy to Clipboard**: One-click copying of generated content
- **Download File**: Direct download as `llms.txt` file
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **No Backend Required**: Pure HTML, CSS, and JavaScript

## 🚀 Live Demo

Visit the live application: [Your Vercel URL will be here after deployment]

## 📁 Project Structure

```
llmstxt/
├── index.html          # Main HTML file with form
├── style.css           # Styling and responsive design
├── script.js           # JavaScript functionality
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

3. **Make edits:**
   - Edit `index.html` for structure changes
   - Edit `style.css` for styling modifications
   - Edit `script.js` for functionality updates

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
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

3. **Follow the prompts:**
   - Link to existing project or create new
   - Choose settings (defaults work fine)
   - Deploy!

## 📝 How to Use

1. **Fill out the form:**
   - Enter your website URL
   - Describe your business
   - List your services/products
   - Add regions, contact info, and additional details

2. **Generate:**
   - Click "Generate LLMs.txt"
   - Review the formatted output

3. **Use the content:**
   - Copy to clipboard or download as file
   - Upload to your website as `/llms.txt`

## 🎨 Customization

### Styling
Edit `style.css` to customize:
- Colors and gradients
- Typography
- Layout and spacing
- Responsive breakpoints

### Functionality
Edit `script.js` to modify:
- Form validation rules
- Output format
- Additional fields
- Export options

### Content Structure
The generated `llms.txt` follows this structure:
- Company header with URL and date
- Business description
- Services/products list
- Geographic coverage (optional)
- Contact information (optional)
- Additional information (optional)
- Instructions for AI models

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Related Links

- [LLMs.txt Official Site](https://llmstxt.org)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages](https://pages.github.com/)

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the [LLMs.txt documentation](https://llmstxt.org)

---

**Made with ❤️ for the AI community** 