'use client';

import React, { useMemo } from 'react';
import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

export const dynamic = 'force-dynamic';

interface StockData {
  sku: string;
  inStock: number;
  reserved: number;
}

interface WidgetProps {
  data?: StockData;
}

export default function StockStatusWidget({ data: propData }: WidgetProps) {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();

  const data = useMemo(() => {
    if (propData && propData.sku) return propData;
    const sdkData = getToolOutput<StockData>();
    if (sdkData && sdkData.sku) return sdkData;
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const dataParam = params.get('data');
        if (dataParam) {
          const parsed = JSON.parse(decodeURIComponent(dataParam));
          if (parsed && parsed.sku) return parsed;
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

  const sku = data?.sku ?? 'SKU-ITEM-450';
  const inStock = data?.inStock ?? 450;
  const reserved = data?.reserved ?? 20;
  const available = Math.max(0, inStock - reserved);
  const total = inStock;
  const availablePct = total > 0 ? ((available / total) * 100).toFixed(0) : '0';

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
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
            }}
          >
            📦
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Stock Level Status
            </h2>
            <div style={{ fontSize: '12px', color: mutedColor, marginTop: '2px' }}>
              SKU: <strong style={{ color: textColor }}>{sku}</strong>
            </div>
          </div>
        </div>
        <div
          style={{
            background: available > 50 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            color: available > 50 ? '#10b981' : '#f59e0b',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {available > 50 ? 'In Stock' : 'Low Stock Alert'}
        </div>
      </div>

      {/* Metric Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '20px',
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
            Available
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
            {available}
          </div>
          <div style={{ fontSize: '10px', color: mutedColor, marginTop: '2px' }}>Ready to ship</div>
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
            Reserved
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b', marginTop: '6px' }}>
            {reserved}
          </div>
          <div style={{ fontSize: '10px', color: mutedColor, marginTop: '2px' }}>Pending orders</div>
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
            Total In Hub
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
            {total}
          </div>
          <div style={{ fontSize: '10px', color: mutedColor, marginTop: '2px' }}>Gross on hand</div>
        </div>
      </div>

      {/* Allocation Progress Bar */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${border}`,
          borderRadius: '14px',
          padding: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
          <span style={{ fontWeight: 600 }}>Uncommitted Fulfillment Capacity</span>
          <span style={{ color: '#10b981', fontWeight: 700 }}>{availablePct}% Available</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '999px',
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, parseFloat(availablePct)))}%`,
              height: '100%',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #0ea5e9 0%, #10b981 100%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
