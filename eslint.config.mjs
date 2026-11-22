import {defineConfig,globalIgnores} from 'eslint/config'
import next from 'eslint-config-next/core-web-vitals'
import ts from 'eslint-config-next/typescript'
import { demoPrivacy } from './eslint.demo-privacy.mjs'
export default defineConfig([...next,...ts,demoPrivacy,{rules:{'@next/next/no-img-element':'off','@next/next/no-html-link-for-pages':'off','react-hooks/set-state-in-effect':'off','react-hooks/refs':'off'}},globalIgnores(['out/**','.next/**','docs/evidence/**','test-results/**'])])
