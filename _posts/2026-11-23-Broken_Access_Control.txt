---
layout: eito_post
title: "OWASP Top 10 2025, 그리고 '접근 제어 실패(Broken Access Control)' 취약점 정리"
date: 2026-11-23 22:00:00 +0900
categories: [블로그/기술문서]
tags: [OWASP, Broken_Access_Control, 접근제어, WEB, 웹해킹, 취약점, Secure_Coding]
---

웹 보안을 공부하기 시작하면 가장 먼저 마주치는 단어가 바로 **OWASP Top 10**이다. OWASP TOP 10 2025년 버전을 통해 보안 동향을 알아보고 Broken Access Control 취약점의 원리와 실제 파이썬 코드 예시, 그리고 방어 방법(시큐어 코딩)까지 정리해 보았다.

---

## 1. OWASP Top 10이란 무엇인가?

**OWASP(Open Worldwide Application Security Project)**는 웹 애플리케이션 보안을 연구하는 비영리 국제 기구다. 이곳에서 약 4년마다 전 세계의 실제 해킹 사고 데이터와 보안 전문가들의 설문을 종합해 **"가장 치명적이고 자주 발생하는 10대 웹 보안 위협"**을 발표하는데, 이것이 바로 OWASP Top 10이다.

2025년 개정판에는 현대 웹 개발 환경(클라우드, API, 마이크로서비스 등)의 복잡성이 커진 현실이 그대로 반영되었다.

Top 10에 선정된 취약점으로는
* **A01:2025 - 접근 제어 실패 (Broken Access Control)** *(2021년에 이어 1위 유지, SSRF와 통합)*
* **A02:2025 - 보안 설정 오류 (Security Misconfiguration)** *(5위에서 2위로 급상승)*
* **A03:2025 - 소프트웨어 공급망 실패 (Software Supply Chain Failures)** *(기존 오래된 컴포넌트 항목 확장)*
* **A04:2025 - 암호 체계 실패 (Cryptographic Failures)**
* **A05:2025 - 인젝션 (Injection)**
등이 있다.

---

## 2. 왜 '접근 제어 실패'가 부동의 1위일까?

OWASP Top 10 2025의 공식 데이터에 따르면, 테스트 대상인 웹 애플리케이션의 평균 3.73%에서 이 카테고리에 속하는 취약점(총 40개 CWE)이 발견되었다고 한다. 또한 수십만 건의 CVE(공개된 보안 취약점) 데이터 분석에서도 가장 많은 비중을 차지했다.

### 비유로 이해하는 핵심 개념
웹 보안에는 크게 세 가지 단계가 있다. PortSwigger Web Security Academy에서는 이를 다음과 같이 명확하게 구분한다.

1. **인증(Authentication):** "당신이 누구인가?"를 확인하는 과정 (예: 아이디/비밀번호로 로그인)
2. **세션 관리(Session Management):** 로그인한 사용자가 이후에 보내는 요청들이 같은 사람에게서 오는지 식별하는 과정
3. **접근 제어(Access Control):** "그래서 당신에게 이 행동을 할 권한이 있는가?"를 확인하는 과정

현실 세계의 호텔에 비유해 보자. 프론트에서 신분증을 확인하고 체크인하는 것이 **인증**이라면, 발급받은 카드키로 내 방(301호) 문만 열리고 옆방(302호)이나 직원 전용실 문은 열리지 않게 막는 것이 **접근 제어**다.

**접근 제어 실패(Broken Access Control)**는 말 그대로 이 카드키 시스템이 고장 난 상태다. 일반 투숙객이 직원용 마스터키를 가지고 다른 사람의 방을 열거나, 관리자 구역에 마음대로 들어갈 수 있게 되는 것과 같은 치명적인 취약점이다. 만약 이 취약점이 발생하면 **대규모 개인정보 유출, 무단 데이터 변조 및 삭제, 관리자 계정 탈취**로 직결되기 때문에 그 파급력이 엄청날 것이다.

---

## 3. 실제로 어떻게 공격이 이루어질까? (주요 유형 4가지)

공격 기법은 생각보다 직관적이다. 웹 브라우저 주소창이나 HTTP 요청을 조금만 조작해도 권한을 우회할 수 있는 경우가 있다.

### ① URL 파라미터 조작 (IDOR: 안전하지 않은 직접 객체 참조)
쇼핑몰 마이페이지에 접속했을 때 주소창이 다음과 같다고 가정해 보자.
> `https://example-shop.com/mypage?user_id=1004`

