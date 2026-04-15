import { useState, useMemo, useCallback } from "react";
import * as XLSX from "xlsx";
import {
  DISTRICTS,
  calculatePotentialScore,
  generateSalesPitch,
  ADDITIONAL_DIMENSIONS,
  COMPETITOR_BRANDS,
  type DistrictData,
  type CompetitorBrands,
} from "@/data/districtData";
import { MapPin, Users, Pill, Activity, Building2, TrendingUp, Copy, Check, ChevronDown, ChevronUp, Save, RotateCcw, Stethoscope, Heart, FlaskConical, Plus, Trash2, Store, Hospital, Download } from "lucide-react";

interface PharmacyForm {
  name: string;
  pharmacistCount: string;
  cgmAwareness: string;
  agpAwareness: string;
  cgmSupport: string;
  bgmVol: string;
  insulinPenSales: string;
  needleSales: string;
  monthlyConsultations: string;
  totalFootfall: string;
  insulinPatients: string;
  oralPatients: string;
  dmPatients: string;
  preDmPatients: string;
}

interface FormState {
  gpCount: string;
  cgmGPs: string;
  dhcName: string;
  dhcFootfall: string;
  dhcNurseCount: string;
  dhcNurseCgmAwareness: string;
  dhcNurseAgpAwareness: string;
  dhcPharmacistCount: string;
  dhcPharmacistCgmAwareness: string;
  dhcPharmacistAgpAwareness: string;
  dhcCgmSupport: string;
  totalPopulation: string;
  estimatedDmPatients: string;
  agingIndex: string;
  publicHousingRatio: string;
  medianIncome: string;
  competitors: CompetitorBrands;
  distance: string;
  currentCgmSales: string;
  pharmacy1: PharmacyForm;
  pharmacy2: PharmacyForm | null;
}

function pharmacyFromData(p: DistrictData["defaultPharmacy"]): PharmacyForm {
  return {
    name: p.name,
    pharmacistCount: String(p.pharmacistCount),
    cgmAwareness: String(p.cgmAwareness),
    agpAwareness: String(p.agpAwareness),
    cgmSupport: p.cgmSupport,
    bgmVol: String(p.bgmMonthlySales),
    insulinPenSales: String(p.insulinPenSales),
    needleSales: String(p.needleSales),
    monthlyConsultations: String(p.monthlyConsultations),
    totalFootfall: String(p.totalFootfall),
    insulinPatients: String(Math.round(p.totalFootfall * p.patientComposition.insulin / 100)),
    oralPatients: String(Math.round(p.totalFootfall * p.patientComposition.oral / 100)),
    dmPatients: String(Math.round(p.totalFootfall * p.patientComposition.dm / 100)),
    preDmPatients: String(Math.round(p.totalFootfall * p.patientComposition.preDm / 100)),
  };
}

function formFromDistrict(d: DistrictData): FormState {
  return {
    gpCount: String(d.estimatedCdccGPs),
    cgmGPs: String(d.cgmSupportGPs),
    dhcName: d.dhcName,
    dhcFootfall: String(d.dhcMonthlyFootfall),
    dhcNurseCount: String(d.dhcNurseCount),
    dhcNurseCgmAwareness: String(d.dhcNurseCgmAwareness),
    dhcNurseAgpAwareness: String(d.dhcNurseAgpAwareness),
    dhcPharmacistCount: String(d.dhcPharmacistCount),
    dhcPharmacistCgmAwareness: String(d.dhcPharmacistCgmAwareness),
    dhcPharmacistAgpAwareness: String(d.dhcPharmacistAgpAwareness),
    dhcCgmSupport: d.dhcCgmSupport,
    totalPopulation: String(d.totalPopulation),
    estimatedDmPatients: String(d.estimatedDmPatients),
    agingIndex: String(d.agingIndex),
    publicHousingRatio: String(d.publicHousingRatio),
    medianIncome: String(d.medianIncome),
    competitors: { ...d.competitors },
    distance: String(d.avgDistanceDhcToPharmacy),
    currentCgmSales: String(d.currentCgmSales),
    pharmacy1: pharmacyFromData(d.defaultPharmacy),
    pharmacy2: null,
  };
}

const emptyPharmacy: PharmacyForm = {
  name: "", pharmacistCount: "1", cgmAwareness: "1", agpAwareness: "1", cgmSupport: "neutral",
  bgmVol: "0", insulinPenSales: "0", needleSales: "0", monthlyConsultations: "0", totalFootfall: "0",
  insulinPatients: "0", oralPatients: "0", dmPatients: "0", preDmPatients: "0",
};

const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);
const supportLabel = (s: string) => s === "support" ? "✅ 支持" : s === "oppose" ? "❌ 不支持" : "➖ 中立";
const n = (s: string) => parseInt(s) || 0;
const nf = (s: string) => parseFloat(s) || 0;
const competitorTotal = (c: CompetitorBrands) => c.linx + c.sibionics + c.ican + c.roche;

