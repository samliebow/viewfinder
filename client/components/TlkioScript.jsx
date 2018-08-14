import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactMarkdown from 'react-markdown';
import LinkRenderer from './LinkRenderer';

const removeHttp = link => {
  if (link.substring(0, 7) === 'http://') {
    return link.substring(7);
  } else if (link.substring(0, 8) === 'https://') {
    return link.substring(8);
  }
  return link;
};

const Link = ({ link }) => (
  <a href={`//${removeHttp(link)}`} target="_blank">
    {link}
  </a>
);

const TlkioScript = ({ codestitch, tlkio, zoom, name, email, startTime }) => {
  const noShowEmailSubject = `Your Hack Reactor Mock Interview Time is Currently In Progress: Connect Here`;
  const noShowEmailBody = `Hi ${name.split(' ')[0]},\n\nIt is currently time for your technical interview and we have been waiting for you.\n\nPlease connect with us in the next five minutes by going to the following URL: ${tlkio}\n\nThanks,\n`;
  const noShowGmailComposeHyperLink = `\` [\`${email}\`](https://mail.google.com/mail/?view=cm&to=${email}&su=${encodeURIComponent(noShowEmailSubject)}&body=${encodeURIComponent(noShowEmailBody)}) \``;

  return (
    <div className="tlkio-script">
      <ReactMarkdown
        source={`
  \`(Send at ${startTime ? startTime.format('h:mm') : 'start'}:) Hi ${name.split(' ')[0]} - if you are present, please input your name in the field below and press enter to join the chat. Then post a message so I know you’re here!\`

  \`(Once they've replied:) Hi! We’ll get started in just a few minutes. To get us started, can you please write your name and email in a comment in this codestitch.io pad?\` [\`${codestitch}\`](${codestitch})

  \`(Once they've written in the Codestitch:) Here’s the link to our video room:\` [\`${zoom}\`](${zoom})\`. Once you have Zoom downloaded please click the link to join. \`

  \`(Send to ${email ? noShowGmailComposeHyperLink : 'their email'} if they don't show ${startTime ? 'by ' + startTime.clone().add(5, 'minutes').format('h:mm') : 'within 5 minutes'}:) Hi ${name.split(' ')[0]}, It is currently time for your technical interview and we have been waiting for you. Please connect with us in the next five minutes by going to the following URL:\` [\`${tlkio}\`](${tlkio})

  `}
        renderers={{ link: LinkRenderer }}
      />
    </div>
  );
}

export default TlkioScript;
