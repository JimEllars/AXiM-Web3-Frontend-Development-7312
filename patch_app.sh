sed -i -e "/const AI = lazy(() => import('.\/pages\/AI'));/a const Tech = lazy(() => import('.\/pages\/Tech'));" src/App.jsx
sed -i -e '/<Route path="\/ai" element={<PageTransition><AI \/><\/PageTransition>} \/>/a \            <Route path="/tech" element={<PageTransition><Tech /></PageTransition>} />' src/App.jsx
