# 화면ID 매핑표

| 화면ID      | 설명     | URL 경로   | 내부 컴포넌트             |
| ----------- | -------- | ---------- | ------------------------- |
| COM0020M00  | 로그인   | /signin    | com/COM0020M00.tsx        |
| DASH0001M00 | 대시보드 | /dashboard | dashboard/DASH0001M00.tsx |
| COMZ020M00  | 등급별 단가 등록 | - | com/COMZ020M00.tsx        |
| COMZ030P00  | 등급별 단가 조회 팝업 | - | com/COMZ030P00.tsx        |
| COMZ070P00  | 직원 검색 팝업 | - | com/COMZ070P00.tsx        |
| COMZ080P00  | 직원 검색 팝업(확장) | - | com/COMZ080P00.tsx        |
| COMZ100P00  | 사용자명 검색 팝업 | - | com/COMZ100P00.tsx        |

## 파일 구조

```
src/app/
├── signin/
│   └── page.tsx              # /signin (COM0020M00 사용)
├── dashboard/
│   ├── DASH0001M00.tsx       # 대시보드 컴포넌트
│   └── page.tsx              # /dashboard (DASH0001M00 사용)
├── com/
│   ├── COM0020M00.tsx        # 로그인 컴포넌트 (내부용)
│   ├── COMZ020M00.tsx        # 등급별 단가 등록 컴포넌트
│   ├── COMZ030P00.tsx        # 등급별 단가 조회 팝업 컴포넌트
│   ├── COMZ070P00.tsx        # 직원 검색 팝업 컴포넌트
│   ├── COMZ080P00.tsx        # 직원 검색 팝업(확장) 컴포넌트
│   └── COMZ100P00.tsx        # 사용자명 검색 팝업 컴포넌트
└── login/
    └── page.tsx              # /login → /signin 리다이렉트
```

## 보안 고려사항

- 화면ID는 URL에 노출되지 않도록 의미있는 경로 사용
- 내부적으로는 화면ID.tsx 파일로 컴포넌트 관리
- URL은 사용자 친화적인 경로로 설정

- 각 업무별 화면은 화면ID.tsx 파일로 관리합니다.
- Next.js app router를 위해 의미있는 경로로 라우팅을 설정합니다.
- 신규 화면 추가 시 이 표에 화면ID와 설명을 함께 기록해 주세요.
