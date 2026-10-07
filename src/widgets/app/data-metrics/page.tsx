'use client';

import React, { useMemo } from 'react';
import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

export const dynamic = 'force-dynamic';

interface MetricsData {
  sum: number;
  avg: number;
  count: number;
}

interface WidgetProps {
  data?: MetricsData;
}

export default function DataMetricsWidget({ data: propData }: WidgetProps) {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();

  const data = useMemo(() => {
    if (propData && typeof propData.sum === 'number') return propData;
    const sdkData = getToolOutput<MetricsData>();
    if (sdkData && typeof sdkData.sum === 'number') return sdkData;
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const dataParam = params.get('data');
        if (dataParam) {
          const parsed = JSON.parse(decodeURIComponent(dataParam));
          if (parsed && typeof parsed.sum === 'number') return parsed;
        }
      } catch {
        // fallback
      }
    }
    return null;
  }, [propData, getToolOutput]);

  const isDark = theme === 'dark';
  const bg = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? '#1e293b' : '#f8fafc';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const sum = data?.sum ?? 2480;
  const avg = data?.avg ?? 310;
  const count = data?.count ?? 8;

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        background: bg,
        color: textColor,
        minHeight: '100%',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
            }}
          >
            📈
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Data Metrics Aggregation
            </h2>
            <div style={{ fontSize: '12px', color: mutedColor, marginTop: '2px' }}>
              Statistical Computation Results
            </div>
          </div>
        </div>
        <div
          style={{
            background: 'rgba(139, 92, 246, 0.15)',
            color: '#a78bfa',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {count} Items Processed
        </div>
      </div>

      {/* 3 Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '14px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: mutedColor, textTransform: 'uppercase' }}>
            Aggregate Sum
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
            {sum.toLocaleString()}
          </div>
          <div style={{ fontSize: '10px', color: mutedColor, marginTop: '2px' }}>Total sum</div>
        </div>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '14px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: mutedColor, textTransform: 'uppercase' }}>
            Arithmetic Mean
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
            {typeof avg === 'number' ? avg.toFixed(1) : avg}
          </div>
          <div style={{ fontSize: '10px', color: mutedColor, marginTop: '2px' }}>Mean average</div>
        </div>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '14px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: mutedColor, textTransform: 'uppercase' }}>
            Sample Size
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#a78bfa', marginTop: '6px' }}>
            {count}
          </div>
          <div style={{ fontSize: '10px', color: mutedColor, marginTop: '2px' }}>Data points</div>
        </div>
      </div>
    </div>
  );
}
