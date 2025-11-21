# 🎭 Role Configuration Guide

## ✨ New Feature: Customizable Roles!

You can now customize how many of each role to include in your game!

---

## 📊 How It Works

### Setup Screen - Role Configuration

```
┌─────────────────────────────────────┐
│  Configure Roles                    │
├─────────────────────────────────────┤
│                                     │
│  👥 Civilians              3        │
│     Find the infiltrators           │
│                                     │
│  🎯 Undercover         [−] 2 [+]   │
│     Blend in and survive            │
│                                     │
│  👻 Mr. White          [−] 1 [+]   │
│     No word, pure skill             │
│                                     │
│  ────────────────────────────────   │
│  Total Players:         6 / 6  ✓   │
└─────────────────────────────────────┘
```

---

## 🎮 Configuration Rules

### 1. **Minimum Requirements**
- ✅ At least **1 Civilian** required
- ✅ Total must equal selected player count
- ⚠️ Cannot have 0 civilians

### 2. **Balanced Recommendations**

#### 3 Players:
- 2 Civilians, 1 Undercover, 0 Mr. White
- OR 2 Civilians, 0 Undercover, 1 Mr. White

#### 4-5 Players:
- 3 Civilians, 1 Undercover, 1 Mr. White (Default)
- OR 2 Civilians, 2 Undercover, 0 Mr. White

#### 6-7 Players:
- 4-5 Civilians, 1-2 Undercover, 1 Mr. White
- OR 4 Civilians, 2 Undercover, 1 Mr. White

#### 8-10 Players:
- 6-7 Civilians, 2 Undercover, 1-2 Mr. White
- OR 5-6 Civilians, 2-3 Undercover, 1 Mr. White

---

## 🎯 Victory Conditions (Updated)

### Civilians Win:
- ✅ ALL infiltrators (Undercover + Mr. White) are eliminated

### Infiltrators Win:
- ✅ All civilians are eliminated
- ✅ Infiltrators equal or outnumber civilians
- ✅ Mr. White guesses civilian word correctly (when eliminated)

---

## 💡 Strategic Considerations

### More Undercover Agents:
- **Pros**: Easier for infiltrators to coordinate
- **Cons**: More suspicious players for civilians to track
- **Gameplay**: More chaotic, harder for civilians

### More Mr. Whites:
- **Pros**: More bluffing opportunities
- **Cons**: Higher risk of being caught
- **Gameplay**: More psychological warfare

### More Civilians:
- **Pros**: Easier for civilians to win
- **Cons**: Infiltrators have more targets
- **Gameplay**: More traditional deduction game

---

## 🎨 UI Features

### Simple +/- Buttons
- Tap **[−]** to decrease count
- Tap **[+]** to increase count
- **Auto-disabled** when limits reached

### Visual Feedback
- **Green total** = Valid configuration ✓
- **Red total** = Invalid configuration ✗
- **Real-time civilian count** updates automatically

### Color Coding
- 🔵 **Blue** = Civilians
- 🔴 **Red** = Undercover
- ⚪ **Gray** = Mr. White

---

## 📋 Examples

### Example 1: Classic (5 players)
```
Civilians:   3
Undercover:  1
Mr. White:   1
Total:       5 ✓
```

### Example 2: Infiltrator Heavy (6 players)
```
Civilians:   2
Undercover:  3
Mr. White:   1
Total:       6 ✓
```

### Example 3: Multiple Mr. Whites (7 players)
```
Civilians:   4
Undercover:  1
Mr. White:   2
Total:       7 ✓
```

### Example 4: Chaos Mode (8 players)
```
Civilians:   3
Undercover:  3
Mr. White:   2
Total:       8 ✓
```

---

## ⚠️ Important Notes

1. **At least 1 civilian required**
   - Game won't start without civilians
   - Warning shown if civilian count = 0

2. **Automatic adjustment**
   - Changing player count auto-adjusts if needed
   - Maintains at least 1 civilian

3. **Victory conditions scale**
   - More infiltrators = harder for civilians
   - Game auto-detects when infiltrators win

4. **Mr. White guessing**
   - Each Mr. White gets a guess when eliminated
   - Any correct guess = Infiltrators win

---

## 🎯 Recommended Configurations

### Beginner Friendly
```
5 players: 3 Civilians, 1 Undercover, 1 Mr. White
```

### Balanced
```
6 players: 3 Civilians, 2 Undercover, 1 Mr. White
```

### Advanced
```
7 players: 3 Civilians, 2 Undercover, 2 Mr. White
```

### Expert / Chaos
```
8 players: 3 Civilians, 3 Undercover, 2 Mr. White
```

---

## 🚀 How to Use

1. **Select player count** (3-10)
2. **Adjust roles** using +/- buttons
3. **Check total** is valid (green ✓)
4. **Start game** when ready

---

## 🎮 Gameplay Impact

### More Infiltrators = 
- 🔺 Harder for civilians
- 🔻 Easier for infiltrators  
- 🎭 More chaos and misdirection
- ⚡ Faster games

### Fewer Infiltrators =
- 🔻 Easier for civilians
- 🔺 Harder for infiltrators
- 🎯 More focused deduction
- 🕐 Longer games

---

## 🐛 Troubleshooting

**Can't increase infiltrators?**
- Need at least 1 civilian remaining
- Total can't exceed player count

**Start button disabled?**
- Check civilian count ≥ 1
- Verify total equals player count

**Victory too easy/hard?**
- Adjust role balance
- More infiltrators = harder for civilians
- Fewer infiltrators = easier for civilians

---

**Enjoy experimenting with different configurations!** 🎉

*Find your perfect balance and create unique gameplay experiences!*

