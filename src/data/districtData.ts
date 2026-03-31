// Hong Kong 18 Districts data with DHC, pharmacy, and healthcare info
export interface DistrictData {
  id: string;
  nameCn: string;
  nameEn: string;
  dhcName: string;
  dhcType: "DHC" | "DHCE"; // DHC = 地區康健中心, DHCE = 地區康健站
  communityPharmacies: string[];
  estimatedCdccGPs: number;
  cgmSupportGPs: number;
  dhcMonthlyFootfall: number;
  pharmacyMonthlyFootfall: number;
  patientComposition: {
    insulin: number; // %
    oral: number; // %
    dm: number; // %
    preDm: number; // %
  };
  bgmMonthlySales: number; // boxes
  insulinPenSales: number;
  needleSales: number;
  avgDistanceDhcToPharmacy: number; // minutes walk
  populationDensity: "high" | "medium" | "low";
  agingIndex: number; // % of 65+
  medianIncome: number; // HKD
  publicHousingRatio: number; // %
  competitorPresence: "strong" | "moderate" | "weak";
}

export const DISTRICTS: DistrictData[] = [
  {
    id: "yuen-long",
    nameCn: "元朗",
    nameEn: "Yuen Long",
    dhcName: "元朗地區康健中心",
    dhcType: "DHC",
    communityPharmacies: ["博愛社區藥房", "元朗廣場萬寧", "天水圍北藥房"],
    estimatedCdccGPs: 18,
    cgmSupportGPs: 5,
    dhcMonthlyFootfall: 3200,
    pharmacyMonthlyFootfall: 1800,
    patientComposition: { insulin: 15, oral: 35, dm: 60, preDm: 40 },
    bgmMonthlySales: 280,
    insulinPenSales: 120,
    needleSales: 350,
    avgDistanceDhcToPharmacy: 8,
    populationDensity: "high",
    agingIndex: 14.2,
    medianIncome: 22000,
    publicHousingRatio: 45,
    competitorPresence: "moderate",
  },
  {
    id: "sham-shui-po",
    nameCn: "深水埗",
    nameEn: "Sham Shui Po",
    dhcName: "深水埗地區康健中心",
    dhcType: "DHC",
    communityPharmacies: ["深水埗社區藥房", "長沙灣健康藥房"],
    estimatedCdccGPs: 22,
    cgmSupportGPs: 8,
    dhcMonthlyFootfall: 4100,
    pharmacyMonthlyFootfall: 2200,
    patientComposition: { insulin: 20, oral: 30, dm: 65, preDm: 35 },
    bgmMonthlySales: 350,
    insulinPenSales: 180,
    needleSales: 420,
    avgDistanceDhcToPharmacy: 5,
    populationDensity: "high",
    agingIndex: 18.5,
    medianIncome: 18000,
    publicHousingRatio: 55,
    competitorPresence: "strong",
  },
  {
    id: "kwai-tsing",
    nameCn: "葵青",
    nameEn: "Kwai Tsing",
    dhcName: "葵青地區康健中心",
    dhcType: "DHC",
    communityPharmacies: ["葵涌社區藥房", "青衣城藥房"],
    estimatedCdccGPs: 15,
    cgmSupportGPs: 4,
    dhcMonthlyFootfall: 2800,
    pharmacyMonthlyFootfall: 1500,
    patientComposition: { insulin: 18, oral: 32, dm: 58, preDm: 42 },
    bgmMonthlySales: 220,
    insulinPenSales: 100,
    needleSales: 280,
    avgDistanceDhcToPharmacy: 10,
    populationDensity: "high",
    agingIndex: 16.8,
    medianIncome: 20000,
    publicHousingRatio: 50,
    competitorPresence: "moderate",
  },
  {
    id: "kwun-tong",
    nameCn: "觀塘",
    nameEn: "Kwun Tong",
    dhcName: "觀塘地區康健中心",
    dhcType: "DHC",
    communityPharmacies: ["觀塘社區藥房", "藍田藥房", "秀茂坪藥房"],
    estimatedCdccGPs: 25,
    cgmSupportGPs: 10,
    dhcMonthlyFootfall: 4500,
    pharmacyMonthlyFootfall: 2800,
    patientComposition: { insulin: 22, oral: 28, dm: 62, preDm: 38 },
    bgmMonthlySales: 400,
    insulinPenSales: 200,
    needleSales: 500,
    avgDistanceDhcToPharmacy: 6,
    populationDensity: "high",
    agingIndex: 19.2,
    medianIncome: 19500,
    publicHousingRatio: 52,
    competitorPresence: "strong",
  },
  {
    id: "wong-tai-sin",
    nameCn: "黃大仙",
    nameEn: "Wong Tai Sin",
    dhcName: "黃大仙地區康健中心",
    dhcType: "DHC",
    communityPharmacies: ["黃大仙社區藥房", "慈雲山藥房"],
    estimatedCdccGPs: 14,
    cgmSupportGPs: 3,
    dhcMonthlyFootfall: 2600,
    pharmacyMonthlyFootfall: 1400,
    patientComposition: { insulin: 20, oral: 30, dm: 60, preDm: 40 },
    bgmMonthlySales: 240,
    insulinPenSales: 110,
    needleSales: 300,
    avgDistanceDhcToPharmacy: 7,
    populationDensity: "high",
    agingIndex: 20.1,
    medianIncome: 17500,
    publicHousingRatio: 58,
    competitorPresence: "moderate",
  },
  {
    id: "eastern",
    nameCn: "東區",
    nameEn: "Eastern",
    dhcName: "東區地區康健站",
    dhcType: "DHCE",
    communityPharmacies: ["太古城藥房", "筲箕灣藥房"],
    estimatedCdccGPs: 20,
    cgmSupportGPs: 7,
    dhcMonthlyFootfall: 2200,
    pharmacyMonthlyFootfall: 1600,
    patientComposition: { insulin: 16, oral: 34, dm: 55, preDm: 45 },
    bgmMonthlySales: 260,
    insulinPenSales: 130,
    needleSales: 310,
    avgDistanceDhcToPharmacy: 8,
    populationDensity: "medium",
    agingIndex: 17.3,
    medianIncome: 28000,
    publicHousingRatio: 35,
    competitorPresence: "moderate",
  },
  {
    id: "southern",
    nameCn: "南區",
    nameEn: "Southern",
    dhcName: "南區地區康健站",
    dhcType: "DHCE",
    communityPharmacies: ["香港仔藥房", "鴨脷洲藥房"],
    estimatedCdccGPs: 10,
    cgmSupportGPs: 3,
    dhcMonthlyFootfall: 1500,
    pharmacyMonthlyFootfall: 900,
    patientComposition: { insulin: 12, oral: 38, dm: 50, preDm: 50 },
    bgmMonthlySales: 150,
    insulinPenSales: 70,
    needleSales: 180,
    avgDistanceDhcToPharmacy: 12,
    populationDensity: "low",
    agingIndex: 16.0,
    medianIncome: 30000,
    publicHousingRatio: 30,
    competitorPresence: "weak",
  },
  {
    id: "wan-chai",
    nameCn: "灣仔",
    nameEn: "Wan Chai",
    dhcName: "灣仔地區康健中心",
    dhcType: "DHC",
    communityPharmacies: ["灣仔社區藥房"],
    estimatedCdccGPs: 16,
    cgmSupportGPs: 6,
    dhcMonthlyFootfall: 2000,
    pharmacyMonthlyFootfall: 1200,
    patientComposition: { insulin: 14, oral: 36, dm: 52, preDm: 48 },
    bgmMonthlySales: 180,
    insulinPenSales: 90,
    needleSales: 220,
    avgDistanceDhcToPharmacy: 5,
    populationDensity: "high",
    agingIndex: 18.0,
    medianIncome: 35000,
    publicHousingRatio: 20,
    competitorPresence: "strong",
  },
  {
    id: "central-western",
    nameCn: "中西區",
    nameEn: "Central & Western",
    dhcName: "中西區地區康健站",
    dhcType: "DHCE",
    communityPharmacies: ["西營盤藥房", "上環藥房"],
    estimatedCdccGPs: 12,
    cgmSupportGPs: 5,
    dhcMonthlyFootfall: 1800,
    pharmacyMonthlyFootfall: 1100,
    patientComposition: { insulin: 10, oral: 40, dm: 48, preDm: 52 },
    bgmMonthlySales: 160,
    insulinPenSales: 80,
    needleSales: 200,
    avgDistanceDhcToPharmacy: 6,
    populationDensity: "medium",
    agingIndex: 15.5,
    medianIncome: 38000,
    publicHousingRatio: 18,
    competitorPresence: "strong",
  },
  {
    id: "kowloon-city",
    nameCn: "九龍城",
    nameEn: "Kowloon City",
    dhcName: "九龍城地區康健站",
    dhcType: "DHCE",
    communityPharmacies: ["土瓜灣藥房", "紅磡藥房"],
    estimatedCdccGPs: 17,
    cgmSupportGPs: 6,
    dhcMonthlyFootfall: 2400,
    pharmacyMonthlyFootfall: 1500,
    patientComposition: { insulin: 18, oral: 32, dm: 58, preDm: 42 },
    bgmMonthlySales: 270,
    insulinPenSales: 140,
    needleSales: 340,
    avgDistanceDhcToPharmacy: 7,
    populationDensity: "high",
    agingIndex: 16.5,
    medianIncome: 24000,
    publicHousingRatio: 40,
    competitorPresence: "moderate",
  },
  {
    id: "yau-tsim-mong",
    nameCn: "油尖旺",
    nameEn: "Yau Tsim Mong",
    dhcName: "油尖旺地區康健站",
    dhcType: "DHCE",
    communityPharmacies: ["旺角社區藥房", "佐敦藥房"],
    estimatedCdccGPs: 19,
    cgmSupportGPs: 7,
    dhcMonthlyFootfall: 2800,
    pharmacyMonthlyFootfall: 1900,
    patientComposition: { insulin: 16, oral: 34, dm: 56, preDm: 44 },
    bgmMonthlySales: 300,
    insulinPenSales: 150,
    needleSales: 380,
    avgDistanceDhcToPharmacy: 4,
    populationDensity: "high",
    agingIndex: 15.8,
    medianIncome: 21000,
    publicHousingRatio: 35,
    competitorPresence: "strong",
  },
  {
    id: "tsuen-wan",
    nameCn: "荃灣",
    nameEn: "Tsuen Wan",
    dhcName: "荃灣地區康健中心",
    dhcType: "DHC",
    communityPharmacies: ["荃灣社區藥房", "荃灣廣場藥房"],
    estimatedCdccGPs: 16,
    cgmSupportGPs: 5,
    dhcMonthlyFootfall: 3000,
    pharmacyMonthlyFootfall: 1700,
    patientComposition: { insulin: 17, oral: 33, dm: 57, preDm: 43 },
    bgmMonthlySales: 250,
    insulinPenSales: 115,
    needleSales: 290,
    avgDistanceDhcToPharmacy: 7,
    populationDensity: "medium",
    agingIndex: 15.5,
    medianIncome: 24000,
    publicHousingRatio: 40,
    competitorPresence: "moderate",
  },
  {
    id: "tuen-mun",
    nameCn: "屯門",
    nameEn: "Tuen Mun",
    dhcName: "屯門地區康健中心",
    dhcType: "DHC",
    communityPharmacies: ["屯門社區藥房", "良景藥房"],
    estimatedCdccGPs: 14,
    cgmSupportGPs: 4,
    dhcMonthlyFootfall: 2900,
    pharmacyMonthlyFootfall: 1600,
    patientComposition: { insulin: 19, oral: 31, dm: 60, preDm: 40 },
    bgmMonthlySales: 260,
    insulinPenSales: 130,
    needleSales: 320,
    avgDistanceDhcToPharmacy: 10,
    populationDensity: "medium",
    agingIndex: 15.0,
    medianIncome: 21000,
    publicHousingRatio: 48,
    competitorPresence: "weak",
  },
  {
    id: "north",
    nameCn: "北區",
    nameEn: "North",
    dhcName: "北區地區康健站",
    dhcType: "DHCE",
    communityPharmacies: ["上水藥房", "粉嶺藥房"],
    estimatedCdccGPs: 10,
    cgmSupportGPs: 2,
    dhcMonthlyFootfall: 1800,
    pharmacyMonthlyFootfall: 1000,
    patientComposition: { insulin: 16, oral: 34, dm: 55, preDm: 45 },
    bgmMonthlySales: 180,
    insulinPenSales: 80,
    needleSales: 220,
    avgDistanceDhcToPharmacy: 12,
    populationDensity: "low",
    agingIndex: 14.8,
    medianIncome: 20000,
    publicHousingRatio: 42,
    competitorPresence: "weak",
  },
  {
    id: "tai-po",
    nameCn: "大埔",
    nameEn: "Tai Po",
    dhcName: "大埔地區康健中心",
    dhcType: "DHC",
    communityPharmacies: ["大埔社區藥房"],
    estimatedCdccGPs: 12,
    cgmSupportGPs: 3,
    dhcMonthlyFootfall: 2200,
    pharmacyMonthlyFootfall: 1200,
    patientComposition: { insulin: 15, oral: 35, dm: 55, preDm: 45 },
    bgmMonthlySales: 200,
    insulinPenSales: 90,
    needleSales: 250,
    avgDistanceDhcToPharmacy: 8,
    populationDensity: "medium",
    agingIndex: 15.2,
    medianIncome: 23000,
    publicHousingRatio: 38,
    competitorPresence: "weak",
  },
  {
    id: "sha-tin",
    nameCn: "沙田",
    nameEn: "Sha Tin",
    dhcName: "沙田地區康健中心",
    dhcType: "DHC",
    communityPharmacies: ["沙田社區藥房", "馬鞍山藥房", "大圍藥房"],
    estimatedCdccGPs: 20,
    cgmSupportGPs: 7,
    dhcMonthlyFootfall: 3800,
    pharmacyMonthlyFootfall: 2100,
    patientComposition: { insulin: 16, oral: 34, dm: 56, preDm: 44 },
    bgmMonthlySales: 320,
    insulinPenSales: 160,
    needleSales: 400,
    avgDistanceDhcToPharmacy: 9,
    populationDensity: "high",
    agingIndex: 15.0,
    medianIncome: 26000,
    publicHousingRatio: 35,
    competitorPresence: "moderate",
  },
  {
    id: "sai-kung",
    nameCn: "西貢",
    nameEn: "Sai Kung",
    dhcName: "西貢地區康健站",
    dhcType: "DHCE",
    communityPharmacies: ["將軍澳藥房", "坑口藥房"],
    estimatedCdccGPs: 11,
    cgmSupportGPs: 3,
    dhcMonthlyFootfall: 2000,
    pharmacyMonthlyFootfall: 1300,
    patientComposition: { insulin: 12, oral: 38, dm: 50, preDm: 50 },
    bgmMonthlySales: 190,
    insulinPenSales: 85,
    needleSales: 230,
    avgDistanceDhcToPharmacy: 10,
    populationDensity: "medium",
    agingIndex: 12.5,
    medianIncome: 28000,
    publicHousingRatio: 30,
    competitorPresence: "weak",
  },
  {
    id: "islands",
    nameCn: "離島",
    nameEn: "Islands",
    dhcName: "離島地區康健站",
    dhcType: "DHCE",
    communityPharmacies: ["東涌藥房"],
    estimatedCdccGPs: 5,
    cgmSupportGPs: 1,
    dhcMonthlyFootfall: 1000,
    pharmacyMonthlyFootfall: 600,
    patientComposition: { insulin: 10, oral: 35, dm: 48, preDm: 52 },
    bgmMonthlySales: 80,
    insulinPenSales: 40,
    needleSales: 100,
    avgDistanceDhcToPharmacy: 15,
    populationDensity: "low",
    agingIndex: 11.0,
    medianIncome: 25000,
    publicHousingRatio: 25,
    competitorPresence: "weak",
  },
];

