# 개발 로드맵 (Development Roadmap)

**프로젝트**: 개인 개발 블로그 (Notion CMS)  
**작성일**: 2026-08-08  
**예상 총 소요 시간**: 11-16일 (약 2-3주)

---

## 개요

이 문서는 Notion CMS 블로그 프로젝트의 단계별 개발 계획을 정의합니다. 각 Phase는 논리적 의존성을 고려하여 순차적으로 진행되며, 견고한 기반 위에 기능을 점진적으로 추가하는 방식입니다.

### 개발 원칙
- **기반 우선**: 견고한 기반 없이는 기능 개발이 어려움
- **중복 방지**: 공통 모듈을 먼저 개발하여 코드 재사용성 확보
- **점진적 추가**: 핵심 기능 완성 후 부가 기능 추가
- **품질 우선**: 기능 완성 후 최적화 진행

---

## Phase 1: 프로젝트 초기 설정

**기간**: 1-2일  
**상태**: 미시작 ⬜

### 목표
Next.js와 Notion API 연동을 위한 견고한 기반 구축

### 세부 작업

#### 1.1 Next.js 프로젝트 구조 설정
- **작업**:
  - 폴더 구조 생성 (`app/`, `components/`, `lib/`, `types/`, `utils/`)
  - TypeScript 설정 검증 (`tsconfig.json`)
  - ESLint & Prettier 설정
  - 경로 별칭 설정 (`@/components`, `@/lib` 등)

- **소요 시간**: 0.5일
- **담당자**: -
- **체크리스트**:
  - [ ] 폴더 구조 생성 완료
  - [ ] TypeScript 설정 검증
  - [ ] Prettier 포맷 설정
  - [ ] 경로 별칭 동작 확인

#### 1.2 Notion API 연동 환경 구축
- **작업**:
  - `.env.local` 파일 생성 템플릿 작성
  - Notion API Key 및 Database ID 설정 가이드 작성
  - `@notionhq/client` 패키지 설치 및 버전 확인
  - 기본 Notion API 클라이언트 인스턴스 생성 (`lib/notion/client.ts`)

- **소요 시간**: 0.5일
- **담당자**: -
- **체크리스트**:
  - [ ] `.env.local` 생성 및 변수 설정
  - [ ] `@notionhq/client` 패키지 설치
  - [ ] Notion 클라이언트 인스턴스 생성
  - [ ] 간단한 API 테스트 (데이터베이스 조회 테스트)

#### 1.3 기본 레이아웃 구조 생성
- **작업**:
  - `RootLayout` 구성 (헤더, 메인, 푸터)
  - 전역 CSS 변수 및 Tailwind 설정 검증
  - 기본 네비게이션 구조 구현
  - 레이아웃 클라이언트 컴포넌트 분리

- **소요 시간**: 1일
- **담당자**: -
- **체크리스트**:
  - [ ] RootLayout 구현
  - [ ] 헤더/푸터 기본 마크업 작성
  - [ ] Tailwind 스타일 검증
  - [ ] 브라우저에서 렌더링 확인

### 완료 기준 ✅
- 프로젝트가 에러 없이 `npm run dev` 실행
- Notion API와 성공적으로 연결 (테스트 쿼리 실행 가능)
- 기본 레이아웃이 브라우저에서 정상 렌더링
- 개발 환경 설정 문서 작성

### 블로킹 이슈 방지
- 환경 변수 오류 → `.env.local` 체크리스트 제공
- Notion API 인증 실패 → API Key 유효성 검증 스크립트 작성

---

## Phase 2: 공통 모듈 개발

**기간**: 2-3일  
**상태**: 미시작 ⬜  
**선행 조건**: Phase 1 완료

### 목표
모든 기능에서 재사용되는 코드의 중앙화, 코드 중복 방지

### 세부 작업

#### 2.1 Notion API 공통 함수 개발
- **작업**:
  - 타입 정의 (`types/notion.ts`):
    - `Page`: Notion 페이지 기본 타입
    - `Post`: 블로그 글 타입 (Title, Category, Tags, Published, Status, Content)
    - `RichText`: Notion Rich Text 타입
  - API 유틸리티 함수 (`lib/notion/api.ts`):
    - `fetchPages(databaseId, filter)`: 페이지 목록 조회
    - `fetchPageContent(pageId)`: 페이지 상세 내용 조회
    - `fetchBlockChildren(blockId)`: 블록 자식 조회 (재귀)
    - `normalizePost(page)`: Notion 페이지를 Post 타입으로 변환
  - 에러 처리 함수:
    - `handleNotionError(error)`: Notion API 에러 처리
    - `validateDatabaseStructure(database)`: 데이터베이스 구조 검증

