'use client';

import { useEffect, useState } from 'react';
import { buildApiUrl } from '../lib/api';

type Category = { category: string; products: number };
type Summary = { orders: number; revenue: number; products: number; categories: Category[] };

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
}

export default function FoodAnalyticsDemo() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Connecting to the order warehouse…');

  async function loadSummary() {
    setLoading(true);
    try {
      const response = await fetch(buildApiUrl('/v1/food/analytics/summary'), { cache: 'no-store' });
      const payload = await response.json().catch(() => ({})) as Partial<Summary> & { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Analytics API is unavailable.');
      setSummary(payload as Summary);
      setMessage('Live aggregate from MongoDB order and product collections.');
    } catch (error) {
      setSummary(null);
      setMessage(error instanceof Error ? error.message : 'Could not load analytics.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void loadSummary(), 0);
    return () => window.clearTimeout(initialLoad);
  }, []);

  return (
    <section className="labPanel foodPanel" aria-label="Food ordering analytics demo">
      <div className="labPanelTop"><span>ORDER ANALYTICS / MONGODB</span><i className={summary ? 'connected' : ''}>{summary ? 'LIVE DATA' : 'SETUP REQUIRED'}</i></div>
      <div className="metricGrid">
        <article><small>TOTAL REVENUE</small><strong>{summary ? formatCurrency(summary.revenue) : '—'}</strong></article>
        <article><small>ORDERS</small><strong>{summary?.orders ?? '—'}</strong></article>
        <article><small>PRODUCTS</small><strong>{summary?.products ?? '—'}</strong></article>
      </div>
      <div className="categoryBoard">
        <p>Product mix</p>
        {summary?.categories.length ? summary.categories.map((item) => {
          const maximum = Math.max(...summary.categories.map((category) => category.products), 1);
          return <div className="categoryRow" key={item.category}><span>{item.category}</span><i><b style={{ width: `${item.products / maximum * 100}%` }} /></i><strong>{item.products}</strong></div>;
        }) : <div className="emptyAnalytics">{loading ? 'Loading analytics…' : 'Add MONGO_URI as a backend secret to show live warehouse metrics.'}</div>}
      </div>
      <div className="labAction"><p className={!summary && !loading ? 'error' : ''}>{message}</p><button type="button" onClick={() => void loadSummary()} disabled={loading}>{loading ? 'Loading…' : 'Refresh data'} <span>↻</span></button></div>
    </section>
  );
}
