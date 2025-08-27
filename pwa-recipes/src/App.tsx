import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { loadOrCreateDatabase, persistDatabase, run } from './lib/sqlite'
import type { SqliteContext } from './lib/sqlite'

type Recipe = { id: number; title: string; url?: string | null }
type Ingredient = { id: number; recipe_id: number; name: string; quantity?: string | null }

function App() {
  const [ready, setReady] = useState(false)
  const [dbRef, setDbRef] = useState<SqliteContext | null>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [ingredientName, setIngredientName] = useState('')
  const [ingredientQty, setIngredientQty] = useState('')

  useEffect(() => {
    ;(async () => {
      const ctx = await loadOrCreateDatabase()
      setDbRef(ctx)
      refreshRecipes(ctx)
      setReady(true)
    })()
  }, [])

  function refreshRecipes(ctx = dbRef!) {
    if (!ctx) return
    const rows = run(ctx.db, 'SELECT id, title, url FROM recipes ORDER BY id DESC') as Recipe[]
    setRecipes(rows)
    if (rows.length && activeId == null) setActiveId(rows[0].id)
  }

  function addRecipe() {
    if (!dbRef || !title.trim()) return
    run(dbRef.db, 'INSERT INTO recipes (title, url) VALUES (?, ?)', [title.trim(), url || null])
    persistDatabase(dbRef.db)
    setTitle('')
    setUrl('')
    refreshRecipes()
  }

  function addIngredient() {
    if (!dbRef || !activeId || !ingredientName.trim()) return
    run(dbRef.db, 'INSERT INTO ingredients (recipe_id, name, quantity) VALUES (?, ?, ?)', [activeId, ingredientName.trim(), ingredientQty || null])
    persistDatabase(dbRef.db)
    setIngredientName('')
    setIngredientQty('')
    forceRerender()
  }

  const activeIngredients: Ingredient[] = useMemo(() => {
    if (!dbRef || !activeId) return []
    return run(dbRef.db, 'SELECT id, recipe_id, name, quantity FROM ingredients WHERE recipe_id = ? ORDER BY id', [activeId]) as Ingredient[]
  }, [dbRef, activeId, ready])

  const [, setTick] = useState(0)
  function forceRerender() { setTick((t) => t + 1) }

  async function copyIngredient(text: string) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {}
  }

  async function shareText(text: string) {
    if ((navigator as any).share) {
      try { await (navigator as any).share({ text }) } catch {}
    } else {
      await copyIngredient(text)
    }
  }

  return (
    <div className="stack">
      <h2>Recipes</h2>
      <div className="row">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="URL (optional)" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button onClick={addRecipe}>Add</button>
      </div>

      <div className="row">
        <select value={activeId ?? ''} onChange={(e) => setActiveId(e.target.value ? Number(e.target.value) : null)}>
          <option value="">Select a recipe…</option>
          {recipes.map((r) => (
            <option key={r.id} value={r.id}>{r.title}</option>
          ))}
        </select>
      </div>

      {activeId && (
        <div className="card">
          <h3>Ingredients</h3>
          <ul className="list">
            {activeIngredients.map((ing) => {
              const text = `${ing.quantity ? ing.quantity + ' ' : ''}${ing.name}`.trim()
              return (
                <li key={ing.id}>
                  <span>{text}</span>
                  <span className="actions">
                    <button onClick={() => copyIngredient(text)}>Copy</button>
                    <button onClick={() => shareText(text)}>Share</button>
                  </span>
                </li>
              )
            })}
          </ul>
          <div className="row">
            <input placeholder="Ingredient" value={ingredientName} onChange={(e) => setIngredientName(e.target.value)} />
            <input placeholder="Qty" value={ingredientQty} onChange={(e) => setIngredientQty(e.target.value)} />
            <button onClick={addIngredient}>Add ingredient</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
