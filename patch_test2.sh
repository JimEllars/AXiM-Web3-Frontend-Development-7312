sed -i -e "s/expect(enterArcadeLinks\[0\]).toHaveAttribute('href', '\/games');/expect(enterArcadeLinks\[0\].getAttribute('href')).toBe('\/games');/g" src/pages/Tech.test.jsx
