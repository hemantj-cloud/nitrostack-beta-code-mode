'use client';

import React, { useMemo } from 'react';
import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

export const dynamic = 'force-dynamic';

interface InventoryReportData {
  facilityId: string;
  totalSKUs: number;
  totalValueUSD: number;
}

interface WidgetProps {
  data?: InventoryReportData;
}

export default function InventoryReportWidget({ data: propData }: WidgetProps) {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();

  const data = useMemo(() => {
    if (propData && propData.facilityId) return propData;
    const sdkData = getToolOutput<InventoryReportData>();
    if (sdkData && sdkData.facilityId) return sdkData;
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const dataParam = params.get('data');
        if (dataParam) {
          const parsed = JSON.parse(decodeURIComponent(dataParam));
          if (parsed && parsed.facilityId) return parsed;
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

  const facilityId = data?.facilityId ?? 'FAC-CENTRAL';
  const totalSKUs = data?.totalSKUs ?? 3200;
  const totalValueUSD = data?.totalValueUSD ?? 8500000;
  const avgValuePerSKU = totalSKUs > 0 ? (totalValueUSD / totalSKUs).toFixed(0) : '0';

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
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
            }}
          >
            🏢
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Inventory Valuation
            </h2>
            <div style={{ fontSize: '12px', color: mutedColor, marginTop: '2px' }}>
              Facility: <strong style={{ color: textColor }}>{facilityId}</strong>
            </div>
          </div>
        </div>
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          Active Hub
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
            Total Valuation
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#f59e0b', marginTop: '6px' }}>
            {formatCurrency(totalValueUSD)}
          </div>
          <div style={{ fontSize: '11px', color: mutedColor, marginTop: '4px' }}>
            Aggregated asset valuation
          </div>
        </div>

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
            Catalog SKUs
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
            {totalSKUs.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: mutedColor, marginTop: '4px' }}>
            Unique tracked product lines
          </div>
        </div>

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
            Avg Value / SKU
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
            ${parseInt(avgValuePerSKU).toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: mutedColor, marginTop: '4px' }}>
            Average holding cost
          </div>
        </div>
      </div>
    </div>
  );
}
