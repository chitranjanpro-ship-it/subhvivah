import { prisma } from './prisma';

export type SuggestionCategory = 'STARTER' | 'ICEBREAKER' | 'REPLY' | 'FOLLOW_UP' | 'TOPIC';

export const DEFAULT_SUGGESTIONS: Record<SuggestionCategory, string[]> = {
  STARTER: [
    "Hello, I came across your profile and would like to know more about you.",
    "Hi, I noticed we share similar interests. Would love to connect.",
    "Greetings! I liked your profile and would like to explore if we are compatible.",
    "Hi there! Your profile seems very interesting. Can we chat?"
  ],
  ICEBREAKER: [
    "What are your favorite hobbies?",
    "What kind of movies do you enjoy?",
    "How do you usually spend your weekends?",
    "What's the last book you read and loved?",
    "Do you enjoy traveling? What's your favorite destination?"
  ],
  REPLY: [
    "Thank you for reaching out.",
    "I appreciate your message. Let's get to know each other.",
    "That sounds interesting. Tell me more.",
    "I'd love to chat and learn more about you.",
    "Thanks for the message! How is your day going?"
  ],
  FOLLOW_UP: [
    "It was nice chatting with you earlier. How are you today?",
    "Hope your day is going well. Would love to continue our conversation.",
    "Hi! Just checking in. How has your week been?",
    "I enjoyed our last conversation. Any plans for the weekend?"
  ],
  TOPIC: [
    "Family background and values",
    "Career goals and aspirations",
    "Lifestyle preferences and habits",
    "Education and interests",
    "Future plans and expectations"
  ]
};

export async function getSuggestions(category: SuggestionCategory) {
  try {
    const dbSuggestions = await prisma.messageSuggestion.findMany({
      where: { category, isActive: true },
      take: 5
    });

    if (dbSuggestions.length > 0) {
      return dbSuggestions.map(s => s.content);
    }

    return DEFAULT_SUGGESTIONS[category];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return DEFAULT_SUGGESTIONS[category];
  }
}

export function analyzeMessage(content: string) {
  const phoneRegex = /(\+?\d{1,4}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/g;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const socialMediaRegex = /(instagram|insta|whatsapp|tg|telegram|fb|facebook|id|username|@)\s*[:=-]?\s*([a-zA-Z0-9._]+)/gi;
  const urlRegex = /https?:\/\/[^\s]+/gi;

  const results = {
    isSafe: true,
    reason: '',
    type: '' as 'SCAM_ATTEMPT' | 'CONTACT_SHARING' | 'ABUSIVE_LANGUAGE' | '',
    suggestedAlternative: ''
  };

  if (phoneRegex.test(content) || emailRegex.test(content) || socialMediaRegex.test(content) || urlRegex.test(content)) {
    results.isSafe = false;
    results.reason = "Sharing contact details or external links is not allowed for security reasons.";
    results.type = 'CONTACT_SHARING';
    results.suggestedAlternative = "Consider continuing the conversation here to build trust first.";
    return results;
  }

  const inappropriateWords = ['rude', 'aggressive', 'abuse', 'stupid', 'idiot']; // Simplified for mock
  if (inappropriateWords.some(word => content.toLowerCase().includes(word))) {
    results.isSafe = false;
    results.reason = "This message may not be appropriate. Consider sending a polite introduction instead.";
    results.type = 'ABUSIVE_LANGUAGE';
    results.suggestedAlternative = "Hello, I'd like to get to know you better. How are you?";
    return results;
  }

  return results;
}

export async function updateTrustScore(userId: string, change: number) {
  try {
    const profile = await prisma.profile.findFirst({
      where: { userId }
    });

    if (profile) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: {
          trustScore: {
            increment: change
          }
        }
      });
    }
  } catch (error) {
    console.error('Error updating trust score:', error);
  }
}

export async function logModerationEvent(chatId: string, userId: string, type: string, content: string, action: string) {
  try {
    await prisma.chatModerationEvent.create({
      data: {
        chatId,
        userId,
        type,
        content,
        actionTaken: action
      }
    });

    // Automatically reduce trust score for violations
    if (action === 'BLOCKED') {
      await updateTrustScore(userId, -5);
    } else if (action === 'WARNED') {
      await updateTrustScore(userId, -2);
    }
  } catch (error) {
    console.error('Error logging moderation event:', error);
  }
}
