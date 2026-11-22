import type {Metadata} from 'next'
import MarketingShell from '@/components/MarketingShell'
import ParchmentDustIntro from '@/components/ParchmentDustIntro'
import { parchmentSessionKey } from '@/lib/parchmentDust'
import './globals.css'
export const metadata:Metadata={title:'SkillChain | Workplace simulations',description:'Explore a fictional workplace simulation for early-career hiring in India.',icons:{icon:'/brand/skillchain-shield.png'}}
const restoreEntrance = `document.documentElement.dataset.parchmentReady = ''; try { if (sessionStorage.getItem(${JSON.stringify(parchmentSessionKey)}) === '1') document.documentElement.dataset.parchmentSeen = '' } catch {}`

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en-IN" suppressHydrationWarning>
    <body style={{ margin: 0, backgroundColor: '#f0e7d8' }}>
      <script dangerouslySetInnerHTML={{ __html: restoreEntrance }}/>
      <ParchmentDustIntro><MarketingShell>{children}</MarketingShell></ParchmentDustIntro>
    </body>
  </html>
}
