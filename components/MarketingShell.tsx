'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Shield from './Shield'
import { useEffect, useRef, useState, type ReactNode } from 'react'

const products = [
  ['/skillproof/', 'SkillProof', 'Try a workplace decision.'],
  ['/trustchain/', 'TrustChain', 'Inspect a fictional verification record.'],
  ['/fairhire/', 'FairHire', 'Trace a finding to its evidence.'],
] as const
const mainLinks = [['/simulations/', 'Simulations'], ['/pricing/', 'Pricing'], ['/contact/?topic=demo', 'Request an employer demo'], ['/demo/', 'Try the simulation']] as const
let motionOverride = false

function currentPage(pathname: string, href: string) {
  return pathname.replace(/\/$/, '') === href.split('?')[0].replace(/\/$/, '') ? 'page' as const : undefined
}

function Wordmark({home}: {home: boolean}) {
  return <Link href="/" prefetch={false} className="wordmark brand-lockup" aria-label="SkillChain Home" aria-current={home ? 'page' : undefined}>
    {process.env.NEXT_PUBLIC_USE_WORDMARK === 'true'
      ? <img src="/brand/template-wordmark.png" alt="SkillChain" width="132" height="38"/>
      : <><Shield/>SkillChain</>}
  </Link>
}

function Footer({ pathname, reduced, toggle }: {pathname: string; reduced: boolean; toggle: () => void}) {
  const groups = [
    ['Platform', products],
    ['Explore', [['/simulations/', 'Simulations'], ['/demo/', 'Try the simulation'], ['/pricing/', 'Pricing']]],
    ['Team', [['/about/', 'About'], ['/contact/', 'Contact']]],
    ['Policies', [['/terms/', 'Terms'], ['/privacy/', 'Privacy']]],
  ] as const
  return <footer className="marketing-footer"><div className="wrap">
    <div className="footer-columns">
      <div><Wordmark home={pathname === '/'}/><p>A workplace simulation for early-career hiring in India.</p></div>
      {groups.map(([heading, links]) => <nav key={heading} aria-label={heading}><h2>{heading}</h2>
        {links.map(([href, label]) => <Link prefetch={false} key={href} href={href} aria-current={currentPage(pathname, href)}>{label}</Link>)}
      </nav>)}
    </div>
    <div className="footer-base">{pathname !== '/' && <p>Candidates are never charged to apply or complete employer-requested assessments.</p>}
      <button type="button" onClick={toggle} aria-pressed={reduced}>Reduce motion</button>
    </div>
  </div></footer>
}

export default function MarketingShell({children}: {children: ReactNode}) {
  const pathname = usePathname()
  const previous = useRef(pathname)
  const [expanded, setExpanded] = useState(false)
  const [reduced, setReduced] = useState(false)
  const disclosure = useRef<HTMLDivElement>(null)
  const platform = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDialogElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const demo = pathname === '/demo' || pathname === '/demo/'

  useEffect(() => {
    setReduced(motionOverride)
    document.documentElement.dataset.reducedMotion = String(motionOverride)
  }, [])

  useEffect(() => {
    if (previous.current === pathname) return
    previous.current = pathname
    setExpanded(false)
    menu.current?.close()
    const frame = requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>('main h1')
      target?.setAttribute('tabindex', '-1')
      target?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  useEffect(() => {
    if (!expanded) return
    const outside = (event: PointerEvent) => {
      if (!disclosure.current?.contains(event.target as Node)) setExpanded(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpanded(false)
        platform.current?.focus()
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [expanded])

  const current = (href: string) => currentPage(pathname, href)
  const close = () => { menu.current?.close(); menuButton.current?.focus() }
  const links = (mobile: boolean) => <>
    {mainLinks.map(([href, label]) => <Link key={href} href={href} prefetch={false} aria-current={current(href)}
      className={href === '/demo/' ? 'primary' : href.startsWith('/contact/') ? 'secondary' : undefined}
      onClick={mobile ? close : undefined}>{label}</Link>)}
  </>
  const productLinks = (mobile: boolean) => products.map(([href,label,summary]) => <Link key={href} href={href} prefetch={false}
    aria-current={current(href)} onClick={() => { if (mobile) close(); else setExpanded(false) }}>
    <strong>{label}</strong><small>{summary}</small>
  </Link>)

  return <>
    <a className="skip" href="#main" onClick={() => {
      const content = document.getElementById('main')
      content?.setAttribute('tabindex', '-1')
      content?.focus()
    }}>Skip to content</a>
    {!demo && <header className="marketing-header">
      <div className="masthead wrap"><Wordmark home={pathname === '/'}/>
        <nav className="desktop-nav" aria-label="Main navigation">
          <div className="platform-disclosure" ref={disclosure} data-current={products.some(([href]) => current(href)) || undefined}>
            <button type="button" ref={platform} aria-expanded={expanded} aria-controls="platform-links" onClick={() => setExpanded(!expanded)}>Platform<span className="platform-chevron" aria-hidden="true"/></button>
            <div id="platform-links" className="platform-links" hidden={!expanded}>{productLinks(false)}</div>
          </div>
          {links(false)}
        </nav>
        <nav className="mobile-nav" aria-label="Main navigation"><Link href="/demo/" prefetch={false} className="primary">Try the simulation</Link>
          <button type="button" ref={menuButton} onClick={() => menu.current?.showModal()}>Menu</button>
        </nav>
      </div>
      <dialog ref={menu} className="menu-sheet" aria-labelledby="mobile-navigation" onCancel={event => { event.preventDefault(); close() }}>
        <h2 id="mobile-navigation">Menu</h2><button type="button" onClick={close} autoFocus>Close</button>
        <nav aria-label="Mobile navigation">
          <h3>Platform</h3>{productLinks(true)}{links(true)}
          <Link href="/about/" prefetch={false} onClick={close} aria-current={current('/about/')}>About</Link>
        </nav>
      </dialog>
    </header>}
    {children}
    {!demo && <Footer pathname={pathname} reduced={reduced} toggle={() => {
      motionOverride = !reduced
      document.documentElement.dataset.reducedMotion = String(motionOverride)
      setReduced(motionOverride)
    }}/>}
  </>
}
