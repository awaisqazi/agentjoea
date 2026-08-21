/** Site-wide constants — every piece of contact info and every external link lives here. */
export const SITE = {
  name: 'Joseph Alvarado',
  title: 'Joseph Alvarado | Real Estate Agent and Investor',
  description:
    'Realtor with Chicagoland Brokers serving Winfield, Wheaton, West Chicago & the Western suburbs of Chicago. Buy, sell, and invest with an agent who invests himself.',
  email: 'AgentJoeA@gmail.com',
  phone: '(224) 324-5472',
  phoneHref: 'tel:+12243245472',
  office: 'Wheaton, IL',
  company: 'Alvarado Investments',
} as const;

export const LINKS = {
  calendly: 'https://calendly.com/agentjoea/30min',
  homeValue: 'https://jalvarado.chicagolandbrokers.net/house-value',
  brokerage: 'https://www.chicagolandbrokers.net/',
  brokerProfile: 'https://jalvarado.chicagolandbrokers.net/',
  fairHousing: 'https://exitrealtywheaton.com/eho',
} as const;

export const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/agent_joealvarado' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61552159351553' },
  { label: 'YouTube', href: 'https://www.youtube.com/@AgentJosephAlvarado' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/josephealvarado/' },
] as const;

/**
 * Form handling for a static site: create a free form at https://formspree.io,
 * then paste its endpoint here (e.g. 'https://formspree.io/f/abcdwxyz').
 * While empty, forms fall back to opening the visitor's email app instead.
 */
export const FORM_ENDPOINT = '';

/** Prefix a root-relative path with the deploy base (GitHub Pages project sites). */
export function href(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const joined = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  return joined || '/';
}
