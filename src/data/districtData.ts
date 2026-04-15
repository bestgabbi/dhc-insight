// Hong Kong 18 Districts data with DHC, pharmacy, and healthcare info

export interface CompetitorBrands {
  linx: number; // 0-5 presence level
  sibionics: number;
  ican: number;
  roche: number;
}

export interface DistrictData {
  id: string;
  nameCn: string;
  nameEn: string;
  // Regional
  totalPopulation: number;
  estimatedDmPatients: number;
  agingIndex: number;
  publicHousingRatio: number;
  medianIncome: number;
  competitors: CompetitorBrands;
  // DHC
  dhcName: string;
  dhcType: "DHC" | "DHCE";
  dhcMonthlyFootfall: number;
  dhcNurseCount: number;
  dhcNurseCgmAwareness: number;
  dhcNurseAgpAwareness: number;
  dhcPharmacistCount: number;
  dhcPharmacistCgmAwareness: number;
  dhcPharmacistAgpAwareness: number;
  dhcCgmSupport: "support" | "neutral" | "oppose";
  // GP
  estimatedCdccGPs: number;
  cgmSupportGPs: number;
  // Default pharmacy
  defaultPharmacy: {
    name: string;
    pharmacistCount: number;
    cgmAwareness: number;
    agpAwareness: number;
    cgmSupport: "support" | "neutral" | "oppose";
    bgmMonthlySales: number;
    insulinPenSales: number;
    needleSales: number;
    monthlyConsultations: number;
    totalFootfall: number;
    patientComposition: { insulin: number; oral: number; dm: number; preDm: number };
  };
  avgDistanceDhcToPharmacy: number;
  // Current CGM sales
  currentCgmSales: number;
}

