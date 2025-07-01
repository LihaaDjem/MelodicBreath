class StorageService {
    constructor() {
        this.storageKey = 'melodicBreathMelodies';
    }

    async saveMelody(melody) {
        try {
            const existingMelodies = await this.getSavedMelodies();
            const updatedMelodies = [...existingMelodies, melody];
            
            localStorage.setItem(this.storageKey, JSON.stringify(updatedMelodies));
            return true;
        } catch (error) {
            console.error('Failed to save melody:', error);
            throw error;
        }
    }

    async getSavedMelodies() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to retrieve saved melodies:', error);
            return [];
        }
    }

    async deleteMelody(melodyId) {
        try {
            const melodies = await this.getSavedMelodies();
            const filteredMelodies = melodies.filter(m => m.id !== melodyId);
            
            localStorage.setItem(this.storageKey, JSON.stringify(filteredMelodies));
            return true;
        } catch (error) {
            console.error('Failed to delete melody:', error);
            throw error;
        }
    }

    async getMelody(melodyId) {
        try {
            const melodies = await this.getSavedMelodies();
            return melodies.find(m => m.id === melodyId) || null;
        } catch (error) {
            console.error('Failed to retrieve melody:', error);
            return null;
        }
    }

    async clearAllMelodies() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Failed to clear melodies:', error);
            throw error;
        }
    }

    async exportMelodies() {
        try {
            const melodies = await this.getSavedMelodies();
            const dataStr = JSON.stringify(melodies, null, 2);
            
            // Create downloadable file
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'melodic-breath-melodies.json';
            link.click();
            
            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error('Failed to export melodies:', error);
            throw error;
        }
    }

    async importMelodies(file) {
        try {
            const text = await file.text();
            const importedMelodies = JSON.parse(text);
            
            if (!Array.isArray(importedMelodies)) {
                throw new Error('Invalid file format');
            }

            const existingMelodies = await this.getSavedMelodies();
            const allMelodies = [...existingMelodies, ...importedMelodies];
            
            localStorage.setItem(this.storageKey, JSON.stringify(allMelodies));
            return importedMelodies.length;
        } catch (error) {
            console.error('Failed to import melodies:', error);
            throw error;
        }
    }
}

window.StorageService = new StorageService();
