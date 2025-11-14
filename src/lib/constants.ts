export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const YOUTUBE_HANDLE = '@RandGuyZA';
export const TWITTER_HANDLE = '@RandGuyZA';
export const LINKS = {
  youtube: `https://www.youtube.com/${YOUTUBE_HANDLE}?sub_confirmation=1`,
  twitter: `https://x.com/${TWITTER_HANDLE}`,
  easyEquities:
    'https://easyidentity.io/profile-type?productid=easyequities&affiliateid=1&affiliatekey=/pohWtteakwQlSM7qFHjyVbXN1r/0Bsu/UD0VcV36cDWa8SJdX27lPZIgTkiVmLY/%2B0pAziRrJSwaBdBPkcJ6pAITz4pKEZrvP94fmVzYaEiOlDMjN0ah1w52s4T7AuZ',
  valr: 'https://www.valr.com/invite/VAVCTUC7',
  luno: 'https://www.luno.com/invite/TA4DB',
} as const;

export const TAGLINE = 'Simple tools. Smart choices. Better money.';

export const contactEmail = 'me@randguy.com';
