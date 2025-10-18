// Historical Prime Lending Rates in South Africa
export interface PrimeRateData {
  date: `${number}${number}${number}${number}-${number}${number}-${number}${number}`; // YYYY-MM-DD format
  rate: number; // Percentage
}

/**
 * The last date for which we checked for the prime lending rate.
 * Useful for displaying the last updated date in the UI.
 */
export const PRIME_LENDING_RATE_LAST_UPDATED = "2025-10-18";

// The repo rate (SARB policy rate) is typically 3.5% below the prime lending rate (since 2000). This has been consistent since then.
export const REPO_RATE_SPREAD = 3.5;

export const PRIME_LENDING_RATE_ZA: {
  date: `${number}${number}${number}${number}-${number}${number}-${number}${number}`;
  rate: number;
}[] = [
  { date: "2025-08-01", rate: 10.5 },
  { date: "2025-05-30", rate: 10.75 },
  { date: "2025-01-31", rate: 11.0 },
  { date: "2024-11-22", rate: 11.25 },
  { date: "2024-09-20", rate: 11.5 },
  { date: "2023-05-26", rate: 11.75 },
  { date: "2023-03-31", rate: 11.25 },
  { date: "2023-01-27", rate: 10.75 },
  { date: "2022-11-25", rate: 10.5 },
  { date: "2022-09-23", rate: 9.75 },
  { date: "2022-07-22", rate: 9.0 },
  { date: "2022-05-20", rate: 8.25 },
  { date: "2022-03-25", rate: 7.75 },
  { date: "2022-01-28", rate: 7.5 },
  { date: "2021-11-19", rate: 7.25 },
  { date: "2020-07-24", rate: 7.0 },
  { date: "2020-05-22", rate: 7.25 },
  { date: "2020-04-15", rate: 7.75 },
  { date: "2020-03-20", rate: 8.75 },
  { date: "2020-01-17", rate: 9.75 },
  { date: "2019-07-19", rate: 10.0 },
  { date: "2018-11-23", rate: 10.25 },
  { date: "2018-03-29", rate: 10.0 },
  { date: "2017-07-21", rate: 10.25 },
  { date: "2016-03-18", rate: 10.5 },
  { date: "2016-01-29", rate: 10.25 },
  { date: "2015-11-20", rate: 9.75 },
  { date: "2015-07-24", rate: 9.5 },
  { date: "2014-07-18", rate: 9.25 },
  { date: "2014-01-30", rate: 9.0 },
  { date: "2012-07-20", rate: 8.5 },
  { date: "2010-11-19", rate: 9.0 },
  { date: "2010-09-10", rate: 9.5 },
  { date: "2010-03-26", rate: 10.0 },
  { date: "2009-08-14", rate: 10.5 },
  { date: "2009-05-29", rate: 11.0 },
  { date: "2009-05-04", rate: 12.0 },
  { date: "2009-03-25", rate: 13.0 },
  { date: "2009-02-06", rate: 14.0 },
  { date: "2008-12-12", rate: 15.0 },
  { date: "2008-06-13", rate: 15.5 },
  { date: "2008-04-11", rate: 15.0 },
  { date: "2007-12-07", rate: 14.5 },
  { date: "2007-10-12", rate: 14.0 },
  { date: "2007-08-17", rate: 13.5 },
  { date: "2007-06-08", rate: 13.0 },
  { date: "2006-12-08", rate: 12.5 },
  { date: "2006-10-13", rate: 12.0 },
  { date: "2006-08-03", rate: 11.5 },
  { date: "2006-06-08", rate: 11.0 },
  { date: "2005-04-15", rate: 10.5 },
  { date: "2004-08-16", rate: 11.0 },
  { date: "2003-12-15", rate: 11.5 },
  { date: "2003-10-20", rate: 12.0 },
  { date: "2003-09-11", rate: 13.0 },
  { date: "2003-08-15", rate: 14.5 },
  { date: "2003-06-13", rate: 15.5 },
  { date: "2002-09-13", rate: 17.0 },
  { date: "2002-06-14", rate: 16.0 },
  { date: "2002-03-18", rate: 15.0 },
  { date: "2002-01-16", rate: 14.0 },
  { date: "2001-12-31", rate: 13.0 },
];

// Derive repo rate from prime lending rate
export const REPO_RATE_ZA: { date: string; rate: number }[] =
  PRIME_LENDING_RATE_ZA.map((item) => ({
    date: item.date,
    rate: item.rate - REPO_RATE_SPREAD,
  }));

// Historical Tax Brackets
export interface TaxBracketData {
  year: string; // Tax year (e.g., "2024/2025")
  brackets: {
    min: number;
    max: number | null; // null for the highest bracket
    rate: number; // Percentage
    label: string;
  }[];
  rebates: {
    primary: number;
    secondary: number;
    tertiary: number;
  };
}