- **소요 시간**: 1.5일
- **담당자**: -
- **체크리스트**:
  - [ ] 모든 타입 정의 완료
  - [ ] `fetchPages()` 함수 구현 및 테스트
  - [ ] `fetchPageContent()` 함수 구현 및 테스트
  - [ ] 에러 처리 함수 구현
  - [ ] 실제 데이터로 함수 동작 검증

#### 2.2 공통 컴포넌트 개발
- **작업**:
  - `components/layout/Header.tsx`:
    - 로고, 사이트 제목, 네비게이션 메뉴
    - 검색 바 플레이스홀더 (Phase 4에서 기능 추가)
    - 반응형 모바일 메뉴
  - `components/layout/Footer.tsx`:
    - 저작권, 소셜 링크
    - 사이트 설명, 카테고리 링크
  - `components/blog/BlogCard.tsx`:
    - 글 제목, 요약, 작성일, 카테고리, 태그
    - 호버 효과 (데스크톱)
    - 클릭 가능한 링크
  - `components/common/CategoryBadge.tsx`:
    - 카테고리 배지 (다양한 색상)
  - `components/common/TagBadge.tsx`:
    - 태그 배지

- **소요 시간**: 1일
- **담당자**: -
- **체크리스트**:
  - [ ] Header 컴포넌트 구현 및 스타일링
  - [ ] Footer 컴포넌트 구현 및 스타일링
  - [ ] BlogCard 컴포넌트 구현 및 스타일링
  - [ ] Badge 컴포넌트 구현 및 스타일링
  - [ ] Storybook 또는 컴포넌트 테스트 페이지에서 검증

#### 2.3 공통 타입 및 유틸리티 정의
- **작업**:
  - `types/blog.ts`:
    - `Post` 타입 상세 정의
    - `Category` 타입
    - `Tag` 타입
  - `lib/utils/format.ts`:
    - `formatDate(date)`: 날짜 포맷팅 (예: "2026년 8월 8일")
    - `truncateText(text, length)`: 텍스트 자르기
    - `generateSlug(title)`: URL Slug 생성
  - `lib/constants.ts`:
    - Notion Database ID, API Key
    - 페이지당 항목 수 등 설정값

- **소요 시간**: 0.5일
- **담당자**: -
- **체크리스트**:
  - [ ] 타입 정의 완료
  - [ ] 유틸리티 함수 구현 및 단위 테스트
  - [ ] 상수 정의 완료

### 완료 기준 ✅
- 모든 공통 함수가 실제 Notion 데이터로 테스트 완료
- 공통 컴포넌트가 여러 props 조합에서 정상 렌더링
- 타입 안정성 확보 (TypeScript 에러 없음)
- 공통 모듈 사용 가이드 문서 작성

### 품질 확인
```bash
npm run type-check  # TypeScript 타입 검증
npm run lint        # ESLint 검증
```

---

## Phase 3: 핵심 기능 개발

**기간**: 3-4일  
**상태**: 미시작 ⬜  
**선행 조건**: Phase 1, Phase 2 완료

### 목표
블로그의 가장 기본이 되는 기능(글 목록, 상세 페이지) 구현

### 세부 작업

#### 3.1 블로그 글 목록 페이지 (`/`)
- **작업**:
  - `app/page.tsx`:
    - Notion 데이터베이스에서 글 목록 조회 (최대 10개, 최신순)
    - `BlogCard` 컴포넌트로 렌더링
    - 페이지네이션 구현 (숫자 페이지네이션)
  - `components/blog/BlogList.tsx`:
    - 글 목록 렌더링 로직
    - 로딩 상태 처리 (스켈레톤 UI)
    - 오류 상태 처리 (사용자 친화적 메시지)
  - `components/pagination/Pagination.tsx`:
    - 이전/다음 버튼
    - 페이지 번호 표시
    - 현재 페이지 강조

- **소요 시간**: 1.5일
- **담당자**: -
- **체크리스트**:
  - [ ] Notion 데이터 조회 로직 구현
  - [ ] BlogList 컴포넌트 구현
  - [ ] 페이지네이션 로직 구현
  - [ ] 로딩/오류 상태 UI 구현
  - [ ] 브라우저에서 데이터 표시 확인
  - [ ] 페이지네이션 동작 테스트

