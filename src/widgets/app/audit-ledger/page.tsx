'use client';

import React, { useMemo } from 'react';
import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

export const dynamic = 'force-dynamic';

interface AuditLedgerData {
  account: string;
  reconciled: boolean;
  discrepancies: number;
}

interface WidgetProps {
  data?: AuditLedgerData;
}

export default function AuditLedgerWidget({ data: propData }: WidgetProps) {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();

  const data = useMemo(() => {
    if (propData && propData.account) return propData;
    const sdkData = getToolOutput<AuditLedgerData>();
    if (sdkData && sdkData.account) return sdkData;
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const dataParam = params.get('data');
        if (dataParam) {
          const parsed = JSON.parse(decodeURIComponent(dataParam));
          if (parsed && parsed.account) return parsed;
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

  const account = data?.account ?? 'GL-1040';
  const reconciled = data?.reconciled ?? true;
  const discrepancies = data?.discrepancies ?? 0;

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
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
            }}
          >
            📋
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              General Ledger Audit
            </h2>
            <div style={{ fontSize: '12px', color: mutedColor, marginTop: '2px' }}>
              Account Verification & Balance Reconciliation
            </div>
          </div>
        </div>
        <div
          style={{
            background: reconciled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: reconciled ? '#10b981' : '#ef4444',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {reconciled ? 'Reconciled' : 'Discrepancy Found'}
        </div>
      </div>

      {/* Main Account Details Card */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${border}`,
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: mutedColor, textTransform: 'uppercase' }}>
              Account Code
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', letterSpacing: '0.04em' }}>
              {account}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: mutedColor, textTransform: 'uppercase' }}>
              Discrepancies
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 800,
                marginTop: '4px',
                color: discrepancies === 0 ? '#10b981' : '#ef4444',
              }}
            >
              {discrepancies} {discrepancies === 1 ? 'Entry' : 'Entries'}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Checklist */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${border}`,
          borderRadius: '14px',
          padding: '16px',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 600, color: mutedColor, marginBottom: '12px' }}>
          Audit Checks Completed
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ color: '#10b981' }}>✔</span> General ledger balanced with journal batches
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ color: '#10b981' }}>✔</span> Double-entry debits equal credits
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ color: discrepancies === 0 ? '#10b981' : '#ef4444' }}>
              {discrepancies === 0 ? '✔' : '⚠'}
            </span>
            Variance check against transaction logs
          </div>
        </div>
      </div>
    </div>
  );
}