export const DISTRICTS: DistrictData[] = [
  {
    id: "yuen-long", nameCn: "元朗", nameEn: "Yuen Long",
    totalPopulation: 668100, estimatedDmPatients: 66800, agingIndex: 14.2, publicHousingRatio: 45, medianIncome: 22000,
    competitors: { linx: 2, sibionics: 1, ican: 0, roche: 3 },
    dhcName: "元朗地區康健中心", dhcType: "DHC", dhcMonthlyFootfall: 3200,
    dhcNurseCount: 6, dhcNurseCgmAwareness: 3, dhcNurseAgpAwareness: 2,
    dhcPharmacistCount: 2, dhcPharmacistCgmAwareness: 3, dhcPharmacistAgpAwareness: 2,
    dhcCgmSupport: "neutral",
    estimatedCdccGPs: 18, cgmSupportGPs: 5,
    defaultPharmacy: { name: "博愛社區藥房", pharmacistCount: 2, cgmAwareness: 3, agpAwareness: 2, cgmSupport: "neutral", bgmMonthlySales: 280, insulinPenSales: 120, needleSales: 350, monthlyConsultations: 150, totalFootfall: 1800, patientComposition: { insulin: 15, oral: 35, dm: 60, preDm: 40 } },
    avgDistanceDhcToPharmacy: 8, currentCgmSales: 12,
  },
  {
    id: "sham-shui-po", nameCn: "深水埗", nameEn: "Sham Shui Po",
    totalPopulation: 405869, estimatedDmPatients: 48700, agingIndex: 18.5, publicHousingRatio: 55, medianIncome: 18000,
    competitors: { linx: 3, sibionics: 2, ican: 1, roche: 4 },
    dhcName: "深水埗地區康健中心", dhcType: "DHC", dhcMonthlyFootfall: 4100,
    dhcNurseCount: 8, dhcNurseCgmAwareness: 3, dhcNurseAgpAwareness: 2,
    dhcPharmacistCount: 3, dhcPharmacistCgmAwareness: 4, dhcPharmacistAgpAwareness: 3,
    dhcCgmSupport: "support",
    estimatedCdccGPs: 22, cgmSupportGPs: 8,
    defaultPharmacy: { name: "深水埗社區藥房", pharmacistCount: 3, cgmAwareness: 4, agpAwareness: 3, cgmSupport: "support", bgmMonthlySales: 350, insulinPenSales: 180, needleSales: 420, monthlyConsultations: 200, totalFootfall: 2200, patientComposition: { insulin: 20, oral: 30, dm: 65, preDm: 35 } },
    avgDistanceDhcToPharmacy: 5, currentCgmSales: 25,
  },
  {
    id: "kwai-tsing", nameCn: "葵青", nameEn: "Kwai Tsing",
    totalPopulation: 495798, estimatedDmPatients: 52100, agingIndex: 16.8, publicHousingRatio: 50, medianIncome: 20000,
    competitors: { linx: 2, sibionics: 1, ican: 0, roche: 3 },
    dhcName: "葵青地區康健中心", dhcType: "DHC", dhcMonthlyFootfall: 2800,
    dhcNurseCount: 5, dhcNurseCgmAwareness: 2, dhcNurseAgpAwareness: 2,
    dhcPharmacistCount: 2, dhcPharmacistCgmAwareness: 3, dhcPharmacistAgpAwareness: 2,
    dhcCgmSupport: "neutral",
    estimatedCdccGPs: 15, cgmSupportGPs: 4,
    defaultPharmacy: { name: "葵涌社區藥房", pharmacistCount: 2, cgmAwareness: 3, agpAwareness: 2, cgmSupport: "neutral", bgmMonthlySales: 220, insulinPenSales: 100, needleSales: 280, monthlyConsultations: 120, totalFootfall: 1500, patientComposition: { insulin: 18, oral: 32, dm: 58, preDm: 42 } },
    avgDistanceDhcToPharmacy: 10, currentCgmSales: 10,
  },
  {
    id: "kwun-tong", nameCn: "觀塘", nameEn: "Kwun Tong",
    totalPopulation: 648541, estimatedDmPatients: 71300, agingIndex: 19.2, publicHousingRatio: 52, medianIncome: 19500,
    competitors: { linx: 3, sibionics: 2, ican: 1, roche: 4 },
    dhcName: "觀塘地區康健中心", dhcType: "DHC", dhcMonthlyFootfall: 4500,
    dhcNurseCount: 10, dhcNurseCgmAwareness: 3, dhcNurseAgpAwareness: 2,
    dhcPharmacistCount: 3, dhcPharmacistCgmAwareness: 3, dhcPharmacistAgpAwareness: 2,
    dhcCgmSupport: "neutral",
    estimatedCdccGPs: 25, cgmSupportGPs: 10,
    defaultPharmacy: { name: "觀塘社區藥房", pharmacistCount: 3, cgmAwareness: 3, agpAwareness: 2, cgmSupport: "neutral", bgmMonthlySales: 400, insulinPenSales: 200, needleSales: 500, monthlyConsultations: 250, totalFootfall: 2800, patientComposition: { insulin: 22, oral: 28, dm: 62, preDm: 38 } },
    avgDistanceDhcToPharmacy: 6, currentCgmSales: 20,
  },
  {
    id: "wong-tai-sin", nameCn: "黃大仙", nameEn: "Wong Tai Sin",
    totalPopulation: 420183, estimatedDmPatients: 50400, agingIndex: 20.1, publicHousingRatio: 58, medianIncome: 17500,
    competitors: { linx: 1, sibionics: 1, ican: 0, roche: 3 },
    dhcName: "黃大仙地區康健中心", dhcType: "DHC", dhcMonthlyFootfall: 2600,
    dhcNurseCount: 5, dhcNurseCgmAwareness: 2, dhcNurseAgpAwareness: 1,
    dhcPharmacistCount: 2, dhcPharmacistCgmAwareness: 2, dhcPharmacistAgpAwareness: 1,
    dhcCgmSupport: "neutral",
    estimatedCdccGPs: 14, cgmSupportGPs: 3,
    defaultPharmacy: { name: "黃大仙社區藥房", pharmacistCount: 2, cgmAwareness: 2, agpAwareness: 1, cgmSupport: "neutral", bgmMonthlySales: 240, insulinPenSales: 110, needleSales: 300, monthlyConsultations: 100, totalFootfall: 1400, patientComposition: { insulin: 20, oral: 30, dm: 60, preDm: 40 } },
    avgDistanceDhcToPharmacy: 7, currentCgmSales: 8,
  },
  {
    id: "eastern", nameCn: "東區", nameEn: "Eastern",
    totalPopulation: 529603, estimatedDmPatients: 52900, agingIndex: 17.3, publicHousingRatio: 35, medianIncome: 28000,
    competitors: { linx: 2, sibionics: 1, ican: 1, roche: 3 },
    dhcName: "東區地區康健站", dhcType: "DHCE", dhcMonthlyFootfall: 2200,
    dhcNurseCount: 4, dhcNurseCgmAwareness: 3, dhcNurseAgpAwareness: 2,
    dhcPharmacistCount: 1, dhcPharmacistCgmAwareness: 3, dhcPharmacistAgpAwareness: 2,
    dhcCgmSupport: "neutral",
    estimatedCdccGPs: 20, cgmSupportGPs: 7,
    defaultPharmacy: { name: "太古城藥房", pharmacistCount: 2, cgmAwareness: 3, agpAwareness: 2, cgmSupport: "neutral", bgmMonthlySales: 260, insulinPenSales: 130, needleSales: 310, monthlyConsultations: 140, totalFootfall: 1600, patientComposition: { insulin: 16, oral: 34, dm: 55, preDm: 45 } },
    avgDistanceDhcToPharmacy: 8, currentCgmSales: 15,
  },
  {
    id: "southern", nameCn: "南區", nameEn: "Southern",
    totalPopulation: 269142, estimatedDmPatients: 24200, agingIndex: 16.0, publicHousingRatio: 30, medianIncome: 30000,
    competitors: { linx: 1, sibionics: 0, ican: 0, roche: 2 },
    dhcName: "南區地區康健站", dhcType: "DHCE", dhcMonthlyFootfall: 1500,
    dhcNurseCount: 3, dhcNurseCgmAwareness: 2, dhcNurseAgpAwareness: 1,
    dhcPharmacistCount: 1, dhcPharmacistCgmAwareness: 2, dhcPharmacistAgpAwareness: 1,
    dhcCgmSupport: "neutral",
    estimatedCdccGPs: 10, cgmSupportGPs: 3,
    defaultPharmacy: { name: "香港仔藥房", pharmacistCount: 1, cgmAwareness: 2, agpAwareness: 1, cgmSupport: "neutral", bgmMonthlySales: 150, insulinPenSales: 70, needleSales: 180, monthlyConsultations: 60, totalFootfall: 900, patientComposition: { insulin: 12, oral: 38, dm: 50, preDm: 50 } },
    avgDistanceDhcToPharmacy: 12, currentCgmSales: 5,
  },
  {
    id: "wan-chai", nameCn: "灣仔", nameEn: "Wan Chai",
    totalPopulation: 166695, estimatedDmPatients: 18300, agingIndex: 18.0, publicHousingRatio: 20, medianIncome: 35000,
    competitors: { linx: 3, sibionics: 2, ican: 2, roche: 4 },
    dhcName: "灣仔地區康健中心", dhcType: "DHC", dhcMonthlyFootfall: 2000,
    dhcNurseCount: 4, dhcNurseCgmAwareness: 4, dhcNurseAgpAwareness: 3,
    dhcPharmacistCount: 2, dhcPharmacistCgmAwareness: 4, dhcPharmacistAgpAwareness: 3,
    dhcCgmSupport: "support",
    estimatedCdccGPs: 16, cgmSupportGPs: 6,
    defaultPharmacy: { name: "灣仔社區藥房", pharmacistCount: 2, cgmAwareness: 4, agpAwareness: 3, cgmSupport: "support", bgmMonthlySales: 180, insulinPenSales: 90, needleSales: 220, monthlyConsultations: 100, totalFootfall: 1200, patientComposition: { insulin: 14, oral: 36, dm: 52, preDm: 48 } },
    avgDistanceDhcToPharmacy: 5, currentCgmSales: 18,
  },
  {
    id: "central-western", nameCn: "中西區", nameEn: "Central & Western",
    totalPopulation: 238691, estimatedDmPatients: 21400, agingIndex: 15.5, publicHousingRatio: 18, medianIncome: 38000,
    competitors: { linx: 3, sibionics: 2, ican: 2, roche: 4 },
    dhcName: "中西區地區康健站", dhcType: "DHCE", dhcMonthlyFootfall: 1800,
    dhcNurseCount: 3, dhcNurseCgmAwareness: 3, dhcNurseAgpAwareness: 2,
    dhcPharmacistCount: 1, dhcPharmacistCgmAwareness: 3, dhcPharmacistAgpAwareness: 2,
    dhcCgmSupport: "neutral",
    estimatedCdccGPs: 12, cgmSupportGPs: 5,
    defaultPharmacy: { name: "西營盤藥房", pharmacistCount: 2, cgmAwareness: 3, agpAwareness: 2, cgmSupport: "neutral", bgmMonthlySales: 160, insulinPenSales: 80, needleSales: 200, monthlyConsultations: 80, totalFootfall: 1100, patientComposition: { insulin: 10, oral: 40, dm: 48, preDm: 52 } },
    avgDistanceDhcToPharmacy: 6, currentCgmSales: 14,
  },
  {
    id: "kowloon-city", nameCn: "九龍城", nameEn: "Kowloon City",
    totalPopulation: 410634, estimatedDmPatients: 41000, agingIndex: 16.5, publicHousingRatio: 40, medianIncome: 24000,
    competitors: { linx: 2, sibionics: 1, ican: 1, roche: 3 },
    dhcName: "九龍城地區康健站", dhcType: "DHCE", dhcMonthlyFootfall: 2400,
    dhcNurseCount: 4, dhcNurseCgmAwareness: 3, dhcNurseAgpAwareness: 2,
    dhcPharmacistCount: 2, dhcPharmacistCgmAwareness: 3, dhcPharmacistAgpAwareness: 2,
    dhcCgmSupport: "neutral",
    estimatedCdccGPs: 17, cgmSupportGPs: 6,
    defaultPharmacy: { name: "土瓜灣藥房", pharmacistCount: 2, cgmAwareness: 3, agpAwareness: 2, cgmSupport: "neutral", bgmMonthlySales: 270, insulinPenSales: 140, needleSales: 340, monthlyConsultations: 130, totalFootfall: 1500, patientComposition: { insulin: 18, oral: 32, dm: 58, preDm: 42 } },
    avgDistanceDhcToPharmacy: 7, currentCgmSales: 13,
  },
  {
    id: "yau-tsim-mong", nameCn: "油尖旺", nameEn: "Yau Tsim Mong",
    totalPopulation: 318522, estimatedDmPatients: 35000, agingIndex: 15.8, publicHousingRatio: 35, medianIncome: 21000,
    competitors: { linx: 3, sibionics: 2, ican: 1, roche: 4 },
    dhcName: "油尖旺地區康健站", dhcType: "DHCE", dhcMonthlyFootfall: 2800,
    dhcNurseCount: 5, dhcNurseCgmAwareness: 3, dhcNurseAgpAwareness: 2,
    dhcPharmacistCount: 2, dhcPharmacistCgmAwareness: 3, dhcPharmacistAgpAwareness: 2,
    dhcCgmSupport: "neutral",
    estimatedCdccGPs: 19, cgmSupportGPs: 7,
    defaultPharmacy: { name: "旺角社區藥房", pharmacistCount: 2, cgmAwareness: 3, agpAwareness: 2, cgmSupport: "neutral", bgmMonthlySales: 300, insulinPenSales: 150, needleSales: 380, monthlyConsultations: 160, totalFootfall: 1900, patientComposition: { insulin: 16, oral: 34, dm: 56, preDm: 44 } },
    avgDistanceDhcToPharmacy: 4, currentCgmSales: 16,
  },
  {
    id: "tsuen-wan", nameCn: "荃灣", nameEn: "Tsuen Wan",
    totalPopulation: 318005, estimatedDmPatients: 33400, agingIndex: 15.5, publicHousingRatio: 40, medianIncome: 24000,
    competitors: { linx: 2, sibionics: 1, ican: 0, roche: 3 },
    dhcName: "荃灣地區康健中心", dhcType: "DHC", dhcMonthlyFootfall: 3000,
    dhcNurseCount: 6, dhcNurseCgmAwareness: 3, dhcNurseAgpAwareness: 2,
    dhcPharmacistCount: 2, dhcPharmacistCgmAwareness: 3, dhcPharmacistAgpAwareness: 2,
    dhcCgmSupport: "neutral",
    estimatedCdccGPs: 16, cgmSupportGPs: 5,
    defaultPharmacy: { name: "荃灣社區藥房", pharmacistCount: 2, cgmAwareness: 3, agpAwareness: 2, cgmSupport: "neutral", bgmMonthlySales: 250, insulinPenSales: 115, needleSales: 290, monthlyConsultations: 130, totalFootfall: 1700, patientComposition: { insulin: 17, oral: 33, dm: 57, preDm: 43 } },
    avgDistanceDhcToPharmacy: 7, currentCgmSales: 11,
  },
  {
    id: "tuen-mun", nameCn: "屯門", nameEn: "Tuen Mun",
    totalPopulation: 495536, estimatedDmPatients: 49500, agingIndex: 15.0, publicHousingRatio: 48, medianIncome: 21000,
    competitors: { linx: 1, sibionics: 0, ican: 0, roche: 2 },
    dhcName: "屯門地區康健中心", dhcType: "DHC", dhcMonthlyFootfall: 2900,
    dhcNurseCount: 5, dhcNurseCgmAwareness: 2, dhcNurseAgpAwareness: 1,
    dhcPharmacistCount: 2, dhcPharmacistCgmAwareness: 2, dhcPharmacistAgpAwareness: 1,
    dhcCgmSupport: "neutral",
    estimatedCdccGPs: 14, cgmSupportGPs: 4,
    defaultPharmacy: { name: "屯門社區藥房", pharmacistCount: 2, cgmAwareness: 2, agpAwareness: 1, cgmSupport: "neutral", bgmMonthlySales: 260, insulinPenSales: 130, needleSales: 320, monthlyConsultations: 120, totalFootfall: 1600, patientComposition: { insulin: 19, oral: 31, dm: 60, preDm: 40 } },
    avgDistanceDhcToPharmacy: 10, currentCgmSales: 9,
  },
  {
    id: "north", nameCn: "北區", nameEn: "North",
    totalPopulation: 304637, estimatedDmPatients: 30400, agingIndex: 14.8, publicHousingRatio: 42, medianIncome: 20000,
    competitors: { linx: 1, sibionics: 0, ican: 0, roche: 2 },
    dhcName: "北區地區康健站", dhcType: "DHCE", dhcMonthlyFootfall: 1800,
    dhcNurseCount: 3, dhcNurseCgmAwareness: 2, dhcNurseAgpAwareness: 1,
    dhcPharmacistCount: 1, dhcPharmacistCgmAwareness: 2, dhcPharmacistAgpAwareness: 1,
    dhcCgmSupport: "neutral",
    estimatedCdccGPs: 10, cgmSupportGPs: 2,
    defaultPharmacy: { name: "上水藥房", pharmacistCount: 1, cgmAwareness: 2, agpAwareness: 1, cgmSupport: "neutral", bgmMonthlySales: 180, insulinPenSales: 80, needleSales: 220, monthlyConsultations: 70, totalFootfall: 1000, patientComposition: { insulin: 16, oral: 34, dm: 55, preDm: 45 } },
    avgDistanceDhcToPharmacy: 12, currentCgmSales: 5,
  },
  {
    id: "tai-po", nameCn: "大埔", nameEn: "Tai Po",
    totalPopulation: 303926, estimatedDmPatients: 30300, agingIndex: 15.2, publicHousingRatio: 38, medianIncome: 23000,
    competitors: { linx: 1, sibionics: 0, ican: 0, roche: 2 },
    dhcName: "大埔地區康健中心", dhcType: "DHC", dhcMonthlyFootfall: 2200,
    dhcNurseCount: 4, dhcNurseCgmAwareness: 2, dhcNurseAgpAwareness: 1,
    dhcPharmacistCount: 2, dhcPharmacistCgmAwareness: 2, dhcPharmacistAgpAwareness: 1,
    dhcCgmSupport: "neutral",
    estimatedCdccGPs: 12, cgmSupportGPs: 3,
    defaultPharmacy: { name: "大埔社區藥房", pharmacistCount: 1, cgmAwareness: 2, agpAwareness: 1, cgmSupport: "neutral", bgmMonthlySales: 200, insulinPenSales: 90, needleSales: 250, monthlyConsultations: 90, totalFootfall: 1200, patientComposition: { insulin: 15, oral: 35, dm: 55, preDm: 45 } },
    avgDistanceDhcToPharmacy: 8, currentCgmSales: 7,
  },
  {
    id: "sha-tin", nameCn: "沙田", nameEn: "Sha Tin",
    totalPopulation: 692806, estimatedDmPatients: 69200, agingIndex: 15.0, publicHousingRatio: 35, medianIncome: 26000,
    competitors: { linx: 2, sibionics: 1, ican: 1, roche: 3 },
    dhcName: "沙田地區康健中心", dhcType: "DHC", dhcMonthlyFootfall: 3800,
    dhcNurseCount: 8, dhcNurseCgmAwareness: 3, dhcNurseAgpAwareness: 2,
    dhcPharmacistCount: 3, dhcPharmacistCgmAwareness: 3, dhcPharmacistAgpAwareness: 2,
    dhcCgmSupport: "neutral",
    estimatedCdccGPs: 20, cgmSupportGPs: 7,
    defaultPharmacy: { name: "沙田社區藥房", pharmacistCount: 2, cgmAwareness: 3, agpAwareness: 2, cgmSupport: "neutral", bgmMonthlySales: 320, insulinPenSales: 160, needleSales: 400, monthlyConsultations: 180, totalFootfall: 2100, patientComposition: { insulin: 16, oral: 34, dm: 56, preDm: 44 } },
    avgDistanceDhcToPharmacy: 9, currentCgmSales: 17,
  },
  {
    id: "sai-kung", nameCn: "西貢", nameEn: "Sai Kung",
    totalPopulation: 489037, estimatedDmPatients: 39100, agingIndex: 12.5, publicHousingRatio: 30, medianIncome: 28000,
    competitors: { linx: 1, sibionics: 0, ican: 0, roche: 2 },
    dhcName: "西貢地區康健站", dhcType: "DHCE", dhcMonthlyFootfall: 2000,
    dhcNurseCount: 3, dhcNurseCgmAwareness: 2, dhcNurseAgpAwareness: 1,
    dhcPharmacistCount: 1, dhcPharmacistCgmAwareness: 2, dhcPharmacistAgpAwareness: 1,
    dhcCgmSupport: "neutral",
    estimatedCdccGPs: 11, cgmSupportGPs: 3,
    defaultPharmacy: { name: "將軍澳藥房", pharmacistCount: 2, cgmAwareness: 2, agpAwareness: 1, cgmSupport: "neutral", bgmMonthlySales: 190, insulinPenSales: 85, needleSales: 230, monthlyConsultations: 80, totalFootfall: 1300, patientComposition: { insulin: 12, oral: 38, dm: 50, preDm: 50 } },
    avgDistanceDhcToPharmacy: 10, currentCgmSales: 8,
  },
  {
    id: "islands", nameCn: "離島", nameEn: "Islands",
    totalPopulation: 186805, estimatedDmPatients: 14900, agingIndex: 11.0, publicHousingRatio: 25, medianIncome: 25000,
    competitors: { linx: 0, sibionics: 0, ican: 0, roche: 1 },
    dhcName: "離島地區康健站", dhcType: "DHCE", dhcMonthlyFootfall: 1000,
    dhcNurseCount: 2, dhcNurseCgmAwareness: 1, dhcNurseAgpAwareness: 1,
    dhcPharmacistCount: 1, dhcPharmacistCgmAwareness: 1, dhcPharmacistAgpAwareness: 1,
    dhcCgmSupport: "oppose",
    estimatedCdccGPs: 5, cgmSupportGPs: 1,
    defaultPharmacy: { name: "東涌藥房", pharmacistCount: 1, cgmAwareness: 1, agpAwareness: 1, cgmSupport: "neutral", bgmMonthlySales: 80, insulinPenSales: 40, needleSales: 100, monthlyConsultations: 30, totalFootfall: 600, patientComposition: { insulin: 10, oral: 35, dm: 48, preDm: 52 } },
    avgDistanceDhcToPharmacy: 15, currentCgmSales: 2,
  },
];

