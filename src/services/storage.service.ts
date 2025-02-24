import { Transcript } from './transcription.service';

// Service for storing and retrieving transcripts
export class StorageService {
  private readonly STORAGE_KEY = 'transcription_app_transcripts';
  
  // Save a transcript
  public saveTranscript(transcript: Transcript): void {
    try {
      // Get existing transcripts
      const transcripts = this.getAllTranscripts();
      
      // Add new transcript
      transcripts.push(transcript);
      
      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transcripts));
    } catch (error) {
      console.error('Error saving transcript:', error);
      throw new Error('Failed to save transcript');
    }
  }
  
  // Get all transcripts
  public getAllTranscripts(): Transcript[] {
    try {
      // Get from localStorage
      const transcriptsJson = localStorage.getItem(this.STORAGE_KEY);
      
      // Parse and return
      return transcriptsJson ? JSON.parse(transcriptsJson) : [];
    } catch (error) {
      console.error('Error getting transcripts:', error);
      return [];
    }
  }
  
  // Get a transcript by ID
  public getTranscriptById(id: string): Transcript | null {
    try {
      // Get all transcripts
      const transcripts = this.getAllTranscripts();
      
      // Find and return the transcript with the matching ID
      return transcripts.find(transcript => transcript.id === id) || null;
    } catch (error) {
      console.error('Error getting transcript by ID:', error);
      return null;
    }
  }
  
  // Delete a transcript
  public deleteTranscript(id: string): boolean {
    try {
      // Get all transcripts
      const transcripts = this.getAllTranscripts();
      
      // Filter out the transcript with the matching ID
      const updatedTranscripts = transcripts.filter(transcript => transcript.id !== id);
      
      // Save the updated list
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedTranscripts));
      
      // Return true if a transcript was removed
      return updatedTranscripts.length < transcripts.length;
    } catch (error) {
      console.error('Error deleting transcript:', error);
      return false;
    }
  }
  
  // Update a transcript
  public updateTranscript(updatedTranscript: Transcript): boolean {
    try {
      // Get all transcripts
      const transcripts = this.getAllTranscripts();
      
      // Find the index of the transcript to update
      const index = transcripts.findIndex(transcript => transcript.id === updatedTranscript.id);
      
      // If found, update it
      if (index !== -1) {
        transcripts[index] = updatedTranscript;
        
        // Save the updated list
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transcripts));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating transcript:', error);
      return false;
    }
  }
  
  // Add some mock transcripts for testing
  public addMockTranscripts(): void {
    // Only add mock data if no transcripts exist
    if (this.getAllTranscripts().length === 0) {
      const mockTranscripts: Transcript[] = [
        {
          id: 'transcript-1',
          title: 'Team Meeting',
          segments: [
            {
              id: 'segment-1',
              speaker: 'Speaker A',
              text: 'Good morning everyone. Let\'s start by discussing the project timeline.',
              startTime: 0,
              endTime: 5.2,
              confidence: 0.95
            },
            {
              id: 'segment-2',
              speaker: 'Speaker B',
              text: 'I think we need to extend the deadline by at least two weeks.',
              startTime: 5.5,
              endTime: 9.8,
              confidence: 0.92
            },
            {
              id: 'segment-3',
              speaker: 'Speaker A',
              text: 'That might be possible. What are the main blockers right now?',
              startTime: 10.2,
              endTime: 14.5,
              confidence: 0.88
            }
          ],
          createdAt: new Date('2025-02-22T10:30:00'),
          duration: 14.5
        },
        {
          id: 'transcript-2',
          title: 'Client Interview',
          segments: [
            {
              id: 'segment-1',
              speaker: 'Speaker A',
              text: 'Thank you for taking the time to speak with us today.',
              startTime: 0,
              endTime: 3.8,
              confidence: 0.96
            },
            {
              id: 'segment-2',
              speaker: 'Speaker B',
              text: 'Happy to be here. I\'m excited to learn more about your services.',
              startTime: 4.2,
              endTime: 8.5,
              confidence: 0.94
            },
            {
              id: 'segment-3',
              speaker: 'Speaker A',
              text: 'Great! Let\'s start by discussing your current challenges.',
              startTime: 9.0,
              endTime: 13.2,
              confidence: 0.91
            }
          ],
          createdAt: new Date('2025-02-20T14:15:00'),
          duration: 13.2
        },
        {
          id: 'transcript-3',
          title: 'Product Brainstorm',
          segments: [
            {
              id: 'segment-1',
              speaker: 'Speaker A',
              text: 'I think we should focus on improving the user onboarding experience.',
              startTime: 0,
              endTime: 4.5,
              confidence: 0.89
            },
            {
              id: 'segment-2',
              speaker: 'Speaker B',
              text: 'That\'s a good point. Our analytics show a 30% drop-off during onboarding.',
              startTime: 5.0,
              endTime: 10.2,
              confidence: 0.93
            },
            {
              id: 'segment-3',
              speaker: 'Speaker C',
              text: 'What if we simplified the form and added a progress indicator?',
              startTime: 10.8,
              endTime: 15.5,
              confidence: 0.87
            }
          ],
          createdAt: new Date('2025-02-18T11:00:00'),
          duration: 15.5
        }
      ];
      
      // Save mock transcripts
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mockTranscripts));
    }
  }
}

// Create a singleton instance
const storageService = new StorageService();
export default storageService;
