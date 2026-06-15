# Test Scenarios for Prototype Link Generator

Use these test scenarios to verify the plugin works correctly in different situations.

## Test Setup
1. Create a new Figma file
2. Install the plugin following the README instructions
3. Open the plugin from the plugins menu

## Test Cases

### 1. Happy Path - Direct Frame Selection
**Setup**: Create 3-5 frames in your Figma file
**Steps**:
1. Select all frames
2. Click "Generate Links"
3. Verify links appear in textarea
4. Click "Copy All"
5. Paste in text editor to verify links work

**Expected**: All frames generate valid prototype links

### 2. No Selection
**Setup**: No frames selected
**Steps**:
1. Ensure no frames are selected
2. Click "Generate Links"

**Expected**: Shows "No frames selected. Please select one or more frames."

### 3. Non-Frame Selection (with parent frame)
**Setup**: Create a frame with text/shape elements inside
**Steps**:
1. Select text or shape elements (not the frame)
2. Click "Generate Links"

**Expected**: Plugin finds parent frame and generates link

### 4. Non-Frame Selection (no parent frame)
**Setup**: Create text/shape elements not inside any frame
**Steps**:
1. Select text/shape elements outside frames
2. Click "Generate Links"

**Expected**: Shows "Only frames are supported. Please reselect."

### 5. Duplicate Selection
**Setup**: Create 2 frames
**Steps**:
1. Select both frames
2. Select one frame again (total 3 selections, 1 duplicate)
3. Click "Generate Links"

**Expected**: Only 2 unique links generated (duplicate removed)

### 6. Mixed Selection
**Setup**: Create frames with nested elements
**Steps**:
1. Select mix of frames and nested elements
2. Click "Generate Links"

**Expected**: All parent frames generate links, duplicates removed

### 7. Large Selection
**Setup**: Create 20+ frames
**Steps**:
1. Select all frames
2. Click "Generate Links"

**Expected**: All links generate, textarea scrolls properly

### 8. Clear/Retry Functionality
**Setup**: Generate some links first
**Steps**:
1. Generate links for some frames
2. Click "Clear"
3. Select different frames
4. Click "Generate Links"

**Expected**: Old links cleared, new links generated

### 9. Copy Functionality
**Setup**: Generate some links
**Steps**:
1. Generate links
2. Click "Copy All"
3. Paste in text editor

**Expected**: All links copied correctly

### 10. Copy Fallback (if clipboard fails)
**Setup**: Generate some links
**Steps**:
1. Generate links
2. Click "Copy All" (if clipboard API fails)

**Expected**: Text selected in textarea, user can manually copy

### 11. UI State Management
**Steps**:
1. Verify buttons are disabled when no links
2. Generate links, verify buttons enabled
3. Click "Clear", verify buttons disabled again

**Expected**: UI state updates correctly

### 12. Error Recovery
**Steps**:
1. Try invalid selection, get error
2. Select valid frames
3. Generate links

**Expected**: Error clears, new links generate successfully

## Link Format Verification

Each generated link should:
- Start with `https://www.figma.com/proto/`
- Contain the file key
- Have `scaling=contain` parameter
- Have matching `node-id` and `starting-point-node-id`
- Be clickable and open the correct prototype view

Example format:
```
https://www.figma.com/proto/ABC123?node-id=1-2&scaling=contain&starting-point-node-id=1-2
```

## Performance Testing

### Large Selection Test
1. Create 100+ frames
2. Select all
3. Generate links
4. Verify performance is acceptable (< 5 seconds)

### Memory Test
1. Generate links multiple times
2. Clear and regenerate
3. Verify no memory leaks or UI issues

## Browser Compatibility

Test in different browsers if possible:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Edge Cases

### Empty File
- Test with completely empty Figma file
- Expected: Appropriate error message

### Single Frame
- Test with only one frame
- Expected: Single link generated

### Nested Frames
- Test with frames inside frames
- Expected: Both frames generate links

### Special Characters in Frame Names
- Test with frames containing special characters
- Expected: Links still generate correctly
