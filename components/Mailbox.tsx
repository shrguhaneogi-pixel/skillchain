import { incidents, welcome } from '@/lib/engine'

export function MailboxThreads({ visible, read, selected, open }: {
  visible: number[]; read: number[]; selected: number; open?: (index: number) => void
}) {
  return <aside className="threads"><h2>Mailbox</h2>
    <p role={open ? 'status' : undefined}>{visible.filter(index => !read.includes(index)).length} unread</p>
    {visible.map(index => {
      const message = index < 0 ? welcome : incidents[index]
      const content = <><small>{index < 0 ? '10:04' : incidents[index].time} IST · {read.includes(index) ? 'Read' : 'Unread'}</small>
        <strong>{message.sender}</strong>{message.subject}</>
      return open
        ? <button key={index} type="button" className={selected === index ? 'selected' : ''} onClick={() => open(index)}>{content}</button>
        : <div key={index} className={'mail-preview-row ' + (selected === index ? 'selected' : '')}>{content}</div>
    })}
  </aside>
}

export function MailboxMessage({ index }: {index: number}) {
  const message = incidents[index]
  return <>
    <div className="kicker">{message?.role ?? welcome.role} · {message?.time ?? '10:04'} IST</div>
    <h2>{message?.subject ?? welcome.subject}</h2><p><b>{message?.sender ?? welcome.sender}</b></p>
    <p className="message">{message?.question ?? welcome.text}</p>
  </>
}
