import { useState, useMemo, useCallback } from "react";
import {
  DISTRICTS,
  calculatePotentialScore,
  getScoreLevel,
  generateSalesPitch,
  ADDITIONAL_DIMENSIONS,
  type DistrictData,
} from "@/data/districtData";
import { MapPin, Users, Pill, Activity, Building2, TrendingUp, Copy, Check, ChevronDown, ChevronUp, Save, RotateCcw, Stethoscope, Heart, FlaskConical } from "lucide-react";

interface FormState {
  partner: string;
  gpCount: string;
  pharmacistRate: string;
  preDmPct: string;
  bgmVol: string;
  distance: string;
  cgmGPs: string;
  insulinPenSales: string;
  // Patient composition breakdown
  insulinPatients: string;
  oralPatients: string;
  dmPatients: string;
  preDmPatients: string;
  totalPatients: string;
  // Editable district presets
  dhcFootfall: string;
  pharmacyFootfall: string;
  agingIndex: string;
  publicHousingRatio: string;
  medianIncome: string;
  competitorPresence: string;
  needleSales: string;
}

function formFromDistrict(d: DistrictData): FormState {
  return {
    partner: d.dhcName,
    gpCount: String(d.estimatedCdccGPs),
    pharmacistRate: "3",
    preDmPct: String(d.patientComposition.preDm),
    bgmVol: String(d.bgmMonthlySales),
    distance: String(d.avgDistanceDhcToPharmacy),
    cgmGPs: String(d.cgmSupportGPs),
    insulinPenSales: String(d.insulinPenSales),
    insulinPatients: String(Math.round(d.dhcMonthlyFootfall * d.patientComposition.insulin / 100)),
    oralPatients: String(Math.round(d.dhcMonthlyFootfall * d.patientComposition.oral / 100)),
    dmPatients: String(Math.round(d.dhcMonthlyFootfall * d.patientComposition.dm / 100)),
    preDmPatients: String(Math.round(d.dhcMonthlyFootfall * d.patientComposition.preDm / 100)),
    totalPatients: String(d.dhcMonthlyFootfall),
    dhcFootfall: String(d.dhcMonthlyFootfall),
    pharmacyFootfall: String(d.pharmacyMonthlyFootfall),
    agingIndex: String(d.agingIndex),
    publicHousingRatio: String(d.publicHousingRatio),
    medianIncome: String(d.medianIncome),
    competitorPresence: d.competitorPresence,
    needleSales: String(d.needleSales),
  };
}

