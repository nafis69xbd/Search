export default async function handler(req, res) {
  const start = Date.now()
  const host = req.headers.host || ""

  const url = new URL(req.url, `https://${host}`)
  const pathname = url.pathname

  if (pathname === "/status") {
    return res.status(200).json({
      status: "online",
      version: "1.0.0",
      uptime: process.uptime(),
      sources: [
        "Wikipedia",
        "GitHub",
        "StackOverflow",
        "DuckDuckGo"
      ],
      api_dev: "@nafis_69x",
      updates: "@xoreez"
    })
  }

  if (pathname === "/trending") {
    return res.status(200).json({
      status: true,
      trending: [
        "OpenAI",
        "ChatGPT",
        "Node.js",
        "Python",
        "Telegram Bot",
        "JavaScript",
        "GitHub",
        "AI Tools"
      ],
      api_dev: "@nafis_69x",
      updates: "@xoreez"
    })
  }

  const q = url.searchParams.get("q")
  const type = url.searchParams.get("type")
  const deepsearch = url.searchParams.get("deepsearch")

  if (!q) {
    return res.status(400).json({
      status: false,
      message: "Missing query parameter",
      example: "/?q=best python lib for telegram bot",
      api_dev: "@nafis_69x",
      updates: "@xoreez"
    })
  }

  const related = [
    `${q} tutorial`,
    `${q} github`,
    `${q} guide`,
    `${q} examples`,
    `${q} documentation`
  ]

  async function searchWikipedia(query) {
    try {
      const r = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
      )

      const d = await r.json()

      if (!d.extract) return null

      return {
        source: "Wikipedia",
        score: 90,
        title: d.title,
        description: d.extract,
        url: d.content_urls?.desktop?.page || null
      }
    } catch {
      return null
    }
  }

  async function searchGithub(query) {
    try {
      const r = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=1`
      )

      const d = await r.json()

      if (!d.items?.length) return null

      const repo = d.items[0]

      return {
        source: "GitHub",
        score: 98,
        title: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count
      }
    } catch {
      return null
    }
  }

  async function searchStackOverflow(query) {
    try {
      const r = await fetch(
        `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(query)}&site=stackoverflow`
      )

      const d = await r.json()

      if (!d.items?.length) return null

      const item = d.items[0]

      return {
        source: "StackOverflow",
        score: 92,
        title: item.title,
        description: "Relevant StackOverflow discussion",
        url: item.link
      }
    } catch {
      return null
    }
  }

  async function searchDuckDuckGo(query) {
    try {
      const r = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`
      )

      const d = await r.json()

      if (!d.Abstract) return null

      return {
        source: "DuckDuckGo",
        score: 85,
        title: d.Heading,
        description: d.Abstract,
        url: d.AbstractURL
      }
    } catch {
      return null
    }
  }

  let results = []

  if (type === "wiki") {
    const data = await searchWikipedia(q)
    if (data) results.push(data)
  } else if (type === "github") {
    const data = await searchGithub(q)
    if (data) results.push(data)
  } else if (type === "stackoverflow") {
    const data = await searchStackOverflow(q)
    if (data) results.push(data)
  } else if (type === "duckduckgo") {
    const data = await searchDuckDuckGo(q)
    if (data) results.push(data)
  } else if (deepsearch === "true") {
    const data = await Promise.all([
      searchGithub(q),
      searchStackOverflow(q),
      searchWikipedia(q),
      searchDuckDuckGo(q)
    ])

    results = data.filter(Boolean)
  } else {
    const programmingKeywords = [
      "python",
      "javascript",
      "node",
      "telegram",
      "api",
      "bot",
      "github",
      "code"
    ]

    const isProgramming = programmingKeywords.some(k =>
      q.toLowerCase().includes(k)
    )

    if (isProgramming) {
      const data = await searchGithub(q)
      if (data) results.push(data)
    } else {
      const data = await searchWikipedia(q)
      if (data) results.push(data)
    }

    if (!results.length) {
      const fallback = await searchDuckDuckGo(q)
      if (fallback) results.push(fallback)
    }
  }

  if (!results.length) {
    return res.status(404).json({
      status: false,
      query: q,
      message: "No results found",
      api_dev: "@nafis_69x",
      updates: "@xoreez"
    })
  }

  results.sort((a, b) => b.score - a.score)

  const best = results[0]

  return res.status(200).json({
    status: true,
    query: q,
    search_time_ms: Date.now() - start,
    confidence: `${best.score}%`,
    source_used: best.source,
    result: best,
    sources_checked: results.map(x => x.source),
    related_searches: related,
    total_results: results.length,
    api_dev: "@nafis_69x",
    updates: "@xoreez"
  })
}