function getDistrictAnalysis(form: FormState) {
  const p1 = form.pharmacy1;
  const p2 = form.pharmacy2;
  const aggBgm = n(p1.bgmVol) + (p2 ? n(p2.bgmVol) : 0);
  const aggInsulinPen = n(p1.insulinPenSales) + (p2 ? n(p2.insulinPenSales) : 0);
  const aggFootfall = n(p1.totalFootfall) + (p2 ? n(p2.totalFootfall) : 0);
  const avgPharmCgm = p2 ? (n(p1.cgmAwareness) + n(p2.cgmAwareness)) / 2 : n(p1.cgmAwareness);
  const avgPharmAgp = p2 ? (n(p1.agpAwareness) + n(p2.agpAwareness)) / 2 : n(p1.agpAwareness);
  const avgDhcCgm = (n(form.dhcNurseCgmAwareness) + n(form.dhcPharmacistCgmAwareness)) / 2;
  const avgDhcAgp = (n(form.dhcNurseAgpAwareness) + n(form.dhcPharmacistAgpAwareness)) / 2;
  const totalInsulinPat = n(p1.insulinPatients) + (p2 ? n(p2.insulinPatients) : 0);
  const totalOralPat = n(p1.oralPatients) + (p2 ? n(p2.oralPatients) : 0);
  const totalDmPat = n(p1.dmPatients) + (p2 ? n(p2.dmPatients) : 0);
  const totalPreDmPat = n(p1.preDmPatients) + (p2 ? n(p2.preDmPatients) : 0);
  const preDmPct = aggFootfall > 0 ? Math.round((totalPreDmPat / aggFootfall) * 100) : 0;
  const cTotal = competitorTotal(form.competitors);

  const score = calculatePotentialScore({
    cdccGPs: n(form.gpCount), pharmacistRate: avgPharmCgm, bgmVol: aggBgm,
    distance: n(form.distance), agingIndex: nf(form.agingIndex), publicHousingRatio: n(form.publicHousingRatio),
    dhcFootfall: n(form.dhcFootfall), pharmacyFootfall: aggFootfall,
    competitorTotal: cTotal, cgmSupportGPs: n(form.cgmGPs),
    insulinPenSales: aggInsulinPen, dhcCgmAwareness: avgDhcCgm, dhcAgpAwareness: avgDhcAgp,
    pharmacyCgmAwareness: avgPharmCgm, pharmacyAgpAwareness: avgPharmAgp, preDmPct,
  });
  const estimatedConversion = Math.round(aggBgm * 0.08 + n(form.gpCount) * 1.5 + n(form.cgmGPs) * 3);
  const currentSales = n(form.currentCgmSales);
  const potential = estimatedConversion - currentSales;

  return {
    score, estimatedConversion, currentSales, potential,
    aggBgm, aggInsulinPen, aggFootfall, preDmPct, cTotal,
    totalInsulinPat, totalOralPat, totalDmPat, totalPreDmPat,
    avgPharmCgm, avgPharmAgp, avgDhcCgm, avgDhcAgp,
  };
}

