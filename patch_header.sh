sed -i -e "/name: 'Games'/d" -e "/name: 'AI'/d" src/components/Header.jsx
sed -i -e "/name: 'Personal', path: '\/personal'/a \    { name: 'Tech', path: '\/tech' }," src/components/Header.jsx