#### 3.2 블로그 글 상세 페이지 (`/blog/[slug]`)
- **작업**:
  - 동적 라우트 설정:
    - `app/blog/[slug]/page.tsx`
    - Slug 기반 페이지 조회 (generateStaticParams 사용 - SSG)
  - Notion 콘텐츠 렌더링:
    - `components/blog/BlogContent.tsx`
    - Rich Text 포맷 지원 (굵게, 기울임, 코드, 링크)
    - 제목 계층 지원 (h1 ~ h6)
    - 리스트 렌더링 (순서 있음/없음)
    - 코드블록 렌더링 (Highlight.js 또는 Prism.js)
    - 인용문 렌더링
    - 이미지 렌더링 (Next.js Image로 최적화)
  - 메타데이터 표시:
    - 글 제목, 작성일, 수정일
    - 카테고리, 태그
    - 저자 정보 (선택사항)

- **소요 시간**: 2일
- **담당자**: -
- **체크리스트**:
  - [ ] 동적 라우트 설정 완료
  - [ ] generateStaticParams 구현 (빌드 타임 페이지 생성)
  - [ ] Rich Text 파싱 로직 구현
  - [ ] 코드블록 문법 하이라이팅 구현
  - [ ] 이미지 최적화 구현
  - [ ] 여러 글에서 상세 페이지 렌더링 확인
  - [ ] 존재하지 않는 글 404 페이지 처리

#### 3.3 Notion 콘텐츠 렌더링 엔진
- **작업**:
  - `lib/notion/renderer.ts`:
    - `renderRichText(richText)`: Rich Text 렌더링
    - `renderBlock(block)`: 블록별 렌더링
    - `renderPageContent(blocks)`: 전체 콘텐츠 렌더링
  - `components/notion/NotionRenderer.tsx`:
    - Notion 블록을 React 컴포넌트로 변환
    - 각 블록 타입별 렌더링 컴포넌트:
      - `NotionParagraph`, `NotionHeading`, `NotionCode`
      - `NotionImage`, `NotionQuote`, `NotionList`
  - 스타일링:
    - Tailwind CSS 클래스 적용
    - 코드블록 테마 설정

- **소요 시간**: 1.5일
- **담당자**: -
- **체크리스트**:
  - [ ] 모든 Notion 블록 타입 지원 확인
  - [ ] Rich Text 포맷 정상 렌더링
  - [ ] 코드블록 문법 하이라이팅 확인
  - [ ] 이미지 반응형 렌더링 확인
  - [ ] 중첩된 블록 정상 처리

### 완료 기준 ✅
- 홈페이지에서 글 목록 정상 표시
- 개별 글 상세 페이지에서 모든 콘텐츠 정상 렌더링
- 페이지네이션 정상 동작
- 로딩/오류 상태 적절히 처리
- Lighthouse Performance > 85
- 모든 글에서 404 에러 없음

### 성능 목표
- FCP (First Contentful Paint) < 1.8초
- LCP (Largest Contentful Paint) < 2.5초
- 빌드 타임 < 60초

---

## Phase 4: 추가 기능 개발

**기간**: 2-3일  
**상태**: 미시작 ⬜  
**선행 조건**: Phase 1, 2, 3 완료

### 목표
사용자 경험 향상을 위한 부가 기능 추가

### 세부 작업

#### 4.1 카테고리 필터링
- **작업**:
  - 카테고리 목록 페이지 (`/category/[category]`):
    - Notion에서 사용 중인 모든 카테고리 동적 조회
    - 카테고리별 글 개수 표시
    - 필터링된 글 목록 표시
  - 카테고리 네비게이션:
    - 홈페이지 사이드바에 카테고리 목록
    - 각 카테고리별 글 개수 표시
    - 현재 카테고리 강조 표시
  - URL 기반 라우팅:
    - `/category/react`, `/category/typescript` 등
    - 페이지네이션 지원

- **소요 시간**: 1일
- **담당자**: -
- **체크리스트**:
  - [ ] `fetchCategories()` 함수 구현
  - [ ] 카테고리 페이지 구현
  - [ ] 카테고리 네비게이션 UI 구현
  - [ ] 필터링 로직 동작 확인
  - [ ] 모든 카테고리 페이지 렌더링 확인

