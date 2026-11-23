import type {Metadata} from 'next'
import CinematicOpening from '@/components/opening/CinematicOpening'
import { openingBootstrap, openingRuntime } from '@/components/opening/runtime'
import MarketingShell from '@/components/MarketingShell'
import './globals.css'
import './opening.css'

export const metadata:Metadata={title:'SkillChain | Workplace simulations',description:'Explore a fictional workplace simulation for early-career hiring in India.',icons:{icon:'/brand/skillchain-shield.png'}}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en-IN" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: openingBootstrap }}/></head>
    <body>
      <span id="opening-document-start" tabIndex={-1}/>
      <CinematicOpening/>
      <div id="skillchain-app" suppressHydrationWarning><MarketingShell>{children}</MarketingShell></div>
      <script dangerouslySetInnerHTML={{ __html: openingRuntime }}/>
    </body>
  </html>
}
