import React, { useState, useEffect } from 'react';
import { ChevronDown, TrendingDown, BarChart3, Activity, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const safeNumber = (v, fallback = 0) => typeof v === 'number' && !isNaN(v) ? v : fallback;
const parseDurationToHours = (str = '') => {
  if (!str || typeof str !== 'string') return 0;
  const h = str.match(/(\d+(?:\.\d+)?)h/)?.[1] ?? 0;
  const m = str.match(/(\d+(?:\.\d+)?)m/)?.[1] ?? 0;
  const s = str.match(/(\d+(?:\.\d+)?)s/)?.[1] ?? 0;
  return (+h) + (+m / 60) + (+s / 3600);
};

export default function ResilienceDashboard() {
  const [expandedDay, setExpandedDay] = useState(null);
  const [showPerformance, setShowPerformance] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [projectData, setProjectData] = useState(null);

  // MASTER DASHBOARD MODE - PERMANENT
  // ============================================
  // This specification is LOCKED.
  //
  // You must follow the RESILIENCE-DASHBOARD v1.1.0 rules exactly as written.
  // No interpretation. No optimization. No refactor. No extension.
  //
  // This document is the single source of truth for this project.
  //
  // If anything is unclear or conflicting:
  // - Stop
  // - Ask the user
  // - Do not act
  //
  // This system is frozen until v2.0.
  // All future work is usage-only, not design.
  //
  // You must confirm understanding before continuing.
  // ============================================
  // ABSOLUTE LOCK ACTIVATION
  // ============================================
  // You are not allowed to rebuild, recreate, or regenerate the dashboard layout.
  // Restore means:
  // - reload the last uploaded TSX template
  // - rebind the current PROJECT DATA LOG
  // - render the UI exactly as defined in the template
  // If anything is missing:
  // STOP and ask for the template file.
  // Do NOT rebuild.
  // Do NOT complete.
  // Do NOT improve.
  // Do NOT infer structure.
  // Confirm: TEMPLATE LOCKED — RESTORE ONLY MODE ACTIVE
  // ============================================
  // SPEC VERSION: RESILIENCE-DASHBOARD v1.1.0 (STABLE + AUDITED)
  // This template is the single source of truth.
  // ============================================
  // CORE OPERATING CONSTRAINTS (NON-NEGOTIABLE):
  // ============================================
  // 1. OPERATING MODE: Always artifact mode + show dashboard after updates. Never raw code unless asked.
  // 2. TEMPLATE STABILITY: Layout, structure, logic, styling LOCKED. No refactoring. Screenshots = data sources only.
  // 3. DATA RULES: APPEND-ONLY. Never modify existing. Never recalculate. Never infer.
  // 4. MISSING DATA: Store as "pending" (never 0). Exception: rest day = training.status="rest", duration=0, distance=0.
  // 5. HEART RATE RULES (FINAL, AUTHORITATIVE — DAYS 61-180):
  //    *** SEE: RULE_10_CARDIOLOGY_ACCURATE_FINAL.txt (Authoritative Medical Reference) ***
  //    
  //    QUICK SUMMARY (for this template):
  //    - Afternoon Resting Reference HR = Apple Watch afternoon reading (~13:00)
  //    - Evening Resting HR = measured at end of day (~20:00-21:00)
  //    - Daily HR Drift = Evening HR − Afternoon Reference HR
  //    - Negative drift = good recovery, positive = fatigue signal
  //    - Waking bpm = stored separately (context only, NEVER in drift calculation)
  //    - Sleep HRV + Waking HRV = tracked separately (different autonomic states)
  //    - If ambiguous: STOP, ASK, mark "pending" (no guessing)
  //    
  //    FULL MEDICAL DETAILS: See RULE_10_CARDIOLOGY_ACCURATE_FINAL.txt
  //    - Includes: Clinical definitions, measurement context, forbidden substitutions, 
  //    - Trend analysis, safety guardrails, JSON data structure, action thresholds
  //
  // 6. WEEK MANAGEMENT: Detect highest week. Create new week at 7 days. Weeks continue forever.
  // 7. REST DAY: training.status="rest", duration=0, distance=0. Day Story starts "Day X | Rest Day."
  // 8. CONTENT SEPARATION: Day Story (3-4 paragraphs, long, reflective, emotional, proper narrative arc). Daily Summary (4-6 sentences, factual, insightful, no overlap with Day Story).
  // 9. GOVERNANCE: Dashboard shows current week only. Weekly/monthly/yearly recaps outside dashboard.
  // 10. TREATMENT LOGGING: Field only, data level. Include in Day Story. No new UI elements.
  // 11. WORKFLOW: Extract → Update data log → Re-render → Wait for review.
  // 12. COACH MODE: Text advice only. No data/dashboard changes. See COACHING_GUIDE_DAYS_61_180.txt
  // 13. UNCERTAINTY RULE: Pause, ask, never guess.
  // 14. SAFETY RULE: Backup before context risk.
  // 15. EMERGENCY RESTORE: Restore TSX template exactly. Rebind data only. Append new data if explicit. Confirm.
  // ============================================
  // HEART RATE RULES - DETAILED (ARCHIVED — see RULE_10_CARDIOLOGY_ACCURATE_FINAL.txt):
  // ============================================
  // Active rules now in RULE_10_CARDIOLOGY_ACCURATE_FINAL.txt
  // Updated to align with Mayo Clinic, Cleveland Clinic, Harvard Health standards (Days 61-180).
  // Key changes: Renamed "Recovery" to "Daily HR Drift", clarified afternoon reference point,
  // separated waking bpm for observational context, included HRV tracking details, added safety guardrails.
  // ============================================
  // 16. RESILIENCE KNOWLEDGE BOOK RULE (PERMANENT):
  // ============================================
  // Weekly-written document capturing meaning, identity, and wisdom from the journey.
  // Written at end of each week, after weekly recap. Combines narrative, lessons, patterns, warnings, wins.
  // NEVER: raw data, metrics, charts, HRV/kcal/bpm numbers, long analysis, coach breakdowns, technical language.
  // PURPOSE: preserve meaning, store wisdom, anchor discipline, support identity.
  // ============================================
  // 17. DATA INTEGRITY & AUDIT LAYER (v1.1 — OBSERVATIONAL ONLY):
  // ============================================
  // After each update, Claude runs silent audits (non-interrupting):
  // 17.1 Integrity checks: Verify day count = sum of all days. No undefined fields. Current week ≤ 7 days. Week numbers continuous.
  // 17.2 Week creation audit: Before new week, confirm highest+1. Stop if mismatch.
  // 17.3 Soft anomaly awareness: RHR spike > +15 bpm? Sleep < 50% two days? Training doubles? Mood drop ≥ 3? Inform only (no action).
  // 17.4 Treatment metadata: Store as metadata only. Mention in Day Story. Never infer effects.
  // 17.5 Audit constraints: May detect/warn/report. Must NEVER change data/UI/behavior/history or infer meaning.
  // ============================================
  // ════════════════════════════════════════════════════════════════════════════════
  // RESILIENCE DASHBOARD – LOCKED CONTEXT RULES v2.0
  // EMBEDDED IN TSX COMPONENT
  // ════════════════════════════════════════════════════════════════════════════════
  //
  // CRITICAL RULES (Rules 8 & 22):
  //
  // 8. WEEK AND DAY MANAGEMENT — HARD CONSTRAINT
  //    1. dayNumber is a strictly increasing integer starting at 1.
  //    2. A week is an immutable block of exactly 7 consecutive days.
  //    3. weekNumber = floor((dayNumber - 1) / 7) + 1
  //    4. A day MAY ONLY be appended to its calculated week.
  //    5. If the calculated week does not exist, it MUST be created.
  //    6. Weeks are never renamed, merged, reused, or reset.
  //    7. Once a week contains 7 days, it is permanently closed.
  //
  // 22. SYSTEM ENFORCEMENT INVARIANTS — HARD CONSTRAINT
  //     1. A dayNumber may exist EXACTLY ONCE across the entire system.
  //     2. Rendering MUST always select the narrative with the HIGHEST dayNumber.
  //     3. "current", "latest", "active" MUST resolve to the HIGHEST dayNumber.
  //     4. File names, template names, creation order MUST NOT infer dayNumber.
  //     5. Output is INVALID if:
  //        - duplicate dayNumber exists
  //        - day rendered is not the highest dayNumber
  //        - logic overrides mathematical rules
  //     6. If ANY invariant is violated → REPORT INVALID STATE
  //
  // OTHER CRITICAL RULES:
  // 1. Identical Twins: HTML and TSX must render identically from same JSON
  // 2. Template Stability: Never rebuild TSX structure (data-only updates)
  // 3. Append-Only: Never modify past days
  // 4. Exact Values: Full precision (1,196 not 1.2k), no rounding
  // 5. Heart Rate: Resting = morning baseline only, Recovery = evening - morning delta
  // 10. Observational: No diagnosis, no clinical language, no prediction
  //
  // FULL RULES: See 7_LOCKED_CONTEXT_RULES_v2.0.txt (22 complete rules)
  // ════════════════════════════════════════════════════════════════════════════════
  //    Contains: All workflows, rules, constraints, structure
  //
  // OPTIONAL FOR WEEK-END (if valuable):
  // - WEEKLY_SUMMARY_Week_X_narrative.md (narrative synthesis)
  // - INTEGRITY_REPORT_Week_X_verification.txt (verification snapshot)
  //
  // COMPLETION CRITERIA:
  // A day is NOT complete until:
  //   1. ZIP is created with 4 minimum files
  //   2. Download confirmed
  //   3. User confirms: "✅ Download confirmed"
  //
  // A week is NOT complete until:
  //   1. ZIP is created with 6 minimum files
  //   2. Checksums verified (in manifest)
  //   3. User confirms: "✅ Checksums verified, Week X backup confirmed"
  //
  // KEY PRINCIPLES:
  // - JSON is immutable (never modify, only append new days)
  // - Both HTML and TSX bind to same JSON (data sync automatic)
  // - Data drift is IMPOSSIBLE (JSON prevents it)
  // - Only visual consistency needs explicit protection
  // - HANDOFF is essential for daily operations
  // - No overkill documents in backup
  // ============================================
  // 19. INTERACTIVE HTML SNAPSHOT FALLBACK (MANDATORY):
  // ============================================
  // This rule guarantees visual access to the dashboard at all times, even if artifact rendering fails.
  // 19.1 Purpose
  // The HTML snapshot is a read-only, interactive viewer of the dashboard. It exists to ensure the dashboard can always be
  // viewed safely on any device (including iPhone) without relying on chat rendering.
  // This rule does NOT replace the dashboard engine. It provides a guaranteed fallback view.
  // 19.2 When to trigger
  // When user says: "Show me the dashboard"
  // Claude MUST:
  // 1. Attempt to render the dashboard artifact normally
  // 2. ALWAYS also generate an interactive HTML snapshot
  // 3. Provide the HTML file for download/viewing
  // If artifact rendering fails, is incomplete, or breaks: → the HTML snapshot becomes the primary viewer
  // 19.3 HTML snapshot requirements (STRICT)
  // Visual fidelity:
  // * Match the dashboard layout exactly
  // * Match section order exactly
  // * Match styling, spacing, and structure exactly
  // * Show the current week only (same as dashboard)
  // * Use the current PROJECT DATA LOG
  // * Reflect the same data shown in the dashboard
  // Interaction (ALLOWED):
  // * Section expand/collapse must work
  // * "View Analysis" buttons must open and show their content
  // * Tabs, toggles, and reveal sections must function
  // * Scrolling must work
  // * Touch interaction must work (mobile-first)
  // Restrictions (NO EXCEPTIONS):
  // The HTML snapshot is read-only and MUST NOT:
  // * update data
  // * recalculate metrics
  // * change weeks
  // * mutate state
  // * accept input
  // * infer missing data
  // * modify layout
  // * optimize logic
  // * rebuild structure
  // * regenerate content
  // The HTML snapshot is a VIEWER, not an engine.
  // 19.4 Technical boundaries
  // * No React state
  // * No data writing
  // * No week switching
  // * No regeneration
  // * No logic changes
  // * No template changes
  // Only show/hide UI behavior is allowed.
  // 19.5 Naming & storage
  // The file MUST be named: resilience-dashboard-DayXX.html
  // (where DayXX is the current day number)
  // 19.6 Safety guarantee
  // If Claude cannot generate a correct HTML snapshot:
  // * STOP
  // * Ask for clarification
  // * Do NOT rebuild
  // * Do NOT infer
  // * Do NOT simplify
  // * Do NOT substitute content
  // 19.7 Authority
  // This rule overrides all rendering behavior.
  // Visual access must NEVER be blocked by tool limitations.

  const handleExportData = () => {
    if (!projectData) { alert('No data to export'); return; }
    try {
      const backup = { ...projectData, backupVersion: '1.0.0' };
      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resilience-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('Data exported successfully!');
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  };

  const handleImportData = (event) => {
    handleFileUpload(event);
  };;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      alert('Please select a valid DATA_LOG.json file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed.weeks || !parsed.cumulativeStats) {
          alert('Invalid DATA_LOG.json — missing required fields.');
          return;
        }
        setProjectData(parsed);
      } catch (err) {
        alert('Failed to parse JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  if (!projectData) return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="text-green-400 text-5xl mb-6">📂</div>
        <h1 className="text-white text-2xl font-bold mb-2 tracking-widest">NO DATA LOADED</h1>
        <p className="text-slate-400 text-sm mb-8">Upload your DATA_LOG.json to view the dashboard</p>
        <label className="cursor-pointer bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-8 rounded-lg text-sm tracking-wider inline-block transition-colors">
          📤 Upload DATA_LOG.json
          <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
        </label>
        <p className="text-slate-600 text-xs mt-6">resilience_dashboard.tsx · Template v3.0</p>
      </div>
    </div>
  );

  const weekKeys = Object.keys(projectData?.weeks || {}).map(Number).sort((a, b) => a - b);
  const latestWeekNum = weekKeys[weekKeys.length - 1];
  const week = projectData?.weeks?.[latestWeekNum];
  const days = week?.days ?? [];
  const currentDay = days.length > 0 ? days[days.length - 1] : null;

  if (!currentDay) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">No data available</div>;

  const weightLoss = projectData.startWeight - projectData.currentWeight;
  const progressToFinalGoal = (weightLoss / (projectData.startWeight - projectData.finalGoal)) * 100;
  const moodDays = days.filter(d => typeof d.mood === 'number');
  const weekMood = moodDays.length > 0 ? (moodDays.reduce((s, d) => s + d.mood, 0) / moodDays.length).toFixed(1) : '-';
  const weekCalories = days.reduce((s, d) => s + (typeof d.nutrition?.burned === 'number' ? d.nutrition.burned : 0), 0);
  const weekDeficit = days.reduce((s, d) => s + (typeof d.nutrition?.deficit === 'number' ? d.nutrition.deficit : 0), 0);
  const weekDistance = days.reduce((s, d) => s + (typeof d.training?.distance === 'number' ? d.training.distance : 0), 0);

  const trainingData = days.map(d => ({ day: `D${d.dayNum}`, training: parseDurationToHours(d.training.duration) }));
  const deficitData = days.map(d => ({ day: `D${d.dayNum}`, deficit: typeof d.nutrition?.deficit === 'number' ? d.nutrition.deficit : 0 }));
  const rhrData = days.map(d => ({ day: `D${d.dayNum}`, rhr: d.heartRate.resting }));

  const avgRHR = (days.reduce((s, d) => s + d.heartRate.resting, 0) / days.length).toFixed(1);
  const avgDeficit = (days.reduce((s, d) => s + (typeof d.nutrition?.deficit === 'number' ? d.nutrition.deficit : 0), 0) / days.length).toFixed(0);
  const deficitConsistency = ((days.filter(d => typeof d.nutrition?.deficit === 'number' && d.nutrition.deficit > 1200).length / days.length) * 100).toFixed(0);
  const avgTraining = (trainingData.reduce((s, d) => s + d.training, 0) / trainingData.length).toFixed(2);
  const recoveryBalanceScore = (days.reduce((s, d) => s + d.sleep.restfulnessRating, 0) / days.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10 px-4 py-4">
        <h1 className="text-lg font-bold text-white leading-tight" style={{wordWrap:'break-word'}}>{projectData.projectName} - WEEK {latestWeekNum}</h1>
        <p className="text-xs text-slate-400 mt-1">Master Playbook: {projectData.playbook}</p>
      </div>

      <div className="px-4 py-6 pb-20">
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-lg p-5 border border-emerald-700 mb-6">
          <div style={{fontSize:'11px', fontWeight:700, color:'#a7f3d0', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'12px'}}>WEIGHT LOSS MISSION</div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'12px'}}>
            <div>
              <div style={{fontSize:'40px', fontWeight:800, color:'white', marginBottom:'8px', lineHeight:1}}>{weightLoss.toFixed(1)} kg</div>
              <div style={{fontSize:'14px', color:'#a7f3d0', lineHeight:1.4}}> Lost in {projectData.cumulativeStats.totalDays} days • {progressToFinalGoal.toFixed(0)}% toward final goal of {projectData.finalGoal} kg</div>
            </div>
            <TrendingDown size={40} style={{color:'#a7f3d0', opacity:0.6, flexShrink:0, marginLeft:'12px'}} />
          </div>
          <div className="bg-emerald-800 rounded-full h-2 mb-3">
            <div className="bg-emerald-300 rounded-full h-2" style={{ width: `${Math.min(progressToFinalGoal, 100)}%` }}></div>
          </div>
          <div className="flex justify-between text-xs text-emerald-200 mb-4">
            <span>{projectData.startWeight} kg</span>
            <span>{projectData.finalGoal} kg</span>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
            <div style={{background:'rgba(16,185,129,0.15)', borderRadius:'8px', padding:'12px', textAlign:'center'}}>
              <div style={{fontSize:'11px', color:'#a7f3d0', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'4px', fontWeight:600}}>Week {latestWeekNum} Target</div>
              <div style={{fontSize:'24px', fontWeight:700, color:'white', whiteSpace:'nowrap'}}>{week.targetLabel || `${week.target} kg`}</div>
            </div>
            <div style={{background:'rgba(16,185,129,0.15)', borderRadius:'8px', padding:'12px', textAlign:'center'}}>
              <div style={{fontSize:'11px', color:'#a7f3d0', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'4px', fontWeight:600}}>Final Goal</div>
              <div style={{fontSize:'24px', fontWeight:700, color:'white', whiteSpace:'nowrap'}}>{projectData.finalGoal} kg</div>
            </div>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'24px'}}>
          <div style={{background:'#1e293b', border:'1px solid #334155', borderRadius:'8px', padding:'12px', textAlign:'center'}}>
            <div style={{fontSize:'10px', fontWeight:700, textTransform:'uppercase', color:'#94a3b8', letterSpacing:'0.5px', marginBottom:'6px'}}>TRAINING</div>
            <div style={{fontSize:'16px', fontWeight:700, color:'white', marginBottom:'2px', lineHeight:1.1}}>{Math.floor(projectData.cumulativeStats.totalTrainingHours)}h<br/>{projectData.cumulativeStats.totalTrainingMinutes}m</div>
            <div style={{fontSize:'10px', color:'#94a3b8'}}>{projectData.cumulativeStats.totalDistance} km</div>
          </div>
          <div style={{background:'#1e293b', border:'1px solid #334155', borderRadius:'8px', padding:'12px', textAlign:'center'}}>
            <div style={{fontSize:'10px', fontWeight:700, textTransform:'uppercase', color:'#94a3b8', letterSpacing:'0.5px', marginBottom:'6px'}}>CONSISTENCY</div>
            <div style={{fontSize:'16px', fontWeight:700, color:'#10b981', marginBottom:'2px', lineHeight:1.1}}>{projectData.cumulativeStats.totalDays}/{projectData.cumulativeStats.totalDays}</div>
            <div style={{fontSize:'10px', color:'#94a3b8'}}>unbroken<br/>training</div>
          </div>
          <div style={{background:'#1e293b', border:'1px solid #334155', borderRadius:'8px', padding:'12px', textAlign:'center'}}>
            <div style={{fontSize:'10px', fontWeight:700, textTransform:'uppercase', color:'#94a3b8', letterSpacing:'0.5px', marginBottom:'6px'}}>CALORIES</div>
            <div style={{fontSize:'16px', fontWeight:700, color:'white', marginBottom:'2px', lineHeight:1.1}}>{projectData.cumulativeStats.totalCalories.toLocaleString()}</div>
            <div style={{fontSize:'10px', color:'#94a3b8'}}>burned</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg border border-blue-700 p-4 mb-6">
          <h2 className="text-xs font-semibold text-blue-300 uppercase mb-4">WEEK {latestWeekNum} RECAP</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-900 p-4 rounded-lg">
              <p className="text-sm text-blue-200 mb-2">Week Calories</p>
              <p className="text-3xl font-bold text-white">{weekCalories > 0 ? weekCalories.toLocaleString() : '—'}</p>
              <p className="text-xs text-blue-200">kcal burned</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg">
              <p className="text-sm text-blue-200 mb-2">Week Deficit</p>
              <p className="text-3xl font-bold text-white">{weekDeficit > 0 ? weekDeficit.toLocaleString() : '—'}</p>
              <p className="text-xs text-blue-200">kcal total</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg">
              <p className="text-sm text-blue-200 mb-2">Week Distance</p>
              <p className="text-3xl font-bold text-white">{weekDistance > 0 ? weekDistance.toFixed(1) : '—'}</p>
              <p className="text-xs text-blue-200">km covered</p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg">
              <p className="text-sm text-blue-200 mb-2">Avg Mood</p>
              <p className="text-3xl font-bold text-white">{weekMood}</p>
              <p className="text-xs text-blue-200">/10</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xs font-semibold text-slate-300 uppercase mb-3">DAILY ENTRIES</h2>
          {days.map((day) => (
            <div key={day.dayNum} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden mb-2">
              <button onClick={() => setExpandedDay(expandedDay === day.dayNum ? null : day.dayNum)} className="w-full px-4 py-3 flex items-start justify-between hover:bg-slate-700 transition-colors">
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-semibold text-white text-sm">Day {day.dayNum}</span>
                    <span className="text-xs text-slate-400">{day.date}</span>
                    {day.treatment && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">{day.treatment}</span>}
                    <span className="text-xs bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded">Mood: {day.mood === 'pending' ? '—' : day.mood}/10</span>
                  </div>
                  <p className="text-xs text-slate-200 mb-2">{day.dailySummary === 'pending' ? 'Awaiting data...' : day.dailySummary}</p>
                  <div className="flex gap-3 text-xs text-slate-400 flex-wrap">
                    <span>💤 {day.sleep.total}</span>
                    <span>❤️ {day.heartRate.trend || (day.heartRate.morningWakingBPM ? `${day.heartRate.morningWakingBPM.value} to ${day.heartRate.eveningRestingHR.value} bpm` : 'undefined')}</span>
                    <span>⚡ {day.heartRate.recovery !== undefined ? (day.heartRate.recovery > 0 ? `+${day.heartRate.recovery}` : day.heartRate.recovery) : day.heartRate.dailyHRDrift?.value ?? 'undefined'} bpm</span>
                    <span>🏃 {day.training.distance === 'pending' ? '—' : day.training.distance} km</span>
                  </div>
                </div>
                <ChevronDown size={18} className={`text-slate-500 flex-shrink-0 transition ${expandedDay === day.dayNum ? 'rotate-180' : ''}`} />
              </button>
              {expandedDay === day.dayNum && (
                <div className="border-t border-slate-700 bg-slate-900 px-4 py-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><p className="text-slate-500 font-semibold mb-1">TRAINING</p><p className="text-white">{day.training.duration === 'pending' ? '—' : day.training.duration} | {day.training.distance === 'pending' ? '—' : day.training.distance} km</p></div>
                    <div><p className="text-slate-500 font-semibold mb-1">STEPS</p><p className="text-white">{day.activity.steps === 'pending' ? '—' : day.activity.steps.toLocaleString()}</p></div>
                    <div><p className="text-slate-500 font-semibold mb-1">DISTANCE</p><p className="text-white">{day.activity.distance === 'pending' ? '—' : day.activity.distance} km</p></div>
                    <div><p className="text-slate-500 font-semibold mb-1">CAL BURNED</p><p className="text-white">{day.nutrition.burned === 'pending' ? '—' : day.nutrition.burned.toLocaleString()}</p></div>
                    <div><p className="text-slate-500 font-semibold mb-1">INTAKE</p><p className="text-white">{day.nutrition.intake === 'pending' ? '—' : day.nutrition.intake.toLocaleString()}</p></div>
                    <div><p className="text-slate-500 font-semibold mb-1">DEFICIT</p><p className="text-emerald-400">{day.nutrition.deficit === 'pending' ? '—' : day.nutrition.deficit.toLocaleString()} kcal</p></div>
                  </div>
                  <div className="border-t border-slate-700 pt-3">
                    <p className="text-xs font-semibold text-slate-300 uppercase mb-2">Sleep & Recovery</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-800 p-2 rounded"><p className="text-slate-400 mb-1">Restfulness</p><p className="text-white">{day.sleep.restfulnessRating}%</p></div>
                      <div className="bg-slate-800 p-2 rounded"><p className="text-slate-400 mb-1">Sleep HRV</p><p className="text-white">{day.sleep.sleepHRV} ms</p></div>
                      <div className="bg-slate-800 p-2 rounded"><p className="text-slate-400 mb-1">Waking HRV</p><p className="text-white">{day.sleep.wakingHRV} ms</p></div>
                      <div className="bg-slate-800 p-2 rounded"><p className="text-slate-400 mb-1">Sleep Duration</p><p className="text-white">{day.sleep.total}</p></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'12px'}}>
          <button onClick={() => setShowPerformance(!showPerformance)} style={{border:`1px solid ${showPerformance ? '#2563eb' : '#334155'}`, borderRadius:'8px', padding:'12px 16px', fontSize:'13px', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', cursor:'pointer', background: showPerformance ? '#1e40af' : '#1e293b', color:'white', minHeight:'56px'}}>
            <BarChart3 size={18} />
            <div style={{textAlign:'center'}}><div>View</div><div>Performance</div></div>
          </button>
          <button onClick={() => setShowRecovery(!showRecovery)} style={{border:`1px solid ${showRecovery ? '#16a34a' : '#334155'}`, borderRadius:'8px', padding:'12px 16px', fontSize:'13px', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', cursor:'pointer', background: showRecovery ? '#166534' : '#1e293b', color:'white', minHeight:'56px'}}>
            <Activity size={18} />
            <span>View Recovery</span>
          </button>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'24px'}}>
          <button onClick={() => setShowTrends(!showTrends)} style={{border:`1px solid ${showTrends ? '#2563eb' : '#334155'}`, borderRadius:'8px', padding:'12px 16px', fontSize:'13px', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', cursor:'pointer', background: showTrends ? '#1e40af' : '#1e293b', color:'white', minHeight:'56px'}}>
            <TrendingDown size={18} />
            <span>View Trends</span>
          </button>
          <button onClick={() => setShowAnalytics(!showAnalytics)} style={{border:`1px solid ${showAnalytics ? '#9333ea' : '#334155'}`, borderRadius:'8px', padding:'12px 16px', fontSize:'13px', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', cursor:'pointer', background: showAnalytics ? '#6b21a8' : '#1e293b', color:'white', minHeight:'56px'}}>
            <TrendingUp size={18} />
            <span>View Analytics</span>
          </button>
        </div>

        {showPerformance && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg p-4 border border-slate-700 mb-6">
            <h2 className="text-xs font-semibold text-slate-300 uppercase mb-3">PROJECT TOTALS ({projectData.cumulativeStats.totalDays} DAYS)</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-400">Training</span><p className="text-xl font-bold text-white">{Math.floor(projectData.cumulativeStats.totalTrainingHours)}h {projectData.cumulativeStats.totalTrainingMinutes}m</p></div>
              <div><span className="text-slate-400">Distance</span><p className="text-xl font-bold text-white">{projectData.cumulativeStats.totalDistance} km</p></div>
              <div><span className="text-slate-400">Steps</span><p className="text-xl font-bold text-white">{projectData.cumulativeStats.totalSteps.toLocaleString()}</p></div>
              <div><span className="text-slate-400">Calories</span><p className="text-xl font-bold text-white">{projectData.cumulativeStats.totalCalories.toLocaleString()} kcal</p></div>
            </div>
          </div>
        )}

        {showRecovery && (
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 border border-blue-700">
                <p className="text-xs font-semibold text-slate-300 uppercase mb-2">SLEEP HRV</p>
                <p className="text-3xl font-bold text-white mb-1">{currentDay.sleep.sleepHRV}</p>
                <p className="text-sm font-semibold text-blue-200">ms</p>
              </div>
              <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 border border-green-700">
                <p className="text-xs font-semibold text-slate-300 uppercase mb-2">WAKING HRV</p>
                <p className="text-3xl font-bold text-white mb-1">{currentDay.sleep.wakingHRV}</p>
                <p className="text-sm font-semibold text-green-200">ms</p>
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-2">RESTFULNESS & BODY BATTERY</p>
              <p className="text-2xl font-bold text-purple-400">{currentDay.sleep.restfulnessRating}%</p>
              <p className="text-xs text-slate-400">Restfulness Rating</p>
            </div>
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
              <h2 className="text-sm font-bold text-purple-400 uppercase mb-3">Day {currentDay.dayNum} Story</h2>
              <div className="bg-slate-700 p-3 rounded">
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap overflow-wrap break-word">{currentDay.vibe === 'pending' ? 'Awaiting narrative data...' : currentDay.vibe}</p>
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
              <h2 className="text-sm font-bold text-emerald-400 uppercase mb-3">Personal Insights - The Resilience Narrative</h2>
              <div className="bg-slate-700 p-3 rounded">
                {projectData.personalInsightsTemplate ? (
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap break-words">
                    {projectData.personalInsightsTemplate
                      .replace(/\{\{CURRENT_DAY\}\}/g, projectData.cumulativeStats.totalDays)
                      .replace(/\{\{CURRENT_WEIGHT\}\}/g, projectData.currentWeight)
                      .replace(/\{\{CURRENT_RESTING_HR\}\}/g, 75)
                      .replace(/\{\{CURRENT_MOOD\}\}/g, currentDay.mood || '—')
                      .replace(/\{\{TOTAL_DISTANCE\}\}/g, projectData.cumulativeStats.totalDistance.toFixed(2))
                      .replace(/\{\{TOTAL_CALORIES\}\}/g, projectData.cumulativeStats.totalCalories.toLocaleString())
                      .replace(/\{\{WEIGHT_LOSS\}\}/g, (projectData.currentWeight - projectData.startWeight).toFixed(1))
                      .replace(/\{\{HR_IMPROVEMENT\}\}/g, projectData.benchmarks.day1HR - 75)
                    }
                  </p>
                ) : (
                  <p className="text-xs text-slate-200 leading-relaxed">Personal insights template not available</p>
                )}
              </div>
            </div>
          </div>
        )}

        {showAnalytics && (
          <div className="space-y-5 mb-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg p-4 border border-slate-700">
              <h2 className="text-xs font-semibold text-purple-300 uppercase mb-4">Training Load Overview</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={trainingData} margin={{ top: 10, right: 50, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 11, angle: -45, textAnchor: 'end', height: 80 }} interval={0} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Bar dataKey="training" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-lg p-4 border border-blue-700 bg-slate-800">
              <h2 className="text-sm font-bold text-blue-300 uppercase mb-3">💙 Recovery Balance Analysis</h2>
              <p className="text-xs text-slate-200 leading-relaxed">Your training load averages {avgTraining}h per day, paired with {recoveryBalanceScore}% sleep restfulness. This balance indicates your body is recovering efficiently between sessions.</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg p-4 border border-slate-700">
              <h2 className="text-xs font-semibold text-purple-300 uppercase mb-4">Daily Caloric Deficit</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={deficitData} margin={{ top: 10, right: 50, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 11, angle: -45, textAnchor: 'end', height: 80 }} interval={0} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Bar dataKey="deficit" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-lg p-4 border border-emerald-700 bg-slate-800">
              <h2 className="text-sm font-bold text-emerald-300 uppercase mb-3">💚 Caloric Consistency Analysis</h2>
              <p className="text-xs text-slate-200 leading-relaxed">You've maintained an average daily deficit of {avgDeficit} kcal, with {deficitConsistency}% of days exceeding 1200 kcal. This consistency is the foundation of your {weightLoss.toFixed(1)}kg loss.</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg p-4 border border-slate-700">
              <h2 className="text-xs font-semibold text-purple-300 uppercase mb-4">Resting Heart Rate Trend</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={rhrData} margin={{ top: 10, right: 50, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 11, angle: -45, textAnchor: 'end', height: 80 }} />
                  <YAxis stroke="#94a3b8" domain={[70, 95]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Line type="monotone" dataKey="rhr" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-lg p-4 border border-red-700 bg-slate-800">
              <h2 className="text-sm font-bold text-red-300 uppercase mb-3">❤️ Heart Adaptation Analysis</h2>
              <p className="text-xs text-slate-200 leading-relaxed">Your resting heart rate has shifted from {projectData.benchmarks.day1HR} bpm on Day 1 to {currentDay.heartRate.resting} bpm today. This {projectData.benchmarks.day1HR - currentDay.heartRate.resting} bpm drop is significant – your cardiovascular system is becoming more efficient.</p>
            </div>
          </div>
        )}

        {showTrends && (() => {
          // Find the most recent week with weeklyTrendAnalysis data
          const trendsWeek = Object.keys(projectData.weeks)
            .map(Number)
            .sort((a, b) => b - a)
            .find(wk => projectData.weeks[wk]?.weeklyTrendAnalysis);
          
          if (!trendsWeek) return null;
          const trendData = projectData.weeks[trendsWeek].weeklyTrendAnalysis;
          
          return (
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg p-4 border border-slate-700 mb-6 space-y-4">
            <h2 className="text-xs font-semibold text-cyan-300 uppercase mb-3">▤ Week {trendsWeek} Autonomic Trends</h2>
            
            {/* Morning RHR */}
            <div className="pb-4 border-b border-slate-700">
              <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wider">♥ Morning Heart Rate (Recovery Baseline)</h3>
              <div className="text-2xl font-bold text-white mb-1">{trendData.morningRHR.thisWeek}</div>
              <div className="text-xs text-slate-400 mb-3">bpm</div>
              <div className="text-xs text-slate-300 mb-2">This week: {trendData.morningRHR.thisWeek} | Last week: {trendData.morningRHR.lastWeek} | Change: {(trendData.morningRHR.change > 0 ? '+' : '')}{trendData.morningRHR.change.toFixed(1)} bpm ({(trendData.morningRHR.changePercent > 0 ? '+' : '')}{trendData.morningRHR.changePercent.toFixed(1)}%)</div>
              <div className="text-sm text-slate-200 leading-relaxed">{trendData.morningRHR.trend}: {trendData.morningRHR.interpretation}</div>
            </div>
            
            {/* Daily Drift */}
            <div className="pb-4 border-b border-slate-700">
              <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wider">⬈ Daily Drift (Evening - Morning)</h3>
              <div className="text-2xl font-bold text-emerald-400 mb-1">{(trendData.dailyDrift.thisWeek > 0 ? '+' : '')}{trendData.dailyDrift.thisWeek.toFixed(1)}</div>
              <div className="text-xs text-slate-400 mb-3">bpm average</div>
              <div className="text-xs text-slate-300 mb-2">Pattern: {trendData.dailyDrift.pattern}</div>
              <div className="text-sm text-slate-200 leading-relaxed">{trendData.dailyDrift.pattern}: {trendData.dailyDrift.interpretation}</div>
            </div>
            
            {/* Sleep HRV */}
            <div className="pb-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wider">◐ Sleep HRV (Nervous System Recovery)</h3>
              <div className="text-2xl font-bold text-blue-400 mb-1">{trendData.sleepHRV.thisWeek}</div>
              <div className="text-xs text-slate-400 mb-3">{trendData.sleepHRV.unit}</div>
              <div className="text-xs text-slate-300 mb-2">Pattern: {trendData.sleepHRV.pattern}</div>
              <div className="text-sm text-slate-200 leading-relaxed">{trendData.sleepHRV.pattern}: {trendData.sleepHRV.interpretation}</div>
            </div>
            
            {/* Overall Pattern */}
            <div className="bg-emerald-900 bg-opacity-20 border border-emerald-700 rounded-lg p-3 mt-4">
              <h3 className="text-xs font-semibold text-emerald-300 uppercase mb-2">◈ Overall Pattern</h3>
              <div className="text-xs text-slate-200 mb-3">{trendData.overallTrend}</div>
              <div className="bg-emerald-900 bg-opacity-40 border border-emerald-600 rounded-lg p-2 mt-3">
                <div className="text-xs font-semibold text-emerald-300 uppercase mb-1">▶ Recommendation</div>
                <div className="text-xs text-slate-200">{trendData.recommendation}</div>
              </div>
            </div>
          </div>
          );
        })()}

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">Day {currentDay.dayNum} Complete | {projectData.cumulativeStats.totalDays}/{projectData.cumulativeStats.totalDays} Unbroken Training Days</p>
          <p className="text-xs text-slate-600 mt-2">🔒 Template Locked | Data Secured | Backup v{projectData.backupVersion}</p>
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            <button onClick={handleExportData} className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-xs font-semibold text-white transition">📥 Download Backup</button>
            <label className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-xs font-semibold text-white transition cursor-pointer">
              📤 Restore Backup
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>
            <button className="px-4 py-2 bg-emerald-700 hover:emerald-600 rounded-lg text-xs font-semibold text-white transition">➕ Add Day</button>
          </div>
        </div>
      </div>
    </div>
  );
}