#### 4.2 검색 기능
- **작업**:
  - 검색 바 구현:
    - `components/search/SearchBar.tsx`
    - 입력 필드, 검색 버튼
    - 검색어 상태 관리
  - 검색 로직 (`lib/utils/search.ts`):
    - 클라이언트 측 검색 (초기 로드 후 빠른 검색)
    - 제목, 본문, 태그 검색
    - 검색 결과 정렬 (관련도순)
  - 검색 결과 페이지 (`/search`):
    - 검색어 표시
    - 검색 결과 개수 표시
    - 검색어 강조 표시
    - "검색 결과 없음" 안내 및 인기 글 추천

- **소요 시간**: 1.5일
- **담당자**: -
- **체크리스트**:
  - [ ] SearchBar 컴포넌트 구현
  - [ ] 클라이언트 측 검색 로직 구현
  - [ ] 검색 결과 페이지 구현
  - [ ] 검색어 강조 표시 구현
  - [ ] 검색 성능 최적화 (debounce 등)
  - [ ] 다양한 검색어로 테스트

#### 4.3 SEO 최적화
- **작업**:
  - 메타데이터 설정:
    - `next.js/metadata` API 사용
    - 페이지별 제목, 설명, OG 이미지
    - Canonical URL 설정
  - 구조화된 데이터 (Schema.org):
    - `BlogPosting` 스키마
    - `BreadcrumbList` 스키마
  - Sitemap 생성:
    - `public/sitemap.xml` 자동 생성
  - robots.txt 설정:
    - `public/robots.txt` 생성

- **소요 시간**: 0.5일
- **담당자**: -
- **체크리스트**:
  - [ ] 모든 페이지에 메타데이터 설정
  - [ ] OG 이미지 설정
  - [ ] 구조화된 데이터 추가
  - [ ] Sitemap 자동 생성
  - [ ] robots.txt 생성
  - [ ] Google Search Console에서 검증

### 완료 기준 ✅
- 카테고리 필터링 정상 동작
- 검색 기능 사용 가능
- Lighthouse SEO > 90
- Google에서 메타데이터 정상 인식

---

## Phase 5: 최적화 및 배포

**기간**: 1-2일  
**상태**: 미시작 ⬜  
**선행 조건**: Phase 1, 2, 3, 4 완료

### 목표
성능 최적화 및 배포 준비

### 세부 작업

#### 5.1 성능 최적화
- **작업**:
  - 빌드 최적화:
    - 번들 크기 분석 (`npm run build -- --analyze`)
    - 불필요한 의존성 제거
    - Code splitting 최적화
  - 이미지 최적화:
    - `next/image` 컴포넌트 사용 확인
    - 이미지 사이즈 설정
    - WebP 포맷 지원
  - 캐싱 전략:
    - ISR (Incremental Static Regeneration) 설정
    - 재검증 주기 설정 (예: 15분)
  - Font 최적화:
    - 시스템 폰트 활용 또는 Web Font 로드 최적화

- **소요 시간**: 1일
- **담당자**: -
- **체크리스트**:
  - [ ] 번들 크기 분석 및 최적화
  - [ ] 이미지 최적화 완료
  - [ ] ISR 설정 검증
  - [ ] Lighthouse Performance > 90
  - [ ] Core Web Vitals 측정 및 개선

#### 5.2 반응형 디자인 개선
- **작업**:
  - 모든 페이지 반응형 테스트:
    - Mobile (< 640px)
    - Tablet (640px ~ 1023px)
    - Desktop (> 1024px)
  - 터치 인터랙션 개선:
    - 버튼 최소 크기 44×44px 확보
    - 터치 타겟 간격 확보
  - 다양한 디바이스에서 테스트:
    - Chrome DevTools 모바일 에뮬레이터
    - 실제 디바이스 테스트 (휴대폰, 태블릿)

- **소요 시간**: 0.5일
- **담당자**: -
- **체크리스트**:
  - [ ] 모든 화면 크기에서 렌더링 확인
  - [ ] 터치 인터랙션 테스트
  - [ ] 다양한 브라우저 호환성 테스트
  - [ ] Lighthouse 모바일 점수 > 85

#### 5.3 최종 QA 및 테스트
- **작업**:
  - 기능 테스트:
    - [ ] 글 목록 페이지 모든 기능
    - [ ] 글 상세 페이지 모든 포맷
    - [ ] 카테고리 필터링
    - [ ] 검색 기능
    - [ ] 페이지네이션
  - 브라우저 호환성:
    - Chrome, Firefox, Safari, Edge
    - 모바일 브라우저 (Chrome Mobile, Safari iOS)
  - 엣지 케이스:
    - 글이 없는 카테고리
    - 검색 결과 없음
    - 매우 긴 글
    - 많은 이미지 있는 글

