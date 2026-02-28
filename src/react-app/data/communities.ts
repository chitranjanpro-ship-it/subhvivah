export interface Community {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
}

export const communities: Community[] = [
  {
    id: "brahmin",
    name: "Brahmin",
    description: "Connect with Brahmin families across India",
    icon: "🕉️",
    memberCount: 15420,
  },
  {
    id: "rajput",
    name: "Rajput",
    description: "Royal heritage, modern connections",
    icon: "⚔️",
    memberCount: 12350,
  },
  {
    id: "marwari",
    name: "Marwari",
    description: "Business families from Rajasthan",
    icon: "🏛️",
    memberCount: 8920,
  },
  {
    id: "gujarati",
    name: "Gujarati",
    description: "Vibrant Gujarati community worldwide",
    icon: "🌸",
    memberCount: 18650,
  },
  {
    id: "punjabi",
    name: "Punjabi",
    description: "Spirited Punjabi families",
    icon: "🌾",
    memberCount: 22100,
  },
  {
    id: "tamil",
    name: "Tamil",
    description: "Rich Tamil cultural heritage",
    icon: "🎭",
    memberCount: 19800,
  },
  {
    id: "malayali",
    name: "Malayali",
    description: "Kerala's diverse community",
    icon: "🌴",
    memberCount: 14200,
  },
  {
    id: "bengali",
    name: "Bengali",
    description: "Artistic Bengali families",
    icon: "🎨",
    memberCount: 16900,
  },
  {
    id: "maratha",
    name: "Maratha",
    description: "Proud Maratha heritage",
    icon: "🏰",
    memberCount: 11500,
  },
  {
    id: "sindhi",
    name: "Sindhi",
    description: "Enterprising Sindhi community",
    icon: "💎",
    memberCount: 7800,
  },
  {
    id: "jain",
    name: "Jain",
    description: "Jain families with strong values",
    icon: "☸️",
    memberCount: 9400,
  },
  {
    id: "muslim",
    name: "Muslim",
    description: "Islamic families seeking nikah",
    icon: "☪️",
    memberCount: 25600,
  },
  {
    id: "christian",
    name: "Christian",
    description: "Christian families across India",
    icon: "✝️",
    memberCount: 13200,
  },
  {
    id: "sikh",
    name: "Sikh",
    description: "Sikh families worldwide",
    icon: "☬",
    memberCount: 11800,
  },
  {
    id: "kayastha",
    name: "Kayastha",
    description: "Scholarly Kayastha heritage",
    icon: "📜",
    memberCount: 8100,
  },
  {
    id: "agarwal",
    name: "Agarwal",
    description: "Agarwal business families",
    icon: "🪙",
    memberCount: 10200,
  },
];

export const getCommunityById = (id: string): Community | undefined => {
  return communities.find((c) => c.id === id);
};
