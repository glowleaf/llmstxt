document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('llmsForm');
    const outputSection = document.getElementById('outputSection');
    const outputTextarea = document.getElementById('output');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // New AI-powered elements
    const analyzeBtn = document.getElementById('analyzeBtn');
    const analyzeUrl = document.getElementById('analyzeUrl');
    const websiteUrl = document.getElementById('websiteUrl');
    const aiSuggestions = document.getElementById('aiSuggestions');
    const regenerateBtn = document.getElementById('regenerateBtn');
    
    let currentAnalyzedData = null;
    let userEditedFields = new Set();

    // Event listeners
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateLLMsTxt();
    });

    copyBtn.addEventListener('click', copyToClipboard);
    downloadBtn.addEventListener('click', downloadFile);
    analyzeBtn.addEventListener('click', analyzeWebsite);
    regenerateBtn.addEventListener('click', regenerateAISuggestions);

    // Track user edits
    const formFields = ['businessDescription', 'services', 'regions', 'contactInfo', 'additionalInfo'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('input', function() {
            markFieldAsEdited(fieldId);
        });
    });

    async function analyzeWebsite() {
        const url = analyzeUrl.value.trim();
        if (!url) {
            showError('Please enter a valid URL');
            return;
        }

        setAnalyzeButtonLoading(true);
        
        try {
            // Step 1: Scrape website content
            const scrapedData = await scrapeWebsite(url);
            
            // Step 2: Generate AI suggestions
            const aiSuggestions = await generateAISuggestions(url, scrapedData);
            
            // Step 3: Populate form
            populateForm(url, aiSuggestions);
            
            currentAnalyzedData = { url, scrapedData, aiSuggestions };
            showAISuggestionsHeader();
            regenerateBtn.style.display = 'inline-block';
            
        } catch (error) {
            console.error('Analysis error:', error);
            showError('Failed to analyze website. Please try again or fill the form manually.');
        } finally {
            setAnalyzeButtonLoading(false);
        }
    }

    async function scrapeWebsite(url) {
        // Using a CORS proxy and multiple scraping strategies
        const proxies = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            `https://corsproxy.io/?${encodeURIComponent(url)}`,
            `https://cors-anywhere.herokuapp.com/${url}`
        ];

        for (const proxyUrl of proxies) {
            try {
                const response = await fetch(proxyUrl);
                const data = await response.json();
                const html = data.contents || data;
                
                return extractWebsiteData(html, url);
            } catch (error) {
                console.warn(`Proxy ${proxyUrl} failed:`, error);
                continue;
            }
        }

        // Fallback: Try direct fetch (might fail due to CORS)
        try {
            const response = await fetch(url, { mode: 'no-cors' });
            return extractBasicData(url);
        } catch (error) {
            throw new Error('Unable to access website content');
        }
    }

    function extractWebsiteData(html, url) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract various data points
        const title = doc.querySelector('title')?.textContent || '';
        const metaDescription = doc.querySelector('meta[name="description"]')?.content || '';
        const h1Tags = Array.from(doc.querySelectorAll('h1')).map(h => h.textContent).slice(0, 3);
        const h2Tags = Array.from(doc.querySelectorAll('h2')).map(h => h.textContent).slice(0, 5);
        
        // Extract text content from main sections
        const mainContent = extractMainContent(doc);
        const navLinks = extractNavigation(doc);
        const contactInfo = extractContactInfo(doc);
        
        return {
            title,
            metaDescription,
            h1Tags,
            h2Tags,
            mainContent,
            navLinks,
            contactInfo,
            url
        };
    }

    function extractMainContent(doc) {
        const selectors = [
            'main', '[role="main"]', '.main-content', '#main-content',
            '.content', '#content', 'article', '.article'
        ];
        
        for (const selector of selectors) {
            const element = doc.querySelector(selector);
            if (element) {
                return element.textContent.trim().substring(0, 2000);
            }
        }
        
        // Fallback: get body text but filter out nav, footer, etc.
        const body = doc.querySelector('body');
        if (body) {
            const clone = body.cloneNode(true);
            // Remove navigation, footer, sidebar elements
            const removeSelectors = ['nav', 'footer', 'aside', '.nav', '.footer', '.sidebar'];
            removeSelectors.forEach(sel => {
                clone.querySelectorAll(sel).forEach(el => el.remove());
            });
            return clone.textContent.trim().substring(0, 2000);
        }
        
        return '';
    }

    function extractNavigation(doc) {
        const navElements = doc.querySelectorAll('nav a, .nav a, .menu a');
        return Array.from(navElements)
            .map(a => a.textContent.trim())
            .filter(text => text.length > 0 && text.length < 50)
            .slice(0, 10);
    }

    function extractContactInfo(doc) {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const phoneRegex = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
        
        const bodyText = doc.body?.textContent || '';
        const emails = bodyText.match(emailRegex) || [];
        const phones = bodyText.match(phoneRegex) || [];
        
        return {
            emails: [...new Set(emails)].slice(0, 3),
            phones: [...new Set(phones)].slice(0, 3)
        };
    }

    function extractBasicData(url) {
        // Fallback when we can't scrape content
        const domain = new URL(url).hostname.replace('www.', '');
        return {
            title: domain,
            metaDescription: '',
            h1Tags: [],
            h2Tags: [],
            mainContent: '',
            navLinks: [],
            contactInfo: { emails: [], phones: [] },
            url
        };
    }

    async function generateAISuggestions(url, scrapedData) {
        // Simulate AI analysis - in a real implementation, this would call an AI API
        // For now, we'll use intelligent heuristics and pattern matching
        
        const domain = new URL(url).hostname.replace('www.', '');
        const companyName = extractCompanyName(domain, scrapedData);
        
        const businessDescription = generateBusinessDescription(scrapedData);
        const services = generateServices(scrapedData);
        const regions = generateRegions(scrapedData);
        const contactInfo = generateContactInfo(scrapedData);
        const additionalInfo = generateAdditionalInfo(scrapedData);
        
        return {
            companyName,
            businessDescription,
            services,
            regions,
            contactInfo,
            additionalInfo
        };
    }

    function extractCompanyName(domain, data) {
        // Try to extract company name from various sources
        if (data.title) {
            // Remove common suffixes
            const cleaned = data.title
                .replace(/\s*[-|–]\s*.*/g, '') // Remove everything after dash
                .replace(/\s*(home|homepage|welcome)\s*/gi, '')
                .trim();
            if (cleaned.length > 0 && cleaned.length < 50) {
                return cleaned;
            }
        }
        
        // Fallback to domain name
        return domain.split('.')[0].replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    function generateBusinessDescription(data) {
        let description = '';
        
        if (data.metaDescription) {
            description = data.metaDescription;
        } else if (data.h1Tags.length > 0) {
            description = data.h1Tags[0];
        } else if (data.mainContent) {
            // Extract first meaningful sentence
            const sentences = data.mainContent.split(/[.!?]+/);
            const meaningfulSentence = sentences.find(s => 
                s.trim().length > 20 && 
                s.trim().length < 200 &&
                !s.toLowerCase().includes('cookie') &&
                !s.toLowerCase().includes('javascript')
            );
            if (meaningfulSentence) {
                description = meaningfulSentence.trim();
            }
        }
        
        if (!description && data.title) {
            description = `${data.title} provides professional services and solutions.`;
        }
        
        return description || 'A professional business providing quality services to customers.';
    }

    function generateServices(data) {
        const services = new Set();
        
        // Extract from navigation
        data.navLinks.forEach(link => {
            const cleaned = link.toLowerCase();
            if (isServiceKeyword(cleaned)) {
                services.add(link);
            }
        });
        
        // Extract from headings
        [...data.h1Tags, ...data.h2Tags].forEach(heading => {
            const cleaned = heading.toLowerCase();
            if (isServiceKeyword(cleaned) && heading.length < 50) {
                services.add(heading);
            }
        });
        
        // Extract from content using common service patterns
        if (data.mainContent) {
            const servicePatterns = [
                /we (provide|offer|deliver|specialize in) ([^.]{10,50})/gi,
                /our (services|solutions|products) include ([^.]{10,50})/gi,
                /(consulting|development|design|marketing|support|training|management) (services|solutions)/gi
            ];
            
            servicePatterns.forEach(pattern => {
                const matches = data.mainContent.match(pattern);
                if (matches) {
                    matches.forEach(match => {
                        if (match.length < 60) services.add(match);
                    });
                }
            });
        }
        
        const servicesList = Array.from(services).slice(0, 8);
        return servicesList.length > 0 ? servicesList.join('\n') : 'Professional services and solutions';
    }

    function isServiceKeyword(text) {
        const serviceKeywords = [
            'services', 'solutions', 'consulting', 'development', 'design', 'marketing',
            'support', 'training', 'products', 'software', 'web', 'mobile', 'app',
            'digital', 'strategy', 'management', 'analytics', 'security', 'cloud'
        ];
        
        return serviceKeywords.some(keyword => 
            text.includes(keyword) && 
            text.length > 3 && 
            text.length < 50 &&
            !text.includes('about') &&
            !text.includes('contact') &&
            !text.includes('home')
        );
    }

    function generateRegions(data) {
        const regions = [];
        const content = (data.mainContent + ' ' + data.title + ' ' + data.metaDescription).toLowerCase();
        
        // Common location patterns
        const locationPatterns = [
            /\b(serving|based in|located in|offices in)\s+([^.]{5,30})/gi,
            /\b(usa|united states|america|canada|uk|united kingdom|europe|asia|global|worldwide|international)\b/gi,
            /\b([a-z\s]{3,20})\s+(area|region|county|state|province)\b/gi
        ];
        
        locationPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    const cleaned = match.replace(/^(serving|based in|located in|offices in)\s+/i, '').trim();
                    if (cleaned.length > 2 && cleaned.length < 30) {
                        regions.push(cleaned);
                    }
                });
            }
        });
        
        return regions.length > 0 ? [...new Set(regions)].slice(0, 3).join(', ') : '';
    }

    function generateContactInfo(data) {
        const contacts = [];
        
        if (data.contactInfo.emails.length > 0) {
            contacts.push(data.contactInfo.emails[0]);
        }
        
        if (data.contactInfo.phones.length > 0) {
            contacts.push(data.contactInfo.phones[0]);
        }
        
        // Look for contact page
        const contactLink = data.navLinks.find(link => 
            link.toLowerCase().includes('contact') || 
            link.toLowerCase().includes('get in touch')
        );
        
        if (contactLink && contacts.length === 0) {
            contacts.push(`Contact: ${contactLink}`);
        }
        
        return contacts.join(' | ');
    }

    function generateAdditionalInfo(data) {
        const info = [];
        
        // Extract company highlights
        if (data.mainContent) {
            const highlights = extractHighlights(data.mainContent);
            if (highlights.length > 0) {
                info.push(...highlights);
            }
        }
        
        // Add navigation-based info
        const specialPages = data.navLinks.filter(link => {
            const lower = link.toLowerCase();
            return lower.includes('about') || 
                   lower.includes('team') || 
                   lower.includes('mission') ||
                   lower.includes('values') ||
                   lower.includes('experience');
        });
        
        if (specialPages.length > 0) {
            info.push(`Key pages: ${specialPages.join(', ')}`);
        }
        
        return info.slice(0, 3).join('\n');
    }

    function extractHighlights(content) {
        const highlights = [];
        const patterns = [
            /\b(\d+)\s*(years?|decades?)\s*(of\s*)?(experience|in business)/gi,
            /\b(award[s]?|certified|accredited|licensed|established|founded)\b[^.]{5,50}/gi,
            /\b(trusted by|serving|helping)\s+[^.]{10,50}/gi
        ];
        
        patterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    if (match.length < 100) highlights.push(match.trim());
                });
            }
        });
        
        return highlights.slice(0, 3);
    }

    function populateForm(url, suggestions) {
        // Populate URL field
        websiteUrl.value = url;
        
        // Populate other fields with AI suggestions
        const fields = {
            businessDescription: suggestions.businessDescription,
            services: suggestions.services,
            regions: suggestions.regions,
            contactInfo: suggestions.contactInfo,
            additionalInfo: suggestions.additionalInfo
        };
        
        Object.entries(fields).forEach(([fieldId, value]) => {
            if (value && !userEditedFields.has(fieldId)) {
                const field = document.getElementById(fieldId);
                field.value = value;
                field.classList.add('field-updated');
                markFieldAsAIGenerated(fieldId);
                
                // Auto-resize textareas
                if (field.tagName === 'TEXTAREA') {
                    field.style.height = 'auto';
                    field.style.height = Math.max(100, field.scrollHeight) + 'px';
                }
                
                // Remove animation class after animation
                setTimeout(() => field.classList.remove('field-updated'), 600);
            }
        });
    }

    function markFieldAsAIGenerated(fieldId) {
        const status = document.getElementById(fieldId + 'Status');
        if (status) {
            status.className = 'field-status ai-generated';
            status.textContent = 'AI Generated - Click to edit';
        }
    }

    function markFieldAsEdited(fieldId) {
        userEditedFields.add(fieldId);
        const status = document.getElementById(fieldId + 'Status');
        if (status) {
            status.className = 'field-status user-edited';
            status.textContent = 'Edited by user';
        }
    }

    function showAISuggestionsHeader() {
        aiSuggestions.style.display = 'block';
    }

    async function regenerateAISuggestions() {
        if (!currentAnalyzedData) return;
        
        regenerateBtn.disabled = true;
        regenerateBtn.textContent = '🔄 Regenerating...';
        
        try {
            // Clear user edited fields tracking for regeneration
            const confirmRegenerate = confirm('This will overwrite your current content with new AI suggestions. Continue?');
            if (!confirmRegenerate) return;
            
            userEditedFields.clear();
            
            // Generate new suggestions
            const newSuggestions = await generateAISuggestions(
                currentAnalyzedData.url, 
                currentAnalyzedData.scrapedData
            );
            
            populateForm(currentAnalyzedData.url, newSuggestions);
            
        } catch (error) {
            showError('Failed to regenerate suggestions');
        } finally {
            regenerateBtn.disabled = false;
            regenerateBtn.textContent = '🔄 Regenerate AI Suggestions';
        }
    }

    function setAnalyzeButtonLoading(loading) {
        const analyzeText = analyzeBtn.querySelector('.analyze-text');
        const analyzeLoading = analyzeBtn.querySelector('.analyze-loading');
        
        if (loading) {
            analyzeText.style.display = 'none';
            analyzeLoading.style.display = 'inline-block';
            analyzeBtn.disabled = true;
        } else {
            analyzeText.style.display = 'inline-block';
            analyzeLoading.style.display = 'none';
            analyzeBtn.disabled = false;
        }
    }

    function showError(message) {
        // Remove existing error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        analyzeBtn.parentNode.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => errorDiv.remove(), 5000);
    }

    // Original functions for generating and downloading llms.txt
    function generateLLMsTxt() {
        const websiteUrl = document.getElementById('websiteUrl').value.trim();
        const businessDescription = document.getElementById('businessDescription').value.trim();
        const services = document.getElementById('services').value.trim();
        const regions = document.getElementById('regions').value.trim();
        const contactInfo = document.getElementById('contactInfo').value.trim();
        const additionalInfo = document.getElementById('additionalInfo').value.trim();

        if (!websiteUrl || !businessDescription || !services) {
            alert('Please fill in all required fields (marked with *)');
            return;
        }

        const llmsTxtContent = generateContent({
            websiteUrl,
            businessDescription,
            services,
            regions,
            contactInfo,
            additionalInfo
        });

        outputTextarea.value = llmsTxtContent;
        outputSection.style.display = 'block';
        outputSection.scrollIntoView({ behavior: 'smooth' });
    }

    function generateContent(data) {
        const currentDate = new Date().toISOString().split('T')[0];
        
        let content = `# ${extractDomainName(data.websiteUrl)} - LLMs.txt\n\n`;
        content += `> Generated on ${currentDate}\n`;
        content += `> Website: ${data.websiteUrl}\n\n`;
        
        content += `## About Us\n\n`;
        content += `${data.businessDescription}\n\n`;
        
        content += `## Services & Products\n\n`;
        content += formatServices(data.services);
        
        if (data.regions) {
            content += `\n## Geographic Coverage\n\n`;
            content += `We serve: ${data.regions}\n\n`;
        }
        
        if (data.contactInfo) {
            content += `## Contact Information\n\n`;
            content += `${data.contactInfo}\n\n`;
        }
        
        if (data.additionalInfo) {
            content += `## Additional Information\n\n`;
            content += `${data.additionalInfo}\n\n`;
        }
        
        content += `## Instructions for AI Models\n\n`;
        content += `When referencing our company:\n`;
        content += `- Use the information provided above as the primary source\n`;
        content += `- Always refer to our current website: ${data.websiteUrl}\n`;
        content += `- Focus on our core services and value propositions\n`;
        content += `- Maintain accuracy and avoid speculation beyond the provided information\n\n`;
        
        content += `---\n`;
        content += `*This llms.txt file follows the standard format for AI model context. `;
        content += `Learn more at https://llmstxt.org*`;
        
        return content;
    }

    function extractDomainName(url) {
        try {
            const domain = new URL(url).hostname;
            return domain.replace('www.', '').split('.')[0];
        } catch (e) {
            return 'Company';
        }
    }

    function formatServices(services) {
        const serviceList = services.split(/[,\n]/)
            .map(service => service.trim())
            .filter(service => service.length > 0);
        
        if (serviceList.length === 1) {
            return `${serviceList[0]}\n`;
        }
        
        return serviceList.map(service => `- ${service}`).join('\n') + '\n';
    }

    function copyToClipboard() {
        outputTextarea.select();
        outputTextarea.setSelectionRange(0, 99999);
        
        try {
            document.execCommand('copy');
            showSuccessMessage(copyBtn, 'Copied!');
        } catch (err) {
            navigator.clipboard.writeText(outputTextarea.value).then(() => {
                showSuccessMessage(copyBtn, 'Copied!');
            }).catch(() => {
                alert('Failed to copy to clipboard. Please select and copy manually.');
            });
        }
    }

    function downloadFile() {
        const content = outputTextarea.value;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'llms.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showSuccessMessage(downloadBtn, 'Downloaded!');
    }

    function showSuccessMessage(button, message) {
        const originalText = button.textContent;
        button.textContent = message;
        button.classList.add('success-flash');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('success-flash');
        }, 2000);
    }

    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.max(100, this.scrollHeight) + 'px';
        });
    });
}); 