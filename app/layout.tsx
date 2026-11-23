import type {Metadata} from 'next'
import MarketingShell from '@/components/MarketingShell'
import './globals.css'
export const metadata:Metadata={title:'SkillChain | Workplace simulations',description:'Explore a fictional workplace simulation for early-career hiring in India.',icons:{icon:'/brand/skillchain-shield.png'}}
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en-IN"><body><MarketingShell>{children}</MarketingShell></body></html>}
