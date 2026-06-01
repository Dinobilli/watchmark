# Watchmark

[English README](README.md)

Watchmark는 한국 공공기관 공고, 지원사업, 쇼핑몰 상품 페이지, 경쟁사 가격/채용/약관 페이지처럼 놓치면 손해가 되는 웹 변경을 추적하는 오픈소스 웹 변경 감지 도구입니다.

단순히 "페이지가 바뀌었다"고 알리는 대신, 반복되는 헤더/푸터/추천 영역 변화는 줄이고 의미 있는 텍스트 변경을 요약합니다. MVP는 API 키 없이 로컬 deterministic 요약으로 동작합니다.

![Watchmark dashboard](docs/assets/watchmark-dashboard.png)

## 왜 필요한가요?

- 공공기관 공지: 입찰, 지원금, 채용, 마감일, 첨부파일 변경 확인.
- 쇼핑몰 운영: 가격, 품절, 옵션, 쿠폰, 상세페이지 문구 변경 추적.
- 창업/영업 리서치: 경쟁사 랜딩, 가격표, 약관, 채용 페이지 업데이트 확인.
- 커뮤니티/개인: 반복 새로고침 없이 관심 페이지 변경 기록 보관.

## MVP 기능

- `POST /api/check`로 URL을 등록하거나 다시 확인.
- 첫 확인은 기준 스냅샷 저장.
- 다음 확인부터 의미 있는 텍스트 변경 감지.
- API 키 없는 로컬 요약.
- 한국 공공기관/쇼핑몰/경쟁사 페이지에 맞춘 대시보드.
- private/local 네트워크 URL은 기본 차단.
- TypeScript, Bun, Hono, Zod, Biome 기반 테스트 포함.

## 빠른 시작

```bash
bun install
bun run dev
```

브라우저에서 `http://localhost:3000/watch`를 여세요.

API 예시:

```bash
curl -i -X POST http://localhost:3000/api/check \
  -H 'content-type: application/json' \
  -d '{"url":"https://example.com","name":"Example","category":"public"}'
```

## 보안과 개인정보 기본값

- 이 저장소에는 API 키가 필요하지 않습니다.
- `.env` 파일과 로컬 실행 산출물은 git에 포함하지 않습니다.
- 사용자가 입력한 URL은 private/local 네트워크 접근을 기본 차단합니다.
- 리디렉션이 private/local 네트워크로 향해도 차단합니다.
- 공개 도메인이 private/local 주소로 해석되면 기본 차단합니다.
- 대시보드는 결과 텍스트를 DOM `textContent`로 넣어 스크립트 실행을 피합니다.
- fetch 실패 응답은 내부 오류 문자열, 토큰, 이메일, IP 같은 상세값을 그대로 노출하지 않습니다.

## 오픈소스 + SaaS 경로

오픈소스 코어는 로컬 변경 감지 엔진과 대시보드입니다. 이후에는 다음 기능으로 확장할 수 있습니다.

- 예약 체크와 변경 이력 저장.
- 이메일, Slack, Discord, KakaoTalk, webhook 알림.
- 팀 워크스페이스와 보존 기간 설정.
- 한국어 긴 공지/상품 페이지용 선택형 AI 요약.
- 공공기관/쇼핑몰별 공개 템플릿.

## 유지관리 흐름

- Pull Request마다 CI가 lint, typecheck, test, build를 실행합니다.
- bug, feature, site template 이슈 템플릿을 제공합니다.
- `ROADMAP.md`, `CHANGELOG.md`, `SECURITY.md`, `CONTRIBUTING.md`로 유지관리 방향을 공개합니다.

## 라이선스

MIT. 자세한 내용은 `LICENSE`를 참고하세요.