const Dashboard = () => {
  const [selectedDistrictId, setSelectedDistrictId] = useState(DISTRICTS[0].id);
  const [form, setForm] = useState<FormState>(() => formFromDistrict(DISTRICTS[0]));
  const [copied, setCopied] = useState(false);
  const [showBrainstorm, setShowBrainstorm] = useState(false);
  const [savedPresets, setSavedPresets] = useState<Record<string, FormState>>({});

  const district = useMemo(() => DISTRICTS.find((d) => d.id === selectedDistrictId) || DISTRICTS[0], [selectedDistrictId]);

  const handleDistrictChange = useCallback((id: string) => {
    setSelectedDistrictId(id);
    const d = DISTRICTS.find((x) => x.id === id);
    if (d) setForm(savedPresets[id] || formFromDistrict(d));
  }, [savedPresets]);

  const update = (key: keyof FormState, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const updateCompetitor = (brand: keyof CompetitorBrands, value: string) =>
    setForm((prev) => ({ ...prev, competitors: { ...prev.competitors, [brand]: parseInt(value) || 0 } }));
  const updateP1 = (key: keyof PharmacyForm, value: string) => setForm((prev) => ({ ...prev, pharmacy1: { ...prev.pharmacy1, [key]: value } }));
  const updateP2 = (key: keyof PharmacyForm, value: string) => setForm((prev) => prev.pharmacy2 ? { ...prev, pharmacy2: { ...prev.pharmacy2, [key]: value } } : prev);

  const addPharmacy2 = () => setForm((prev) => ({ ...prev, pharmacy2: { ...emptyPharmacy } }));
  const removePharmacy2 = () => setForm((prev) => ({ ...prev, pharmacy2: null }));

  const savePreset = () => setSavedPresets((prev) => ({ ...prev, [selectedDistrictId]: { ...form } }));
  const resetPreset = () => {
    setForm(formFromDistrict(district));
    setSavedPresets((prev) => { const next = { ...prev }; delete next[selectedDistrictId]; return next; });
  };

  const p1 = form.pharmacy1;
  const p2 = form.pharmacy2;
  const analysis = useMemo(() => {
    const a = getDistrictAnalysis(form);
    const pitches = generateSalesPitch({
      pharmacyCgmAwareness: a.avgPharmCgm, pharmacyAgpAwareness: a.avgPharmAgp,
      dhcCgmAwareness: a.avgDhcCgm, dhcAgpAwareness: a.avgDhcAgp,
      cdccGPs: n(form.gpCount), preDmPct: a.preDmPct, bgmVol: a.aggBgm,
      distance: n(form.distance), cgmSupportGPs: n(form.cgmGPs),
      competitorTotal: a.cTotal, agingIndex: nf(form.agingIndex),
      dhcCgmSupport: form.dhcCgmSupport, pharmacyCgmSupport: p1.cgmSupport,
    });
    return { ...a, pitches };
  }, [form, p1.cgmSupport]);

  const aggFootfall = analysis.aggFootfall;
  const aggBgm = analysis.aggBgm;
  const aggConsult = n(p1.monthlyConsultations) + (p2 ? n(p2.monthlyConsultations) : 0);
  const preDmPct = analysis.preDmPct;

  const copyResult = () => {
    const text = document.getElementById("analysis-pre")?.textContent || "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSaved = !!savedPresets[selectedDistrictId];

  // ── Excel Export ──
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryRows = DISTRICTS.map((d) => {
      const f = savedPresets[d.id] || formFromDistrict(d);
      const a = getDistrictAnalysis(f);
      return {
        "區域": d.nameCn,
        "英文": d.nameEn,
        "DHC類型": d.dhcType,
        "總人口": n(f.totalPopulation),
        "糖尿病患者": n(f.estimatedDmPatients),
        "CDCC GP": n(f.gpCount),
        "CGM支持GP": n(f.cgmGPs),
        "DHC人流": n(f.dhcFootfall),
        "藥房人流": a.aggFootfall,
        "BGM月銷": a.aggBgm,
        "胰島素患者": a.totalInsulinPat,
        "口服藥患者": a.totalOralPat,
        "DM患者": a.totalDmPat,
        "Pre-DM患者": a.totalPreDmPat,
        "Linx": f.competitors.linx,
        "Sibionics": f.competitors.sibionics,
        "iCan": f.competitors.ican,
        "Roche": f.competitors.roche,
        "預估CGM月轉化": a.estimatedConversion,
        "現在銷量": a.currentSales,
        "Potential": a.potential,
      };
    }).sort((a, b) => b["預估CGM月轉化"] - a["預估CGM月轉化"]);

    const summaryWs = XLSX.utils.json_to_sheet(summaryRows);
    summaryWs["!cols"] = Object.keys(summaryRows[0]).map(() => ({ wch: 14 }));
    XLSX.utils.book_append_sheet(wb, summaryWs, "18區總覽排名");

    // Individual district sheets
    DISTRICTS.forEach((d) => {
      const f = savedPresets[d.id] || formFromDistrict(d);
      const a = getDistrictAnalysis(f);
      const pitches = generateSalesPitch({
        pharmacyCgmAwareness: a.avgPharmCgm, pharmacyAgpAwareness: a.avgPharmAgp,
        dhcCgmAwareness: a.avgDhcCgm, dhcAgpAwareness: a.avgDhcAgp,
        cdccGPs: n(f.gpCount), preDmPct: a.preDmPct, bgmVol: a.aggBgm,
        distance: n(f.distance), cgmSupportGPs: n(f.cgmGPs),
        competitorTotal: a.cTotal, agingIndex: nf(f.agingIndex),
        dhcCgmSupport: f.dhcCgmSupport, pharmacyCgmSupport: f.pharmacy1.cgmSupport,
      });

      const rows: (string | number)[][] = [
        ["Abbott CGM 區域分析報告", "", "", `生成日期: ${new Date().toLocaleDateString()}`],
        [],
        ["═══ 區域基本數據 ═══"],
        ["區域", `${d.nameCn} (${d.nameEn})`],
        ["總人口", n(f.totalPopulation)],
        ["糖尿病患者數", n(f.estimatedDmPatients)],
        ["老齡化指數 (%)", nf(f.agingIndex)],
        ["公屋比例 (%)", n(f.publicHousingRatio)],
        ["收入中位數 (HKD)", n(f.medianIncome)],
        [],
        ["═══ 競品分佈 ═══"],
        ["Linx", f.competitors.linx],
        ["Sibionics", f.competitors.sibionics],
        ["iCan", f.competitors.ican],
        ["Roche", f.competitors.roche],
        [],
        ["═══ DHC 數據 ═══"],
        ["DHC名稱", f.dhcName],
        ["DHC類型", d.dhcType],
        ["月人流", n(f.dhcFootfall)],
        ["CGM態度", f.dhcCgmSupport],
        ["護士人數", n(f.dhcNurseCount)],
        ["護士CGM了解度", n(f.dhcNurseCgmAwareness)],
        ["護士AGP了解度", n(f.dhcNurseAgpAwareness)],
        ["藥劑師人數", n(f.dhcPharmacistCount)],
        ["藥劑師CGM了解度", n(f.dhcPharmacistCgmAwareness)],
        ["藥劑師AGP了解度", n(f.dhcPharmacistAgpAwareness)],
        [],
        ["═══ GP 渠道 ═══"],
        ["CDCC活躍GP", n(f.gpCount)],
        ["CGM支持GP", n(f.cgmGPs)],
        ["DHC至藥房距離 (分鐘)", n(f.distance)],
        [],
        ["═══ 藥房1 ═══"],
        ["名稱", f.pharmacy1.name],
        ["藥劑師人數", n(f.pharmacy1.pharmacistCount)],
        ["CGM了解度", n(f.pharmacy1.cgmAwareness)],
        ["AGP了解度", n(f.pharmacy1.agpAwareness)],
        ["CGM態度", f.pharmacy1.cgmSupport],
        ["BGM月銷 (盒)", n(f.pharmacy1.bgmVol)],
        ["胰島素筆/月", n(f.pharmacy1.insulinPenSales)],
        ["針頭銷量/月", n(f.pharmacy1.needleSales)],
        ["Consultation/月", n(f.pharmacy1.monthlyConsultations)],
        ["總人流/月", n(f.pharmacy1.totalFootfall)],
        ["胰島素患者", n(f.pharmacy1.insulinPatients)],
        ["口服藥患者", n(f.pharmacy1.oralPatients)],
        ["DM患者", n(f.pharmacy1.dmPatients)],
        ["Pre-DM患者", n(f.pharmacy1.preDmPatients)],
      ];

      if (f.pharmacy2) {
        rows.push([], ["═══ 藥房2 ═══"]);
        rows.push(
          ["名稱", f.pharmacy2.name],
          ["藥劑師人數", n(f.pharmacy2.pharmacistCount)],
          ["CGM了解度", n(f.pharmacy2.cgmAwareness)],
          ["AGP了解度", n(f.pharmacy2.agpAwareness)],
          ["CGM態度", f.pharmacy2.cgmSupport],
          ["BGM月銷 (盒)", n(f.pharmacy2.bgmVol)],
          ["胰島素筆/月", n(f.pharmacy2.insulinPenSales)],
          ["針頭銷量/月", n(f.pharmacy2.needleSales)],
          ["Consultation/月", n(f.pharmacy2.monthlyConsultations)],
          ["總人流/月", n(f.pharmacy2.totalFootfall)],
          ["胰島素患者", n(f.pharmacy2.insulinPatients)],
          ["口服藥患者", n(f.pharmacy2.oralPatients)],
          ["DM患者", n(f.pharmacy2.dmPatients)],
          ["Pre-DM患者", n(f.pharmacy2.preDmPatients)],
        );
      }

      rows.push(
        [],
        ["═══ 分析結果 ═══"],
        ["預估CGM月轉化", a.estimatedConversion],
        ["現在銷量", a.currentSales],
        ["Potential (轉化-現銷)", a.potential],
        [],
        ["═══ 戰術建議 ═══"],
        ...pitches.map((p, i) => [`${i + 1}. ${p}`]),
      );

      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws["!cols"] = [{ wch: 24 }, { wch: 30 }, { wch: 15 }, { wch: 20 }];
      const sheetName = d.nameCn.length > 20 ? d.nameCn.substring(0, 20) : d.nameCn;
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    XLSX.writeFile(wb, `Abbott_CGM_18Districts_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ── Pharmacy Card Component ──
  const PharmacyCard = ({ label, data, updater, removable }: {
    label: string; data: PharmacyForm;
    updater: (k: keyof PharmacyForm, v: string) => void;
    removable?: boolean;
  }) => {
    const foot = n(data.totalFootfall);
    return (
      <div className="p-3 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-primary flex items-center gap-1"><Store size={14} /> {label}</span>
          {removable && <button onClick={removePharmacy2} className="text-xs text-destructive hover:underline flex items-center gap-1"><Trash2 size={12} /> 移除</button>}
        </div>
        <div className="mb-2">
          <label className="section-label">藥房名稱</label>
          <input type="text" value={data.name} onChange={(e) => updater("name", e.target.value)} className="w-full p-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="section-label">藥劑師人數</label>
            <input type="number" value={data.pharmacistCount} onChange={(e) => updater("pharmacistCount", e.target.value)} className="w-full p-2 text-sm" />
          </div>
          <div>
            <label className="section-label">CGM了解度 (1-5)</label>
            <input type="range" min="1" max="5" value={data.cgmAwareness} onChange={(e) => updater("cgmAwareness", e.target.value)} className="w-full" />
            <span className="text-xs text-primary">{stars(n(data.cgmAwareness))}</span>
          </div>
          <div>
            <label className="section-label">AGP/LibreView了解度</label>
            <input type="range" min="1" max="5" value={data.agpAwareness} onChange={(e) => updater("agpAwareness", e.target.value)} className="w-full" />
            <span className="text-xs text-primary">{stars(n(data.agpAwareness))}</span>
          </div>
          <div>
            <label className="section-label">是否支持CGM</label>
            <select value={data.cgmSupport} onChange={(e) => updater("cgmSupport", e.target.value)} className="w-full p-2 text-sm">
              <option value="support">支持</option>
              <option value="neutral">中立</option>
              <option value="oppose">不支持</option>
            </select>
          </div>
        </div>
        <div className="text-xs font-semibold text-muted-foreground mt-3 mb-1 border-t border-border pt-2">📦 銷售數據</div>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div>
            <label className="section-label">BGM 月銷 (盒)</label>
            <input type="number" value={data.bgmVol} onChange={(e) => updater("bgmVol", e.target.value)} className="w-full p-2 text-sm" />
          </div>
          <div>
            <label className="section-label">胰島素筆/月</label>
            <input type="number" value={data.insulinPenSales} onChange={(e) => updater("insulinPenSales", e.target.value)} className="w-full p-2 text-sm" />
          </div>
          <div>
            <label className="section-label">針頭銷量/月</label>
            <input type="number" value={data.needleSales} onChange={(e) => updater("needleSales", e.target.value)} className="w-full p-2 text-sm" />
          </div>
        </div>
        <div className="text-xs font-semibold text-muted-foreground mt-3 mb-1 border-t border-border pt-2">👥 人流 & 患者組成</div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="section-label">每月Consultation</label>
            <input type="number" value={data.monthlyConsultations} onChange={(e) => updater("monthlyConsultations", e.target.value)} className="w-full p-2 text-sm" />
          </div>
          <div>
            <label className="section-label">總人流/月</label>
            <input type="number" value={data.totalFootfall} onChange={(e) => updater("totalFootfall", e.target.value)} className="w-full p-2 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded bg-accent/50 border border-primary/10">
            <label className="section-label flex items-center gap-1"><Pill size={10} className="text-primary" /> 打胰島素</label>
            <input type="number" value={data.insulinPatients} onChange={(e) => updater("insulinPatients", e.target.value)} className="w-full p-1.5 text-sm mt-1" />
            <div className="text-xs text-muted-foreground">{foot > 0 ? ((n(data.insulinPatients) / foot) * 100).toFixed(1) : 0}%</div>
          </div>
          <div className="p-2 rounded bg-accent/50 border border-primary/10">
            <label className="section-label flex items-center gap-1"><FlaskConical size={10} className="text-primary" /> 口服藥</label>
            <input type="number" value={data.oralPatients} onChange={(e) => updater("oralPatients", e.target.value)} className="w-full p-1.5 text-sm mt-1" />
            <div className="text-xs text-muted-foreground">{foot > 0 ? ((n(data.oralPatients) / foot) * 100).toFixed(1) : 0}%</div>
          </div>
          <div className="p-2 rounded bg-accent/50 border border-primary/10">
            <label className="section-label flex items-center gap-1"><Activity size={10} className="text-destructive" /> DM確診</label>
            <input type="number" value={data.dmPatients} onChange={(e) => updater("dmPatients", e.target.value)} className="w-full p-1.5 text-sm mt-1" />
            <div className="text-xs text-muted-foreground">{foot > 0 ? ((n(data.dmPatients) / foot) * 100).toFixed(1) : 0}%</div>
          </div>
          <div className="p-2 rounded bg-accent/50 border border-primary/10">
            <label className="section-label flex items-center gap-1"><TrendingUp size={10} className="text-warning" /> Pre-DM</label>
            <input type="number" value={data.preDmPatients} onChange={(e) => updater("preDmPatients", e.target.value)} className="w-full p-1.5 text-sm mt-1" />
            <div className="text-xs text-muted-foreground">{foot > 0 ? ((n(data.preDmPatients) / foot) * 100).toFixed(1) : 0}%</div>
          </div>
        </div>
      </div>
    );
  };

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
        <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
          <Download size={16} /> 導出 Excel
        </button>
      </div>

      {/* District selector */}
      <div className="mb-4">
        <select value={selectedDistrictId} onChange={(e) => handleDistrictChange(e.target.value)} className="w-full p-2.5 text-sm font-semibold border border-border rounded-lg bg-card">
          {DISTRICTS.map((d) => (
            <option key={d.id} value={d.id}>{d.nameCn} ({d.nameEn}) — {d.dhcType}{savedPresets[d.id] ? " ●" : ""}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* ============ INPUT SECTION ============ */}
        <div className="flex-1 space-y-4">

          {/* ── Section 1: 區域數據 ── */}
          <div className="terminal-box">
            <div className="terminal-header flex items-center justify-center gap-2">
              <MapPin size={16} /> 區域數據 REGIONAL DATA
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="section-label">總人口</label>
                <input type="number" value={form.totalPopulation} onChange={(e) => update("totalPopulation", e.target.value)} className="w-full p-2 text-sm" />
              </div>
              <div>
                <label className="section-label">糖尿病患者數</label>
                <input type="number" value={form.estimatedDmPatients} onChange={(e) => update("estimatedDmPatients", e.target.value)} className="w-full p-2 text-sm" />
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
                <label className="section-label">現有CGM月銷量</label>
                <input type="number" value={form.currentCgmSales} onChange={(e) => update("currentCgmSales", e.target.value)} className="w-full p-2 text-sm" />
              </div>
            </div>

            {/* Competitor brands */}
            <div className="text-xs font-semibold text-muted-foreground mb-2 border-t border-border pt-2">🏷️ 競品品牌滲透度 (0-5)</div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {(Object.keys(form.competitors) as (keyof CompetitorBrands)[]).map((brand) => (
                <div key={brand}>
                  <label className="section-label">{brand === "linx" ? "Linx" : brand === "sibionics" ? "Sibionics" : brand === "ican" ? "iCan" : "Roche"}</label>
                  <input type="number" min="0" max="5" value={form.competitors[brand]} onChange={(e) => updateCompetitor(brand, e.target.value)} className="w-full p-2 text-sm" />
                </div>
              ))}
            </div>

            {/* GP */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="section-label flex items-center gap-1"><Stethoscope size={12} className="text-primary" /> CDCC 活躍 GP</label>
                <input type="number" value={form.gpCount} onChange={(e) => update("gpCount", e.target.value)} className="w-full p-2 text-sm" />
              </div>
              <div>
                <label className="section-label flex items-center gap-1"><Heart size={12} className="text-primary" /> CGM 支持 GP</label>
                <input type="number" value={form.cgmGPs} onChange={(e) => update("cgmGPs", e.target.value)} className="w-full p-2 text-sm" />
              </div>
              <div>
                <label className="section-label">DHC至藥房 (分鐘)</label>
                <input type="number" value={form.distance} onChange={(e) => update("distance", e.target.value)} className="w-full p-2 text-sm" />
              </div>
            </div>
          </div>

          {/* ── Section 2: DHC ── */}
          <div className="terminal-box">
            <div className="terminal-header flex items-center justify-center gap-2">
              <Hospital size={16} /> DHC 數據 (不可銷售)
            </div>
            <div className="mb-3">
              <label className="section-label">DHC 名稱</label>
              <input type="text" value={form.dhcName} onChange={(e) => update("dhcName", e.target.value)} className="w-full p-2 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="section-label">月人流</label>
                <input type="number" value={form.dhcFootfall} onChange={(e) => update("dhcFootfall", e.target.value)} className="w-full p-2 text-sm" />
              </div>
              <div>
                <label className="section-label">CGM態度</label>
                <select value={form.dhcCgmSupport} onChange={(e) => update("dhcCgmSupport", e.target.value)} className="w-full p-2 text-sm">
                  <option value="support">支持</option>
                  <option value="neutral">中立</option>
                  <option value="oppose">不支持</option>
                </select>
              </div>
            </div>
            <div className="text-xs font-semibold text-muted-foreground mb-1 border-t border-border pt-2">🩺 護士</div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <label className="section-label">人數</label>
                <input type="number" value={form.dhcNurseCount} onChange={(e) => update("dhcNurseCount", e.target.value)} className="w-full p-2 text-sm" />
              </div>
              <div>
                <label className="section-label">CGM了解度</label>
                <input type="range" min="1" max="5" value={form.dhcNurseCgmAwareness} onChange={(e) => update("dhcNurseCgmAwareness", e.target.value)} className="w-full" />
                <span className="text-xs text-primary">{stars(n(form.dhcNurseCgmAwareness))}</span>
              </div>
              <div>
                <label className="section-label">AGP/LibreView</label>
                <input type="range" min="1" max="5" value={form.dhcNurseAgpAwareness} onChange={(e) => update("dhcNurseAgpAwareness", e.target.value)} className="w-full" />
                <span className="text-xs text-primary">{stars(n(form.dhcNurseAgpAwareness))}</span>
              </div>
            </div>
            <div className="text-xs font-semibold text-muted-foreground mb-1 border-t border-border pt-2">💊 DHC藥劑師</div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="section-label">人數</label>
                <input type="number" value={form.dhcPharmacistCount} onChange={(e) => update("dhcPharmacistCount", e.target.value)} className="w-full p-2 text-sm" />
              </div>
              <div>
                <label className="section-label">CGM了解度</label>
                <input type="range" min="1" max="5" value={form.dhcPharmacistCgmAwareness} onChange={(e) => update("dhcPharmacistCgmAwareness", e.target.value)} className="w-full" />
                <span className="text-xs text-primary">{stars(n(form.dhcPharmacistCgmAwareness))}</span>
              </div>
              <div>
                <label className="section-label">AGP/LibreView</label>
                <input type="range" min="1" max="5" value={form.dhcPharmacistAgpAwareness} onChange={(e) => update("dhcPharmacistAgpAwareness", e.target.value)} className="w-full" />
                <span className="text-xs text-primary">{stars(n(form.dhcPharmacistAgpAwareness))}</span>
              </div>
            </div>
          </div>

          {/* ── Section 3: 藥房 ── */}
          <div className="terminal-box">
            <div className="terminal-header flex items-center justify-center gap-2">
              <Store size={16} /> 社區藥房 PHARMACY (銷售數據)
            </div>
            <PharmacyCard label="藥房 1 (默認)" data={p1} updater={updateP1} />
            {p2 ? (
              <div className="mt-3">
                <PharmacyCard label="藥房 2 (補充)" data={p2} updater={updateP2} removable />
              </div>
            ) : (
              <button onClick={addPharmacy2} className="w-full mt-3 p-2 text-sm font-semibold border-2 border-dashed border-primary/30 rounded-lg text-primary hover:bg-accent transition-colors flex items-center justify-center gap-2">
                <Plus size={14} /> 添加第二家藥房
              </button>
            )}
          </div>

          {/* Save/Reset */}
          <div className="flex gap-2">
            <button onClick={savePreset} className="flex-1 flex items-center justify-center gap-2 p-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
              <Save size={14} /> 保存此區數據 {isSaved && "(已保存)"}
            </button>
            <button onClick={resetPreset} className="flex items-center justify-center gap-2 p-2.5 text-sm font-semibold bg-muted text-muted-foreground rounded-md hover:opacity-90 transition-opacity px-4">
              <RotateCcw size={14} /> 重置
            </button>
          </div>
        </div>

        {/* ============ ANALYSIS SECTION ============ */}
        <div className="flex-1 space-y-4">
          <div className="terminal-box-double">
            <div className="terminal-header flex items-center justify-center gap-2">
              <TrendingUp size={16} /> REAL-TIME ANALYSIS
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold font-mono text-primary">{analysis.estimatedConversion}</div>
                <div className="text-xs text-muted-foreground">預估CGM月轉化</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold font-mono text-foreground">{analysis.currentSales}</div>
                <div className="text-xs text-muted-foreground">現在銷量</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className={`text-2xl font-bold font-mono ${analysis.potential > 0 ? "score-high" : "text-muted-foreground"}`}>{analysis.potential > 0 ? "+" : ""}{analysis.potential}</div>
                <div className="text-xs text-muted-foreground">Potential</div>
              </div>
            </div>

            {/* Detailed report */}
            <pre id="analysis-pre" className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-foreground p-3 rounded-md bg-muted/30">
{`┌─────────────────────────────────────────┐
│  區域概況                                │
├─────────────────────────────────────────┤
│  總人口: ${n(form.totalPopulation).toLocaleString()}
│  糖尿病患者: ${n(form.estimatedDmPatients).toLocaleString()}
│  老齡化: ${form.agingIndex}% | 公屋: ${form.publicHousingRatio}%
│  收入中位: HK$${n(form.medianIncome).toLocaleString()}
│  競品: Linx(${form.competitors.linx}) Sibionics(${form.competitors.sibionics}) iCan(${form.competitors.ican}) Roche(${form.competitors.roche})
├─────────────────────────────────────────┤
│  DHC: ${form.dhcName}
├─────────────────────────────────────────┤
│  人流: ${form.dhcFootfall}/月 | CGM態度: ${supportLabel(form.dhcCgmSupport)}
│  護士: ${form.dhcNurseCount}人 | CGM${stars(n(form.dhcNurseCgmAwareness))} | AGP${stars(n(form.dhcNurseAgpAwareness))}
│  藥劑師: ${form.dhcPharmacistCount}人 | CGM${stars(n(form.dhcPharmacistCgmAwareness))} | AGP${stars(n(form.dhcPharmacistAgpAwareness))}
├─────────────────────────────────────────┤
│  GP渠道: CDCC ${form.gpCount} | CGM支持 ${form.cgmGPs}
├─────────────────────────────────────────┤
│  藥房: ${p1.name}${p2 ? " + " + p2.name : ""}
├─────────────────────────────────────────┤
│  BGM: ${p1.bgmVol}盒 | 胰島素筆: ${p1.insulinPenSales} | 針頭: ${p1.needleSales}
│  患者: 胰島素${p1.insulinPatients} 口服${p1.oralPatients} DM${p1.dmPatients} Pre-DM${p1.preDmPatients}${p2 ? `
├─────────────────────────────────────────┤
│  藥房2: ${p2.name}
│  BGM: ${p2.bgmVol}盒 | 胰島素筆: ${p2.insulinPenSales} | 針頭: ${p2.needleSales}
│  患者: 胰島素${p2.insulinPatients} 口服${p2.oralPatients} DM${p2.dmPatients} Pre-DM${p2.preDmPatients}` : ""}
├─────────────────────────────────────────┤
│  匯總: BGM ${aggBgm}盒 | 人流 ${aggFootfall} | Consultation ${aggConsult}
│  Pre-DM佔比: ${preDmPct}%
│  預估CGM月轉化: ≈ ${analysis.estimatedConversion} 套
│  現在銷量: ${analysis.currentSales} 套
│  Potential: ${analysis.potential > 0 ? "+" : ""}${analysis.potential} 套
├─────────────────────────────────────────┤
│  戰術執行建議
├─────────────────────────────────────────┤
${analysis.pitches.map((p) => `│  ▸ ${p}`).join("\n")}
└─────────────────────────────────────────┘`}
            </pre>

            <button onClick={copyResult} className="w-full mt-3 p-2.5 flex items-center justify-center gap-2 font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm">
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
              <th className="text-center p-2">DHC人流</th>
              <th className="text-center p-2">藥房人流</th>
              <th className="text-center p-2">BGM</th>
              <th className="text-center p-2">胰島素</th>
              <th className="text-center p-2">口服</th>
              <th className="text-center p-2">DM</th>
              <th className="text-center p-2">Pre-DM</th>
              <th className="text-center p-2">Linx</th>
              <th className="text-center p-2">Sib.</th>
              <th className="text-center p-2">iCan</th>
              <th className="text-center p-2">Roche</th>
              <th className="text-center p-2">CGM轉化</th>
              <th className="text-center p-2">現銷量</th>
              <th className="text-center p-2">Potential</th>
            </tr>
          </thead>
          <tbody>
            {DISTRICTS.map((d) => {
              const f = savedPresets[d.id] || formFromDistrict(d);
              const a = getDistrictAnalysis(f);
              const isSelected = d.id === selectedDistrictId;
              const hasSave = !!savedPresets[d.id];
              return (
                <tr key={d.id} className={`border-b border-border/50 cursor-pointer hover:bg-accent/50 transition-colors ${isSelected ? "bg-accent" : ""}`} onClick={() => handleDistrictChange(d.id)}>
                  <td className="p-2 font-semibold">{d.nameCn} {hasSave && <span className="text-primary">●</span>}</td>
                  <td className="p-2 text-muted-foreground">{d.dhcType}</td>
                  <td className="text-center p-2">{n(f.gpCount)}</td>
                  <td className="text-center p-2">{n(f.dhcFootfall)}</td>
                  <td className="text-center p-2">{a.aggFootfall}</td>
                  <td className="text-center p-2">{a.aggBgm}</td>
                  <td className="text-center p-2">{a.totalInsulinPat}</td>
                  <td className="text-center p-2">{a.totalOralPat}</td>
                  <td className="text-center p-2">{a.totalDmPat}</td>
                  <td className="text-center p-2">{a.totalPreDmPat}</td>
                  <td className="text-center p-2">{f.competitors.linx}</td>
                  <td className="text-center p-2">{f.competitors.sibionics}</td>
                  <td className="text-center p-2">{f.competitors.ican}</td>
                  <td className="text-center p-2">{f.competitors.roche}</td>
                  <td className={`text-center p-2 font-bold text-primary`}>{a.estimatedConversion}</td>
                  <td className="text-center p-2">{a.currentSales}</td>
                  <td className={`text-center p-2 font-bold ${a.potential > 0 ? "score-high" : "text-muted-foreground"}`}>{a.potential > 0 ? "+" : ""}{a.potential}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Brainstorm */}
      <div className="mt-6 terminal-box">
        <button onClick={() => setShowBrainstorm(!showBrainstorm)} className="w-full flex items-center justify-between text-sm font-semibold text-primary">
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
