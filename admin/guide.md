# 管理员指南

管理员 API 使用 JWT Bearer Token 认证，与用户 API Key 不同。

## 登录

```bash
curl -X POST http://localhost:8080/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "your-admin-password"}'
```

响应：

```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

后续请求在 Header 中携带：`Authorization: Bearer <token>`

---

## 用户管理

### 查看用户列表

```bash
curl http://localhost:8080/admin/users \
  -H "Authorization: Bearer <token>"
```

响应：

```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "name": "张三",
    "status": "pending",
    "created_at": "2026-05-29T10:00:00Z",
    "project": null
  }
]
```

用户状态：`pending`（待审批）、`active`（已激活）、`suspended`（已停用）

### 审批用户

审批后自动生成 API Key 并返回（**仅返回一次，请妥善保存**）：

```bash
curl -X PATCH http://localhost:8080/admin/users/{id}/approve \
  -H "Authorization: Bearer <token>"
```

响应：

```json
{ "api_key": "gw-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
```

### 停用用户

```bash
curl -X PATCH http://localhost:8080/admin/users/{id}/suspend \
  -H "Authorization: Bearer <token>"
```

---

## API Key 管理

### 撤销 API Key

```bash
curl -X DELETE http://localhost:8080/admin/keys/{id} \
  -H "Authorization: Bearer <token>"
```

---

## 配额管理

### 查看所有配额

```bash
curl http://localhost:8080/admin/quotas \
  -H "Authorization: Bearer <token>"
```

### 创建配额

`subject_type` 可为 `user` 或 `project`，`period` 可为 `daily` 或 `monthly`：

```bash
curl -X POST http://localhost:8080/admin/quotas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "subject_type": "user",
    "subject_id": "user-uuid",
    "limit_tokens": 1000000,
    "warning_threshold": 800000,
    "period": "monthly"
  }'
```

### 更新配额

```bash
curl -X PUT http://localhost:8080/admin/quotas/{id} \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"limit_tokens": 2000000, "warning_threshold": 1600000}'
```

---

## 用量查询

支持按 `user_id`、`project_id`、`period`（格式 `YYYY-MM`）过滤，返回按天聚合的 Token 消耗与费用：

```bash
curl "http://localhost:8080/admin/usage?user_id=uuid&period=2026-05" \
  -H "Authorization: Bearer <token>"
```

响应：

```json
[
  { "day": "2026-05-29T00:00:00Z", "tokens": 15234, "cost": 0.045702 }
]
```

---

## 配额预警记录

```bash
curl http://localhost:8080/admin/warnings \
  -H "Authorization: Bearer <token>"
```
