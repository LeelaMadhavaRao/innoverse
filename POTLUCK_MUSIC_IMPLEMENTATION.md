# Potluck Lunch Event - Background Music Implementation

## Overview
Added background music support for the Potluck Lunch Event poster launch, similar to the existing Innoverse event poster launch functionality.

## Changes Made

### 1. Created Dynamic Background Music Hook
- **File**: `frontend/src/hooks/use-dynamic-background-music.js`
- **Purpose**: Allows switching between different audio files dynamically
- **Features**:
  - Can switch audio sources without reloading the component
  - Maintains fade-in/fade-out functionality
  - Supports all the same controls as the original hook (play, pause, stop, volume control)

### 2. Updated Admin Poster Launch
- **File**: `frontend/src/pages/admin/poster-launch.jsx`
- **Changes**:
  - Integrated the new dynamic background music hook
  - Added logic to determine appropriate music file based on poster type:
    - Innoverse poster → `/innoverse.mp3`
    - Potluck poster → `/potluck.mp3`
  - Enhanced launch sequence to start appropriate music

### 3. Enhanced Poster Launch Display Component
- **File**: `frontend/src/components/poster-launch-display.jsx`
- **Changes**:
  - Added potluck poster data to mock data
  - Integrated dynamic music system
  - Added `musicFile` property to poster data structure
  - Updated music playing logic to use poster-specific audio

## Poster Configuration

### Potluck Lunch Event Poster Data
```javascript
{
  id: 'potluck-lunch-2025',
  title: 'Potluck Lunch Event',
  subtitle: 'Community Gathering',
  description: 'Join us for a delightful potluck lunch event bringing together our community',
  tagline: 'Share. Taste. Connect.',
  date: 'SEPTEMBER 16 2K25',
  organizer: 'STUDENT COMMUNITY',
  musicFile: '/potluck.mp3'
}
```

## Audio Files
- **Innoverse Event**: `/innoverse.mp3` (existing)
- **Potluck Event**: `/potluck.mp3` (confirmed to exist in `frontend/public/`)

## How It Works

1. **Admin launches a poster**: The system detects which poster is being launched
2. **Music selection**: Based on the poster ID, the appropriate music file is selected:
   - `innoverse-2025` → plays `innoverse.mp3`
   - `potluck-lunch-2025` → plays `potluck.mp3`
3. **Dynamic loading**: The music hook loads and plays the correct audio file
4. **Seamless experience**: Users get poster-specific background music that enhances the event atmosphere

## Features Supported
- ✅ Background music for Innoverse event
- ✅ Background music for Potluck lunch event  
- ✅ Automatic music selection based on poster type
- ✅ Fade-in/fade-out effects
- ✅ Volume controls
- ✅ Play/pause/stop functionality
- ✅ Music controls UI overlay
- ✅ Loop functionality for continuous playback

## Usage
When launching either the Innoverse or Potluck poster from the admin panel, the appropriate background music will automatically start playing to enhance the launch experience.
