import re

with open("src/pages/Tools.jsx", "r") as f:
    content = f.read()

# Try a simpler regex replace
new_content = re.sub(
    r'<section className="pt-32 pb-16 relative overflow-hidden">.*?</section>',
    '''<section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
              Premium Asset <span className="text-axim-purple">Generators</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm leading-relaxed">
              Access enterprise-grade document creation and digital products at a fraction of the traditional cost. Our intelligent generators provide fast, accurate, and secure assets instantly.
            </p>
          </div>
        </div>
      </section>''',
    content,
    flags=re.DOTALL
)

# Also update SEO tag
new_content = re.sub(
    r'<SEO[^>]*title="Infrastructure Tools \| AXiM Systems"[^>]*description="Access AXiM\'s suite of proprietary business infrastructure tools, including automated legal generation and payroll documentation systems."[^>]*/>',
    '''<SEO
        title="Premium Asset Generators | AXiM Systems"
        description="Access enterprise-grade document creation and digital products at a fraction of the traditional cost." customSchema={toolsSchema}
      />''',
    new_content,
    flags=re.DOTALL
)

with open("src/pages/Tools.jsx", "w") as f:
    f.write(new_content)
