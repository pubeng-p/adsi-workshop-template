# ドメインモデル設計

## ドメイン概要図

```
┌─────────────────────────────────────────────────────────┐
│                    勤怠管理ドメイン                        │
├──────────────┬──────────────────┬────────────────────────┤
│  認証コンテキスト  │   打刻コンテキスト    │    休暇コンテキスト     │
│              │                  │                        │
│  Employee    │   Attendance     │    LeaveRequest        │
│  (認証/権限)  │   (出退勤記録)    │    (休暇申請)           │
│              │                  │    LeaveBalance        │
│              │                  │    (有給残日数)          │
└──────────────┴──────────────────┴────────────────────────┘
```

## Entity

### Employee（社員）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | Long | PK、自動採番 |
| loginId | String | ログインID（一意） |
| password | String | BCrypt ハッシュ |
| name | String | 社員名 |
| role | Role (enum) | EMPLOYEE / ADMIN |
| createdAt | LocalDateTime | 作成日時 |
| updatedAt | LocalDateTime | 更新日時 |
| version | Long | 楽観ロック |

### Attendance（勤怠記録）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | Long | PK、自動採番 |
| employeeId | Long | FK → Employee |
| date | LocalDate | 勤務日 |
| clockIn | LocalTime | 出勤時刻 |
| clockOut | LocalTime | 退勤時刻（nullable） |
| createdAt | LocalDateTime | 作成日時 |
| updatedAt | LocalDateTime | 更新日時 |
| version | Long | 楽観ロック |

- 制約: 同一 employeeId + date の組み合わせは一意

### LeaveRequest（休暇申請）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | Long | PK、自動採番 |
| employeeId | Long | FK → Employee |
| leaveType | LeaveType (enum) | PAID / HALF_DAY / SICK |
| date | LocalDate | 休暇日 |
| status | LeaveStatus (enum) | PENDING / APPROVED / REJECTED |
| approvedBy | Long | FK → Employee（承認者、nullable） |
| createdAt | LocalDateTime | 作成日時 |
| updatedAt | LocalDateTime | 更新日時 |
| version | Long | 楽観ロック |

### LeaveBalance（有給残日数）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | Long | PK、自動採番 |
| employeeId | Long | FK → Employee（一意） |
| remainingDays | BigDecimal | 有給残日数（0.5 刻み） |
| version | Long | 楽観ロック |

## Value Object

### Role（権限）

```java
public enum Role {
    EMPLOYEE, ADMIN
}
```

### LeaveType（休暇種類）

```java
public enum LeaveType {
    PAID,      // 有給休暇（1日消化）
    HALF_DAY,  // 半休（0.5日消化）
    SICK       // 病気休暇（残日数消化なし）
}
```

### LeaveStatus（申請ステータス）

```java
public enum LeaveStatus {
    PENDING,   // 申請中
    APPROVED,  // 承認済み
    REJECTED   // 却下
}
```

## Repository（interface）

| Repository | 主なメソッド |
|-----------|------------|
| EmployeeRepository | findByLoginId, findAll |
| AttendanceRepository | findByEmployeeIdAndDate, findByEmployeeIdAndDateBetween |
| LeaveRequestRepository | findByEmployeeId, findByStatus, findByEmployeeIdAndDate |
| LeaveBalanceRepository | findByEmployeeId |

## Service（interface）

| Service | 責務 |
|---------|------|
| AuthService | ログイン認証、トークン発行 |
| AttendanceService | 出勤/退勤打刻、履歴取得、月次集計 |
| LeaveService | 休暇申請、承認/却下、有給付与、残日数取得 |
| ExportService | CSV エクスポート |

## ビジネスルール

| ルール | 場所 |
|--------|------|
| 同日二重出勤打刻禁止 | AttendanceService |
| 出勤なしの退勤打刻禁止 | AttendanceService |
| 同日二重退勤打刻禁止 | AttendanceService |
| 有給残日数不足で申請不可（PAID: 1.0, HALF_DAY: 0.5） | LeaveService |
| 承認時に有給残日数を減算 | LeaveService |
| SICK は残日数チェックなし | LeaveService |
| 有給付与は管理者のみ | LeaveService |
