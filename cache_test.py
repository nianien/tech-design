#!/usr/bin/env python3
"""
Prompt caching 验证脚本
原理:对同一条带 cache_control 的大 prompt 连发两次。
  - 第1次:冷缓存,应全是 cache_creation(写)
  - 第2次:若缓存生效,应几乎全是 cache_read(读),creation≈0
对 xinapi 和官方各跑一遍,对比第2次的 read/creation,即可判定网关是否破坏缓存。

用法:
  pip install requests
  python cache_test.py
然后按提示填 base_url 和 key,或直接改下面的 ENDPOINTS。
"""

import requests, json, time, sys

# ====== 在这里填你的两个端点 ======
ENDPOINTS = {
    "xinapi":   {"base_url": "https://你的xinapi地址/v1", "api_key": "sk-xinapi-xxx"},
    "official": {"base_url": "https://api.anthropic.com/v1", "api_key": "sk-ant-xxx"},
}
MODEL = "claude-opus-4-8"   # 用你实际在跑的模型名;注意 xinapi 和官方的模型名可能不同
# =================================

# 构造一段足够长、可缓存的内容(必须超过模型最小缓存阈值,opus 约 1024 token,这里给足)
BIG_CONTEXT = ("你是一个资深后端工程师。以下是项目背景与编码规范,请记住。\n"
               + ("这是一段用于填充上下文、确保超过缓存最小阈值的示例代码与文档说明。" * 400))

def build_payload():
    return {
        "model": MODEL,
        "max_tokens": 50,
        "system": [
            {
                "type": "text",
                "text": BIG_CONTEXT,
                "cache_control": {"type": "ephemeral"}   # 关键:声明此块可缓存
            }
        ],
        "messages": [{"role": "user", "content": "用一句话回答:1+1=?"}],
    }

def call(base_url, api_key, label):
    url = base_url.rstrip("/") + "/messages"
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }
    r = requests.post(url, headers=headers, json=build_payload(), timeout=120)
    if r.status_code != 200:
        print(f"  [{label}] HTTP {r.status_code}: {r.text[:300]}")
        return None
    u = r.json().get("usage", {})
    print(f"  [{label}] input={u.get('input_tokens')} "
          f"output={u.get('output_tokens')} "
          f"cache_creation={u.get('cache_creation_input_tokens')} "
          f"cache_read={u.get('cache_read_input_tokens')}")
    return u

def run(name, cfg):
    print(f"\n===== {name} ({cfg['base_url']}) =====")
    print("第1次(预期:全是 cache_creation,cache_read=0)")
    u1 = call(cfg["base_url"], cfg["api_key"], "1st")
    if u1 is None:
        return
    time.sleep(3)  # 间隔几秒,远小于5分钟TTL,缓存应仍有效
    print("第2次(预期:若缓存生效→cache_read 大、cache_creation≈0)")
    u2 = call(cfg["base_url"], cfg["api_key"], "2nd")
    if u2 is None:
        return
    cr = u2.get("cache_read_input_tokens") or 0
    cc = u2.get("cache_creation_input_tokens") or 0
    print("  --> 判定:", end=" ")
    if cr > cc and cr > 1000:
        print("✅ 缓存命中正常(第2次走读取,便宜)")
    elif cc > cr:
        print("❌ 缓存未复用(第2次仍在重写!这条路缓存有问题)")
    else:
        print("⚠️ 结果不明确,建议多跑几次或检查最小阈值")

if __name__ == "__main__":
    for name, cfg in ENDPOINTS.items():
        if "xxx" in cfg["api_key"] or "你的" in cfg["base_url"]:
            print(f"跳过 {name}:请先在脚本里填好 base_url 和 api_key")
            continue
        run(name, cfg)
