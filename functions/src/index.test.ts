
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import fft from 'firebase-functions-test';

// Initialize firebase-functions-test.
const test = fft({
  projectId: 'medimate-test-project',
}, 'service-account-key.json');


// Mocking the dependencies
jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

// Import the functions after mocking
import { generateSignedUploadUrl, verifyProvider, generateSignedDownloadUrl } from './index';

describe('Cloud Functions', () => {

  afterAll(() => {
    test.cleanup();
  });

  describe('generateSignedUploadUrl', () => {
    it('should throw an error if the caller is not authenticated', async () => {
      const wrapped = test.wrap(generateSignedUploadUrl);
      await expect(wrapped({}, {})).rejects.toThrow('You must be logged in to upload files.');
    });

    it('should throw an error if required data is missing', async () => {
        const wrapped = test.wrap(generateSignedUploadUrl);
        const context = { auth: { uid: 'testUser' }};
        await expect(wrapped({}, { auth: context.auth })).rejects.toThrow();
    });

    it('should return a signed URL and create a doc for a valid request', async () => {
        const wrapped = test.wrap(generateSignedUploadUrl);
        const data = { filename: 'test.pdf', contentType: 'application/pdf', docType: 'mdcn_license' };
        const context = { auth: { uid: 'testUser' }};
        const result = await wrapped(data, context);
        
        expect(result).toHaveProperty('uploadUrl');
        expect(result).toHaveProperty('storagePath');
        expect(result).toHaveProperty('docId');
        // In a real test, you'd also check Firestore to ensure the doc was created.
    });
  });

  describe('verifyProvider', () => {
    it('should throw an error if the caller is not an admin', async () => {
      const wrapped = test.wrap(verifyProvider);
      const context = { auth: { token: { role: 'patient' } } };
      await expect(wrapped({ uid: 'doctor1', action: 'approve' }, context)).rejects.toThrow('Only admins can perform this action.');
    });
    
    it('should approve a provider when called by an admin', async () => {
        const wrapped = test.wrap(verifyProvider);
        const data = { uid: 'doctor1', action: 'approve', note: 'Looks good' };
        const context = { auth: { uid: 'admin1', token: { role: 'admin' } } };

        // Mock admin SDK calls
        const setCustomUserClaimsMock = jest.fn().mockResolvedValue(true);
        const updateMock = jest.fn().mockResolvedValue(true);
        const setMock = jest.fn().mockResolvedValue(true);
        
        const firestoreMock = {
            collection: () => ({
                doc: () => ({
                    collection: () => ({
                        doc: () => ({
                            set: setMock
                        })
                    }),
                    update: updateMock,
                }),
            }),
            batch: () => ({
                update: updateMock,
                set: setMock,
                commit: jest.fn().mockResolvedValue(true)
            })
        };

        const authMock = {
            setCustomUserClaims: setCustomUserClaimsMock,
        };

        jest.spyOn(admin, 'firestore').mockReturnValue(firestoreMock as any);
        jest.spyOn(admin, 'auth').mockReturnValue(authMock as any);
        
        const result = await wrapped(data, context);
        expect(result.success).toBe(true);
        expect(result.newStatus).toBe('approved');
        // In a real test, you would assert that the mocked functions were called.
    });
  });

  describe('generateSignedDownloadUrl', () => {
      it('should throw an error for non-owner/non-admin', async () => {
        const wrapped = test.wrap(generateSignedDownloadUrl);
        const context = { auth: { uid: 'anotherUser', token: { role: 'patient' }}};
        await expect(wrapped({ storagePath: 'private/kyc/testUser/file.pdf', uid: 'testUser' }, context)).rejects.toThrow('You do not have permission to view this file.');
      });

      it('should return a URL for the owner', async () => {
        const wrapped = test.wrap(generateSignedDownloadUrl);
        const context = { auth: { uid: 'testUser' }};
        const result = await wrapped({ storagePath: 'private/kyc/testUser/file.pdf', uid: 'testUser' }, context);
        expect(result).toHaveProperty('downloadUrl');
      });

      it('should return a URL for an admin', async () => {
        const wrapped = test.wrap(generateSignedDownloadUrl);
        const context = { auth: { uid: 'adminUser', token: { role: 'admin' }}};
        const result = await wrapped({ storagePath: 'private/kyc/testUser/file.pdf', uid: 'testUser' }, context);
        expect(result).toHaveProperty('downloadUrl');
      });
  });

});
