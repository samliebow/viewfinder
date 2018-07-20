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

const TlkioScript = ({ codestitch, tlkio, zoom, name, email, startTime }) => (
  <div className="tlkio-script">
    <ReactMarkdown
      source={`
\`Hi ${name.split(' ')[0]} - if you are present, please input your name in the field below and press enter to join the chat. Then post a message so I know you’re here!\`

\`Hi! We’ll get started in just a few minutes. To get us started, can you please write your name and email in a comment in this codestitch.io pad?\` [\`${codestitch}\`](${codestitch})

\`(Send to ${email || 'their email'} if they don't show ${startTime ? 'by ' + startTime.add(5, 'minutes').format('h:mm') : 'within 5 min'}): Hi ${name.split(' ')[0]}, It is currently time for your technical interview and we have been waiting for you. Please connect with us by going to the following URL:\` [\`${tlkio}\`](${tlkio})

\`Here’s the link to our video room:\` [\`${zoom}\`](${zoom})\`. Once you have Zoom downloaded please click the link to join. \`
`}
      renderers={{ link: LinkRenderer }}
    />
  </div>
);

export default TlkioScript;