// Potential Score Algorithm
export function calculatePotentialScore(data: {
  cdccGPs: number;
  pharmacistRate: number;
  preDmPct: number;
  bgmVol: number;
  distance: number;
  agingIndex: number;
  publicHousingRatio: number;
  dhcFootfall: number;
  pharmacyFootfall: number;
  competitorPresence: string;
  cgmSupportGPs: number;
  insulinPenSales: number;
}): number {
  const competitorPenalty = data.competitorPresence === "strong" ? -10 : data.competitorPresence === "moderate" ? -5 : 0;
  
  let score =
    data.cdccGPs * 2 +
    data.pharmacistRate * 10 +
    data.preDmPct * 0.5 +
    data.bgmVol * 0.1 +
    data.agingIndex * 1.5 +
    data.publicHousingRatio * 0.3 +
    (data.dhcFootfall / 200) +
    (data.pharmacyFootfall / 200) +
    data.cgmSupportGPs * 3 +
    data.insulinPenSales * 0.05 +
    competitorPenalty -
    data.distance * 2;

  return Math.max(0, Math.round(score * 10) / 10);
}

export function getScoreLevel(score: number): { label: string; cssClass: string } {
  if (score > 80) return { label: "🔴 HIGH POTENTIAL (重點攻堅)", cssClass: "score-high" };
  if (score > 50) return { label: "🟡 MEDIUM (持續跟進)", cssClass: "score-medium" };
  return { label: "⚪ LOW (維持現狀)", cssClass: "score-low" };
}

