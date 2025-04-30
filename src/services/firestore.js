import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    getDocs,
    deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';

export const saveResume = async (userId, resumeData) => {
    try {
        // Create a clean copy of the data to ensure no undefined values
        const cleanResumeData = JSON.parse(JSON.stringify({
            ...resumeData,
            skills: resumeData.skills.filter(skill => skill !== ''), // Remove empty skills
            experience: resumeData.experience.map(exp => ({
                ...exp,
                startDate: exp.startDate || { month: '', year: '' },
                endDate: exp.endDate || { month: '', year: '' }
            })),
            education: resumeData.education,
            projects: resumeData.projects
        }));

        const userDoc = doc(db, 'users', userId);
        await setDoc(userDoc, {
            resume: cleanResumeData,
            updatedAt: new Date()
        }, { merge: true });
    } catch (error) {
        console.error('Error saving resume:', error);
        throw error;
    }
};

export const getResume = async (userId) => {
    try {
        const userDoc = doc(db, 'users', userId);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
            return docSnap.data().resume || null;
        }
        return null;
    } catch (error) {
        console.error('Error getting resume:', error);
        throw error;
    }
};

export const updateResume = async (userId, resumeData) => {
    try {
        const resumeRef = doc(db, 'resumes', userId);
        await updateDoc(resumeRef, {
            ...resumeData,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error updating resume:', error);
        throw error;
    }
};

export const savePreset = async (userId, section, preset) => {
    try {
        const presetsDoc = doc(db, 'users', userId, 'presets', section);
        const docSnap = await getDoc(presetsDoc);
        const existingPresets = docSnap.exists() ? docSnap.data().presets || [] : [];

        // Check if a preset with this name already exists
        const existingIndex = existingPresets.findIndex(p => p.name.toLowerCase() === preset.name.toLowerCase());

        let updatedPresets;
        if (existingIndex >= 0) {
            // Replace the existing preset
            updatedPresets = [...existingPresets];
            updatedPresets[existingIndex] = preset;
        } else {
            // Add new preset
            updatedPresets = [...existingPresets, preset];
        }

        await setDoc(presetsDoc, { presets: updatedPresets });
        return updatedPresets;
    } catch (error) {
        console.error('Error saving preset:', error);
        throw error;
    }
};

export const getPresets = async (userId, sectionKey) => {
    try {
        const presetRef = doc(db, 'users', userId, 'presets', sectionKey);
        const presetDoc = await getDoc(presetRef);

        if (presetDoc.exists()) {
            return presetDoc.data().presets;
        }
        return [];
    } catch (error) {
        console.error('Error getting presets:', error);
        throw error;
    }
};

export const getAllPresets = async (userId) => {
    try {
        const presetsCollection = collection(db, 'users', userId, 'presets');
        const snapshot = await getDocs(presetsCollection);

        const presets = {};
        snapshot.forEach(doc => {
            presets[doc.id] = doc.data().presets || [];
        });

        return presets;
    } catch (error) {
        console.error('Error getting presets:', error);
        throw error;
    }
};

export const deletePreset = async (userId, section, presetName) => {
    try {
        const presetsDoc = doc(db, 'users', userId, 'presets', section);
        const docSnap = await getDoc(presetsDoc);

        if (docSnap.exists()) {
            const existingPresets = docSnap.data().presets || [];
            const updatedPresets = existingPresets.filter(preset => preset.name !== presetName);

            if (updatedPresets.length === 0) {
                // If no presets left, delete the document
                await deleteDoc(presetsDoc);
            } else {
                // Update with remaining presets
                await setDoc(presetsDoc, { presets: updatedPresets });
            }
        }
    } catch (error) {
        console.error('Error deleting preset:', error);
        throw error;
    }
}; 