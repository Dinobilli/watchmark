# Watchmark

[English README](README.en.md)

Watchmark는 한국 공공기관 공고, 지원사업, 쇼핑몰 상품 페이지, 경쟁사 가격/채용/약관 페이지처럼 놓치면 손해가 되는 웹 변경을 빠르게 확인하는 오픈소스 변경 감지 도구입니다.

첫 확인 내용을 기준 스냅샷으로 저장하고, 이후에는 의미 있는 텍스트 변화만 추려 사람이 바로 판단할 수 있는 짧은 요약을 만듭니다. MVP는 API 키 없이 로컬에서 동작합니다. 같은 코어를 기반으로 예약 체크, 팀 알림, 공개 사이트 템플릿, 선택형 AI 요약을 갖춘 SaaS로 확장할 수 있습니다.

![Watchmark dashboard](docs/assets/watchmark-dashboard.png)

## 왜 필요한가요?

- 공공기관 공지: 입찰, 지원금, 채용, 마감일, 첨부파일 변경 확인.
- 쇼핑몰 운영: 가격, 품절, 옵션, 쿠폰, 상세페이지 문구 변경 추적.
- 창업/영업 리서치: 경쟁사 랜딩, 가격표, 약관, 채용 페이지 업데이트 확인.
- 개인 모니터링: 반복 새로고침 없이 관심 페이지 변경 이력 보관.

## MVP 기능

- `POST /api/check`로 URL을 등록하거나 다시 확인합니다.
- 첫 확인은 기준 스냅샷으로 저장합니다.
- 다음 확인부터 의미 있는 텍스트 변경을 감지합니다.
- 변경된 줄을 `추가된 내용`과 `삭제된 내용`으로 나눠 대시보드에서 바로 확인합니다.
- 익명화된 한국 공공기관 공고 예시를 API와 대시보드에서 바로 미리 볼 수 있습니다.
- API 키 없이 로컬 요약을 생성합니다.
- 한국 공공기관/쇼핑몰/경쟁사 페이지에 맞춘 대시보드를 제공합니다.
- private/local 네트워크 URL과 위험한 리디렉션을 기본 차단합니다.
- TypeScript, Bun, Hono, Zod, Biome, CI 테스트를 사용합니다.

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

공공 공고 예시 API:

```bash
curl -i http://localhost:3000/api/fixtures/korean-public-notices/deadline-change
```

## 개발 스크립트

```bash
bun test
bun run browser-test
bun run typecheck
bun run lint
bun run build
```

## 보안과 개인정보 기본값

- MVP는 OpenAI 키나 외부 API 키가 없어도 실행됩니다.
- `.env` 파일과 로컬 빌드/실행 산출물은 git에 포함하지 않습니다.
- 사용자가 입력한 URL은 private/local 네트워크 접근을 기본 차단합니다.
- 리디렉션 대상도 매번 검증한 뒤 가져옵니다.
- 대시보드는 결과를 HTML로 주입하지 않고 DOM 텍스트 노드로 렌더링합니다.
- fetch 실패 응답은 내부 오류 문자열, 토큰, 이메일, IP 같은 상세값을 그대로 노출하지 않습니다.

자세한 내용은 [SECURITY.md](SECURITY.md)와 [docs/security-review.md](docs/security-review.md)를 참고하세요.

## 오픈소스 + SaaS 경로

오픈소스 코어는 로컬 변경 감지 엔진과 대시보드입니다. 이후에는 다음 기능으로 확장할 수 있습니다.

- 예약 체크와 장기 변경 이력 저장.
- 이메일, Slack, Discord, KakaoTalk, webhook 알림.
- 팀 워크스페이스, 감시 URL 한도, 유료 보존 기간.
- 한국어 긴 공지/상품 페이지용 선택형 OpenAI 요약.
- 공공기관/쇼핑몰/경쟁사 페이지용 공개 템플릿.

## 유지관리 흐름

- Pull Request마다 CI가 lint, typecheck, test, build를 실행합니다.
- bug, feature, site template 이슈 템플릿을 제공합니다.
- `ROADMAP.md`, `CHANGELOG.md`, `SECURITY.md`, `CONTRIBUTING.md`로 유지관리 방향을 공개합니다.
- `docs/backlog.md`에는 GitHub 공개 후 바로 다룰 초기 이슈 후보를 정리했습니다.
- 유지관리는 이슈 단위로 작은 기능을 닫고 릴리스 노트를 남기는 방식으로 진행합니다. 예: `0.1.3` 한국 공공 공고 fixture pack.

## Codex 오픈소스 지원 프로그램과의 적합성

Watchmark는 Codex가 실제로 도와줄 일이 많은 프로젝트입니다. 이슈 분류, PR 리뷰, 릴리스 흐름, URL 보안 강화, 다양한 웹사이트 형태에 대한 회귀 테스트 생성이 모두 유지관리 작업에 해당합니다. 신청서 초안은 [application/codex-for-oss-draft.md](application/codex-for-oss-draft.md)에 정리되어 있습니다.

## 라이선스

MIT. 자세한 내용은 [LICENSE](LICENSE)를 참고하세요.