const Dashboard = () => {
  const [selectedDistrictId, setSelectedDistrictId] = useState(DISTRICTS[0].id);
  const [form, setForm] = useState<FormState>(() => formFromDistrict(DISTRICTS[0]));
  const [copied, setCopied] = useState(false);
  const [showBrainstorm, setShowBrainstorm] = useState(false);
  const [savedPresets, setSavedPresets] = useState<Record<string, FormState>>({});

  const district = useMemo(
    () => DISTRICTS.find((d) => d.id === selectedDistrictId) || DISTRICTS[0],
    [selectedDistrictId]
  );

  const handleDistrictChange = useCallback((id: string) => {
    setSelectedDistrictId(id);
    const d = DISTRICTS.find((x) => x.id === id);
    if (d) {
      // Use saved preset if available, otherwise use default
      const saved = savedPresets[id];
      setForm(saved || formFromDistrict(d));
    }
  }, [savedPresets]);

  const update = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const savePreset = () => {
    setSavedPresets((prev) => ({ ...prev, [selectedDistrictId]: { ...form } }));
  };

  const resetPreset = () => {
    setForm(formFromDistrict(district));
    setSavedPresets((prev) => {
      const next = { ...prev };
      delete next[selectedDistrictId];
      return next;
    });
  };

  // Parse values with fallback
  const v = useMemo(() => {
    const gp = parseInt(form.gpCount) || 0;
    const rate = parseInt(form.pharmacistRate) || 3;
    const preDm = parseInt(form.preDmPct) || 0;
    const bgm = parseInt(form.bgmVol) || 0;
    const dist = parseInt(form.distance) || 0;
    const cgmGPs = parseInt(form.cgmGPs) || 0;
    const insulinPen = parseInt(form.insulinPenSales) || 0;
    const dhcFoot = parseInt(form.dhcFootfall) || 0;
    const pharmFoot = parseInt(form.pharmacyFootfall) || 0;
    const aging = parseFloat(form.agingIndex) || 0;
    const pubHousing = parseInt(form.publicHousingRatio) || 0;
    const income = parseInt(form.medianIncome) || 0;
    const comp = form.competitorPresence || "moderate";
    const insulinPat = parseInt(form.insulinPatients) || 0;
    const oralPat = parseInt(form.oralPatients) || 0;
    const dmPat = parseInt(form.dmPatients) || 0;
    const preDmPat = parseInt(form.preDmPatients) || 0;
    const totalPat = parseInt(form.totalPatients) || 0;
    const needles = parseInt(form.needleSales) || 0;

    return { gp, rate, preDm, bgm, dist, cgmGPs, insulinPen, dhcFoot, pharmFoot, aging, pubHousing, income, comp, insulinPat, oralPat, dmPat, preDmPat, totalPat, needles };
  }, [form]);

  const analysis = useMemo(() => {
    const score = calculatePotentialScore({
      cdccGPs: v.gp,
      pharmacistRate: v.rate,
      preDmPct: v.preDm,
      bgmVol: v.bgm,
      distance: v.dist,
      agingIndex: v.aging,
      publicHousingRatio: v.pubHousing,
      dhcFootfall: v.dhcFoot,
      pharmacyFootfall: v.pharmFoot,
      competitorPresence: v.comp,
      cgmSupportGPs: v.cgmGPs,
      insulinPenSales: v.insulinPen,
    });

    const level = getScoreLevel(score);
    const pitches = generateSalesPitch({
      pharmacistRate: v.rate,
      cdccGPs: v.gp,
      preDmPct: v.preDm,
      bgmVol: v.bgm,
      distance: v.dist,
      cgmSupportGPs: v.cgmGPs,
      competitorPresence: v.comp,
      agingIndex: v.aging,
    });

    const estimatedConversion = Math.round(v.bgm * 0.08 + v.gp * 1.5 + v.cgmGPs * 3);

    return { score, level, pitches, estimatedConversion };
  }, [v]);

  const copyResult = () => {
    const text = document.getElementById("analysis-pre")?.textContent || "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSaved = !!savedPresets[selectedDistrictId];

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="text-primary-foreground" size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Abbott FreeStyle Libre · HK 18區銷售滲透工具</h1>
            <p className="text-xs text-muted-foreground">v2026.04 | User: Gabbi XIAO</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* ============ INPUT SECTION ============ */}
        <div className="flex-1 space-y-4">
          <div className="terminal-box">
            <div className="terminal-header flex items-center justify-center gap-2">
              <MapPin size={16} /> DATA INPUT
            </div>

            {/* District selector */}
            <div className="mb-4">
              <label className="section-label">區域 District</label>
              <select
                value={selectedDistrictId}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full p-2 text-sm"
              >
                {DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nameCn} ({d.nameEn}) — {d.dhcType}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="section-label">合作夥伴 DHC / Pharmacy</label>
              <input type="text" value={form.partner} onChange={(e) => update("partner", e.target.value)} className="w-full p-2 text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="section-label flex items-center gap-1"><Stethoscope size={12} className="text-primary" /> CDCC 活躍 GP</label>
                <input type="number" value={form.gpCount} onChange={(e) => update("gpCount", e.target.value)} className="w-full p-2 text-sm" />
              </div>
              <div>
                <label className="section-label flex items-center gap-1"><Heart size={12} className="text-primary" /> CGM 支持 GP</label>
                <input type="number" value={form.cgmGPs} onChange={(e) => update("cgmGPs", e.target.value)} className="w-full p-2 text-sm" />
              </div>
            </div>

            <div className="mb-4">
              <label className="section-label">
                藥劑師配合度: <span className="text-terminal-amber">{"★".repeat(parseInt(form.pharmacistRate) || 3)}{"☆".repeat(5 - (parseInt(form.pharmacistRate) || 3))}</span>
              </label>
              <input type="range" min="1" max="5" value={form.pharmacistRate} onChange={(e) => update("pharmacistRate", e.target.value)} className="w-full" />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="section-label">BGM 月銷 (盒)</label>
                <input type="number" value={form.bgmVol} onChange={(e) => update("bgmVol", e.target.value)} className="w-full p-2 text-sm" />
              </div>
              <div>
                <label className="section-label">胰島素筆/月</label>
                <input type="number" value={form.insulinPenSales} onChange={(e) => update("insulinPenSales", e.target.value)} className="w-full p-2 text-sm" />
              </div>
              <div>
                <label className="section-label">針頭銷量/月</label>
                <input type="number" value={form.needleSales} onChange={(e) => update("needleSales", e.target.value)} className="w-full p-2 text-sm" />
              </div>
            </div>

            <div className="mb-4">
              <label className="section-label">DHC至藥房步程 (分鐘)</label>
              <input type="number" value={form.distance} onChange={(e) => update("distance", e.target.value)} className="w-full p-2 text-sm" />
            </div>
          </div>

          {/* Patient Composition */}
          <div className="terminal-box">
            <div className="terminal-header flex items-center justify-center gap-2">
              <Users size={16} /> 患者組成 PATIENT COMPOSITION
            </div>

            <div className="mb-3">
              <label className="section-label">總患者人流/月 (估算)</label>
              <input type="number" value={form.totalPatients} onChange={(e) => update("totalPatients", e.target.value)} className="w-full p-2 text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-md bg-accent/50 border border-primary/10">
                <label className="section-label flex items-center gap-1"><Pill size={12} className="text-primary" /> 打胰島素 Insulin</label>
                <input type="number" value={form.insulinPatients} onChange={(e) => update("insulinPatients", e.target.value)} placeholder="人數" className="w-full p-2 text-sm mt-1" />
                <div className="text-xs text-muted-foreground mt-1">
                  佔比: {v.totalPat > 0 ? ((v.insulinPat / v.totalPat) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="p-3 rounded-md bg-accent/50 border border-primary/10">
                <label className="section-label flex items-center gap-1"><FlaskConical size={12} className="text-primary" /> 口服藥 Oral</label>
                <input type="number" value={form.oralPatients} onChange={(e) => update("oralPatients", e.target.value)} placeholder="人數" className="w-full p-2 text-sm mt-1" />
                <div className="text-xs text-muted-foreground mt-1">
                  佔比: {v.totalPat > 0 ? ((v.oralPat / v.totalPat) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="p-3 rounded-md bg-accent/50 border border-primary/10">
                <label className="section-label flex items-center gap-1"><Activity size={12} className="text-terminal-red" /> 糖尿病 DM</label>
                <input type="number" value={form.dmPatients} onChange={(e) => update("dmPatients", e.target.value)} placeholder="人數" className="w-full p-2 text-sm mt-1" />
                <div className="text-xs text-muted-foreground mt-1">
                  佔比: {v.totalPat > 0 ? ((v.dmPat / v.totalPat) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="p-3 rounded-md bg-accent/50 border border-primary/10">
                <label className="section-label flex items-center gap-1"><TrendingUp size={12} className="text-terminal-amber" /> 前期 Pre-DM</label>
                <input type="number" value={form.preDmPatients} onChange={(e) => update("preDmPatients", e.target.value)} placeholder="人數" className="w-full p-2 text-sm mt-1" />
                <div className="text-xs text-muted-foreground mt-1">
                  佔比: {v.totalPat > 0 ? ((v.preDmPat / v.totalPat) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>

            <div className="mt-3 p-2 rounded bg-muted text-xs text-muted-foreground">
              Pre-DM%（用於評分）: <input type="number" value={form.preDmPct} onChange={(e) => update("preDmPct", e.target.value)} className="inline-block w-16 p-1 text-xs ml-1" />%
            </div>
          </div>

          {/* Editable District Presets */}
          <div className="terminal-box">
            <div className="terminal-header flex items-center justify-center gap-2">
              <Building2 size={16} /> 區域數據 DISTRICT PRESETS
              {isSaved && <span className="text-xs opacity-70">(已保存)</span>}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="section-label">DHC 月人流</label>
                <input type="number" value={form.dhcFootfall} onChange={(e) => update("dhcFootfall", e.target.value)} className="w-full p-2 text-sm" />
              </div>
              <div>
                <label className="section-label">藥房月人流</label>
                <input type="number" value={form.pharmacyFootfall} onChange={(e) => update("pharmacyFootfall", e.target.value)} className="w-full p-2 text-sm" />
              </div>
              <div>
                <label className="section-label">老齡化指數 (%)</label>
                <input type="number" step="0.1" value={form.agingIndex} onChange={(e) => update("agingIndex", e.target.value)} className="w-full p-2 text-sm" />
              </div>
              <div>
                <label className="section-label">公屋比例 (%)</label>
                <input type="number" value={form.publicHousingRatio} onChange={(e) => update("publicHousingRatio", e.target.value)} className="w-full p-2 text-sm" />
              </div>
              <div>
                <label className="section-label">收入中位數 (HKD)</label>
                <input type="number" value={form.medianIncome} onChange={(e) => update("medianIncome", e.target.value)} className="w-full p-2 text-sm" />
              </div>
              <div>
                <label className="section-label">競品壓力</label>
                <select value={form.competitorPresence} onChange={(e) => update("competitorPresence", e.target.value)} className="w-full p-2 text-sm">
                  <option value="strong">強勢 Strong</option>
                  <option value="moderate">中等 Moderate</option>
                  <option value="weak">弱 Weak</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={savePreset} className="flex-1 flex items-center justify-center gap-2 p-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                <Save size={14} /> 保存此區數據
              </button>
              <button onClick={resetPreset} className="flex items-center justify-center gap-2 p-2 text-sm font-semibold bg-muted text-muted-foreground rounded-md hover:opacity-90 transition-opacity px-4">
                <RotateCcw size={14} /> 重置
              </button>
            </div>
          </div>
        </div>

        {/* ============ ANALYSIS SECTION ============ */}
        <div className="flex-1 space-y-4">
          <div className="terminal-box-double">
            <div className="terminal-header flex items-center justify-center gap-2">
              <TrendingUp size={16} /> REAL-TIME ANALYSIS
            </div>

            {/* Score card */}
            <div className="flex items-center gap-4 mb-4 p-4 rounded-lg bg-muted/50">
              <div className="text-center">
                <div className={`text-4xl font-bold font-mono ${analysis.level.cssClass}`}>
                  {analysis.score}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Potential Score</div>
              </div>
              <div className="flex-1">
                <div className={`text-sm font-semibold ${analysis.level.cssClass}`}>{analysis.level.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{district.nameCn} ({district.nameEn}) · {district.dhcType}</div>
                <div className="text-xs text-muted-foreground">{form.partner}</div>
              </div>
            </div>

            {/* Detailed report */}
            <pre id="analysis-pre" className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-foreground p-3 rounded-md bg-muted/30">
{`┌─────────────────────────────────────────┐
│  核心數據分析                            │
├─────────────────────────────────────────┤
│  CDCC渠道力: ${v.gp > 15 ? "強" : v.gp > 8 ? "中" : "弱"} (${v.gp} GPs)
│  CGM支持GP: ${v.cgmGPs} 位
│  藥劑師推動力: ${"★".repeat(v.rate)}${"☆".repeat(5 - v.rate)}
│  Pre-DM佔比: ${v.preDm}%
│  BGM月銷量: ${v.bgm} 盒
│  胰島素筆: ${v.insulinPen} 支/月
│  針頭銷量: ${v.needles} 支/月
├─────────────────────────────────────────┤
│  患者組成 (推算)                         │
├─────────────────────────────────────────┤
│  總人流: ${v.totalPat} 人/月
│  打胰島素: ${v.insulinPat} 人 (${v.totalPat > 0 ? ((v.insulinPat / v.totalPat) * 100).toFixed(1) : 0}%)
│  口服藥:   ${v.oralPat} 人 (${v.totalPat > 0 ? ((v.oralPat / v.totalPat) * 100).toFixed(1) : 0}%)
│  DM確診:   ${v.dmPat} 人 (${v.totalPat > 0 ? ((v.dmPat / v.totalPat) * 100).toFixed(1) : 0}%)
│  Pre-DM:   ${v.preDmPat} 人 (${v.totalPat > 0 ? ((v.preDmPat / v.totalPat) * 100).toFixed(1) : 0}%)
├─────────────────────────────────────────┤
│  地域影響因素                            │
├─────────────────────────────────────────┤
│  DHC人流: ${v.dhcFoot}/月
│  藥房人流: ${v.pharmFoot}/月
│  老齡化: ${v.aging}% (65+)
│  公屋比例: ${v.pubHousing}%
│  收入中位: HK$${v.income.toLocaleString()}
│  距離障礙: ${v.dist}分鐘步程
│  競品壓力: ${v.comp === "strong" ? "⚠ 強勢" : v.comp === "moderate" ? "△ 中等" : "○ 弱"}
├─────────────────────────────────────────┤
│  預估CGM月轉化: ≈ ${analysis.estimatedConversion} 套
├─────────────────────────────────────────┤
│  戰術執行建議                            │
├─────────────────────────────────────────┤
${analysis.pitches.map((p) => `│  ▸ ${p}`).join("\n")}
├─────────────────────────────────────────┤
│  CSV:
│  ${district.nameEn},${form.partner},${v.gp},${v.rate},${v.preDm},${v.bgm},${v.dist},${analysis.score}
└─────────────────────────────────────────┘`}
            </pre>

            <button
              onClick={copyResult}
              className="w-full mt-3 p-2.5 flex items-center justify-center gap-2 font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm"
            >
              {copied ? <><Check size={16} /> 已複製</> : <><Copy size={16} /> 複製分析結果</>}
            </button>
          </div>
        </div>
      </div>

      {/* 18 District Overview */}
      <div className="mt-6 terminal-box overflow-x-auto">
        <div className="terminal-header flex items-center justify-center gap-2">
          <MapPin size={16} /> 18區總覽 DISTRICT OVERVIEW
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-primary border-b-2 border-border font-semibold">
              <th className="text-left p-2">區域</th>
              <th className="text-left p-2">DHC</th>
              <th className="text-center p-2">GPs</th>
              <th className="text-center p-2">CGM GP</th>
              <th className="text-center p-2">DHC人流</th>
              <th className="text-center p-2">BGM銷量</th>
              <th className="text-center p-2">Pre-DM%</th>
              <th className="text-center p-2">老齡%</th>
              <th className="text-center p-2">競品</th>
              <th className="text-center p-2">潛力分</th>
              <th className="text-center p-2">等級</th>
            </tr>
          </thead>
          <tbody>
            {DISTRICTS.map((d) => {
              const saved = savedPresets[d.id];
              const s = calculatePotentialScore({
                cdccGPs: saved ? parseInt(saved.gpCount) || d.estimatedCdccGPs : d.estimatedCdccGPs,
                pharmacistRate: saved ? parseInt(saved.pharmacistRate) || 3 : 3,
                preDmPct: saved ? parseInt(saved.preDmPct) || d.patientComposition.preDm : d.patientComposition.preDm,
                bgmVol: saved ? parseInt(saved.bgmVol) || d.bgmMonthlySales : d.bgmMonthlySales,
                distance: saved ? parseInt(saved.distance) || d.avgDistanceDhcToPharmacy : d.avgDistanceDhcToPharmacy,
                agingIndex: saved ? parseFloat(saved.agingIndex) || d.agingIndex : d.agingIndex,
                publicHousingRatio: saved ? parseInt(saved.publicHousingRatio) || d.publicHousingRatio : d.publicHousingRatio,
                dhcFootfall: saved ? parseInt(saved.dhcFootfall) || d.dhcMonthlyFootfall : d.dhcMonthlyFootfall,
                pharmacyFootfall: saved ? parseInt(saved.pharmacyFootfall) || d.pharmacyMonthlyFootfall : d.pharmacyMonthlyFootfall,
                competitorPresence: saved ? saved.competitorPresence : d.competitorPresence,
                cgmSupportGPs: saved ? parseInt(saved.cgmGPs) || d.cgmSupportGPs : d.cgmSupportGPs,
                insulinPenSales: saved ? parseInt(saved.insulinPenSales) || d.insulinPenSales : d.insulinPenSales,
              });
              const lvl = getScoreLevel(s);
              const isSelected = d.id === selectedDistrictId;
              const hasSave = !!savedPresets[d.id];
              return (
                <tr
                  key={d.id}
                  className={`border-b border-border/50 cursor-pointer hover:bg-accent/50 transition-colors ${isSelected ? "bg-accent" : ""}`}
                  onClick={() => handleDistrictChange(d.id)}
                >
                  <td className="p-2 font-semibold">{d.nameCn} {hasSave && <span className="text-primary">●</span>}</td>
                  <td className="p-2 text-muted-foreground">{d.dhcType}</td>
                  <td className="text-center p-2">{saved ? saved.gpCount : d.estimatedCdccGPs}</td>
                  <td className="text-center p-2">{saved ? saved.cgmGPs : d.cgmSupportGPs}</td>
                  <td className="text-center p-2">{saved ? saved.dhcFootfall : d.dhcMonthlyFootfall}</td>
                  <td className="text-center p-2">{saved ? saved.bgmVol : d.bgmMonthlySales}</td>
                  <td className="text-center p-2">{saved ? saved.preDmPct : d.patientComposition.preDm}%</td>
                  <td className="text-center p-2">{saved ? saved.agingIndex : d.agingIndex}%</td>
                  <td className="text-center p-2">{(saved?.competitorPresence || d.competitorPresence) === "strong" ? "⚠" : (saved?.competitorPresence || d.competitorPresence) === "moderate" ? "△" : "○"}</td>
                  <td className={`text-center p-2 font-bold ${lvl.cssClass}`}>{s}</td>
                  <td className={`text-center p-2 font-semibold ${lvl.cssClass}`}>{s > 80 ? "HIGH" : s > 50 ? "MED" : "LOW"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Brainstorm Section (collapsible) */}
      <div className="mt-6 terminal-box">
        <button
          onClick={() => setShowBrainstorm(!showBrainstorm)}
          className="w-full flex items-center justify-between text-sm font-semibold text-primary"
        >
          <span className="flex items-center gap-2">💡 建議額外收集維度 — BRAINSTORM</span>
          {showBrainstorm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {showBrainstorm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {ADDITIONAL_DIMENSIONS.map((dim) => (
              <div key={dim.category} className="p-3 rounded-md bg-muted/50 border border-border">
                <div className="text-primary font-semibold text-sm mb-2">▸ {dim.category}</div>
                {dim.items.map((item) => (
                  <div key={item} className="text-xs text-muted-foreground pl-2 mb-0.5">• {item}</div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-6 pb-4">
        Abbott FreeStyle Libre HK — Confidential Sales Tool v2026.04 · 數據為估算值，請根據實際調研更新
      </p>
    </div>
  );
};

export default Dashboard;
