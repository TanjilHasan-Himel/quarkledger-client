/**
 * Maps any category slug or name to one of the 5 canonical palette tokens:
 * - tech:     var(--c-tech)     (#FF5722) [Flagship Vertical]
 * - politics: var(--c-politics) (#7FB0E0) [Bangladesh, National, Geopolitics]
 * - business: var(--c-business) (#8FD19A) [Economy, Markets, Finance]
 * - sports:   var(--c-sports)   (#E39199) [Sports, Athletics]
 * - culture:  var(--c-culture)  (#C3A6EC) [Space, Science, Humanities, Nature]
 */
export function getCategoryColorVar(slugOrName?: string | null): string {
  if (!slugOrName) return 'var(--c-tech)';

  const normalized = slugOrName.toLowerCase();

  // Politics / Bangladesh / Geopolitics / National
  if (
    normalized.includes('bangladesh') ||
    normalized.includes('national') ||
    normalized.includes('politics') ||
    normalized.includes('world') ||
    normalized.includes('geopolitics') ||
    normalized.includes('defense') ||
    normalized.includes('policy') ||
    normalized.includes('আইন') ||
    normalized.includes('বাংলাদেশ') ||
    normalized.includes('জাতীয়')
  ) {
    return 'var(--c-politics)';
  }

  // Business / Economy / Finance
  if (
    normalized.includes('economy') ||
    normalized.includes('business') ||
    normalized.includes('finance') ||
    normalized.includes('market') ||
    normalized.includes('অর্থনীতি') ||
    normalized.includes('বাণিজ্য')
  ) {
    return 'var(--c-business)';
  }

  // Sports
  if (
    normalized.includes('sports') ||
    normalized.includes('athletic') ||
    normalized.includes('খেলাধুলা')
  ) {
    return 'var(--c-sports)';
  }

  // Culture / Science / Space / Nature
  if (
    normalized.includes('space') ||
    normalized.includes('science') ||
    normalized.includes('astronomy') ||
    normalized.includes('physics') ||
    normalized.includes('culture') ||
    normalized.includes('entertainment') ||
    normalized.includes('environment') ||
    normalized.includes('nature') ||
    normalized.includes('মহাকাশ') ||
    normalized.includes('বিজ্ঞান') ||
    normalized.includes('সংস্কৃতি')
  ) {
    return 'var(--c-culture)';
  }

  // Default to flagship brand color (Tech / AI)
  return 'var(--c-tech)';
}