서버가 "로그인한 사람이 진짜 1004번 회원이 맞나?"를 검사하지 않고 단순히 주소창의 숫자만 보고 화면을 띄워준다면 어떻게 될까? 공격자가 주소창의 숫자를 `1005`로 바꾸기만 해도 다른 사람의 이름, 주소, 주문 내역이 그대로 노출된다. 이를 **수평적 권한 상승(Horizontal Privilege Escalation)**이라 부른다.

### ② 숨겨진 관리자 페이지 접근 (수직적 권한 상승)
일반 사용자가 관리자(Admin)의 기능을 실행하는 경우다. PortSwigger 실습(Lab)을 통해 확인해 본 대표적 사례는 개발자가 관리자 페이지 주소를 `/admin-panel-secret`처럼 어렵게 지어놓고 별도의 권한 검사를 생략하는 경우다. 검색 엔진 수집을 막기 위해 작성해 둔 `robots.txt` 파일이나 자바스크립트 소스 코드를 통해 이 경로가 노출되면, 누구나 로그인 없이 관리자 페이지에 들어가 다른 사용자를 삭제할 수 있게 된다.

### ③ HTTP 메서드 및 다단계 프로세스 우회
* **HTTP 메서드 우회:** 서버 방화벽에서 `POST /admin/deleteUser` 요청은 관리자만 쓰도록 막아두었는데, 공격자가 요청 방식을 `GET`으로 살짝 바꿨더니 서버가 이를 허용해 버리는 경우다.
* **다단계 프로세스 우회:** 회원 정보 수정이 `1단계(정보 조회) → 2단계(수정 입력) → 3단계(최종 승인)`로 이루어질 때, 1·2단계에만 권한 검사를 걸어두고 3단계 승인 요청에는 검사를 빠뜨리는 실수다. 공격자가 3단계 API 요청만 직접 전송하면 권한 없이 정보를 바꿀 수 있다.

### ④ SSRF (서버 측 요청 위조)의 통합
2021년 버전에서는 10위였던 **SSRF(Server-Side Request Forgery)**가 2025년 버전에서는 A01(접근 제어 실패)에 통합되었다. SSRF는 공격자가 웹 서버를 속여서 서버 내부망의 보호된 자원(예: 클라우드 메타데이터 서버 등)에 대신 접근하게 만드는 공격이다. 결국 "허가되지 않은 내부 자원에 접근한다"는 본질이 같기 때문에 하나로 합쳐진 것이다.

---

## 4. 코드로 보는 취약점과 시큐어 코딩

개념만 보면 추상적일 수 있어서, 파이썬 Flask를 기준으로 **취약한 코드**와 **안전하게 수정한 코드**를 직접 비교해 보았다.

### 취약한 코드 (Vulnerable Code)
사용자가 URL에 입력한 `user_id` 값을 아무런 검증 없이 그대로 DB 조회에 사용하는 경우다.

```python
from flask import Flask, session, jsonify

app = Flask(__name__)

@app.route('/api/orders/<int:user_id>')
def get_user_orders(user_id):
    # 로그인 여부만 확인할 뿐, '누가' 요청했는지는 확인하지 않음
    if 'logged_in_user_id' not in session:
        return jsonify({"error": "로그인이 필요합니다."}), 401
    
    # 공격자가 URL의 user_id를 다른 사람 번호로 바꾸면 그대로 조회됨 ㄱㅡ
    orders = db.query("SELECT * FROM orders WHERE user_id = ?", (user_id,))
    return jsonify(orders)
```

### 시큐어 코딩 (Secure Code) 방법
외부(URL 파라미터)에서 들어온 값을 믿지 않고, **서버가 안전하게 보관 중인 세션(Session) 정보**를 기준으로 권한을 검증해야 한다.

```python
from flask import Flask, session, jsonify

app = Flask(__name__)

@app.route('/api/orders/<int:user_id>')
def get_user_orders(user_id):
    current_user_id = session.get('logged_in_user_id')
    is_admin = session.get('role') == 'admin'

    # 1. 인증 확인
    if not current_user_id:
        return jsonify({"error": "로그인이 필요합니다."}), 401

    # 2. 인가(접근 제어) 확인: 본인 데이터이거나 관리자일 때만 허용
    if current_user_id != user_id and not is_admin:
        return jsonify({"error": "해당 데이터에 접근할 권한이 없습니다."}), 403

    orders = db.query("SELECT * FROM orders WHERE user_id = ?", (user_id,))
    return jsonify(orders)
```
핵심은 단순하다. **"요청자가 누구인지(Session)"**와 **"접근하려는 데이터의 주인이 누구인지(user_id)"**를 서버 코드에서 반드시 대조하는 것이다.

