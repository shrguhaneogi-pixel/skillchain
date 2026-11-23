export type PolicySection = readonly [id: string, heading: string, text: string]

export default function Policy({ title, sections, crossLink, children }: {
  title: string; sections: readonly PolicySection[]; crossLink: 'Privacy' | 'Terms'; children?: React.ReactNode
}) {
  return <main id="main" className="wrap">
    <h1>{title}</h1><p className="kicker">Draft for legal review · prototype</p>
    <div className="policy-layout">
      <nav aria-label="Contents"><h2>Contents</h2>{sections.map(([id, heading]) => <a key={id} href={'#' + id}>{heading}</a>)}</nav>
      <article className="policy-body">{sections.map(([id, heading, body]) => <section key={id} id={id}>
        <h2><a href={'#' + id}>{heading}</a></h2><p>{body}</p>
      </section>)}
      {children}
      <div className="controlrow"><a href={crossLink === 'Privacy' ? '/privacy/' : '/terms/'}>{crossLink}</a>
        <a href="/contact/?topic=privacy">Contact about privacy or a correction</a></div>
      </article>
    </div>
  </main>
}
