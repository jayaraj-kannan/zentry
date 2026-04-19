import { describe, it, expect, vi, beforeEach } from 'vitest';
import { seedInitialData } from '../../firebase/stadiumService';
import * as firestore from 'firebase/firestore';

// Mock the firebase/firestore module
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  getDocs: vi.fn(),
  query: vi.fn(),
  limit: vi.fn()
}));

// Mock the firebaseConfig
vi.mock('../../firebase/firebaseConfig', () => ({
  db: {}
}));

describe('Stadium Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('seeds initial data correctly', async () => {
    const mockZones = [{ id: 1, name: 'Zone 1' }];
    const mockStalls = [{ id: 101, name: 'Stall 1' }];
    const mockParking = [{ id: 1, name: 'Parking 1' }];

    await seedInitialData(mockZones, mockStalls, mockParking);

    // Verify setDoc was called for each item
    expect(firestore.setDoc).toHaveBeenCalledTimes(3);
    expect(firestore.doc).toHaveBeenCalled();
  });
});
