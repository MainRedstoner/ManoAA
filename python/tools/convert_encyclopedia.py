"""Convert wechat/data/encyclopedia.js -> python/data/encyclopedia.py

The JS file is a single object literal: keys are bare identifiers, values are
strings / lists / dicts, and image URLs use `BASE + "/..."` string concat.
We convert it to a Python module by quoting keys (outside of string literals)
and keeping `BASE + "..."` as-is (Python evaluates it at import time, same
as the story.py converter did).

Usage: python tools/convert_encyclopedia.py
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "..", "wechat", "data", "encyclopedia.js")
DST = os.path.join(HERE, "..", "data", "encyclopedia.py")


def convert(src_text: str) -> str:
    start = src_text.index("const encyclopedia = ") + len("const encyclopedia = ")
    end = src_text.index(";", start)
    obj = src_text[start:end]

    out = []
    i = 0
    n = len(obj)
    in_str = False
    quote = None
    key_re = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")
    while i < n:
        c = obj[i]
        if in_str:
            out.append(c)
            if c == "\\" and i + 1 < n:
                out.append(obj[i + 1])
                i += 2
                continue
            if c == quote:
                in_str = False
            i += 1
            continue
        if c in "\"'":
            in_str = True
            quote = c
            out.append(c)
            i += 1
            continue
        m = key_re.match(obj, i)
        if m:
            j = m.end()
            while j < n and obj[j] in " \t":
                j += 1
            if j < n and obj[j] == ":":
                out.append('"' + m.group(0) + '"')
                out.append(obj[m.end():j])
                out.append(":")
                i = j + 1
                continue
        out.append(c)
        i += 1
    return "".join(out)


def main():
    with open(SRC, encoding="utf-8") as f:
        src = f.read()
    body = convert(src)
    py = (
        "\"\"\"ManoAA Pygame Port — Encyclopedia Data\n"
        "Converted from wechat/data/encyclopedia.js (do not edit by hand).\"\"\"\n"
        "BASE = \"gresource\"\n\n"
        "ENCYCLOPEDIA = " + body + "\n"
    )
    with open(DST, "w", encoding="utf-8") as f:
        f.write(py)
    # Validate round-trip
    ns = {}
    exec(compile(py, DST, "exec"), ns)
    enc = ns["ENCYCLOPEDIA"]
    total = sum(len(v) for v in enc.values())
    print(f"OK: {len(enc)} categories, {total} entries -> {DST}")
    for cat, items in enc.items():
        for it in items:
            assert "id" in it and "name" in it, f"bad entry in {cat}: {it}"
    print("validation passed")


if __name__ == "__main__":
    main()
