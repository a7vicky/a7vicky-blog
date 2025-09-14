// Blog Application
class BlogApp {
    constructor() {
        this.posts = [];
        this.currentFilter = 'all';
        this.theme = localStorage.getItem('theme') || 'light';
        this.postDirectory = 'posts/';
        this.currentView = 'home'; // 'home' or 'post'
        this.currentPost = null;
        this.postFiles = [
            // Personal posts (only existing files)
            { file: 'personal/my-sre-journey.md', topic: 'personal' }
        ];
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.setupRouting();
        this.loadPosts();
    }

    // Theme Management
    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = this.theme === 'light' ? '🌙' : '☀️';
    }

    // Event Listeners
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                this.filterPosts(topic);
            });
        });

        // Browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            this.handleRouteChange();
        });
    }

    // URL Routing System
    setupRouting() {
        this.handleRouteChange();
    }

    handleRouteChange() {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('post');
        const topic = urlParams.get('topic') || 'all';

        if (postId) {
            this.showPostPage(parseInt(postId));
        } else {
            this.showHomePage();
            this.filterPosts(topic);
        }
    }

    navigateToPost(postId) {
        const url = new URL(window.location);
        url.searchParams.set('post', postId);
        window.history.pushState({ postId }, '', url);
        this.showPostPage(postId);
    }

    navigateToHome(topic = 'all') {
        const url = new URL(window.location);
        url.searchParams.delete('post');
        if (topic !== 'all') {
            url.searchParams.set('topic', topic);
        } else {
            url.searchParams.delete('topic');
        }
        window.history.pushState({ topic }, '', url);
        this.showHomePage();
        this.filterPosts(topic);
    }

    // Post Management
    async loadPosts() {
        this.showLoading();
        
        try {
            await this.loadPostsFromFiles();
            this.renderPosts();
        } catch (error) {
            console.error('Error loading posts:', error);
            this.showError();
        }
    }

    async loadPostsFromFiles() {
        this.posts = [];
        console.log('Loading posts from files:', this.postFiles);
        
        for (let i = 0; i < this.postFiles.length; i++) {
            const postFile = this.postFiles[i];
            console.log(`Attempting to load: ${this.postDirectory}${postFile.file}`);
            try {
                const response = await fetch(`${this.postDirectory}${postFile.file}`);
                console.log(`Response status for ${postFile.file}:`, response.status);
                if (response.ok) {
                    const markdown = await response.text();
                    console.log(`Loaded markdown for ${postFile.file}, length:`, markdown.length);
                    const post = this.parseMarkdownPost(markdown, postFile, i + 1);
                    if (post) {
                        console.log(`Parsed post:`, post.title);
                        this.posts.push(post);
                    }
                } else {
                    console.warn(`Could not load post: ${postFile.file}, status: ${response.status}`);
                }
            } catch (error) {
                console.warn(`Error loading post ${postFile.file}:`, error);
                // Continue loading other posts even if one fails
            }
        }
        
        console.log(`Total posts loaded: ${this.posts.length}`);
        
        // If no posts loaded from files, use demo posts as fallback
        if (this.posts.length === 0) {
            console.log('No posts loaded, using demo posts');
            this.loadDemoPosts();
        }
    }

    parseMarkdownPost(markdown, postFile, id) {
        const lines = markdown.split('\n');
        let title = '';
        let topic = postFile.topic;
        let date = new Date().toISOString().split('T')[0];
        let readTime = '5 min read';
        let excerpt = '';
        let content = markdown;

        // Extract metadata from markdown
        for (let i = 0; i < Math.min(lines.length, 20); i++) {
            const line = lines[i].trim();
            
            // Extract title from first # heading
            if (line.startsWith('# ') && !title) {
                title = line.substring(2).trim();
            }
            
            // Extract metadata from bold markers
            if (line.startsWith('**Topic:**')) {
                topic = line.replace('**Topic:**', '').trim();
            }
            if (line.startsWith('**Date:**')) {
                date = line.replace('**Date:**', '').trim();
            }
            if (line.startsWith('**Read Time:**')) {
                readTime = line.replace('**Read Time:**', '').trim();
            }
            if (line.startsWith('**Excerpt:**')) {
                excerpt = line.replace('**Excerpt:**', '').trim();
            }
        }

        // If no excerpt found, create one from the first paragraph
        if (!excerpt) {
            const contentLines = lines.filter(line => 
                line.trim() && 
                !line.startsWith('#') && 
                !line.startsWith('**') &&
                !line.startsWith('---')
            );
            if (contentLines.length > 0) {
                excerpt = contentLines[0].substring(0, 150) + (contentLines[0].length > 150 ? '...' : '');
            }
        }

        return {
            id,
            title: title || `Post ${id}`,
            topic,
            excerpt,
            content,
            date,
            readTime,
            file: postFile.file
        };
    }

    loadDemoPosts() {
        // Fallback demo posts when files can't be loaded
        this.posts = [
            {
                id: 1,
                title: "Getting Started with JavaScript ES6",
                topic: "tech",
                excerpt: "Learn the fundamental features of ES6 that will make your JavaScript code more modern and efficient.",
                content: `# Getting Started with JavaScript ES6

ES6 introduced many powerful features that have transformed how we write JavaScript. Here are some key features:

## Arrow Functions
\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`;
\`\`\`

## Destructuring
\`\`\`javascript
const { name, age } = person;
\`\`\`

## Template Literals
\`\`\`javascript
const message = \`Welcome \${name}, you are \${age} years old.\`;
\`\`\`

These features make JavaScript more expressive and easier to read.`,
                date: "2025-09-10",
                readTime: "5 min read",
                file: "tech/javascript-es6.md"
            },
            {
                id: 2,
                title: "My Journey into Open Source",
                topic: "personal",
                excerpt: "Reflections on contributing to open source projects and the lessons learned along the way.",
                content: `# My Journey into Open Source

Contributing to open source has been one of the most rewarding aspects of my development career.

## Why Open Source?
- **Learning**: Exposure to different coding styles and architectures
- **Community**: Meeting developers from around the world
- **Impact**: Building tools that help other developers

## Getting Started
1. Find projects that interest you
2. Start with small contributions (documentation, bug fixes)
3. Be patient and persistent
4. Follow contribution guidelines

## Key Lessons
- Communication is as important as code
- Every contribution matters, no matter how small
- The community is generally welcoming and helpful

Open source isn't just about code - it's about collaboration and building something together.`,
                date: "2025-09-05",
                readTime: "6 min read",
                file: "personal/open-source-journey.md"
            }
        ];
    }

    // Post Rendering
    renderPosts() {
        const filteredPosts = this.getFilteredPosts();
        const postsGrid = document.getElementById('postsGrid');
        const postsCount = document.getElementById('postsCount');
        const loading = document.getElementById('loading');
        const emptyState = document.getElementById('emptyState');

        // Hide loading
        loading.style.display = 'none';

        // Update posts count
        postsCount.textContent = `${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''}`;

        if (filteredPosts.length === 0) {
            postsGrid.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        postsGrid.innerHTML = filteredPosts.map(post => this.createPostCard(post)).join('');

        // Add click listeners to post cards
        this.addPostClickListeners();
    }

    createPostCard(post) {
        return this.renderTemplate('postCard', {
            id: post.id,
            topic: post.topic,
            title: post.title,
            excerpt: post.excerpt,
            date: this.formatDate(post.date),
            readTime: post.readTime,
            fileName: post.file ? post.file.split('/').pop().replace('.md', '') : `post-${post.id}`
        });
    }

    // Template rendering system
    renderTemplate(templateName, data) {
        const templates = {
            postCard: `
                <article class="post-card" data-post-id="{id}" data-file="{fileName}">
                    <div class="post-topic">{topic}</div>
                    <h3 class="post-title">{title}</h3>
                    <p class="post-excerpt">{excerpt}</p>
                    <div class="post-meta">
                        <span class="post-date">{date}</span>
                        <span class="post-read-time">{readTime}</span>
                    </div>
                    <div class="post-file-name">📄 {fileName}.md</div>
                </article>
            `,
            postPage: `
                <div class="post-page-header">
                    <button class="back-btn">← Back to Posts</button>
                    <div class="post-page-meta">
                        <div class="post-topic">{topic}</div>
                        <div class="post-file-info">
                            <span class="post-file-name">📄 {fileName}.md</span>
                        </div>
                    </div>
                </div>
                <article class="post-page-content">
                    <header class="post-header">
                        <h1 class="post-title">{title}</h1>
                        <div class="post-meta">
                            <span class="post-date">{date}</span>
                            <span class="post-read-time">{readTime}</span>
                        </div>
                    </header>
                    <div class="post-content">{content}</div>
                </article>
            `,
            loadingState: `
                <div class="loading-spinner"></div>
                <p>Loading posts from markdown files...</p>
            `,
            emptyState: `
                <div class="empty-icon">📝</div>
                <h3>No posts found</h3>
                <p>Create .md files in the posts directory to see content here!</p>
            `
        };

        const template = templates[templateName];
        if (!template) {
            console.warn(`Template '${templateName}' not found`);
            return '';
        }

        return this.interpolateTemplate(template, data);
    }

    interpolateTemplate(template, data) {
        return template.replace(/\{(\w+)\}/g, (match, key) => {
            return data[key] !== undefined ? data[key] : match;
        });
    }

    addPostClickListeners() {
        const postCards = document.querySelectorAll('.post-card');
        postCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const postId = parseInt(e.currentTarget.getAttribute('data-post-id'));
                this.navigateToPost(postId);
            });
        });
    }

    // Filtering
    filterPosts(topic) {
        this.currentFilter = topic;
        
        // Update active navigation button
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-topic') === topic) {
                btn.classList.add('active');
            }
        });

        // Update URL if we're on home page
        if (this.currentView === 'home') {
            // Handle special case for about section
            if (topic === 'about') {
                this.showAuthorSection();
                this.hidePostsSection();
            } else {
                this.showPostsSection();
                this.hideAuthorSection();
                this.renderPosts();
            }
        }
    }

    getFilteredPosts() {
        if (this.currentFilter === 'all') {
            return this.posts;
        }
        return this.posts.filter(post => post.topic === this.currentFilter);
    }

    // Section Management
    showAuthorSection() {
        document.getElementById('authorSection').style.display = 'block';
    }

    hideAuthorSection() {
        document.getElementById('authorSection').style.display = 'none';
    }

    showPostsSection() {
        document.getElementById('postsSection').style.display = 'block';
    }

    hidePostsSection() {
        document.getElementById('postsSection').style.display = 'none';
    }

    // Page Management
    showHomePage() {
        this.currentView = 'home';
        document.getElementById('homePage').style.display = 'block';
        document.getElementById('postPage').style.display = 'none';
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    showPostPage(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) {
            this.showHomePage();
            return;
        }

        this.currentView = 'post';
        this.currentPost = post;
        
        // Hide home page and show post page
        document.getElementById('homePage').style.display = 'none';
        document.getElementById('postPage').style.display = 'block';

        // Render post content
        this.renderPostPage(post);

        // Scroll to top
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    renderPostPage(post) {
        const postPage = document.getElementById('postPage');
        postPage.innerHTML = this.renderTemplate('postPage', {
            topic: post.topic,
            fileName: post.file ? post.file.split('/').pop().replace('.md', '') : `post-${post.id}`,
            title: post.title,
            date: this.formatDate(post.date),
            readTime: post.readTime,
            content: this.markdownToHtml(post.content)
        });

        // Add back button listener
        const backBtn = postPage.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.navigateToHome(this.currentFilter);
            });
        }
    }

    // Enhanced markdown to HTML converter
    markdownToHtml(markdown) {
        let html = markdown;
        
        // Remove metadata section (everything before ---)
        html = html.replace(/^[\s\S]*?---\n/, '');
        
        // Convert headers (in order from most specific to least)
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        
        // Convert code blocks first (before other processing)
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
        
        // Convert inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Convert bold and italic (be more specific with regex)
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        // Convert links (handle @ mentions and regular links)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
            // Clean up the link text (remove @ if it's a social media handle)
            const cleanText = text.startsWith('@') ? text : text;
            return `<a href="${url}" target="_blank" rel="noopener">${cleanText}</a>`;
        });
        
        // Convert horizontal rules
        html = html.replace(/^---$/gm, '<hr>');
        
        // Convert blockquotes
        html = html.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');
        
        // Process lists more carefully
        const lines = html.split('\n');
        const processedLines = [];
        let inOrderedList = false;
        let inUnorderedList = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            // Check for ordered list items
            if (trimmedLine.match(/^\d+\.\s+/)) {
                if (!inOrderedList) {
                    processedLines.push('<ol>');
                    inOrderedList = true;
                }
                if (inUnorderedList) {
                    processedLines.push('</ul>');
                    inUnorderedList = false;
                }
                const content = trimmedLine.replace(/^\d+\.\s+/, '');
                processedLines.push(`<li>${content}</li>`);
            }
            // Check for unordered list items
            else if (trimmedLine.match(/^[-*+]\s+/)) {
                if (!inUnorderedList) {
                    processedLines.push('<ul>');
                    inUnorderedList = true;
                }
                if (inOrderedList) {
                    processedLines.push('</ol>');
                    inOrderedList = false;
                }
                const content = trimmedLine.replace(/^[-*+]\s+/, '');
                processedLines.push(`<li>${content}</li>`);
            }
            // Regular line
            else {
                // Close any open lists
                if (inOrderedList) {
                    processedLines.push('</ol>');
                    inOrderedList = false;
                }
                if (inUnorderedList) {
                    processedLines.push('</ul>');
                    inUnorderedList = false;
                }
                processedLines.push(line);
            }
        }
        
        // Close any remaining open lists
        if (inOrderedList) processedLines.push('</ol>');
        if (inUnorderedList) processedLines.push('</ul>');
        
        html = processedLines.join('\n');
        
        // Convert paragraphs (split by double newlines)
        const paragraphs = html.split('\n\n');
        const processedParagraphs = paragraphs.map(paragraph => {
            paragraph = paragraph.trim();
            if (!paragraph) return '';
            
            // Skip if already wrapped in HTML tags
            if (paragraph.match(/^<(h[1-6]|ul|ol|li|pre|blockquote|hr|div)/i)) {
                return paragraph;
            }
            
            // Skip if it's a header or list
            if (paragraph.match(/^#{1,6}\s/) || paragraph.includes('<li>') || paragraph.includes('<ol>') || paragraph.includes('<ul>')) {
                return paragraph;
            }
            
            // Check if it's just a single line that should be a paragraph
            const lines = paragraph.split('\n').filter(line => line.trim());
            if (lines.length === 1 && !lines[0].match(/^<\w+/)) {
                return `<p>${paragraph}</p>`;
            }
            
            // Multiple lines - wrap in paragraph if not already HTML
            if (!paragraph.match(/^<\w+/)) {
                return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
            }
            
            return paragraph;
        });
        
        html = processedParagraphs.join('\n\n');
        
        // Clean up extra whitespace and empty elements
        html = html.replace(/\n{3,}/g, '\n\n');
        html = html.replace(/<p>\s*<\/p>/g, '');
        html = html.replace(/^\s+|\s+$/g, '');
        
        return html;
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showLoading() {
        const loading = document.getElementById('loading');
        loading.innerHTML = this.renderTemplate('loadingState', {});
        loading.style.display = 'block';
        document.getElementById('postsSection').style.display = 'none';
    }

    showError() {
        document.getElementById('loading').style.display = 'none';
        const emptyState = document.getElementById('emptyState');
        emptyState.innerHTML = this.renderTemplate('emptyState', {});
        emptyState.style.display = 'block';
        document.getElementById('postsCount').textContent = 'Error loading posts';
    }
}

// Initialize the blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogApp();
}); 