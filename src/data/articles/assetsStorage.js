/**
 * 篇章六：数字资产管理、图床与安全架构 (assetsStorage.js)
 * 媒体资源学习指南：S3/R2/OSS 签名鉴权, WebP/AVIF 现代图片格式, 防盗链与 EXIF 隐私
 */

export const ASSETS_STORAGE_ARTICLES = {
  "assets/image-hosting-arch": `# 现代数字资产图床架构：S3 / R2 / OSS 签名与鉴权体系

> 图片是内容创作中最重、最具带宽成本的数字资产。本文详解基于对象存储的现代图床架构与零凭证泄露上传体系。

---

## 1. 传统服务端中转图床 vs 现代客户端直传架构

传统图床让用户先将图片上传到业务应用服务器，再由服务器转存到对象存储。该模式存在巨大弊端：
- **服务器带宽瞬间被撑爆**；
- **传输耗时翻倍**（用户 -> 服务器 -> S3）；
- **服务器内存溢出风险**。

![现代图床架构 · 客户端预签名直传 (Presigned Upload) 拓扑流](./assets/diagrams/s3-presigned-upload-flow.svg)

### 现代工业标准：预签名直传 (Presigned URL Upload)
\`\`\`mermaid
sequenceDiagram
    autonumber
    actor Creator as 创作者客户端 (Client)
    participant AuthAPI as 业务网关 / Serverless
    participant S3Bucket as AWS S3 / Cloudflare R2 / 阿里云 OSS

    Creator->>AuthAPI: 请求预签名上传凭证 (携带文件 SHA256 与文件大小)
    AuthAPI-->>Creator: 计算并签发短期有效的 Presigned URL (如 15 分钟失效)
    Creator->>S3Bucket: 直接通过 PUT / POST 请求上传图片二进制流
    S3Bucket-->>Creator: 返回 HTTP 200 与永久访问 CDN 链接
\`\`\`

---

## 2. 核心对象存储厂商配置对比

| 对象存储服务 | 核心优势 | 出站流量费 (Egress Fee) | 推荐典型场景 |
| :--- | :--- | :---: | :--- |
| **Cloudflare R2** | 100% 兼容 S3 协议、全网边缘加速 | **0 元（免出站流量费）** | 自媒体自建图床首选 |
| **AWS S3** | 工业界事实标准、99.999999999% 耐久度 | 相对高昂 | 全球化企业级大规模归档 |
| **阿里云 OSS** | 国内访问低延迟、完备的媒体处理服务 | 按量计费 | 面向国内微信公众号的专属加速 |
`,

  "assets/nextgen-image-formats": `# 下一代图片格式实战：WebP、AVIF 压缩与自适应加载

> 传统 JPEG 与 PNG 诞生于 30 年前，难以满足现代高画质、低延迟的移动端阅读需求。

---

## 1. 现代三大主流图片编码技术参数对比

| 特性维度 | JPEG (1992) | PNG (1996) | WebP (Google, 2010) | AVIF (AOMedia, 2019) |
| :--- | :--- | :--- | :--- | :--- |
| **压缩算法** | 离散余弦变换 (DCT) | Deflate (无损) | VP8 帧内预测编码 | AV1 视频关键帧编码 |
| **相同画质文件体积** | 100% (基准) | 120%~200% (极大) | **较 JPEG 减小 30%~40%** | **较 JPEG 减小 50%~65%** |
| **Alpha 透明通道** | 不支持 | 支持 | 完美支持 | 完美支持 |
| **动画支持** | 不支持 | APNG (支持有限) | 支持动图动画 | 支持动图动画 |
| **现代浏览器兼容度** | 100% | 100% | 98.5% (全主流支持) | 93.8% (现代浏览器支持) |

---

## 2. 渐进式回退加载标准规范 (\`<picture>\` 标签)

在现代 Web 技术出版中，应当利用 HTML5 的 \`<picture>\` 容器实现智能内容协商：
\`\`\`html
<picture>
  <!-- 优先加载超高压缩比的 AVIF 格式 -->
  <source srcset="image.avif" type="image/avif">
  <!-- 兼容加载现代通用的 WebP 格式 -->
  <source srcset="image.webp" type="image/webp">
  <!-- 终极兜底方案：传统 JPEG 格式 -->
  <img src="image.jpg" alt="技术架构图" loading="lazy" decoding="async">
</picture>
\`\`\`
`,

  "assets/cdn-and-security": `# 防盗链机制、CDN 边缘缓存与 EXIF 隐私擦除规范

> 在数字内容分发中，资产被外部恶意盗刷流量或照片泄露创作者真实家庭地理位置，是两大严重的安全与成本威胁。

---

## 1. 彻底防范隐私泄露：EXIF 元数据强制擦除

现代智能手机或微单拍摄的照片，通常包含 EXIF（Exchangeable Image File Format）敏感元数据：
- **GPS 经纬度坐标**：可精准定位创作者拍摄时的物理地址、楼层甚至房间；
- **拍摄设备序列号、镜头型号与时间戳**。

### 客户端在上传前必须执行本地擦除：
成熟的客户端必须在读取用户本地文件时，先绘制到 OffscreenCanvas，或使用元数据清洗工具**物理过滤掉所有的 GPS 与设备信息**，杜绝隐私在互联网上裸奔。

---

## 2. 现代 CDN 边缘缓存与防盗链治理

1. **HTTP Referer 鉴权白名单**：在 CDN 边缘节点验证请求头 \`Referer\`，只允许受信任的域名（如自身域名、微信后台 \`servicewechat.com\`）拉取图片；
2. **边缘智能图片转码 (Image Resizing)**：通过 CDN 参数（如 \`?x-oss-process=image/resize,w_800/format,webp\`），动态按终端屏幕尺寸下发最合适的分辨率，大幅节约传输带宽。
`
};
