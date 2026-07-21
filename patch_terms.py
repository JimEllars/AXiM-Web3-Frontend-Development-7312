import re

with open('src/pages/Terms.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import SafeIcon from '../common/SafeIcon';",
    "import SafeIcon from '../common/SafeIcon';\nimport { logTelemetry } from '../lib/telemetry';\nimport { useAximStore } from '../store/useAximStore';"
)

content = content.replace(
    "export default function Terms() {",
    "export default function Terms() {\n  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);"
)

content = content.replace(
    """          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Data privacy, terms of service, and enterprise processing agreements.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 flex flex-col md:flex-row gap-12">""",
    """          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Data privacy, terms of service, and enterprise processing agreements.
          </p>
          {isWeb3Authenticated && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-axim-purple/10 border border-axim-purple/30 text-[9px] font-mono tracking-widest text-axim-purple uppercase rounded-sm select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-axim-purple animate-pulse" />
              [COMPLIANCE_PROOF: ON-CHAIN VERIFIED]
            </div>
          )}
        </div>
      </section>

      <motion.div
        className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 flex flex-col md:flex-row gap-12"
        onViewportEnter={() => {
          logTelemetry('legal_page_viewed', { initialDoc: activeDoc });
        }}
        viewport={{ once: true, amount: 0.2 }}
      >"""
)

content = content.replace(
    """          </div>
        </div>
      </section>
    </div>""",
    """          </div>
        </div>
      </motion.div>
    </div>"""
)

content = content.replace(
    """onClick={() => setActiveDoc('tos')}""",
    """onClick={() => {\n              setActiveDoc('tos');\n              logTelemetry('legal_document_switched', { targetDocument: 'tos' });\n            }}"""
)

content = content.replace(
    """onClick={() => setActiveDoc('privacy')}""",
    """onClick={() => {\n              setActiveDoc('privacy');\n              logTelemetry('legal_document_switched', { targetDocument: 'privacy' });\n            }}"""
)

content = content.replace(
    """onClick={() => setActiveDoc('dpa')}""",
    """onClick={() => {\n              setActiveDoc('dpa');\n              logTelemetry('legal_document_switched', { targetDocument: 'dpa' });\n            }}"""
)


with open('src/pages/Terms.jsx', 'w') as f:
    f.write(content)
