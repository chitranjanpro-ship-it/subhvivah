import { Request, Response } from 'express';
import { prisma } from '../app';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';

const profileSchema = z.object({
  userType: z.enum([
    'BRIDE', 'GROOM', 'DIVORCED_BRIDE', 'DIVORCED_GROOM', 'WIDOW', 'WIDOWER',
    'PARENT', 'SIBLING', 'FRIEND', 'GUARDIAN', 'RELATIVE', 'MARRIAGE_BROKER'
  ]),
  name: z.string(),
  age: z.number().min(18),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  religion: z.string(),
  caste: z.string().optional(),
  height: z.number().optional(),
  location: z.string(),
  bio: z.string().optional(),
  education: z.string(),
  occupation: z.string(),
  company: z.string().optional(),
  income: z.number().optional(),
  familyBackground: z.string().optional(),
  parentsDetails: z.string().optional(),
  siblingsDetails: z.string().optional(),
  diet: z.string().optional(),
  smoking: z.boolean().optional(),
  drinking: z.boolean().optional(),
  prefAgeMin: z.number().optional(),
  prefAgeMax: z.number().optional(),
  prefLocation: z.string().optional(),
  prefEducation: z.string().optional(),
  prefLifestyle: z.string().optional(),
});

export const createProfile = async (req: AuthRequest, res: Response) => {
  try {
    const data = profileSchema.parse(req.body);
    const userId = req.user!.id;

    const profile = await prisma.profile.create({
      data: {
        ...data,
        userId
      }
    });

    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    console.error('Create profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = profileSchema.partial().parse(req.body);
    const userId = req.user!.id;

    const profile = await prisma.profile.findUnique({ where: { id } });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (profile.userId !== userId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedProfile = await prisma.profile.update({
      where: { id },
      data
    });

    res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        photos: { where: { isVerified: true } },
        user: { select: { email: true, isVerified: true } }
      }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchProfiles = async (req: Request, res: Response) => {
  try {
    const {
      gender, ageMin, ageMax, religion, location, education, userType
    } = req.query;

    const where: any = {
      status: 'VERIFIED'
    };

    if (gender) where.gender = gender;
    if (userType) where.userType = userType;
    if (religion) where.religion = religion;
    if (location) where.location = { contains: location as string, mode: 'insensitive' };
    if (ageMin || ageMax) {
      where.age = {
        gte: ageMin ? parseInt(ageMin as string) : undefined,
        lte: ageMax ? parseInt(ageMax as string) : undefined,
      };
    }

    const profiles = await prisma.profile.findMany({
      where,
      include: {
        photos: { where: { isMain: true } }
      },
      take: 20
    });

    res.status(200).json({ profiles });
  } catch (error) {
    console.error('Search profiles error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
