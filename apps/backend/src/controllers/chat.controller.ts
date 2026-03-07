import { Request, Response } from 'express';
import { prisma } from '../app';
import { AuthRequest } from '../middlewares/auth.middleware';
import { analyzeChat } from '../services/ai.service';

export const createChat = async (req: AuthRequest, res: Response) => {
  try {
    const { participantId } = req.body;
    const userId = req.user!.id;

    // Check if chat already exists between these users
    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: participantId } } }
        ]
      }
    });

    if (existingChat) {
      return res.status(200).json({ chat: existingChat });
    }

    const chat = await prisma.chat.create({
      data: {
        participants: {
          create: [
            { userId },
            { userId: participantId }
          ]
        }
      }
    });

    res.status(201).json({ chat });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId, content } = req.body;
    const senderId = req.user!.id;

    // AI Moderation
    const moderationResult = await analyzeChat(content);
    if (!moderationResult.is_safe) {
      // Log risk and warn or block
      await prisma.activityLog.create({
        data: {
          userId: senderId,
          action: 'CHAT_RISK_DETECTED',
          details: JSON.stringify({ chatId, content, flags: moderationResult.flags })
        }
      });
      return res.status(400).json({
        message: 'Message flagged by AI safety monitoring. Please follow community guidelines.',
        flags: moderationResult.flags
      });
    }

    const message = await prisma.message.create({
      data: {
        chatId,
        senderId,
        content
      }
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getChats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const chats = await prisma.chat.findMany({
      where: {
        participants: { some: { userId } }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profiles: {
                  select: { name: true, photos: { where: { isMain: true } } }
                }
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    res.status(200).json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, email: true }
        }
      }
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