// Potential Score Algorithm
export function calculatePotentialScore(data: {
  cdccGPs: number;
  pharmacistRate: number;
  bgmVol: number;
  distance: number;
  agingIndex: number;
  publicHousingRatio: number;
  dhcFootfall: number;
  pharmacyFootfall: number;
  competitorTotal: number;
  cgmSupportGPs: number;
  insulinPenSales: number;
  dhcCgmAwareness: number;
  dhcAgpAwareness: number;
  pharmacyCgmAwareness: number;
  pharmacyAgpAwareness: number;
  preDmPct: number;
}): number {
  let score =
    data.cdccGPs * 2 +
    data.pharmacistRate * 8 +
    data.preDmPct * 0.5 +
    data.bgmVol * 0.1 +
    data.agingIndex * 1.5 +
    data.publicHousingRatio * 0.3 +
    (data.dhcFootfall / 200) +
    (data.pharmacyFootfall / 200) +
    data.cgmSupportGPs * 3 +
    data.insulinPenSales * 0.05 +
    data.dhcCgmAwareness * 4 +
    data.dhcAgpAwareness * 3 +
    data.pharmacyCgmAwareness * 5 +
    data.pharmacyAgpAwareness * 3 -
    data.competitorTotal * 2 -
    data.distance * 2;

  return Math.max(0, Math.round(score * 10) / 10);
}

