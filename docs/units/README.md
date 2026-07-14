# Unit of Work 分割

## 依存図

```
Phase A（共通基盤 — 1人で実施、他 Unit の前提）
┌─────────────────────────────────┐
│  Unit 0: 共通基盤               │
│  プロジェクト骨格・認証・Employee │
└──────────────┬──────────────────┘
               │ 依存
       ┌───────┴────────┐
       ▼                ▼
Phase B（2人で並列実装）
┌──────────────────┐  ┌──────────────────┐
│ Unit 1: 打刻     │  │ Unit 2: 休暇     │
│ 出退勤・履歴・集計 │  │ 申請・承認・付与   │
└──────────────────┘  └──────────────────┘
       │                │
       └───────┬────────┘
               ▼
Phase C（統合）
┌─────────────────────────────────┐
│  Unit 3: 管理者機能・CSV・統合   │
└─────────────────────────────────┘
```

## Phase 割り当て

| Phase | Unit | 担当 | 前提 |
|-------|------|------|------|
| A | Unit 0: 共通基盤 | 共同 | なし |
| B | Unit 1: 打刻ドメイン | 担当者 1 | Unit 0 |
| B | Unit 2: 休暇ドメイン | 担当者 2 | Unit 0 |
| C | Unit 3: 管理者・CSV・統合 | 共同 | Unit 1 + Unit 2 |

## 各 Unit 概要

| Unit | ユーザーストーリー | テーブル | API |
|------|------------------|---------|-----|
| Unit 0 | US-1 (ログイン) | employees | /auth/login, /admin/employees |
| Unit 1 | US-2, US-3, US-4, US-5, US-9 | attendances | /attendances/*, /admin/attendances, /attendances/summary |
| Unit 2 | US-6, US-7, US-8 | leave_requests, leave_balances | /leaves/*, /admin/leaves/* |
| Unit 3 | US-10 | （なし） | /admin/export/attendances |

## 並列実装の前提条件

Unit 1 と Unit 2 が並列実装できる理由：
- テーブルが独立している（attendances ↔ leave_requests/leave_balances は FK 関係なし）
- 共有するのは Employee Entity のみ（Unit 0 で定義済み）
- Service interface が独立している（AttendanceService ↔ LeaveService）
