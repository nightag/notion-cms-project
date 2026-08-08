# 개인 개발 블로그 (Personal Dev Blog)

Notion을 CMS로 활용한 개인 기술 블로그 프로젝트입니다. Notion 데이터베이스에서 글을 작성하면 자동으로 블로그에 반영됩니다.

## 📋 프로젝트 개요

- **목표**: Notion API를 활용하여 간편한 블로그 운영
- **주요 특징**:
  - Notion 데이터베이스 연동
  - 자동 블로그 배포
  - 반응형 디자인
  - 빠른 페이지 로딩 (SSG + ISR)

## 🎯 주요 기능

- ✨ Notion 데이터베이스에서 글 자동 조회
- 📖 개별 글 상세 페이지 및 목차 생성
- 🏷️ 카테고리별 필터링
- 🔍 검색 기능 (클라이언트 측)
- 📱 반응형 디자인 (Mobile, Tablet, Desktop)
- 💅 Rich Text 지원 (코드블록, 이미지, 텍스트 포맷 등)

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **CMS**: Notion API (@notionhq/client)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 설치 및 설정

### 1. 저장소 클론
```bash
git clone https://github.com/yourusername/notion-cms-project.git
cd notion-cms-project
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음을 추가하세요:

```env
NEXT_PUBLIC_NOTION_DATABASE_ID=your_database_id
NOTION_API_KEY=your_notion_api_key
```

**Notion API 키 발급 방법**:
1. [Notion Developers](https://www.notion.so/my-integrations) 방문
2. "New integration" 클릭
3. Integration 이름 설정 및 Workspace 선택
4. "Internal Integration Token" 복사 (NOTION_API_KEY)
5. Notion 데이터베이스 공유 > 위의 integration 추가

**Database ID 확인 방법**:
- Notion 데이터베이스 URL: `https://notion.so/your-workspace/database_id?v=...`
- URL에서 `/` 이후의 32자 (하이픈 제거)가 Database ID

### 4. Notion 데이터베이스 구조

다음 필드를 가진 Notion 데이터베이스 생성:

| 필드명 | 타입 | 예시 |
|--------|------|------|
| Title | Title | "Next.js 성능 최적화 가이드" |
| Category | Select | "React", "TypeScript" |
| Tags | Multi-select | "성능", "최적화" |
| Published | Date | 2026-08-08 |
| Status | Select | "발행됨" / "초안" |
| Content | Page content | Notion 본문 |

## 🚀 실행 방법

### 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 빌드
```bash
npm run build
```

### 프로덕션 실행
```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
notion-cms-project/
├── app/                      # Next.js App Router
│   ├── page.tsx             # 홈페이지
│   ├── blog/
│   │   └── [slug]/          # 글 상세 페이지
│   └── category/
│       └── [category]/      # 카테고리 페이지
├── components/              # React 컴포넌트
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── BlogCard.tsx
│   └── ...
├── lib/                     # 유틸리티 함수
│   ├── notion.ts           # Notion API 클라이언트
│   └── ...
├── types/                   # TypeScript 타입 정의
│   └── blog.ts
├── public/                  # 정적 파일
├── docs/                    # 문서
│   └── PRD.md              # 제품 요구사항 문서
└── ...
```

## 📚 문서

- [PRD (제품 요구사항 문서)](./docs/PRD.md) - 프로젝트 상세 기획
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Notion API 문서](https://developers.notion.com/)

## 🚀 배포

### Vercel 배포

1. GitHub에 저장소 푸시
2. [Vercel](https://vercel.com) 접속 및 로그인
3. "New Project" → GitHub 저장소 선택
4. 환경 변수 설정 (NOTION_API_KEY, NEXT_PUBLIC_NOTION_DATABASE_ID)
5. Deploy 클릭

## 🔐 보안

- **API Key**: `.env.local`에서만 로드 (`.gitignore`에 추가됨)
- **공개 변수**: `NEXT_PUBLIC_` 접두사만 클라이언트에 노출
- **Notion**: Status가 "발행됨"인 글만 공개

## 📈 성능 목표

- First Contentful Paint (FCP): < 1.8초
- Largest Contentful Paint (LCP): < 2.5초
- Cumulative Layout Shift (CLS): < 0.1
- Lighthouse SEO: > 90

## 🛣️ 향후 계획

- [ ] 댓글 기능
- [ ] 태그별 필터링
- [ ] Dark Mode 지원
- [ ] RSS 피드
- [ ] 다국어 지원
- [ ] 조회수 및 좋아요 기능

## 📝 라이선스

MIT License

## 💬 피드백 및 문의

이슈 및 PR은 언제든 환영합니다!
