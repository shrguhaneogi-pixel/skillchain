import type {Metadata} from 'next'
import './globals.css'
export const metadata:Metadata={title:'SkillChain | Workplace simulations',description:'Explore a fictional workplace simulation for early-career hiring in India.'}
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en-IN"><body><a className="skip" href="#main">Skip to content</a>{children}</body></html>}
