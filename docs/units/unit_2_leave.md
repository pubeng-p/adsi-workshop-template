# Unit 2: 休暇ドメイン

## 目的

休暇申請・承認/却下・有給付与・残日数管理を実装する。

## 前提

- Unit 0 が完了していること（Employee / 認証基盤が利用可能）

## ユーザーストーリー

- **US-6**: 休暇申請
- **US-7**: 休暇承認/却下
- **US-8**: 有給付与（管理者）

## スコープ

### Backend

- [ ] Flyway: V3__create_leave_requests.sql + V4__create_leave_balances.sql
- [ ] LeaveType enum / LeaveStatus enum
- [ ] LeaveRequest Entity
- [ ] LeaveBalance Entity
- [ ] LeaveRequestRepository / LeaveBalanceRepository
- [ ] LeaveService interface + 実装
  - requestLeave: 残日数チェック → 申請作成
  - approve: ステータス変更 + 残日数減算
  - reject: ステータス変更
  - grantLeave: 管理者による有給付与
  - getMyLeaves: 自分の申請一覧
  - getPendingLeaves: 申請中一覧（管理者用）
  - getBalance: 有給残日数取得
- [ ] LeaveController（/api/leaves/*）
- [ ] AdminLeaveController（/api/admin/leaves/*）
- [ ] テスト: Service（ビジネスルール）/ Controller / Repository

### Frontend

- [ ] 休暇申請画面（/leaves — 申請フォーム＋申請履歴）
- [ ] 管理者: 休暇承認画面（/admin/leaves — 申請中一覧＋承認/却下）
- [ ] 管理者: 有給付与画面（/admin/grant — 社員選択＋付与フォーム）
- [ ] テスト: 休暇申請フォームコンポーネント

## API エンドポイント

| Method | Path | 説明 |
|--------|------|------|
| POST | /api/leaves | 休暇申請 |
| GET | /api/leaves | 自分の申請一覧 |
| GET | /api/leaves/balance | 有給残日数 |
| GET | /api/admin/leaves/pending | 申請中一覧 |
| POST | /api/admin/leaves/{id}/approve | 承認 |
| POST | /api/admin/leaves/{id}/reject | 却下 |
| POST | /api/admin/leaves/balance/{employeeId}/grant | 有給付与 |

## テーブル

- leave_requests（V3）
- leave_balances（V4）

## ビジネスルール

- 有給残日数不足で PAID 申請不可（必要: 1.0日）
- 有給残日数不足で HALF_DAY 申請不可（必要: 0.5日）
- SICK は残日数チェックなし
- 承認時に有給残日数を減算（PAID: -1.0, HALF_DAY: -0.5）
- 却下時は残日数変更なし
- 有給付与は管理者ロールのみ

## 完了条件

- [ ] 休暇申請の正常系・異常系テストが全パス
- [ ] 承認で残日数が正しく減算される
- [ ] 残日数不足で申請がエラーになる
- [ ] 管理者が有給を付与できる
- [ ] SICK は残日数に影響しない
