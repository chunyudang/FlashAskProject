# MVP Scope

## Authentication
- **Phone number login**: SMS verification code; auto-registers on first login
- **No guest mode**: Not in MVP scope
- **No WeChat login**: Not in MVP scope
- Admin: separate username/password login with JWT

## Core Gameplay
- **5 categories × 5 levels = 25 levels total**
  - Categories: 科学 (Science), 社会 (Society), 逻辑 (Logic), 生活 (Life), 人文 (Humanities)
- **6 questions per level** (fixed, not configurable in MVP)
- **Pass condition**: ≥ 4 correct answers (≥ 60% accuracy)
- **Fail handling**: "Not passed" message, can retry immediately, no penalty or forced review
- **Linear unlocking**: Must pass previous level to unlock next; first level always open
- **No stamina/energy system**: Players can play unlimited times

## Scoring System
- **+100 points** per correct answer
- **+200 points** per level completion (pass bonus)
- No score deductions for wrong answers

## Excluded Features (MVP)
- No daily challenge
- No combo/streak system
- No sound effects
- No achievement system
- No leaderboard
- No daily check-in
- No per-question timer
- No power-ups (skip, eliminate, time-freeze)
- No ad integration
- No skin/theme store
- No wrong answer notebook
- No social sharing
- No user-submitted questions
- No battle/PvP mode
- No knowledge graph / weak point analysis

## Admin Features (MVP)
- Single "editor" role (all permissions)
- Question CRUD (with soft delete, filtering by category/level, keyword search)
- Category management (name, icon)
- Level management (order, name, question count config)
- User list view (nickname, phone, registration time, total score, level progress)
