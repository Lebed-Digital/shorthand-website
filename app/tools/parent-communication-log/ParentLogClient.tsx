'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import TrackedLink from '../../../components/TrackedLink';
import styles from './ParentLogClient.module.css';

const COLUMNS = ['Date', 'Student Name', 'Method', 'Reached?', 'Summary / Notes', 'Follow-up?'];
const METHOD_OPTIONS = ['Call', 'Email', 'Note Home', 'In Person', 'Text'];
const REACHED_OPTIONS = ['Yes', 'Voicemail', 'No Answer'];
const FOLLOWUP_OPTIONS = ['None', 'Yes, see notes'];

const EMPTY_ROW = { date: '', student: '', method: '', reached: '', summary: '', followup: '' };

function Row({
  row,
  onChange,
  index,
}: {
  row: typeof EMPTY_ROW;
  onChange: (i: number, field: string, val: string) => void;
  index: number;
}) {
  return (
    <tr>
      <td>
        <input
          type="date"
          className={styles.cellInput}
          value={row.date}
          onChange={(e) => onChange(index, 'date', e.target.value)}
        />
      </td>
      <td>
        <input
          type="text"
          className={styles.cellInput}
          placeholder="Student name"
          value={row.student}
          onChange={(e) => onChange(index, 'student', e.target.value)}
        />
      </td>
      <td>
        <select className={styles.cellSelect} value={row.method} onChange={(e) => onChange(index, 'method', e.target.value)}>
          <option value="">-</option>
          {METHOD_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </td>
      <td>
        <select className={styles.cellSelect} value={row.reached} onChange={(e) => onChange(index, 'reached', e.target.value)}>
          <option value="">-</option>
          {REACHED_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </td>
      <td>
        <textarea
          className={styles.cellTextarea}
          rows={2}
          placeholder="What was discussed / decided"
          value={row.summary}
          onChange={(e) => onChange(index, 'summary', e.target.value)}
        />
      </td>
      <td>
        <select className={styles.cellSelect} value={row.followup} onChange={(e) => onChange(index, 'followup', e.target.value)}>
          <option value="">-</option>
          {FOLLOWUP_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </td>
    </tr>
  );
}

export default function ParentLogClient() {
  const [teacherName, setTeacherName] = useState('');
  const [weekOf, setWeekOf] = useState('');
  const [rows, setRows] = useState(Array.from({ length: 10 }, () => ({ ...EMPTY_ROW })));

  function handleChange(i: number, field: string, val: string) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)));
  }

  function addRows() {
    setRows((prev) => [...prev, ...Array.from({ length: 5 }, () => ({ ...EMPTY_ROW }))]);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <main className={styles.page}>
      {/* Screen header — hidden on print */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <Link href="/" className={styles.backLink}>← ShortHand</Link>
            <h1 className={styles.title}>Free Parent Communication Log</h1>
            <p className={styles.subtitle}>Fill it in here and print, or print blank and fill by hand.</p>
          </div>
          <div className={styles.headerActions}>
            <button onClick={addRows} className={styles.btnSecondary}>
              + Add 5 rows
            </button>
            <button onClick={handlePrint} className={styles.btnPrimary}>
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* Printable area */}
      <div className={styles.content}>
        {/* Log header */}
        <div className={styles.logHeaderCard}>
          <div className={styles.logHeaderRow}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Teacher Name</label>
              <input
                type="text"
                className={styles.fieldInput}
                placeholder="Your name"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Week of</label>
              <input
                type="date"
                className={styles.fieldInput}
                value={weekOf}
                onChange={(e) => setWeekOf(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Log table */}
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <Row key={i} row={row} onChange={handleChange} index={i} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Add rows button — screen only */}
        <div className={styles.addMoreRow}>
          <button onClick={addRows} className={styles.addMoreLink}>
            + Add 5 more rows
          </button>
        </div>

        {/* Footer — always printed */}
        <div className={styles.footerNote}>
          <p className={styles.footerNoteText}>
            Want your parent communication log built into your daily routine?{' '}
            <span className={styles.screenOnly}>
              <TrackedLink
                href="https://app.getshorthandapp.com"
                label="app"
                ctaSource="parent-communication-log-footer"
                className={styles.footerNoteLink}
              >
                Try ShortHand free
              </TrackedLink>{' '}
. Log behavior notes, mood check-ins, and parent contacts from your phone.
            </span>
            <span className={styles.printOnly}>
              Try ShortHand free at getshorthandapp.com. Log behavior notes, mood check-ins, and parent contacts from your phone.
            </span>
          </p>
        </div>
      </div>

      {/* Screen CTA block — hidden on print */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Want this to happen automatically?</h2>
          <p className={styles.ctaDescription}>
            ShortHand logs every parent contact you make: timestamped, tied to the student, searchable. No separate spreadsheet. No trying to remember what you said in October.
          </p>
          <TrackedLink
            href="https://app.getshorthandapp.com"
            label="app"
            ctaSource="parent-communication-log-bottom"
            className={styles.ctaButton}
          >
            Try ShortHand Free
          </TrackedLink>
          <p className={styles.ctaFootnote}>No credit card. No setup. Works on your phone.</p>
        </div>
      </div>
    </main>
  );
}
