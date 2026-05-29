import{_ as a,H as n,f as t,i as e}from"./chunks/framework.BrbjhDn-.js";const k=JSON.parse('{"title":"架构总览","description":"","frontmatter":{},"headers":[],"relativePath":"architecture/overview.md","filePath":"architecture/overview.md"}'),i={name:"architecture/overview.md"};function p(d,s,l,r,h,c){return n(),t("div",null,[...s[0]||(s[0]=[e(`<h1 id="架构总览" tabindex="-1">架构总览 <a class="header-anchor" href="#架构总览" aria-label="Permalink to &quot;架构总览&quot;">​</a></h1><h2 id="系统架构" tabindex="-1">系统架构 <a class="header-anchor" href="#系统架构" aria-label="Permalink to &quot;系统架构&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>客户端</span></span>
<span class="line"><span>  │</span></span>
<span class="line"><span>  ▼</span></span>
<span class="line"><span>┌─────────────────────────────────────────┐</span></span>
<span class="line"><span>│              gllm-gateway               │</span></span>
<span class="line"><span>│                                         │</span></span>
<span class="line"><span>│  ┌──────────┐    ┌────────────────────┐ │</span></span>
<span class="line"><span>│  │ 用户 API  │    │    管理员 API       │ │</span></span>
<span class="line"><span>│  │ /v1/*    │    │    /admin/*        │ │</span></span>
<span class="line"><span>│  └────┬─────┘    └────────┬───────────┘ │</span></span>
<span class="line"><span>│       │ API Key 认证       │ JWT 认证    │</span></span>
<span class="line"><span>│       ▼                   ▼             │</span></span>
<span class="line"><span>│  ┌──────────┐    ┌────────────────────┐ │</span></span>
<span class="line"><span>│  │ 配额检查  │    │   用户/Key/配额管理  │ │</span></span>
<span class="line"><span>│  │ (Redis)  │    │                    │ │</span></span>
<span class="line"><span>│  └────┬─────┘    └────────────────────┘ │</span></span>
<span class="line"><span>│       │                                 │</span></span>
<span class="line"><span>│       ▼                                 │</span></span>
<span class="line"><span>│  ┌──────────────────────┐               │</span></span>
<span class="line"><span>│  │      代理路由         │               │</span></span>
<span class="line"><span>│  │  claude* → Anthropic │               │</span></span>
<span class="line"><span>│  │  其他   → OpenAI     │               │</span></span>
<span class="line"><span>│  └────┬─────────────────┘               │</span></span>
<span class="line"><span>│       │ 用量记录 (PostgreSQL)            │</span></span>
<span class="line"><span>└───────┼─────────────────────────────────┘</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ├──► OpenAI API</span></span>
<span class="line"><span>        └──► Anthropic API</span></span></code></pre></div><h2 id="数据流" tabindex="-1">数据流 <a class="header-anchor" href="#数据流" aria-label="Permalink to &quot;数据流&quot;">​</a></h2><ol><li>客户端携带 <code>Authorization: Bearer &lt;api-key&gt;</code> 发起请求</li><li><code>auth.Middleware</code> 从数据库查询 API Key 哈希，验证有效性，提取 <code>user_id</code></li><li><code>quota.Enforcer</code> 从 Redis 读取当前周期 Token 消耗，判断是否超限</li><li><code>proxy.Router</code> 根据 <code>model</code> 字段前缀选择提供商，转发请求</li><li>响应返回客户端后，<code>usage.Recorder</code> 异步将 Token 消耗写入 PostgreSQL</li></ol><h2 id="模块说明" tabindex="-1">模块说明 <a class="header-anchor" href="#模块说明" aria-label="Permalink to &quot;模块说明&quot;">​</a></h2><table tabindex="0"><thead><tr><th>模块</th><th>路径</th><th>职责</th></tr></thead><tbody><tr><td><code>proxy</code></td><td><code>internal/proxy/</code></td><td>请求路由与转发，支持 OpenAI 和 Anthropic</td></tr><tr><td><code>auth</code></td><td><code>internal/auth/</code></td><td>API Key 中间件（用户）+ JWT 签发/验证（管理员）</td></tr><tr><td><code>quota</code></td><td><code>internal/quota/</code></td><td>Redis 计数器 + 配额检查，超限返回 429</td></tr><tr><td><code>usage</code></td><td><code>internal/usage/</code></td><td>将 Token 消耗与费用写入 PostgreSQL</td></tr><tr><td><code>admin</code></td><td><code>internal/admin/</code></td><td>用户管理、Key 管理、配额管理、用量查询 API</td></tr><tr><td><code>config</code></td><td><code>internal/config/</code></td><td>从 <code>config.yaml</code> 加载服务配置</td></tr><tr><td><code>db</code></td><td><code>internal/db/</code></td><td>PostgreSQL 连接池 + SQL 迁移</td></tr></tbody></table><h2 id="数据库设计" tabindex="-1">数据库设计 <a class="header-anchor" href="#数据库设计" aria-label="Permalink to &quot;数据库设计&quot;">​</a></h2><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 管理员账号</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">admins (id, email, password_hash, created_at)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 项目（用于按项目聚合配额）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">projects (id, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, created_at)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 用户（status: pending | active | suspended）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">users (id, email, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">status</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, project_id, created_at)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- API Key（存储哈希值，明文仅在审批时返回一次）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">api_keys (id, key_hash, user_id, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">status</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, created_at)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- status: active | revoked</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 配额规则（按用户或项目，按日或月）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">quotas (id, subject_type, subject_id, limit_tokens, warning_threshold, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">period</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- subject_type: user | project</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- period: daily | monthly</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 用量记录（按请求粒度）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">usage_records (id, user_id, project_id, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">provider</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, model,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">               input_tokens, output_tokens, cost_usd, created_at)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 配额预警记录（防止重复通知）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">quota_warnings (id, subject_type, subject_id, period_key, notified_at)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- LLM 提供商配置（API Key 加密存储）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">llm_providers (id, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, base_url, api_key_encrypted)</span></span></code></pre></div><h2 id="认证机制" tabindex="-1">认证机制 <a class="header-anchor" href="#认证机制" aria-label="Permalink to &quot;认证机制&quot;">​</a></h2><table tabindex="0"><thead><tr><th>场景</th><th>认证方式</th><th>Header</th></tr></thead><tbody><tr><td>用户调用 LLM API</td><td>API Key</td><td><code>Authorization: Bearer gw-xxx</code></td></tr><tr><td>管理员操作后台</td><td>JWT（HS256）</td><td><code>Authorization: Bearer eyJ...</code></td></tr></tbody></table><p>API Key 以 <code>gw-</code> 前缀开头，存储时只保存 SHA-256 哈希值，明文仅在用户审批时返回一次。</p><h2 id="技术栈" tabindex="-1">技术栈 <a class="header-anchor" href="#技术栈" aria-label="Permalink to &quot;技术栈&quot;">​</a></h2><table tabindex="0"><thead><tr><th>组件</th><th>选型</th></tr></thead><tbody><tr><td>HTTP 框架</td><td>go-chi/chi v5</td></tr><tr><td>数据库</td><td>PostgreSQL 14+（jackc/pgx v5）</td></tr><tr><td>缓存/计数</td><td>Redis 6+（go-redis v9）</td></tr><tr><td>认证</td><td>golang-jwt/jwt v5</td></tr><tr><td>密码哈希</td><td>bcrypt（golang.org/x/crypto）</td></tr><tr><td>配置</td><td>YAML（gopkg.in/yaml.v3）</td></tr></tbody></table>`,14)])])}const g=a(i,[["render",p]]);export{k as __pageData,g as default};
