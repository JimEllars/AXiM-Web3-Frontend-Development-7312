import re

with open("src/pages/Tools.jsx", "r") as f:
    content = f.read()

# Replace the heading section
old_header = """      {/* Hero Header */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
            Proprietary <span className="text-transparent bg-clip-text bg-gradient-to-r from-axim-purple to-indigo-600">Utilities.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-10">
            A specialized collection of decentralized applications and autonomous documentation generators designed to reduce overhead and accelerate operational compliance.
          </p>
        </div>
      </section>"""

new_header = """      {/* Hero Header */}
      <section className="pt-32 pb-16 relative overflow-hidden">
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
      </section>"""

content = content.replace(old_header, new_header)

with open("src/pages/Tools.jsx", "w") as f:
    f.write(content)
