const CATEGORY_KEYWORDS = {
  pothole: ['pothole', 'hole', 'road damage', 'crater', 'broken road', 'road crack'],
  garbage: ['garbage', 'trash', 'waste', 'litter', 'dump', 'overflow', 'rubbish'],
  water_leakage: ['water', 'leak', 'pipe', 'flood', 'drainage', 'sewage', 'overflow'],
  streetlight: ['light', 'streetlight', 'lamp', 'dark', 'bulb', 'electricity', 'pole']
};

const PRIORITY_RULES = {
  critical: ['major', 'severe', 'dangerous', 'accident', 'emergency', 'large', 'huge'],
  high: ['significant', 'serious', 'bad', 'broken', 'overflow'],
  low: ['minor', 'small', 'slight', 'little']
};

function detectCategory(text) {
  const lower = text.toLowerCase();
  let best = { category: 'other', score: 0, keywords: [] };

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matched = keywords.filter(k => lower.includes(k));
    if (matched.length > best.score) {
      best = { category: cat, score: matched.length, keywords: matched };
    }
  }
  return { detectedCategory: best.category, confidence: Math.min(best.score / 3, 1), keywords: best.keywords };
}

function assignPriority(text) {
  const lower = text.toLowerCase();
  if (PRIORITY_RULES.critical.some(k => lower.includes(k))) return 'critical';
  if (PRIORITY_RULES.high.some(k => lower.includes(k))) return 'high';
  if (PRIORITY_RULES.low.some(k => lower.includes(k))) return 'low';
  return 'medium';
}

async function checkDuplicate(Complaint, description, location) {
  if (!location?.lat || !location?.lng) return null;

  const recent = await Complaint.find({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    isDuplicate: false
  }).select('description location _id');

  const words = description.toLowerCase().split(/\s+/);

  for (const c of recent) {
    const existingWords = c.description.toLowerCase().split(/\s+/);
    const common = words.filter(w => existingWords.includes(w) && w.length > 4);
    const similarity = common.length / Math.max(words.length, existingWords.length);

    const latDiff = Math.abs((c.location?.lat || 0) - location.lat);
    const lngDiff = Math.abs((c.location?.lng || 0) - location.lng);
    const nearby = latDiff < 0.005 && lngDiff < 0.005;

    if (similarity > 0.5 && nearby) return c._id;
  }
  return null;
}

module.exports = { detectCategory, assignPriority, checkDuplicate };
