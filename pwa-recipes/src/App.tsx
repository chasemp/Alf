import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { loadOrCreateDatabase, persistDatabase, run, exportDatabaseBlob, replaceDatabaseFromArrayBuffer, autoSchedule, getScheduleBetween } from './lib/sqlite'
import type { SqliteContext } from './lib/sqlite'

type Recipe = { id: number; title: string; url?: string | null }
type Ingredient = { id: number; recipe_id: number; name: string; quantity?: string | null }

type ScheduledRow = { id: number; date: string; recipe_id: number; title: string }

function App() {
  const [ready, setReady] = useState(false)
  const [dbRef, setDbRef] = useState<SqliteContext | null>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [ingredientName, setIngredientName] = useState('')
  const [ingredientQty, setIngredientQty] = useState('')

  const [startISO, setStartISO] = useState(() => new Date().toISOString().slice(0,10))
  const [weeks, setWeeks] = useState(2)
  const [scheduled, setScheduled] = useState<ScheduledRow[]>([])

  useEffect(() => {
    ;(async () => {
      const ctx = await loadOrCreateDatabase()
      setDbRef(ctx)
      refreshRecipes(ctx)
      refreshSchedule(ctx)
      setReady(true)
    })()
  }, [])

  function refreshRecipes(ctx = dbRef!) {
    if (!ctx) return
    const rows = run(ctx.db, 'SELECT id, title, url FROM recipes ORDER BY id DESC') as Recipe[]
    setRecipes(rows)
    if (rows.length && activeId == null) setActiveId(rows[0].id)
  }

  function refreshSchedule(ctx = dbRef!) {
    if (!ctx) return
    const start = startISO
    const endDate = new Date(start)
    endDate.setDate(endDate.getDate() + weeks*7 - 1)
    const end = endDate.toISOString().slice(0,10)
    const rows = getScheduleBetween(ctx.db, start, end)
    setScheduled(rows)
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

  async function doExport() {
    if (!dbRef) return
    const blob = await exportDatabaseBlob(dbRef.db)
    const filename = 'recipes.sqlite'
    if ('showSaveFilePicker' in window) {
      try {
        // @ts-ignore
        const handle = await (window as any).showSaveFilePicker({ suggestedName: filename, types: [{ description: 'SQLite DB', accept: { 'application/octet-stream': ['.sqlite'] } }] })
        const writable = await handle.createWritable()
        await writable.write(blob)
        await writable.close()
        return
      } catch {}
    }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function doImport() {
    try {
      if ('showOpenFilePicker' in window) {
        // @ts-ignore
        const [handle] = await (window as any).showOpenFilePicker({ multiple: false, types: [{ description: 'SQLite DB', accept: { 'application/octet-stream': ['.sqlite'] } }] })
        const file = await handle.getFile()
        const buf = await file.arrayBuffer()
        await replaceDatabaseFromArrayBuffer(buf)
      } else {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.sqlite,application/octet-stream'
        const file = await new Promise<File>((resolve, reject) => {
          input.onchange = () => {
            if (input.files && input.files[0]) resolve(input.files[0])
            else reject(new Error('No file'))
          }
          input.click()
        })
        const buf = await file.arrayBuffer()
        await replaceDatabaseFromArrayBuffer(buf)
      }
      if (dbRef) {
        // reload DB instance from persisted store
        const ctx = await loadOrCreateDatabase()
        setDbRef(ctx)
        refreshRecipes(ctx)
        refreshSchedule(ctx)
      }
    } catch {}
  }

  function generateSchedule() {
    if (!dbRef) return
    autoSchedule(dbRef.db, new Date(startISO), weeks)
    persistDatabase(dbRef.db)
    refreshSchedule()
  }

  return (
    <div className="stack">
      <h2>Recipes</h2>
      <div className="row">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="URL (optional)" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button onClick={addRecipe}>Add</button>
        <span className="actions" style={{ marginLeft: 'auto' }}>
          <button onClick={doImport}>Import .sqlite</button>
          <button onClick={doExport}>Export .sqlite</button>
        </span>
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

      <div className="card">
        <h3>Schedule</h3>
        <div className="row">
          <label>Start</label>
          <input type="date" value={startISO} onChange={(e) => { setStartISO(e.target.value); refreshSchedule() }} />
          <label>Weeks</label>
          <input type="number" min={1} max={8} value={weeks} onChange={(e) => { setWeeks(Number(e.target.value||1)); refreshSchedule() }} />
          <button onClick={generateSchedule}>Auto schedule</button>
        </div>
        <ul className="list">
          {scheduled.map(s => (
            <li key={s.id}>
              <span>{s.date}</span>
              <span style={{ marginLeft: 8 }}>{s.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