export function generateSalesPitch(data: {
  pharmacistRate: number;
  cdccGPs: number;
  preDmPct: number;
  bgmVol: number;
  distance: number;
  cgmSupportGPs: number;
  competitorPresence: string;
  agingIndex: number;
}): string[] {
  const pitches: string[] = [];

  if (data.pharmacistRate >= 4) {
    pitches.push("藥劑師極度配合→投放[14天FreeStyle Libre試用手冊]並安排專場教育");
  }
  if (data.cdccGPs > 15) {
    pitches.push("GP資源豐富→推動[GP-藥房引流轉介卡]及聯合screening活動");
  }
  if (data.preDmPct > 40) {
    pitches.push("Pre-DM群體龐大→推廣[CGM早期篩查套餐]，強調預防價值");
  }
  if (data.bgmVol > 250) {
    pitches.push("BGM銷量高→重點推[BGM→CGM升級計劃]，展示便利性優勢");
  }
  if (data.distance > 10) {
    pitches.push("距離較遠→建議安排[流動教育車]或[DHC內部駐點日]");
  }
  if (data.cgmSupportGPs < 3) {
    pitches.push("CGM支持GP不足→優先安排[GP CGM培訓工作坊]");
  }
  if (data.competitorPresence === "strong") {
    pitches.push("競品強勢→強調FreeStyle Libre差異化：免校準、14天持續、App連接");
  }
  if (data.agingIndex > 17) {
    pitches.push("老齡化嚴重→針對長者推廣[簡易操作CGM方案]及家屬教育");
  }

  if (pitches.length === 0) {
    pitches.push("流量較弱，建議先通過DHC內部培訓，從篩查端截流");
  }

  return pitches;
}

// Additional data dimensions to collect (brainstorm)
export const ADDITIONAL_DIMENSIONS = [
  { category: "Patient Journey", items: ["初診→確診平均天數", "確診→用藥平均天數", "用藥→CGM轉介率", "患者自費意願評分(1-5)", "醫療券使用比例"] },
  { category: "競爭情報", items: ["Medtronic Guardian覆蓋率", "Dexcom G7鋪貨情況", "競品促銷頻次/月", "競品KOL醫生名單"] },
  { category: "渠道力", items: ["DHC護士數量", "藥劑師CGM培訓完成率", "藥房陳列位評分(1-5)", "是否有Demo機展示"] },
  { category: "社區特徵", items: ["區內糖尿病專科診所數", "HA醫院覆蓋(聯網)", "社區NGO合作數", "語言需求(粵/普/英)", "區內DM支援小組數"] },
  { category: "數碼化", items: ["患者App下載率", "LibreView連接率", "遠程監測參與率", "WhatsApp群組活躍度"] },
  { category: "財務指標", items: ["平均每患者月度消費(HKD)", "CGM vs BGM毛利對比", "退貨/投訴率", "保險覆蓋比例"] },
];
