# Auralytics - API Documentation

This document provides detailed information about the APIs and interfaces used in the Auralytics.

## Table of Contents

1. [Authentication API](#authentication-api)
2. [Transcription API](#transcription-api)
3. [Storage API](#storage-api)
4. [AI Analysis API](#ai-analysis-api)
5. [Type Definitions](#type-definitions)

## Authentication API

The Authentication API provides methods for user authentication and session management.

### AuthContext

```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}
```

### Properties

#### isAuthenticated: boolean

Indicates whether a user is currently authenticated.

#### user: User | null

The currently authenticated user, or null if no user is authenticated.

#### loading: boolean

Indicates whether an authentication operation is in progress.

#### error: string | null

The error message from the last failed authentication operation, or null if no error occurred.

### Methods

#### login(email: string, password: string): Promise<void>

Authenticates a user with email and password.

**Parameters:**
- `email`: The user's email address
- `password`: The user's password

**Returns:**
- A Promise that resolves when authentication is successful

**Throws:**
- Error if authentication fails

**Example:**
```typescript
try {
  await auth.login('user@example.com', 'password123');
  // User is now authenticated
} catch (error) {
  // Handle authentication error
  console.error('Login failed:', error);
}
```

#### loginWithGoogle(): Promise<void>

Authenticates a user with Google (mock implementation).

**Returns:**
- A Promise that resolves when authentication is successful

**Throws:**
- Error if authentication fails

**Example:**
```typescript
try {
  await auth.loginWithGoogle();
  // User is now authenticated
} catch (error) {
  // Handle authentication error
  console.error('Google login failed:', error);
}
```

#### register(email: string, password: string, name: string): Promise<void>

Registers a new user.

**Parameters:**
- `email`: The user's email address
- `password`: The user's password
- `name`: The user's display name

**Returns:**
- A Promise that resolves when registration is successful

**Throws:**
- Error if registration fails

**Example:**
```typescript
try {
  await auth.register('user@example.com', 'password123', 'John Doe');
  // User is now registered and authenticated
} catch (error) {
  // Handle registration error
  console.error('Registration failed:', error);
}
```

#### logout(): void

Logs out the current user.

**Example:**
```typescript
auth.logout();
// User is now logged out
```

## Transcription API

The Transcription API provides methods for speech recognition and transcript management.

### TranscriptionService

```typescript
class TranscriptionService {
  public start(onUpdate: (segments: TranscriptionSegment[]) => void): void;
  public stop(): TranscriptionSegment[];
  public saveTranscript(title: string): Transcript;
}
```

### Methods

#### start(onUpdate: (segments: TranscriptionSegment[]) => void): void

Starts the speech recognition process.

**Parameters:**
- `onUpdate`: A callback function that is called when new transcription segments are available

**Example:**
```typescript
transcriptionService.start((segments) => {
  // Update UI with new segments
  setTranscriptSegments(segments);
});
```

#### stop(): TranscriptionSegment[]

Stops the speech recognition process.

**Returns:**
- An array of transcription segments

**Example:**
```typescript
const finalSegments = transcriptionService.stop();
// Use finalSegments for further processing
```

#### saveTranscript(title: string): Transcript

Saves the current transcript with the specified title.

**Parameters:**
- `title`: The title for the transcript

**Returns:**
- The saved transcript object

**Example:**
```typescript
const savedTranscript = transcriptionService.saveTranscript('Team Meeting');
// Use savedTranscript for further processing
```

## Storage API

The Storage API provides methods for saving and retrieving transcripts.

### StorageService

```typescript
class StorageService {
  public saveTranscript(transcript: Transcript): void;
  public getAllTranscripts(): Transcript[];
  public getTranscriptById(id: string): Transcript | null;
  public deleteTranscript(id: string): boolean;
  public updateTranscript(updatedTranscript: Transcript): boolean;
  public addMockTranscripts(): void;
}
```

### Methods

#### saveTranscript(transcript: Transcript): void

Saves a transcript to storage.

**Parameters:**
- `transcript`: The transcript to save

**Throws:**
- Error if saving fails

**Example:**
```typescript
try {
  storageService.saveTranscript(transcript);
  // Transcript saved successfully
} catch (error) {
  // Handle save error
  console.error('Error saving transcript:', error);
}
```

#### getAllTranscripts(): Transcript[]

Retrieves all transcripts from storage.

**Returns:**
- An array of transcripts

**Example:**
```typescript
const transcripts = storageService.getAllTranscripts();
// Use transcripts for display or processing
```

#### getTranscriptById(id: string): Transcript | null

Retrieves a transcript by its ID.

**Parameters:**
- `id`: The ID of the transcript to retrieve

**Returns:**
- The transcript with the specified ID, or null if not found

**Example:**
```typescript
const transcript = storageService.getTranscriptById('transcript-123');
if (transcript) {
  // Use transcript for display or processing
} else {
  // Handle transcript not found
}
```

#### deleteTranscript(id: string): boolean

Deletes a transcript by its ID.

**Parameters:**
- `id`: The ID of the transcript to delete

**Returns:**
- `true` if the transcript was deleted, `false` if not found

**Example:**
```typescript
const deleted = storageService.deleteTranscript('transcript-123');
if (deleted) {
  // Transcript deleted successfully
} else {
  // Transcript not found
}
```

#### updateTranscript(updatedTranscript: Transcript): boolean

Updates an existing transcript.

**Parameters:**
- `updatedTranscript`: The updated transcript

**Returns:**
- `true` if the transcript was updated, `false` if not found

**Example:**
```typescript
const updated = storageService.updateTranscript(transcript);
if (updated) {
  // Transcript updated successfully
} else {
  // Transcript not found
}
```

#### addMockTranscripts(): void

Adds mock transcripts to storage for testing purposes.

**Example:**
```typescript
storageService.addMockTranscripts();
// Mock transcripts added to storage
```

## AI Analysis API

The AI Analysis API provides methods for analyzing transcripts.

### AIService

```typescript
class AIService {
  public async summarize(transcript: Transcript): Promise<AIAnalysisResult>;
  public async extractKeyPoints(transcript: Transcript): Promise<AIAnalysisResult>;
  public async analyzeSentiment(transcript: Transcript): Promise<AIAnalysisResult>;
  public async identifyTopics(transcript: Transcript): Promise<AIAnalysisResult>;
}
```

### Methods

#### summarize(transcript: Transcript): Promise<AIAnalysisResult>

Generates a summary of the transcript.

**Parameters:**
- `transcript`: The transcript to summarize

**Returns:**
- A Promise that resolves to an AIAnalysisResult containing the summary

**Example:**
```typescript
try {
  const result = await aiService.summarize(transcript);
  // Use result.content for display
} catch (error) {
  // Handle error
  console.error('Error summarizing transcript:', error);
}
```

#### extractKeyPoints(transcript: Transcript): Promise<AIAnalysisResult>

Extracts key points from the transcript.

**Parameters:**
- `transcript`: The transcript to analyze

**Returns:**
- A Promise that resolves to an AIAnalysisResult containing the key points

**Example:**
```typescript
try {
  const result = await aiService.extractKeyPoints(transcript);
  // Use result.content for display
} catch (error) {
  // Handle error
  console.error('Error extracting key points:', error);
}
```

#### analyzeSentiment(transcript: Transcript): Promise<AIAnalysisResult>

Analyzes the sentiment of the transcript.

**Parameters:**
- `transcript`: The transcript to analyze

**Returns:**
- A Promise that resolves to an AIAnalysisResult containing the sentiment analysis

**Example:**
```typescript
try {
  const result = await aiService.analyzeSentiment(transcript);
  // Use result.content for display
  
  // The sentiment analysis typically includes:
  // - Overall sentiment score
  // - Per-speaker sentiment breakdown
  // - Emotional tone identification
  // - Key emotional moments in the transcript
} catch (error) {
  // Handle error
  console.error('Error analyzing sentiment:', error);
}
```

#### identifyTopics(transcript: Transcript): Promise<AIAnalysisResult>

Identifies topics in the transcript.

**Parameters:**
- `transcript`: The transcript to analyze

**Returns:**
- A Promise that resolves to an AIAnalysisResult containing the identified topics

**Example:**
```typescript
try {
  const result = await aiService.identifyTopics(transcript);
  // Use result.content for display
} catch (error) {
  // Handle error
  console.error('Error identifying topics:', error);
}
```

## Type Definitions

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
```

Represents a user account in the application.

**Properties:**
- `id`: Unique identifier for the user
- `name`: Display name of the user
- `email`: Email address of the user
- `avatar`: Optional URL to the user's profile image

### TranscriptionSegment

```typescript
interface TranscriptionSegment {
  id: string;
  speaker: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}
```

Represents a segment of a transcript, typically spoken by a single speaker.

**Properties:**
- `id`: Unique identifier for the segment
- `speaker`: Identifier for the speaker (e.g., "Speaker 1")
- `text`: The transcribed text for this segment
- `startTime`: The start time of the segment in milliseconds
- `endTime`: The end time of the segment in milliseconds
- `confidence`: A value between 0 and 1 indicating the confidence level of the transcription

### Transcript

```typescript
interface Transcript {
  id: string;
  title: string;
  segments: TranscriptionSegment[];
  createdAt: Date;
  duration: number;
}
```

Represents a complete transcript of a recording.

**Properties:**
- `id`: Unique identifier for the transcript
- `title`: User-provided title for the transcript
- `segments`: Array of transcription segments
- `createdAt`: Date when the transcript was created
- `duration`: Duration of the recording in milliseconds

### AIAnalysisResult

```typescript
interface AIAnalysisResult {
  type: 'summary' | 'keyPoints' | 'sentiment' | 'topics';
  content: string | string[] | Record<string, any>;
  timestamp: Date;
}
```

Represents the result of an AI analysis operation.

**Properties:**
- `type`: The type of analysis performed
- `content`: The analysis result, which can be a string, array of strings, or a complex object
- `timestamp`: When the analysis was performed

**Content by Type:**
- `summary`: A string containing the summary text
- `keyPoints`: An array of strings, each representing a key point
- `sentiment`: An object containing sentiment scores and analysis
- `topics`: An array of strings or an object with topic categories and items
