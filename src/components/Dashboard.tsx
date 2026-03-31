import { useState, useMemo, useCallback } from "react";
import {
  DISTRICTS,
  calculatePotentialScore,
  getScoreLevel,
  generateSalesPitch,
  ADDITIONAL_DIMENSIONS,
  type DistrictData,
} from "@/data/districtData";

const Dashboard = () => {
  const [selectedDistrictId, setSelectedDistrictId] = useState(DISTRICTS[0].id);
  const [overrides, setOverrides] = useState<{
    partner: string;
    gpCount: string;
    pharmacistRate: string;
    preDmPct: string;
    bgmVol: string;
    distance: string;
    cgmGPs: string;
    insulinPenSales: string;
  }>({
    partner: "",
    gpCount: "",
    pharmacistRate: "3",
    preDmPct: "",
    bgmVol: "",
    distance: "",
    cgmGPs: "",
    insulinPenSales: "",
  });

  const district = useMemo(
    () => DISTRICTS.find((d) => d.id === selectedDistrictId) || DISTRICTS[0],
    [selectedDistrictId]
  );

  // When district changes, pre-fill with district data
  const handleDistrictChange = useCallback((id: string) => {
    setSelectedDistrictId(id);
    const d = DISTRICTS.find((x) => x.id === id);
    if (d) {
      setOverrides({
        partner: d.dhcName,
        gpCount: String(d.estimatedCdccGPs),
        pharmacistRate: "3",
        preDmPct: String(d.patientComposition.preDm),
        bgmVol: String(d.bgmMonthlySales),
        distance: String(d.avgDistanceDhcToPharmacy),
        cgmGPs: String(d.cgmSupportGPs),
        insulinPenSales: String(d.insulinPenSales),
      });
    }
  }, []);

  const update = (key: string, value: string) =>
    setOverrides((prev) => ({ ...prev, [key]: value }));

  // Computed analysis
  const analysis = useMemo(() => {
    const gp = parseInt(overrides.gpCount) || district.estimatedCdccGPs;
    const rate = parseInt(overrides.pharmacistRate) || 3;
    const preDm = parseInt(overrides.preDmPct) || district.patientComposition.preDm;
    const bgm = parseInt(overrides.bgmVol) || district.bgmMonthlySales;
    const dist = parseInt(overrides.distance) || district.avgDistanceDhcToPharmacy;
    const cgmGPs = parseInt(overrides.cgmGPs) || district.cgmSupportGPs;
    const insulinPen = parseInt(overrides.insulinPenSales) || district.insulinPenSales;
    const partner = overrides.partner || district.dhcName;

    const score = calculatePotentialScore({
      cdccGPs: gp,
      pharmacistRate: rate,
      preDmPct: preDm,
      bgmVol: bgm,
      distance: dist,
      agingIndex: district.agingIndex,
      publicHousingRatio: district.publicHousingRatio,
      dhcFootfall: district.dhcMonthlyFootfall,
      pharmacyFootfall: district.pharmacyMonthlyFootfall,
      competitorPresence: district.competitorPresence,
      cgmSupportGPs: cgmGPs,
      insulinPenSales: insulinPen,
    });

    const level = getScoreLevel(score);
    const pitches = generateSalesPitch({
      pharmacistRate: rate,
      cdccGPs: gp,
      preDmPct: preDm,
      bgmVol: bgm,
      distance: dist,
      cgmSupportGPs: cgmGPs,
      competitorPresence: district.competitorPresence,
      agingIndex: district.agingIndex,
    });

    // Estimate monthly CGM conversion
    const estimatedConversion = Math.round(bgm * 0.08 + gp * 1.5 + cgmGPs * 3);

    return { score, level, pitches, partner, gp, rate, preDm, bgm, dist, cgmGPs, insulinPen, estimatedConversion };
  }, [overrides, district]);

  const copyResult = () => {
    const text = document.getElementById("analysis-pre")?.textContent || "";
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 font-mono">
      {/* Header */}
      <pre className="text-foreground glow-text text-xs md:text-sm mb-4">
{`***********************************************************************
* ABBOTT FREESTYLE LIBRE - HK 18 DISTRICTS SALES PENETRATION TOOL    *
* [VERSION 2026.04]  |  USER: HE MENGQIAN (小Ga)                     *
***********************************************************************`}
      </pre>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Input Section */}
        <div className="flex-1 terminal-box">
          <div className="terminal-header">[ DATA_INPUT ]</div>

          <label className="block font-bold mt-2 mb-1">1. 區域 (District):</label>
          <select
            value={selectedDistrictId}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="w-full p-1.5 mb-3"
          >
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nameCn} ({d.nameEn}) - {d.dhcType}
              </option>
            ))}
          </select>

          <label className="block font-bold mt-2 mb-1">2. 關鍵合作夥伴 (DHC/Pharmacy):</label>
          <input
            type="text"
            value={overrides.partner}
            onChange={(e) => update("partner", e.target.value)}
            placeholder={district.dhcName}
            className="w-full p-1.5 mb-3"
          />

          <label className="block font-bold mt-2 mb-1">3. CDCC 活躍 GP 數量:</label>
          <input
            type="number"
            value={overrides.gpCount}
            onChange={(e) => update("gpCount", e.target.value)}
            placeholder={String(district.estimatedCdccGPs)}
            className="w-full p-1.5 mb-3"
          />

          <label className="block font-bold mt-2 mb-1">4. CGM 支持 GP 數量:</label>
          <input
            type="number"
            value={overrides.cgmGPs}
            onChange={(e) => update("cgmGPs", e.target.value)}
            placeholder={String(district.cgmSupportGPs)}
            className="w-full p-1.5 mb-3"
          />

          <label className="block font-bold mt-2 mb-1">
            5. 藥劑師配合度 (1-5 星): <span className="text-terminal-amber">{"★".repeat(parseInt(overrides.pharmacistRate) || 3)}</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={overrides.pharmacistRate}
            onChange={(e) => update("pharmacistRate", e.target.value)}
            className="w-full mb-3"
          />

          <label className="block font-bold mt-2 mb-1">6. 患者組成 (Pre-DM %):</label>
          <input
            type="number"
            value={overrides.preDmPct}
            onChange={(e) => update("preDmPct", e.target.value)}
            placeholder={String(district.patientComposition.preDm)}
            className="w-full p-1.5 mb-3"
          />

          <label className="block font-bold mt-2 mb-1">7. 現有 BGM 月銷量 (盒):</label>
          <input
            type="number"
            value={overrides.bgmVol}
            onChange={(e) => update("bgmVol", e.target.value)}
            placeholder={String(district.bgmMonthlySales)}
            className="w-full p-1.5 mb-3"
          />

          <label className="block font-bold mt-2 mb-1">8. 胰島素筆月銷量:</label>
          <input
            type="number"
            value={overrides.insulinPenSales}
            onChange={(e) => update("insulinPenSales", e.target.value)}
            placeholder={String(district.insulinPenSales)}
            className="w-full p-1.5 mb-3"
          />

          <label className="block font-bold mt-2 mb-1">9. 距離障礙 (DHC至藥房步程 分鐘):</label>
          <input
            type="number"
            value={overrides.distance}
            onChange={(e) => update("distance", e.target.value)}
            placeholder={String(district.avgDistanceDhcToPharmacy)}
            className="w-full p-1.5 mb-3"
          />

          {/* District Quick Info */}
          <div className="mt-4 p-3 border border-border">
            <div className="text-terminal-cyan text-xs mb-2">[ 區域預設數據 - {district.nameCn} ]</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>人口密度: {district.populationDensity === "high" ? "高" : district.populationDensity === "medium" ? "中" : "低"} | 老齡化: {district.agingIndex}% | 公屋比例: {district.publicHousingRatio}%</div>
              <div>DHC月人流: {district.dhcMonthlyFootfall} | 藥房月人流: {district.pharmacyMonthlyFootfall}</div>
              <div>競品: {district.competitorPresence === "strong" ? "強勢" : district.competitorPresence === "moderate" ? "中等" : "弱"} | 收入中位: ${district.medianIncome.toLocaleString()}</div>
              <div>社區藥房: {district.communityPharmacies.join(", ")}</div>
              <div>患者構成: 胰島素{district.patientComposition.insulin}% | 口服藥{district.patientComposition.oral}% | DM{district.patientComposition.dm}% | Pre-DM{district.patientComposition.preDm}%</div>
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="flex-1 terminal-box-double">
          <div className="terminal-header">[ REAL-TIME_ANALYSIS ]</div>
          <pre id="analysis-pre" className="text-xs md:text-sm glow-text whitespace-pre-wrap">
{`+================================================+
|  SUMMARY REPORT FOR: ${district.nameCn} (${district.nameEn})
+================================================+
|  TARGET: ${analysis.partner}
|  DHC TYPE: ${district.dhcType}
+------------------------------------------------+
|  POTENTIAL SCORE: ${analysis.score}
|  PRIORITY LEVEL: ${analysis.level.label}
+================================================+
|  [核心數據分析]
|  - CDCC渠道力: ${analysis.gp > 15 ? "強" : analysis.gp > 8 ? "中" : "弱"} (${analysis.gp} GPs)
|  - CGM支持GP: ${analysis.cgmGPs} 位
|  - 藥劑師推動力: ${"★".repeat(analysis.rate)}${"☆".repeat(5 - analysis.rate)}
|  - 目標群體(Pre-DM): ${analysis.preDm}%
|  - BGM現有銷量: ${analysis.bgm}盒/月
|  - 胰島素筆銷量: ${analysis.insulinPen}支/月
|  - DHC人流: ${district.dhcMonthlyFootfall}/月
|  - 藥房人流: ${district.pharmacyMonthlyFootfall}/月
|  - 距離障礙: ${analysis.dist}分鐘步程
+------------------------------------------------+
|  [地域影響因素]
|  - 老齡化指數: ${district.agingIndex}% (65+人口)
|  - 公屋比例: ${district.publicHousingRatio}%
|  - 收入中位數: HK$${district.medianIncome.toLocaleString()}
|  - 競品壓力: ${district.competitorPresence === "strong" ? "⚠ 強勢" : district.competitorPresence === "moderate" ? "△ 中等" : "○ 弱"}
+================================================+
|  [預估CGM月轉化量]
|  ≈ ${analysis.estimatedConversion} 套/月
+------------------------------------------------+
|  [戰術執行建議]
${analysis.pitches.map((p) => `|  ▸ ${p}`).join("\n")}
+================================================+
|  CSV: ${district.nameEn},${analysis.partner},${analysis.gp},${analysis.rate},${analysis.preDm},${analysis.bgm},${analysis.dist},${analysis.score}
+================================================+`}
          </pre>

          <button
            onClick={copyResult}
            className="w-full mt-4 p-2.5 bg-primary text-primary-foreground font-bold border-none cursor-pointer hover:opacity-80 transition-opacity"
          >
            📋 複製分析結果 (COPY)
          </button>
        </div>
      </div>

      {/* Additional Dimensions Section */}
      <div className="mt-6 terminal-box">
        <div className="terminal-header">[ 建議額外收集維度 - BRAINSTORM ]</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ADDITIONAL_DIMENSIONS.map((dim) => (
            <div key={dim.category} className="border border-border p-3">
              <div className="text-terminal-cyan font-bold text-sm mb-2">▸ {dim.category}</div>
              {dim.items.map((item) => (
                <div key={item} className="text-xs text-muted-foreground pl-2">• {item}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 18 District Overview Table */}
      <div className="mt-6 terminal-box overflow-x-auto">
        <div className="terminal-header">[ 18區總覽 - DISTRICT OVERVIEW ]</div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-terminal-cyan border-b border-border">
              <th className="text-left p-1">區域</th>
              <th className="text-left p-1">DHC</th>
              <th className="text-center p-1">GPs</th>
              <th className="text-center p-1">CGM GP</th>
              <th className="text-center p-1">DHC人流</th>
              <th className="text-center p-1">BGM銷量</th>
              <th className="text-center p-1">Pre-DM%</th>
              <th className="text-center p-1">老齡%</th>
              <th className="text-center p-1">競品</th>
              <th className="text-center p-1">潛力分</th>
              <th className="text-center p-1">等級</th>
            </tr>
          </thead>
          <tbody>
            {DISTRICTS.map((d) => {
              const s = calculatePotentialScore({
                cdccGPs: d.estimatedCdccGPs,
                pharmacistRate: 3,
                preDmPct: d.patientComposition.preDm,
                bgmVol: d.bgmMonthlySales,
                distance: d.avgDistanceDhcToPharmacy,
                agingIndex: d.agingIndex,
                publicHousingRatio: d.publicHousingRatio,
                dhcFootfall: d.dhcMonthlyFootfall,
                pharmacyFootfall: d.pharmacyMonthlyFootfall,
                competitorPresence: d.competitorPresence,
                cgmSupportGPs: d.cgmSupportGPs,
                insulinPenSales: d.insulinPenSales,
              });
              const lvl = getScoreLevel(s);
              return (
                <tr
                  key={d.id}
                  className={`border-b border-border/30 cursor-pointer hover:bg-secondary/30 ${d.id === selectedDistrictId ? "bg-secondary/50" : ""}`}
                  onClick={() => handleDistrictChange(d.id)}
                >
                  <td className="p-1 font-bold">{d.nameCn}</td>
                  <td className="p-1 text-muted-foreground">{d.dhcType}</td>
                  <td className="text-center p-1">{d.estimatedCdccGPs}</td>
                  <td className="text-center p-1">{d.cgmSupportGPs}</td>
                  <td className="text-center p-1">{d.dhcMonthlyFootfall}</td>
                  <td className="text-center p-1">{d.bgmMonthlySales}</td>
                  <td className="text-center p-1">{d.patientComposition.preDm}%</td>
                  <td className="text-center p-1">{d.agingIndex}%</td>
                  <td className="text-center p-1">{d.competitorPresence === "strong" ? "⚠" : d.competitorPresence === "moderate" ? "△" : "○"}</td>
                  <td className={`text-center p-1 font-bold ${lvl.cssClass}`}>{s}</td>
                  <td className={`text-center p-1 ${lvl.cssClass}`}>{s > 80 ? "HIGH" : s > 50 ? "MED" : "LOW"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <pre className="text-xs text-muted-foreground mt-4 text-center">
{`[EOF] Abbott FreeStyle Libre HK - Confidential Sales Tool v2026.04
Note: 數據為估算值，請根據實際調研更新 | 潛力評分算法可根據業務需求調整`}
      </pre>
      <div className="text-center mt-1">
        <span className="inline-block w-2 h-4 bg-foreground animate-blink" />
      </div>
    </div>
  );
};

export default Dashboard;
