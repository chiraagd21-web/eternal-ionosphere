'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, ExternalLink, ShoppingCart, Globe, BookOpen, ChevronRight, Sparkles, ArrowRight, Image as ImageIcon, Link2 } from 'lucide-react'

interface WebResult {
  title: string
  url: string
  snippet: string
}

interface ShoppingLink {
  name: string
  url: string
  icon: string
  color: string
}

interface RelatedTopic {
  text: string
  url: string
}

interface SearchData {
  query: string
  abstract: string
  abstractSource: string
  abstractUrl: string
  image: string
  heading: string
  webResults: WebResult[]
  shoppingLinks: ShoppingLink[]
  relatedTopics: RelatedTopic[]
  infobox: { label: string; value: string }[]
}

export default function GlobalSearchPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SearchData | null>(null)
  const [searchStep, setSearchStep] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query
    if (!q.trim()) return
    setQuery(q)
    setLoading(true)
    setHasSearched(true)
    setData(null)

    const steps = [
      'Scanning the web...',
      'Aggregating sources...',
      'Comparing prices across retailers...',
      'Building answer...',
    ]
    let idx = 0
    const stepTimer = setInterval(() => {
      setSearchStep(steps[idx])
      idx = (idx + 1) % steps.length
    }, 800)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      if (res.ok) {
        const result = await res.json()
        setData(result)
      }
    } catch(e) {}

    clearInterval(stepTimer)
    setSearchStep('')
    setLoading(false)
  }

  const getDomain = (url: string) => {
    try { return new URL(url).hostname.replace('www.', '') } catch { return url }
  }

  // Landing state — no search yet
  if (!hasSearched) {
    return (
      <div className="min-h-screen w-full bg-[var(--bg-0)] flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight mb-3">Global Search</h1>
          <p className="text-sm text-[var(--text-secondary)] opacity-40 mb-10">Search anything — products, prices, comparisons, knowledge. Powered by real-time web data.</p>

          <form onSubmit={(e) => { e.preventDefault(); handleSearch() }} className="relative mb-10">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-30" size={22} />
            <input
              ref={inputRef}
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything... (e.g. mango, iPhone 16, best laptops 2025)"
              className="w-full pl-16 pr-6 py-6 rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] text-lg text-[var(--text-primary)] outline-none focus:border-indigo-500/50 focus:shadow-xl focus:shadow-indigo-500/5 transition-all shadow-lg"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all">
              Search
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-2">
            {['iPhone 16 Pro', 'best laptops 2025', 'mango nutrition', 'Tesla Model Y', 'Nintendo Switch 2', 'Sony WH-1000XM5'].map(suggestion => (
              <button
                key={suggestion}
                onClick={() => { setQuery(suggestion); handleSearch(suggestion) }}
                className="px-4 py-2 bg-[var(--bg-1)] border border-[var(--border)] rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-indigo-500/30 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[var(--bg-0)] p-4 lg:p-8 font-sans custom-scrollbar overflow-y-auto pb-20">
      {/* Search Bar — sticky top */}
      <div className="sticky top-0 z-30 bg-[var(--bg-0)] pb-4 pt-2 lg:pt-0">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch() }} className="max-w-3xl mx-auto relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-30" size={20} />
          <input
            ref={inputRef}
            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything..."
            className="w-full pl-14 pr-28 py-4 rounded-2xl bg-[var(--bg-1)] border border-[var(--border)] text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500/50 transition-all shadow-lg"
          />
          <button type="submit" disabled={loading} className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest text-[9px] transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={14} /> : 'Search'}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto mt-10">
          <div className="flex items-center gap-4 p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Loader2 className="animate-spin text-indigo-400" size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-indigo-400 mb-1">{searchStep || 'Searching...'}</div>
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" />
                <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {data && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto mt-6 space-y-6">

          {/* AI Answer Card */}
          {data.abstract && (
            <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[2rem] p-6 lg:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="text-white" size={16} />
                </div>
                <div className="text-sm font-black text-[var(--text-primary)]">Answer</div>
                <div className="text-[9px] font-bold text-[var(--text-secondary)] opacity-30 uppercase tracking-widest">
                  Source: {data.abstractSource}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight mb-4">{data.heading}</h2>
                  <p className="text-sm text-[var(--text-primary)] opacity-80 leading-relaxed">{data.abstract}</p>
                  {data.abstractUrl && (
                    <a href={data.abstractUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                      Read more on {data.abstractSource} <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                {data.image && (
                  <div className="w-full lg:w-48 shrink-0">
                    <img src={data.image} alt={data.heading} className="w-full rounded-2xl object-cover border border-[var(--border)]" />
                  </div>
                )}
              </div>

              {/* Infobox */}
              {data.infobox.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {data.infobox.map((item: any, i: number) => (
                      <div key={i} className="p-3 bg-[var(--bg-0)] rounded-xl border border-[var(--border)]">
                        <div className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest mb-1">{item.label}</div>
                        <div className="text-xs font-bold text-[var(--text-primary)] truncate">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Shopping Links */}
          <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[2rem] p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-5">
              <ShoppingCart className="text-amber-400" size={20} />
              <div className="text-sm font-black text-[var(--text-primary)]">Shop &amp; Compare</div>
              <div className="text-[9px] font-bold text-[var(--text-secondary)] opacity-30 uppercase tracking-widest">
                Live price comparison across retailers
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {data.shoppingLinks.map(link => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-[var(--bg-0)] border border-[var(--border)] rounded-xl hover:border-indigo-500/30 hover:bg-[var(--bg-2)] transition-all group"
                >
                  <span className="text-2xl">{link.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-black text-[var(--text-primary)] truncate">{link.name}</div>
                    <div className="text-[9px] text-[var(--text-secondary)] opacity-30">Search results →</div>
                  </div>
                  <ExternalLink size={14} className="text-[var(--text-secondary)] opacity-20 group-hover:opacity-60 transition-opacity shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Web Results */}
          {data.webResults.length > 0 && (
            <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[2rem] p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-5">
                <Globe className="text-emerald-400" size={20} />
                <div className="text-sm font-black text-[var(--text-primary)]">Web Results</div>
                <div className="text-[9px] font-bold text-[var(--text-secondary)] opacity-30 uppercase tracking-widest">
                  {data.webResults.length} sources found
                </div>
              </div>
              <div className="space-y-4">
                {data.webResults.map((result, i) => (
                  <motion.a
                    key={i}
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="block p-4 bg-[var(--bg-0)] border border-[var(--border)] rounded-xl hover:border-indigo-500/30 hover:bg-[var(--bg-2)] transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <img src={`https://www.google.com/s2/favicons?domain=${getDomain(result.url)}&sz=32`} alt="" className="w-4 h-4 rounded" />
                      <span className="text-[10px] font-bold text-[var(--text-secondary)] opacity-40 truncate">{getDomain(result.url)}</span>
                    </div>
                    <h3 className="text-sm font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors mb-1 line-clamp-1">{result.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)] opacity-50 line-clamp-2 leading-relaxed">{result.snippet}</p>
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {/* Related Topics */}
          {data.relatedTopics.length > 0 && (
            <div className="bg-[var(--bg-1)] border border-[var(--border)] rounded-[2rem] p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-5">
                <BookOpen className="text-rose-400" size={20} />
                <div className="text-sm font-black text-[var(--text-primary)]">Related Topics</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.relatedTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuery(topic.text.split(' - ')[0]); handleSearch(topic.text.split(' - ')[0]) }}
                    className="text-left p-4 bg-[var(--bg-0)] border border-[var(--border)] rounded-xl hover:border-indigo-500/30 hover:bg-[var(--bg-2)] transition-all flex items-center gap-3"
                  >
                    <ChevronRight size={14} className="text-indigo-400 shrink-0" />
                    <span className="text-xs text-[var(--text-primary)] line-clamp-2">{topic.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* No results state */}
      {data && !loading && !data.abstract && data.webResults.length === 0 && (
        <div className="max-w-3xl mx-auto mt-20 text-center">
          <Search size={48} className="mx-auto mb-4 text-[var(--text-secondary)] opacity-10" />
          <p className="text-lg font-bold text-[var(--text-secondary)] opacity-30">No results found for &ldquo;{data.query}&rdquo;</p>
          <p className="text-sm text-[var(--text-secondary)] opacity-20 mt-2">Try a different search term</p>
        </div>
      )}
    </div>
  )
}