export function getScoreLevel(score: number): { label: string; cssClass: string } {
  if (score > 80) return { label: "🔴 HIGH POTENTIAL (重點攻堅)", cssClass: "score-high" };
  if (score > 50) return { label: "🟡 MEDIUM (持續跟進)", cssClass: "score-medium" };
  return { label: "⚪ LOW (維持現狀)", cssClass: "score-low" };
}

export function generateSalesPitch(data: {
  pharmacyCgmAwareness: number;
  pharmacyAgpAwareness: number;
  dhcCgmAwareness: number;
  dhcAgpAwareness: number;
  cdccGPs: number;
  preDmPct: number;
  bgmVol: number;
  distance: number;
  cgmSupportGPs: number;
  competitorTotal: number;
  agingIndex: number;
  dhcCgmSupport: string;
  pharmacyCgmSupport: string;
}): string[] {
  const pitches: string[] = [];
  if (data.pharmacyCgmAwareness >= 4) pitches.push("藥房藥劑師CGM認知高→投放[14天FreeStyle Libre試用手冊]並安排專場教育");
  else if (data.pharmacyCgmAwareness <= 2) pitches.push("藥房藥劑師CGM認知低→優先安排[藥劑師CGM基礎培訓]");
  if (data.pharmacyAgpAwareness <= 2) pitches.push("藥房AGP/LibreView認知不足→安排[AGP報告解讀工作坊]");
  if (data.dhcCgmAwareness <= 2) pitches.push("DHC護理團隊CGM認知低→安排[DHC內部CGM教育日]");
  if (data.dhcAgpAwareness <= 2) pitches.push("DHC對AGP/LibreView不熟→提供[LibreView平台Demo及操作培訓]");
  if (data.dhcCgmSupport === "oppose") pitches.push("DHC不支持CGM→需先建立關係，提供臨床數據及成功案例");
  if (data.cdccGPs > 15) pitches.push("GP資源豐富→推動[GP-藥房引流轉介卡]及聯合screening活動");
  if (data.preDmPct > 40) pitches.push("Pre-DM群體龐大→推廣[CGM早期篩查套餐]，強調預防價值");
  if (data.bgmVol > 250) pitches.push("BGM銷量高→重點推[BGM→CGM升級計劃]，展示便利性優勢");
  if (data.distance > 10) pitches.push("距離較遠→建議安排[流動教育車]或[DHC內部駐點日]");
  if (data.cgmSupportGPs < 3) pitches.push("CGM支持GP不足→優先安排[GP CGM培訓工作坊]");
  if (data.competitorTotal > 8) pitches.push("競品強勢→強調FreeStyle Libre差異化：免校準、14天持續、App連接");
  if (data.agingIndex > 17) pitches.push("老齡化嚴重→針對長者推廣[簡易操作CGM方案]及家屬教育");
  if (pitches.length === 0) pitches.push("流量較弱，建議先通過DHC內部培訓，從篩查端截流");
  return pitches;
}

export const COMPETITOR_BRANDS = ["Linx", "Sibionics", "iCan", "Roche"] as const;

export const ADDITIONAL_DIMENSIONS = [
  { category: "Patient Journey", items: ["初診→確診平均天數", "確診→用藥平均天數", "用藥→CGM轉介率", "患者自費意願評分(1-5)", "醫療券使用比例"] },
  { category: "競爭情報", items: ["Medtronic Guardian覆蓋率", "Dexcom G7鋪貨情況", "競品促銷頻次/月", "競品KOL醫生名單"] },
  { category: "渠道力", items: ["藥房陳列位評分(1-5)", "是否有Demo機展示", "藥房POS系統支持度"] },
  { category: "社區特徵", items: ["區內糖尿病專科診所數", "HA醫院覆蓋(聯網)", "社區NGO合作數", "語言需求(粵/普/英)", "區內DM支援小組數"] },
  { category: "數碼化", items: ["患者App下載率", "LibreView連接率", "遠程監測參與率", "WhatsApp群組活躍度"] },
  { category: "財務指標", items: ["平均每患者月度消費(HKD)", "CGM vs BGM毛利對比", "退貨/投訴率", "保險覆蓋比例"] },
];
