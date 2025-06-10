import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'Explain technical concepts',
    message: `What is a "serverless function"?`
  },
  {
    heading: 'Summarize an article',
    message: 'Summarize the following article for a 2nd grader: \n'
  },
  {
    heading: 'Draft an email',
    message: `Draft an email to my boss about the following: \n`
  }
]

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
			<div className="rounded-lg border bg-background p-8">
				<h1 className="mb-2 text-lg font-semibold">
					My Budget Buddy Personal Finance Assistant
				</h1>
				<p className="leading-normal text-muted-foreground">
          Ask your personal finance assistant anything to learn more about your financial position. {' '}
          <ExternalLink href="https://vercel.com/storage/kv">
            Learn more
          </ExternalLink>
          .
        </p>
			</div>
		</div>
  )
}
