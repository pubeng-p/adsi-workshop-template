# DB 設計

## ER 図

```
┌──────────────────┐       ┌──────────────────────┐
│    employees     │       │     attendances      │
├──────────────────┤       ├──────────────────────┤
│ id (PK)          │──┐    │ id (PK)              │
│ login_id (UQ)    │  │    │ employee_id (FK)     │←─┐
│ password         │  │    │ date                 │   │
│ name             │  │    │ clock_in             │   │
│ role             │  │    │ clock_out            │   │
│ created_at       │  │    │ created_at           │   │
│ updated_at       │  │    │ updated_at           │   │
│ version          │  │    │ version              │   │
└──────────────────┘  │    └──────────────────────┘   │
                      │    UQ(employee_id, date)       │
                      │                               │
                      │    ┌──────────────────────┐   │
                      │    │   leave_requests     │   │
                      │    ├──────────────────────┤   │
                      │    │ id (PK)              │   │
                      ├───→│ employee_id (FK)     │   │
                      │    │ leave_type           │   │
                      │    │ date                 │   │
                      │    │ status               │   │
                      ├───→│ approved_by (FK)     │   │
                      │    │ created_at           │   │
                      │    │ updated_at           │   │
                      │    │ version              │   │
                      │    └──────────────────────┘   │
                      │                               │
                      │    ┌──────────────────────┐   │
                      │    │   leave_balances     │   │
                      │    ├──────────────────────┤   │
                      │    │ id (PK)              │   │
                      └───→│ employee_id (FK, UQ) │   │
                           │ remaining_days       │   │
                           │ version              │   │
                           └──────────────────────┘   │
                                                      │
                      employees.id ────────────────────┘
```

## テーブル定義

### employees

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| login_id | VARCHAR(50) | NOT NULL, UNIQUE | ログインID |
| password | VARCHAR(255) | NOT NULL | BCrypt ハッシュ |
| name | VARCHAR(100) | NOT NULL | 社員名 |
| role | VARCHAR(20) | NOT NULL | EMPLOYEE / ADMIN |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | |
| version | BIGINT | NOT NULL, DEFAULT 0 | 楽観ロック |

### attendances

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| employee_id | BIGINT | NOT NULL, FK → employees(id) | |
| date | DATE | NOT NULL | 勤務日 |
| clock_in | TIME | NOT NULL | 出勤時刻 |
| clock_out | TIME | NULL | 退勤時刻 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | |
| version | BIGINT | NOT NULL, DEFAULT 0 | 楽観ロック |

- UNIQUE(employee_id, date)

### leave_requests

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| employee_id | BIGINT | NOT NULL, FK → employees(id) | |
| leave_type | VARCHAR(20) | NOT NULL | PAID / HALF_DAY / SICK |
| date | DATE | NOT NULL | 休暇日 |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' | PENDING / APPROVED / REJECTED |
| approved_by | BIGINT | NULL, FK → employees(id) | 承認者 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | |
| version | BIGINT | NOT NULL, DEFAULT 0 | 楽観ロック |

### leave_balances

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| employee_id | BIGINT | NOT NULL, FK → employees(id), UNIQUE | |
| remaining_days | DECIMAL(4,1) | NOT NULL, DEFAULT 0.0 | 有給残日数 |
| version | BIGINT | NOT NULL, DEFAULT 0 | 楽観ロック |

## インデックス

| テーブル | インデックス | 用途 |
|---------|------------|------|
| attendances | idx_attendance_employee_date (employee_id, date) | 社員×日付検索 |
| leave_requests | idx_leave_request_employee (employee_id) | 社員別申請一覧 |
| leave_requests | idx_leave_request_status (status) | ステータス別一覧 |

## Flyway マイグレーション計画

| バージョン | 内容 |
|-----------|------|
| V1__create_employees.sql | employees テーブル作成 |
| V2__create_attendances.sql | attendances テーブル作成 |
| V3__create_leave_requests.sql | leave_requests テーブル作成 |
| V4__create_leave_balances.sql | leave_balances テーブル作成 |
| V5__insert_initial_data.sql | 管理者アカウント初期データ |
