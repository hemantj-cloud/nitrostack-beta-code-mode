'use client';

import React, { useMemo } from 'react';
import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

export const dynamic = 'force-dynamic';

interface FinancialData {
  year: number;
  revenue: number;
  profit: number;
}

interface WidgetProps {
  data?: FinancialData;
}

export default function FinancialSummaryWidget({ data: propData }: WidgetProps) {
  const theme = useTheme();
  const { isReady, getToolOutput } = useWidgetSDK();

  const data = useMemo(() => {
    if (propData && typeof propData.revenue === 'number') {
      return propData;
    }
    const sdkData = getToolOutput<FinancialData>();
    if (sdkData && typeof sdkData.revenue === 'number') {
      return sdkData;
    }
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const dataParam = params.get('data');
        if (dataParam) {
          const parsed = JSON.parse(decodeURIComponent(dataParam));
          if (parsed && typeof parsed.revenue === 'number') return parsed;
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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const currentYear = data?.year ?? 2026;
  const revenue = data?.revenue ?? 12000000;
  const profit = data?.profit ?? 3400000;
  const profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0.0';

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
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
            }}
          >
            📊
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Financial Summary
            </h2>
            <div style={{ fontSize: '12px', color: mutedColor, marginTop: '2px' }}>
              Fiscal Year {currentYear} Performance
            </div>
          </div>
        </div>
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          FY {currentYear}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        {/* Revenue */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '14px',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: mutedColor, textTransform: 'uppercase' }}>
            Gross Revenue
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
            {formatCurrency(revenue)}
          </div>
          <div style={{ fontSize: '11px', color: mutedColor, marginTop: '4px' }}>
            Annual operational turnover
          </div>
        </div>

        {/* Net Profit */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '14px',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: mutedColor, textTransform: 'uppercase' }}>
            Net Profit
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
            {formatCurrency(profit)}
          </div>
          <div style={{ fontSize: '11px', color: mutedColor, marginTop: '4px' }}>
            Bottom-line net earnings
          </div>
        </div>

        {/* Profit Margin */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '14px',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: mutedColor, textTransform: 'uppercase' }}>
            Profit Margin
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#a855f7', marginTop: '6px' }}>
            {profitMargin}%
          </div>
          <div style={{ fontSize: '11px', color: mutedColor, marginTop: '4px' }}>
            Net operating efficiency
          </div>
        </div>
      </div>

      {/* Margin Visual Bar */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${border}`,
          borderRadius: '14px',
          padding: '16px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
          <span style={{ fontWeight: 600 }}>Profit to Revenue Ratio</span>
          <span style={{ color: '#10b981', fontWeight: 700 }}>{profitMargin}% conversion</span>
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
              width: `${Math.min(100, Math.max(0, parseFloat(profitMargin)))}%`,
              height: '100%',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #38bdf8 0%, #10b981 100%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
