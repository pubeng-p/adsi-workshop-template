# Unit 1: 打刻ドメイン

## 目的

出退勤打刻・勤怠履歴閲覧・月次集計を実装する。

## 前提

- Unit 0 が完了していること（Employee / 認証基盤が利用可能）

## ユーザーストーリー

- **US-2**: 出勤打刻
- **US-3**: 退勤打刻
- **US-4**: 自分の勤怠履歴閲覧
- **US-5**: 管理者による全社員の勤怠閲覧
- **US-9**: 月次勤怠集計（グラフ表示）

## スコープ

### Backend

- [ ] Flyway: V2__create_attendances.sql
- [ ] Attendance Entity
- [ ] AttendanceRepository
- [ ] AttendanceService interface + 実装
  - clockIn: 二重打刻チェック → 出勤記録
  - clockOut: 出勤未打刻チェック → 退勤記録
  - getMyAttendances: 月別一覧
  - getEmployeeAttendances: 管理者用
  - getMonthlySummary: 月次集計
- [ ] AttendanceController（/api/attendances/*）
- [ ] AdminAttendanceController（/api/admin/attendances）
- [ ] テスト: Service（ビジネスルール）/ Controller / Repository

### Frontend

- [ ] 打刻画面（/ — 出勤/退勤ボタン、本日の状態表示）
- [ ] 勤怠履歴画面（/history — 月別テーブル）
- [ ] 月次集計画面（/summary — グラフ表示）
- [ ] 管理者: 社員勤怠閲覧画面（/admin/attendances — 社員選択＋履歴）
- [ ] テスト: 打刻画面コンポーネント

## API エンドポイント

| Method | Path | 説明 |
|--------|------|------|
| POST | /api/attendances/clock-in | 出勤打刻 |
| POST | /api/attendances/clock-out | 退勤打刻 |
| GET | /api/attendances/today | 本日の打刻状態 |
| GET | /api/attendances?year=&month= | 自分の月別履歴 |
| GET | /api/attendances/summary?year=&month= | 月次集計 |
| GET | /api/admin/attendances?employeeId=&year=&month= | 管理者用 |

## テーブル

- attendances（V2）

## ビジネスルール

- 同日二重出勤打刻禁止
- 出勤なしの退勤打刻禁止
- 同日二重退勤打刻禁止
- 1日1レコード（分割勤務なし）

## 完了条件

- [ ] 打刻の正常系・異常系テストが全パス
- [ ] 履歴が月別で取得できる
- [ ] 月次集計（出勤日数・欠勤日数）が正しく計算される
- [ ] 管理者が任意社員の履歴を閲覧できる
