# Potluck Music Test Instructions - UPDATED

## Testing the Potluck Music Feature

### Steps to Test:

1. **Start the application**:
   - Frontend is running at http://localhost:5173/
   - Make sure backend is also running

2. **Navigate to Admin Poster Launch**:
   - Go to `/admin/poster-launch` 
   - You should see both Innoverse and Potluck Lunch Event cards

3. **Test Potluck Music Flow**:
   
   **Step 1: Click on Potluck Lunch Event Card**
   - Click on the "Potluck Lunch Event" card
   - This should show the blurred poster view with a launch button
   - No music should play yet
   
   **Step 2: Click the Launch Button**
   - Click the "🚀 Launch Poster" (or "👁️ Preview Poster" if already launched) button
   - **Music should start playing (`potluck.mp3`) immediately**
   - You should see launch animations and effects
   - The poster will go through phases: launching → curtains → display
   
   **Step 3: Click "Save & Continue" Button** 
   - After the poster display appears, look for the green button at the bottom
   - Click "✨ Save & Continue" (or "✨ Close Preview & Continue")
   - **Music should stop immediately**
   - Should return to selection view

### Expected Browser Console Logs:

When testing, you should see these logs in the browser developer console:

**When clicking the poster card:**
```
🎯 Selecting poster: [poster object]
📱 Phase changed to blur
```

**When clicking Launch/Preview button:**
```
🚀 Launch button clicked, current phase: blur
📝 Selected poster: [poster object]
✅ Starting launch sequence...
🍽️ Potluck event detected, using potluck.mp3
🎵 Starting music for Potluck Lunch Event with file: /potluck.mp3
🎵 Background music command sent for Potluck Lunch Event with /potluck.mp3 [preview/launch]
```

**When clicking Save & Continue:**
```
✨ User clicked Save & Continue button
🎵 Current music state - isPlaying: true, currentSource: /potluck.mp3
🎵 Background music stopped on Save & Continue button click
📱 Phase changed to success
```

### Expected Behavior:

- ✅ Music starts only when "Launch Poster" button is clicked
- ✅ `potluck.mp3` plays for Potluck Lunch Event  
- ✅ `innoverse.mp3` plays for Innoverse Event
- ✅ Music stops when "Save & Continue" is clicked
- ✅ Music controls are visible during playback
- ✅ Volume can be adjusted during playback

### Files Involved:

- **Music File**: `frontend/public/potluck.mp3` ✅ (confirmed exists)
- **Main Component**: `frontend/src/pages/admin/poster-launch.jsx`
- **Music Hook**: `frontend/src/hooks/use-dynamic-background-music.js`

### Troubleshooting:

**If Music Doesn't Start:**
1. Check browser console for error messages
2. Verify `potluck.mp3` exists in `frontend/public/` folder
3. Check browser's audio permissions (some browsers block autoplay)
4. Try clicking somewhere on the page first to enable audio context
5. Check if volume is not muted in browser/system
6. Try with different browsers (Chrome/Firefox/Edge)

**If Music Doesn't Stop:**
1. Check console logs for "Save & Continue" button click
2. Verify the button text matches "✨ Save & Continue" or "✨ Close Preview & Continue"
3. Check if there are any JavaScript errors preventing the stop command

**Audio File Issues:**
- File path: `/potluck.mp3` (served from `frontend/public/potluck.mp3`)
- Make sure the file is not corrupted
- Try replacing with a different MP3 file for testing

### Quick Test Alternative:

If you want to test just the music functionality:
1. Open browser developer console
2. Go to the poster launch page
3. Click on Potluck card
4. Watch the console logs when clicking launch button
5. Verify music starts and audio file loads
6. Click Save & Continue and verify music stops
