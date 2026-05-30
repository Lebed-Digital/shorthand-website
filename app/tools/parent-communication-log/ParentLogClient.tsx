'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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
  const cell = 'border border-gray-300 p-1';
  const input = 'w-full text-sm focus:outline-none bg-transparent';
  const select = 'w-full text-sm focus:outline-none bg-transparent print:appearance-none';

  return (
    <tr className="align-top">
      <td className={cell}>
        <input
          type="date"
          className={input}
          value={row.date}
          onChange={(e) => onChange(index, 'date', e.target.value)}
        />
      </td>
      <td className={cell}>
        <input
          type="text"
          className={input}
          placeholder="Student name"
          value={row.student}
          onChange={(e) => onChange(index, 'student', e.target.value)}
        />
      </td>
      <td className={cell}>
        <select className={select} value={row.method} onChange={(e) => onChange(index, 'method', e.target.value)}>
          <option value="">-</option>
          {METHOD_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </td>
      <td className={cell}>
        <select className={select} value={row.reached} onChange={(e) => onChange(index, 'reached', e.target.value)}>
          <option value="">-</option>
          {REACHED_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </td>
      <td className={cell}>
        <textarea
          className={`${input} resize-none`}
          rows={2}
          placeholder="What was discussed / decided"
          value={row.summary}
          onChange={(e) => onChange(index, 'summary', e.target.value)}
        />
      </td>
      <td className={cell}>
        <select className={select} value={row.followup} onChange={(e) => onChange(index, 'followup', e.target.value)}>
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
    <main className="min-h-screen bg-gray-50">
      {/* Screen header — hidden on print */}
      <div className="print:hidden bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link href="/" className="text-sm text-teal-600 hover:underline mb-1 block">← ShortHand</Link>
            <h1 className="text-2xl font-bold text-gray-900">Free Parent Communication Log</h1>
            <p className="text-gray-500 text-sm mt-1">Fill it in here and print, or print blank and fill by hand.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={addRows}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              + Add 5 rows
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
            >
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* Printable area */}
      <div className="max-w-5xl mx-auto px-4 py-6 print:px-0 print:py-0 print:max-w-none">
        {/* Log header */}
        <div className="bg-white border border-gray-200 rounded-xl print:rounded-none print:border-0 p-6 print:p-4 mb-6 print:mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-1">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Teacher Name</label>
              <input
                type="text"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-500 text-base pb-1"
                placeholder="Your name"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Week of</label>
              <input
                type="date"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-500 text-base pb-1"
                value={weekOf}
                onChange={(e) => setWeekOf(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Log table */}
        <div className="bg-white border border-gray-200 rounded-xl print:rounded-none print:border-0 overflow-x-auto print:overflow-visible">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-teal-600 text-white print:bg-gray-100 print:text-gray-900">
                {COLUMNS.map((col) => (
                  <th key={col} className="border border-gray-300 print:border-gray-400 px-2 py-2 text-left font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                    {col}
                  </th>
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
        <div className="print:hidden mt-4 text-center">
          <button
            onClick={addRows}
            className="text-sm text-teal-600 hover:underline"
          >
            + Add 5 more rows
          </button>
        </div>

        {/* Footer — always printed */}
        <div className="mt-8 print:mt-6 border-t border-gray-200 pt-6 print:pt-4">
          <p className="text-xs text-gray-400 text-center print:text-gray-500">
            Want your parent communication log built into your daily routine?{' '}
            <span className="print:hidden">
              <Link href="https://getshorthandapp.com" className="text-teal-600 hover:underline">
                Try ShortHand free
              </Link>{' '}
. Log behavior notes, mood check-ins, and parent contacts from your phone.
            </span>
            <span className="hidden print:inline">
              Try ShortHand free at getshorthandapp.com. Log behavior notes, mood check-ins, and parent contacts from your phone.
            </span>
          </p>
        </div>
      </div>

      {/* Screen CTA block — hidden on print */}
      <div className="print:hidden max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Want this to happen automatically?</h2>
          <p className="text-gray-600 mb-5 max-w-md mx-auto text-sm">
            ShortHand logs every parent contact you make: timestamped, tied to the student, searchable. No separate spreadsheet. No trying to remember what you said in October.
          </p>
          <a
            href="https://getshorthandapp.com"
            className="inline-block bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition text-sm"
          >
            Try ShortHand Free
          </a>
          <p className="text-xs text-gray-400 mt-3">No credit card. No setup. Works on your phone.</p>
        </div>
      </div>
    </main>
  );
}
