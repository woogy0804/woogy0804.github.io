---
layout: page
title: Categories
icon: fas fa-stream
order: 1
sections:
  - name: 개발
    key: 개발
  - name: CTF/Wargame
    key: CTF-Wargame
  - name: Bug Bounty
    key: Bug Bounty
  - name: 블로그/기술문서
    key: 블로그-기술문서
  - name: 논문/컨퍼런스
    key: 논문-컨퍼런스
  - name: 공모전/자격증
    key: 공모전-자격증
---

{% for section in page.sections %}
<h2 id="category-{{ forloop.index }}">{{ section.name }}</h2>
{% assign posts = site.categories[section.key] %}
{% if posts %}
<ul>
{% for post in posts %}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
{% endfor %}
</ul>
{% else %}
<p>아직 작성한 글이 없습니다.</p>
{% endif %}
{% endfor %}
