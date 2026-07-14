# Unit 0: 共通基盤

## 目的

プロジェクト骨格の構築。テスト実行環境・認証・Employee ドメインを整え、
Unit 1 / Unit 2 が独立して TDD 開発を始められる状態にする。

## ユーザーストーリー

- **US-1**: ログイン（ID/パスワード認証、JWT 発行）

## スコープ

### Backend（Spring Boot）

- [ ] プロジェクト初期化（Spring Boot 3.x, Java 21, Gradle）
- [ ] 依存ライブラリ（Spring Web, Security, Data JPA, Flyway, H2, jjwt, JUnit 5, AssertJ, Mockito）
- [ ] パッケージ構成: `com.example.attendance.{employee,auth,common}`
- [ ] application.yml / application-test.yml（H2 テスト用）
- [ ] Flyway: V1__create_employees.sql + V5__insert_initial_data.sql
- [ ] Employee Entity + Role enum
- [ ] EmployeeRepository
- [ ] AuthService（ログイン認証 + JWT 発行）
- [ ] AuthController（POST /api/auth/login）
- [ ] SecurityFilterChain（JWT フィルター、パス認可設定）
- [ ] GlobalExceptionHandler（@RestControllerAdvice）
- [ ] AdminEmployeeController（GET /api/admin/employees）
- [ ] ArchUnit テスト（レイヤー違反検出）
- [ ] テスト: AuthService / AuthController / EmployeeRepository

### Frontend（Next.js）

- [ ] プロジェクト初期化（Next.js 14+, TypeScript, Tailwind CSS）
- [ ] ディレクトリ構成（App Router）
- [ ] API クライアント（fetch ラッパー + JWT 付与 + basePath 対応）
- [ ] 認証コンテキスト（ログイン状態管理、ルートガード）
- [ ] ログイン画面（/login）
- [ ] ナビゲーションコンポーネント（ロール別表示切替）
- [ ] テスト環境（Vitest + Testing Library）
- [ ] テスト: ログイン画面コンポーネント

## API エンドポイント

| Method | Path | 説明 |
|--------|------|------|
| POST | /api/auth/login | ログイン → JWT 返却 |
| GET | /api/admin/employees | 社員一覧（管理者用） |

## テーブル

- employees（V1）
- 初期データ: admin ユーザー（V5）

## 完了条件

- [ ] `./gradlew test` が全パス
- [ ] `npm test` が全パス
- [ ] POST /api/auth/login で JWT が取得できる
- [ ] JWT 付きリクエストで認証が通る
- [ ] JWT なしリクエストが 401 になる
- [ ] 管理者以外が /api/admin/* にアクセスすると 403 になる
