import Link from 'next/link'

export default function NotFound() {
  return <main id="main" tabIndex={-1} className="wrap">
    <h1>Page not found</h1>
    <div className="controlrow"><Link href="/" className="secondary">Home</Link><Link href="/demo/" className="primary">Try the demo</Link></div>
  </main>
}
