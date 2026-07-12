import re

with open("src/pages/Article.jsx", "r") as f:
    content = f.read()

# 1. Add scrollPercent state
scroll_percent_code = """  const [hasLoggedCompletion, setHasLoggedCompletion] = useState(false);
  const { scrollYProgress } = useScroll();
  const [scrollPercent, setScrollPercent] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollPercent(Math.round(latest * 100));
  });"""
content = re.sub(
    r"  const \[hasLoggedCompletion, setHasLoggedCompletion\] = useState\(false\);\n  const \{ scrollYProgress \} = useScroll\(\);",
    scroll_percent_code,
    content
)

# 2. Add telemetry hooks to sidebar links
# Demand letter promo
demand_letter_find = r'href="https://quickdemandletter\.com/start"'
demand_letter_replace = r'href="https://quickdemandletter.com/start"\n               onClick={() => logTelemetry(\'sidebar_conversion_click\', { funnel: \'demand_letter\', article: slug })}'
content = re.sub(demand_letter_find, demand_letter_replace, content)

# Mutual NDA Tool Block
nda_find = r'to="/tools/nda"'
nda_replace = r'to="/tools/nda"\n                 onClick={() => logTelemetry(\'sidebar_tool_click\', { tool: \'nda\', article: slug })}'
content = re.sub(nda_find, nda_replace, content)

# Automated Pay Stub Action
paystub_find = r'to="/tools/paystub"'
paystub_replace = r'to="/tools/paystub"\n                 onClick={() => logTelemetry(\'sidebar_tool_click\', { tool: \'paystub\', article: slug })}'
content = re.sub(paystub_find, paystub_replace, content)

# 3. Add scroll progress text in the sticky action pill
sticky_pill_find = r'<div className="w-px h-6 bg-white/10" />\s*<button\s*onClick=\{handleShare\}'
sticky_pill_replace = """<div className="w-px h-6 bg-white/10" />
        <span className="text-[10px] font-mono tracking-widest text-zinc-400 select-none">{scrollPercent}% READ</span>
        <div className="w-px h-6 bg-white/10" />
        <button
          onClick={handleShare}"""
content = re.sub(sticky_pill_find, sticky_pill_replace, content)

with open("src/pages/Article.jsx", "w") as f:
    f.write(content)

print("Article.jsx patched")
