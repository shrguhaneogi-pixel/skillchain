const restricted = [
  'localStorage', 'sessionStorage', 'indexedDB', 'cookie', 'fetch',
  'XMLHttpRequest', 'sendBeacon', 'WebSocket',
]

const memberRestrictions = restricted.flatMap(name => [
  { selector: `MemberExpression[computed=false][property.name="${name}"]`, message: 'Keep practice data in memory.' },
  { selector: `MemberExpression[computed=true][property.value="${name}"]`, message: 'Keep practice data in memory.' },
])

export const demoPrivacy = {
  files: ['app/demo/**/*.tsx', 'components/{Demo,Report,DemoFooter,Mailbox}.tsx', 'lib/{engine,practice-clock}.ts'],
  rules: {
    'no-restricted-globals': ['error', ...restricted],
    'no-restricted-syntax': ['error', ...memberRestrictions],
    'no-restricted-imports': ['error', {
      patterns: [{
        regex: '(analytics|telemetry|tracking|posthog|segment|mixpanel|amplitude|plausible|umami|gtag|sentry|hotjar|fullstory|clarity|heap)',
        caseSensitive: false,
        message: 'The practice workspace has no analytics imports.',
      }],
    }],
  },
}
