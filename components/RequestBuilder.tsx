'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { estimate, mailDraft, prepareRequest, requestErrors, selectedTopic, topics, validEmail, type RequestFields } from '@/lib/requests'

const mailbox = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? ''
const recipient = validEmail(mailbox) ? mailbox : ''
const initial: RequestFields = { topic: 'demo', email: '', organisation: '', message: '', include: false }
const labels = { email: 'Reply email', organisation: 'Organisation', message: 'Message', include: 'Include these details in my request.', topic: 'Topic' }

export default function RequestBuilder() {
  const [fields, setFields] = useState(initial)
  const [counts, setCounts] = useState<ReturnType<typeof estimate>>(null)
  const [errors, setErrors] = useState<ReturnType<typeof requestErrors>>({})
  const [review, setReview] = useState(false)
  const [status, setStatus] = useState('')
  const summary = useRef<HTMLDivElement>(null)
  const reviewHeading = useRef<HTMLHeadingElement>(null)
  const topicInput = useRef<HTMLSelectElement>(null)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setFields(previous => ({ ...previous, topic: selectedTopic(params.get('topic')) }))
    setCounts(estimate(params.get('c'), params.get('r')))
  }, [])
  function submit(event: FormEvent) {
    event.preventDefault()
    const next = requestErrors(fields)
    setErrors(next)
    if (Object.keys(next).length) requestAnimationFrame(() => summary.current?.focus())
    else {
      setReview(true)
      setStatus('')
      requestAnimationFrame(() => reviewHeading.current?.focus())
    }
  }

  if (review) {
    const request = prepareRequest(fields, counts)
    const text = (recipient ? 'To: ' + recipient + '\n' : '') + 'Subject: ' + request.subject + '\n\n' + request.body
    function download() {
      const url = URL.createObjectURL(new Blob([text], {type: 'text/plain;charset=utf-8'}))
      const link = document.createElement('a')
      link.href = url
      link.download = 'skillchain-request.txt'
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
    return <section className="card request-review"><h2 tabIndex={-1} ref={reviewHeading}>Review request</h2>
      <pre tabIndex={0}>{text}</pre>
      {!recipient && <p>Direct delivery is not configured in this preview. You can save your request.</p>}
      <div className="controlrow">
        <button type="button" onClick={() => {setReview(false); requestAnimationFrame(() => topicInput.current?.focus())}}>Edit request</button>
        {recipient && <a className="primary" href={mailDraft(recipient, request)} onClick={() => setStatus('Your mail app may have opened. Send the message there to finish.')}>Open email draft</a>}
        <button type="button" onClick={async () => {
          try { await navigator.clipboard.writeText(text); setStatus('Request copied.') }
          catch { setStatus('Copy is unavailable. Select the request text above to copy it.'); }
        }}>Copy request</button>
        <button type="button" onClick={download}>Download request (.txt)</button>
      </div>
      <p role="status">{status}</p>
    </section>
  }

  return <form className="card contact-form" noValidate onSubmit={submit}>
    {Object.keys(errors).length > 0 && <div ref={summary} tabIndex={-1} role="alert">
      <h2>Check your request</h2><ul>{Object.entries(errors).map(([field, error]) => <li key={field}><a href={'#request-' + field}>{error}</a></li>)}</ul>
    </div>}
    <label htmlFor="request-topic">Topic<select id="request-topic" ref={topicInput} value={fields.topic} onChange={event => setFields({...fields, topic: selectedTopic(event.target.value)})}>
      {Object.entries(topics).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
    </select></label>
    {fields.topic === 'standard' && counts && <p>{counts.c.toLocaleString('en-IN')} candidates × {counts.r} runs · {counts.total.toLocaleString('en-IN')} estimated credits</p>}
    {(['email', 'organisation', 'message'] as const).map(field => {
      const props = {
        id: 'request-' + field, value: fields[field], 'aria-invalid': !!errors[field],
        'aria-describedby': errors[field] ? 'error-' + field : undefined,
        onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFields({...fields, [field]: event.target.value}),
      }
      return <label key={field} htmlFor={props.id}>{labels[field]}{field === 'organisation' && ' (optional)'}
        {field === 'message' ? <textarea {...props} required maxLength={1500} rows={5}/> : <input {...props} required={field === 'email'} type={field === 'email' ? 'email' : 'text'} maxLength={field === 'email' ? 254 : 100}/>}
        {errors[field] && <small id={'error-' + field} className="field-error">{errors[field]}</small>}
      </label>
    })}
    <p>Please leave out identity documents, candidate records and sensitive personal details.</p>
    <label className="check"><input id="request-include" type="checkbox" checked={fields.include} required aria-invalid={!!errors.include}
      aria-describedby={errors.include ? 'error-include' : undefined}
      onChange={event => setFields({...fields, include: event.target.checked})}/>{labels.include}</label>
    {errors.include && <small id="error-include" className="field-error">{errors.include}</small>}
    <p><a href="/privacy/">How request details are used</a></p>
    <button type="submit" className="primary">Review request</button>
  </form>
}
