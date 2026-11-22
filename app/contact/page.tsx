import RequestBuilder from '@/components/RequestBuilder'

export default function ContactPage() {
  return <main id="main" className="wrap page-split">
    <header><h1>Bring us a role your team hires for.</h1><p className="lead">Tell us what someone in the role has to decide on a difficult day.</p></header>
    <RequestBuilder/>
  </main>
}
