#!/bin/bash
sed -i 's/<div className="fixed inset-0 z-\[100\] flex items-start justify-center pt-\[10vh\] px-4 bg-\[#050505\]\/90 backdrop-blur-md" onClick={() => setIsOpen(false)}>/<div className="fixed inset-0 z-\[100\] flex items-start justify-center pt-20 px-4 sm:px-6 bg-\[#050505\]\/90 backdrop-blur-md" onClick={() => setIsOpen(false)}>/g' src/components/GlobalSearch.jsx
