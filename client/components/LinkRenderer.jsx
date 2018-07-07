// Renderer for ReactMarkdown links
const LinkRenderer = props => (
  <a href={props.href} target="_blank">
    {props.children}
  </a>
);

export default LinkRenderer;