- **소요 시간**: 0.5일
- **담당자**: -
- **체크리스트**:
  - [ ] 모든 기능 정상 동작
  - [ ] 에러 없이 모든 페이지 로드
  - [ ] 성능 목표 달성
  - [ ] 접근성 기준 만족 (WCAG)

#### 5.4 Vercel 배포
- **작업**:
  - Vercel 프로젝트 생성:
    - GitHub 저장소 연결
    - 자동 배포 설정
  - 환경 변수 설정:
    - Production 환경 변수 설정
    - `NOTION_API_KEY`, `NEXT_PUBLIC_NOTION_DATABASE_ID`
  - 배포 전 검사:
    - CI/CD 파이프라인 실행
    - 빌드 로그 확인
  - 배포 후 검증:
    - 실제 URL에서 기능 확인
    - 성능 메트릭 확인

- **소요 시간**: 0.5일
- **담당자**: -
- **체크리스트**:
  - [ ] GitHub 저장소 Vercel에 연결
  - [ ] 환경 변수 설정 완료
  - [ ] 배포 성공 (빌드 에러 없음)
  - [ ] Production 환경에서 모든 기능 확인
  - [ ] 도메인 설정 (선택사항)

### 완료 기준 ✅
- 모든 성능 목표 달성:
  - FCP < 1.8초
  - LCP < 2.5초
  - CLS < 0.1
  - Lighthouse Performance > 90
  - Lighthouse SEO > 90
  - Lighthouse Mobile > 85
- 모든 기능 정상 동작
- 프로덕션 배포 완료
- 배포 URL 정상 작동

---

## 전체 타임라인

```
Week 1
│
├─ Phase 1 (1-2일) ████
│  └─ 프로젝트 초기 설정 완료
│
├─ Phase 2 (2-3일) ████████
│  └─ 공통 모듈 개발 완료
│
└─ Phase 3 (1일 진행 중) ███
   └─ 핵심 기능 개발 중...

Week 2
│
├─ Phase 3 (계속) ████████
│  └─ 핵심 기능 개발 완료
│
├─ Phase 4 (2-3일) ████████
│  └─ 추가 기능 개발 완료
│
└─ Phase 5 (1-2일) ████
   └─ 최적화 및 배포 완료
```

**예상 완료 날짜**: 2026-08-22 (2주)

---

## 위험 요소 및 대응 방안

| 위험 요소 | 영향도 | 대응 방안 |
|---------|--------|---------|
| **Notion API 속도 제한** | 중 | ISR 캐싱 적극 활용, 재시도 로직 구현 |
| **Notion 스키마 변경** | 높 | 데이터 검증 함수 작성, 타입 안정성 확보 |
| **빌드 시간 증가** | 중 | 번들 분석, Code splitting 최적화 |
| **Vercel 배포 실패** | 중 | 로컬 테스트 충분히 진행, CI/CD 로그 확인 |
| **브라우저 호환성 문제** | 낮 | 크로스 브라우저 테스트 철저히 진행 |

---

## 완료 후 체크리스트

### 배포 전 최종 확인
- [ ] 모든 환경 변수 설정 완료
- [ ] 모든 기능 수동 테스트 완료
- [ ] Lighthouse 성능 검사 완료
- [ ] SEO 메타데이터 검증
- [ ] 모바일 디바이스에서 테스트 완료
- [ ] 404 페이지 설정
- [ ] 에러 페이지 설정
- [ ] 로그 모니터링 설정

### 배포 후 모니터링
- [ ] 실시간 에러 모니터링 (Sentry, etc.)
- [ ] 성능 모니터링 (Google Analytics, Vercel Analytics)
- [ ] 사용자 피드백 수집

---

## 추가 리소스

- [PRD (제품 요구사항 문서)](./PRD.md)
- [Notion API 공식 문서](https://developers.notion.com/)
- [Next.js 15 공식 가이드](https://nextjs.org/docs)
- [Core Web Vitals 최적화](https://web.dev/vitals/)
- [Web 접근성 가이드](https://www.w3.org/WAI/)

---

**업데이트 이력**

| 버전 | 날짜 | 변경 사항 |
|------|------|---------|
| 1.0 | 2026-08-08 | 초기 로드맵 작성 |