// Historical SARS tax brackets
// Source: SARS official tax tables
export const taxBracketsHistory: TaxBracketData[] = [
  {
    year: "2015/2016",
    brackets: [
      { min: 0, max: 181_900, rate: 18, label: "0 - R181,900" },
      { min: 181_900, max: 284_100, rate: 26, label: "R181,901 - R284,100" },
      { min: 284_100, max: 393_200, rate: 31, label: "R284,101 - R393,200" },
      { min: 393_200, max: 550_100, rate: 36, label: "R393,201 - R550,100" },
      { min: 550_100, max: 701_300, rate: 39, label: "R550,101 - R701,300" },
      { min: 701_300, max: null, rate: 41, label: "R701,301+" },
    ],
    rebates: {
      primary: 13_257,
      secondary: 7_407,
      tertiary: 2_466,
    },
  },
  {
    year: "2016/2017",
    brackets: [
      { min: 0, max: 188_000, rate: 18, label: "0 - R188,000" },
      { min: 188_000, max: 293_600, rate: 26, label: "R188,001 - R293,600" },
      { min: 293_600, max: 406_400, rate: 31, label: "R293,601 - R406,400" },
      { min: 406_400, max: 550_100, rate: 36, label: "R406,401 - R550,100" },
      { min: 550_100, max: 701_300, rate: 39, label: "R550,101 - R701,300" },
      { min: 701_300, max: null, rate: 41, label: "R701,301+" },
    ],
    rebates: {
      primary: 13_500,
      secondary: 7_407,
      tertiary: 2_466,
    },
  },
  {
    year: "2017/2018",
    brackets: [
      { min: 0, max: 189_880, rate: 18, label: "0 - R189,880" },
      { min: 189_880, max: 296_540, rate: 26, label: "R189,881 - R296,540" },
      { min: 296_540, max: 410_460, rate: 31, label: "R296,541 - R410,460" },
      { min: 410_460, max: 555_600, rate: 36, label: "R410,461 - R555,600" },
      { min: 555_600, max: 708_310, rate: 39, label: "R555,601 - R708,310" },
      {
        min: 708_310,
        max: 1_500_000,
        rate: 41,
        label: "R708,311 - R1,500,000",
      },
      { min: 1_500_000, max: null, rate: 45, label: "R1,500,001+" },
    ],
    rebates: {
      primary: 13_635,
      secondary: 7_479,
      tertiary: 2_493,
    },
  },
  {
    year: "2018/2019",
    brackets: [
      { min: 0, max: 195_850, rate: 18, label: "0 - R195,850" },
      { min: 195_850, max: 305_850, rate: 26, label: "R195,851 - R305,850" },
      { min: 305_850, max: 423_300, rate: 31, label: "R305,851 - R423,300" },
      { min: 423_300, max: 555_600, rate: 36, label: "R423,301 - R555,600" },
      { min: 555_600, max: 708_310, rate: 39, label: "R555,601 - R708,310" },
      {
        min: 708_310,
        max: 1_500_000,
        rate: 41,
        label: "R708,311 - R1,500,000",
      },
      { min: 1_500_000, max: null, rate: 45, label: "R1,500,001+" },
    ],
    rebates: {
      primary: 14_067,
      secondary: 7_713,
      tertiary: 2_574,
    },
  },
  {
    year: "2019/2020",
    brackets: [
      { min: 0, max: 195_850, rate: 18, label: "0 - R195,850" },
      { min: 195_850, max: 305_850, rate: 26, label: "R195,851 - R305,850" },
      { min: 305_850, max: 423_300, rate: 31, label: "R305,851 - R423,300" },
      { min: 423_300, max: 555_600, rate: 36, label: "R423,301 - R555,600" },
      { min: 555_600, max: 708_310, rate: 39, label: "R555,601 - R708,310" },
      {
        min: 708_310,
        max: 1_500_000,
        rate: 41,
        label: "R708,311 - R1,500,000",
      },
      { min: 1_500_000, max: null, rate: 45, label: "R1,500,001+" },
    ],
    rebates: {
      primary: 14_220,
      secondary: 7_794,
      tertiary: 2_601,
    },
  },
  {
    year: "2020/2021",
    brackets: [
      { min: 0, max: 205_900, rate: 18, label: "0 - R205,900" },
      { min: 205_900, max: 321_600, rate: 26, label: "R205,901 - R321,600" },
      { min: 321_600, max: 445_100, rate: 31, label: "R321,601 - R445,100" },
      { min: 445_100, max: 584_200, rate: 36, label: "R445,101 - R584,200" },
      { min: 584_200, max: 744_800, rate: 39, label: "R584,201 - R744,800" },
      {
        min: 744_800,
        max: 1_577_300,
        rate: 41,
        label: "R744,801 - R1,577,300",
      },
      { min: 1_577_300, max: null, rate: 45, label: "R1,577,301+" },
    ],
    rebates: {
      primary: 14_958,
      secondary: 8_199,
      tertiary: 2_736,
    },
  },
  {
    year: "2021/2022",
    brackets: [
      { min: 0, max: 216_200, rate: 18, label: "0 - R216,200" },
      { min: 216_200, max: 337_800, rate: 26, label: "R216,201 - R337,800" },
      { min: 337_800, max: 467_500, rate: 31, label: "R337,801 - R467,500" },
      { min: 467_500, max: 613_600, rate: 36, label: "R467,501 - R613,600" },
      { min: 613_600, max: 782_200, rate: 39, label: "R613,601 - R782,200" },
      {
        min: 782_200,
        max: 1_656_600,
        rate: 41,
        label: "R782,201 - R1,656,600",
      },
      { min: 1_656_600, max: null, rate: 45, label: "R1,656,601+" },
    ],
    rebates: {
      primary: 15_714,
      secondary: 8_613,
      tertiary: 2_871,
    },
  },
  {
    year: "2022/2023",
    brackets: [
      { min: 0, max: 226_000, rate: 18, label: "0 - R226,000" },
      { min: 226_000, max: 353_100, rate: 26, label: "R226,001 - R353,100" },
      { min: 353_100, max: 488_700, rate: 31, label: "R353,101 - R488,700" },
      { min: 488_700, max: 641_400, rate: 36, label: "R488,701 - R641,400" },
      { min: 641_400, max: 817_600, rate: 39, label: "R641,401 - R817,600" },
      {
        min: 817_600,
        max: 1_731_600,
        rate: 41,
        label: "R817,601 - R1,731,600",
      },
      { min: 1_731_600, max: null, rate: 45, label: "R1,731,601+" },
    ],
    rebates: {
      primary: 16_425,
      secondary: 9_000,
      tertiary: 2_997,
    },
  },
  {
    year: "2023/2024",
    brackets: [
      { min: 0, max: 237_100, rate: 18, label: "0 - R237,100" },
      { min: 237_100, max: 370_500, rate: 26, label: "R237,101 - R370,500" },
      { min: 370_500, max: 512_800, rate: 31, label: "R370,501 - R512,800" },
      { min: 512_800, max: 673_000, rate: 36, label: "R512,801 - R673,000" },
      { min: 673_000, max: 857_900, rate: 39, label: "R673,001 - R857,900" },
      {
        min: 857_900,
        max: 1_817_000,
        rate: 41,
        label: "R857,901 - R1,817,000",
      },
      { min: 1_817_000, max: null, rate: 45, label: "R1,817,001+" },
    ],
    rebates: {
      primary: 17_235,
      secondary: 9_444,
      tertiary: 3_145,
    },
  },
  {
    year: "2024/2025",
    brackets: [
      { min: 0, max: 237_100, rate: 18, label: "0 - R237,100" },
      { min: 237_100, max: 370_500, rate: 26, label: "R237,101 - R370,500" },
      { min: 370_500, max: 512_800, rate: 31, label: "R370,501 - R512,800" },
      { min: 512_800, max: 673_000, rate: 36, label: "R512,801 - R673,000" },
      { min: 673_000, max: 857_900, rate: 39, label: "R673,001 - R857,900" },
      {
        min: 857_900,
        max: 1_817_000,
        rate: 41,
        label: "R857,901 - R1,817,000",
      },
      { min: 1_817_000, max: null, rate: 45, label: "R1,817,001+" },
    ],
    rebates: {
      primary: 17_235,
      secondary: 9_444,
      tertiary: 3_145,
    },
  },
  {
    year: "2025/2026",
    brackets: [
      { min: 0, max: 262_200, rate: 18, label: "0 - R262,200" },
      { min: 262_200, max: 410_600, rate: 26, label: "R262,201 - R410,600" },
      { min: 410_600, max: 567_800, rate: 31, label: "R410,601 - R567,800" },
      { min: 567_800, max: 746_000, rate: 36, label: "R567,801 - R746,000" },
      { min: 746_000, max: 950_000, rate: 39, label: "R746,001 - R950,000" },
      {
        min: 950_000,
        max: 2_011_200,
        rate: 41,
        label: "R950,001 - R2,011,200",
      },
      { min: 2_011_200, max: null, rate: 45, label: "R2,011,201+" },
    ],
    rebates: {
      primary: 19_095,
      secondary: 10_461,
      tertiary: 3_484,
    },
  },
];
