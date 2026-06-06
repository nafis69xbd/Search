Multi Source Search API

A fast and lightweight search API built for Vercel. This API collects data from multiple public sources and returns the most relevant result based on source ranking and query analysis.

Features

- Multi-source search engine
- Smart source routing
- Deep search mode
- GitHub repository search
- Wikipedia search
- StackOverflow search
- DuckDuckGo search
- Source ranking system
- Related search suggestions
- Search performance metrics
- Status endpoint
- Trending endpoint
- Vercel ready
- No API key required

Sources

- GitHub
- Wikipedia
- StackOverflow
- DuckDuckGo

Installation

Clone the repository:

git clone https://github.com/nafis69xbd/Search
cd Search

Install dependencies:

npm install

Run locally:

vercel dev

Deployment

Deploy directly to Vercel:

vercel

Endpoints

Search

GET /?q=python

Example:

https://search-tau-ten.vercel.app/?q=python

GitHub Search

GET /?q=telegram&type=github

Wikipedia Search

GET /?q=openai&type=wiki

StackOverflow Search

GET /?q=nodejs&type=stackoverflow

DuckDuckGo Search

GET /?q=chatgpt&type=duckduckgo

Deep Search

GET /?q=telegram bot&deepsearch=true

Deep Search checks all available sources and returns the highest-ranked result.

Status

GET /status

Trending

GET /trending

Response Example

{
  "status": true,
  "query": "best python lib for telegram bot",
  "search_time_ms": 421,
  "confidence": "98%",
  "source_used": "GitHub",
  "result": {
    "source": "GitHub",
    "score": 98,
    "title": "python-telegram-bot/python-telegram-bot",
    "description": "A pure Python interface for the Telegram Bot API",
    "url": "https://github.com/python-telegram-bot/python-telegram-bot"
  },
  "sources_checked": [
    "GitHub",
    "StackOverflow",
    "Wikipedia",
    "DuckDuckGo"
  ],
  "related_searches": [
    "python tutorial",
    "python github",
    "python guide"
  ],
  "total_results": 4,
  "api_dev": "@nafis_69x",
  "updates": "@xoreez"
}

Project Structure
 
├── search/main.js
└── vercel.json

Performance

- Lightweight architecture
- Serverless deployment
- Fast response times
- Optimized source selection
- Parallel deep search execution

Roadmap

- AI-powered summaries
- News search
- Image search
- Video search
- Language detection
- Search analytics
- Advanced ranking engine
- Cached search results

License

MIT License

Credits

API Developer: @nafis_69x

Updates: @xoreez