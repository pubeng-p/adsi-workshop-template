# Unit 3: 管理者機能・CSV・統合

## 目的

CSV エクスポート機能の実装と、全 Unit を統合した E2E 動作確認。

## 前提

- Unit 1 + Unit 2 が完了していること

## ユーザーストーリー

- **US-10**: CSV エクスポート

## スコープ

### Backend

- [ ] ExportService interface + 実装
  - exportAttendances: 月別・社員別の CSV 生成
- [ ] AdminExportController（GET /api/admin/export/attendances）
- [ ] テスト: ExportService / Controller

### Frontend

- [ ] 管理者: CSV エクスポート画面（/admin/export — 月/社員選択＋ダウンロード）
- [ ] 管理者ダッシュボード（/admin — 未承認件数表示、各画面へのリンク）

### 統合

- [ ] 統合テスト（全 API エンドポイントの結合テスト）
- [ ] 月次集計に休暇データを含める（出勤日数 + 有給取得日数 + 病休日数）
- [ ] フロントエンド全画面の動作確認

## API エンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | /api/admin/export/attendances?year=&month=&employeeId= | CSV ダウンロード |

## CSV 出力仕様

```
社員名,日付,出勤時刻,退勤時刻
田中太郎,2026-07-01,09:00,18:05
田中太郎,2026-07-02,08:55,18:10
```

- ヘッダー行あり
- 文字コード: UTF-8（BOM 付き — Excel 対応）
- 退勤未打刻の場合は空文字

## 完了条件

- [ ] CSV が正しいフォーマットでダウンロードできる
- [ ] 全社員 / 個別社員の切り替えが機能する
- [ ] 統合テストが全パス
- [ ] 全画面が正常に動作する（ログイン → 打刻 → 履歴 → 休暇 → 管理者機能）
