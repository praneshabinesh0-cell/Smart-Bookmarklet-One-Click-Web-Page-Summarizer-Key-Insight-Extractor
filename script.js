<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart AI Page Summarizer Mini-App</title>
    <style>
        :root {
            --bg-color: #0b132b;
            --card-bg: rgba(28, 37, 65, 0.75);
            --border-color: rgba(255, 255, 255, 0.12);
            --accent-green: #6fffe9;
            --accent-mint: #5bc0be;
            --text-primary: #f4f7f6;
            --text-secondary: #a0aec0;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            max-width: 650px;
            width: 100%;
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        h1 {
            font-size: 1.8rem;
            color: var(--accent-green);
            margin-bottom: 8px;
        }

        p.subtitle {
            color: var(--text-secondary);
            font-size: 0.95rem;
            margin-bottom: 24px;
        }

        .bookmarklet-area {
            background: rgba(0, 0, 0, 0.3);
            border: 1px dashed var(--accent-mint);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 24px;
        }

        .bookmarklet-btn {
            display: inline-block;
            background: var(--accent-mint);
            color: var(--bg-color);
            font-weight: 700;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            cursor: grab;
            transition: transform 0.2s, background 0.2s;
        }

        .bookmarklet-btn:hover {
            transform: translateY(-2px);
            background: var(--accent-green);
        }

        .test-box {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        textarea {
            width: 100%;
            height: 120px;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 12px;
            color: var(--text-primary);
            resize: vertical;
            font-size: 0.9rem;
        }

        textarea:focus {
            outline: none;
            border-color: var(--accent-mint);
        }

        button.action-btn {
            background: transparent;
            border: 1px solid var(--accent-green);
            color: var(--accent-green);
            padding: 12px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        button.action-btn:hover {
            background: var(--accent-green);
            color: var(--bg-color);
        }

        /* Overlay modal injected into DOM */
        #summary-overlay {
            display: none;
            position: fixed;
            top: 20px;
            right: 20px;
            width: 360px;
            background: rgba(11, 19, 43, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid var(--accent-green);
            border-radius: 12px;
            padding: 20px;
            z-index: 99999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.6);
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from { transform: translateX(50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        .overlay-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 10px;
            margin-bottom: 12px;
        }

        .overlay-header h3 {
            font-size: 1.1rem;
            color: var(--accent-green);
        }

        .close-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.2rem;
            cursor: pointer;
        }

        .meta-tag {
            display: inline-block;
            background: rgba(111, 255, 233, 0.15);
            color: var(--accent-green);
            font-size: 0.75rem;
            padding: 4px 8px;
            border-radius: 4px;
            margin-bottom: 12px;
        }

        .bullet-list {
            list-style: none;
            font-size: 0.88rem;
            line-height: 1.5;
            color: #d1d5db;
        }

        .bullet-list li {
            margin-bottom: 8px;
            position: relative;
            padding-left: 16px;
        }

        .bullet-list li::before {
            content: "•";
            color: var(--accent-mint);
            position: absolute;
            left: 0;
            font-weight: bold;
        }
    </style>
</head>
<body>

    <div class="container">
        <h1>Smart Page Summarizer</h1>
        <p class="subtitle">Extract core insights & key takeaways in 1 click.</p>

        <div class="bookmarklet-area">
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">
                Drag this button to your Browser Bookmarks Bar:
            </p>
            <a class="bookmarklet-btn" href="javascript:(function(){
                let t=document.body.innerText.substring(0,3000);
                alert('Summarizing current page context:\n\n' + t.substring(0, 150) + '...');
            })();">⚡ Summarize Page</a>
        </div>

        <div class="test-box">
            <label style="font-size: 0.85rem; color: var(--text-secondary);">Test with custom text or article excerpt:</label>
            <textarea id="sample-text" placeholder="Paste article text here to test the summary overlay..."></textarea>
            <button class="action-btn" onclick="generateSummary()">Generate Summary Overlay</button>
        </div>
    </div>

    <!-- UI Overlay for Output -->
    <div id="summary-overlay">
        <div class="overlay-header">
            <h3>⚡ Executive Summary</h3>
            <button class="close-btn" onclick="closeOverlay()">✕</button>
        </div>
        <div class="meta-tag" id="reading-time">⏱️ 2 min read • 3 key takeaways</div>
        <ul class="bullet-list" id="summary-bullets">
            <!-- Dynamically populated -->
        </ul>
    </div>

    <script>
        function generateSummary() {
            const input = document.getElementById('sample-text').value.trim();
            const overlay = document.getElementById('summary-overlay');
            const bulletContainer = document.getElementById('summary-bullets');
            const readingTimeTag = document.getElementById('reading-time');

            if (!input) {
                alert("Please paste some text first!");
                return;
            }

            // Word count and reading time calculation
            const wordCount = input.split(/\s+/).filter(Boolean).length;
            const readTime = Math.max(1, Math.ceil(wordCount / 200));
            readingTimeTag.innerText = `⏱️ ${readTime} min read • ${wordCount} words analyzed`;

            // Simple Extractive Summarization Logic (Grabs top 3 sentences as mock LLM output)
            const sentences = input.match(/[^.!?]+[.!?]+/g) || [input];
            const keyPoints = sentences.slice(0, 3);

            bulletContainer.innerHTML = '';
            keyPoints.forEach(point => {
                const li = document.createElement('li');
                li.innerText = point.trim();
                bulletContainer.appendChild(li);
            });

            overlay.style.display = 'block';
        }

        function closeOverlay() {
            document.getElementById('summary-overlay').style.display = 'none';
        }
    </script>
</body>
</html>
