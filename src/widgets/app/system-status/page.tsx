'use client';

import React, { useMemo } from 'react';
import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

export const dynamic = 'force-dynamic';

interface SystemStatusData {
  status: string;
  uptimeSeconds: number;
  timestamp: number;
}

interface WidgetProps {
  data?: SystemStatusData;
}

export default function SystemStatusWidget({ data: propData }: WidgetProps) {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();

  const data = useMemo(() => {
    if (propData && propData.status) return propData;
    const sdkData = getToolOutput<SystemStatusData>();
    if (sdkData && sdkData.status) return sdkData;
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const dataParam = params.get('data');
        if (dataParam) {
          const parsed = JSON.parse(decodeURIComponent(dataParam));
          if (parsed && parsed.status) return parsed;
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

  const status = data?.status ?? 'healthy';
  const uptimeSeconds = data?.uptimeSeconds ?? 14520;
  const timestamp = data?.timestamp ?? Date.now();

  const formatUptime = (sec: number) => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = Math.floor(sec % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const isHealthy = status.toLowerCase() === 'healthy';

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
              background: isHealthy
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: isHealthy
                ? '0 4px 12px rgba(16, 185, 129, 0.25)'
                : '0 4px 12px rgba(239, 68, 68, 0.25)',
            }}
          >
            {isHealthy ? '⚡' : '⚠'}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              System Health Monitor
            </h2>
            <div style={{ fontSize: '12px', color: mutedColor, marginTop: '2px' }}>
              Service Runtime & Operational Metrics
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: isHealthy ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: isHealthy ? '#10b981' : '#ef4444',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isHealthy ? '#10b981' : '#ef4444',
              display: 'inline-block',
            }}
          />
          {status.toUpperCase()}
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: mutedColor, textTransform: 'uppercase' }}>
            Process Uptime
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
            {formatUptime(uptimeSeconds)}
          </div>
          <div style={{ fontSize: '11px', color: mutedColor, marginTop: '4px' }}>
            Active continuously
          </div>
        </div>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: '14px',
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: mutedColor, textTransform: 'uppercase' }}>
            Last Heartbeat
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '8px' }}>
            {new Date(timestamp).toLocaleTimeString()}
          </div>
          <div style={{ fontSize: '11px', color: mutedColor, marginTop: '4px' }}>
            {new Date(timestamp).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