---

## 5. 개발자들이 흔히 하는 착각과 방어법

자료에 따르면, 접근 제어 취약점은 개발자가 다음과 같은 안일한 생각을 할 때 주로 발생했다.

* *"프론트엔드(화면)에서 일반 사용자에게는 관리자 버튼을 안 보이게 숨겼으니 괜찮겠지?"* → **틀렸다.** 공격자는 화면을 클릭하지 않고 API 주소로 직접 요청을 보낸다.
* *"회원 번호를 `1, 2, 3` 대신 복잡한 난수(UUID)로 만들면 못 찾겠지?"* → **반만 맞다.** 추측하기 어려워질 뿐, 로그나 공유 링크 등으로 주소가 한 번 유출되면 권한 검사 없이는 속수무책으로 뚫린다.

이를 막기 위해 지켜야 할 실무 방어 원칙은 다음과 같다.

1. **기본값은 무조건 '거부(Deny by default)':** 공개되어야 하는 공지사항이나 메인 페이지를 제외하고, 모든 페이지와 API는 기본적으로 접근을 차단한 뒤 필요한 권한만 명시적으로 허용해야 한다.
2. **서버 측에서 매번 검증하기:** 모든 API 엔드포인트에서 요청을 처리하기 직전에 현재 세션의 사용자 권한을 확인해야 한다.
3. **중앙 집중식 접근 제어 모듈 사용:** 코드 곳곳에 `if user.role == 'admin':` 같은 조건문을 흩뿌려 놓으면 개발자가 실수로 하나를 빠뜨리기 쉽다. 프레임워크의 데코레이터(예: `@login_required`, `@roles_required`)나 미들웨어를 사용해 일관되게 권한을 통제해야 한다.
4. **접근 실패 로그 기록 및 알림:** 권한 없는 사용자가 반복적으로 타인의 데이터나 관리자 경로에 접근하려 시도(HTTP 403 응답 다수 발생)한다면, 이를 기록하고 관리자에게 경고를 보내 조기에 공격을 탐지해야 한다.

---

## 6. 마치며

지금까지 OWASP Top 10 2025의 가장 치명적인 위협인 'Broken Access Control'의 원리와 방어 방법을 정리해 보았다.

이번 주제를 공부하며 가장 크게 와닿은 점은 보안 사고의 시작점이 의외로 단순하다는 것이다. **"요청을 보낸 사람이 이 리소스에 접근할 권한이 있는가?"**라는 가장 기본적인 검증을 서버가 놓치는 순간, 평범한 URL 조작만으로도 개인정보 유출이나 관리자 권한 탈취 같은 돌이킬 수 없는 사고로 이어진다. 기능을 구현하는 것만큼이나 '누구에게 허용할 것인가'를 꼼꼼히 설계하는 습관이 정말 중요하다는 것을 배웠다.

---

## 참고 자료 (References)

1. **OWASP Top 10:2025 공식 한국어 문서 (A01:2025 접근 제어 실패)**  
   https://top10.owasp.org/2025/ko/A01_2025-Broken_Access_Control/
2. **OWASP Top 10:2025 소개 및 2021 대비 주요 변화 (한국어)**  
   https://top10.owasp.org/2025/ko/0x00_2025-Introduction/
3. **OWASP 서울 챕터 발표 자료 - OWASP Top 10 2025: 바뀌지 않은 것 그리고 바뀐 것 (홍성진)**  
   https://owasp.github.io/www-chapter-seoul/assets/files/2025%20Dec%20%ED%99%8D%EC%84%B1%EC%A7%84%20-%20OWASP%20Top%20Ten%202025%20-%20%EB%B0%94%EB%80%8C%EC%A7%80%20%EC%95%8A%EC%9D%80%20%EA%B2%83%20%EA%B7%B8%EB%A6%AC%EA%B3%A0%20%EB%B0%94%EB%80%90%20%EA%B2%83.pdf
4. **PortSwigger Web Security Academy - Access control vulnerabilities and privilege escalation**  
   https://portswigger.net/web-security/access-control
5. **SentinelOne 사이버 보안 가이드 - OWASP Top 10: 취약점과 위험, 해결 방법 (한국어)**  
   https://www.sentinelone.com/ko/cybersecurity-101/cybersecurity/owasp-top-10/
6. **블로그 - [T0M4TO] OWASP Top 10 - 2025 한글 리뷰**  
   https://tomatohj.tistory.com/87