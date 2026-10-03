import { fileURLToPath } from 'node:url';

function isFaqHeading(node, ctx) {
  if (node.type !== 'heading' || node.depth !== 2) return false;
  const text = ctx.textContent(node).trim();
  return /^frequently asked questions$/i.test(text) || /^faq$/i.test(text);
}

// Posts already render a FAQ component from frontmatter. Drop the matching
// in-body "FAQ" / "Frequently Asked Questions" section so the answer is not
// printed twice. App and other collections are left alone.
export function stripDuplicateFaq(ctx) {
  const path = ctx?.fileURL ? fileURLToPath(ctx.fileURL) : '';
  if (!path.includes('/content/blog/') && !path.includes('\\content\\blog\\')) return null;
  return {
    name: 'strip-duplicate-faq',
    heading(node, visitCtx) {
      if (!isFaqHeading(node, visitCtx)) return;
      const parent = visitCtx.parent(node);
      const index = visitCtx.indexOf(node);
      if (!parent || index == null) return;
      const children = parent.children || [];
      for (let i = children.length - 1; i >= index; i -= 1) {
        visitCtx.removeNode(children[i]);
      }
    },
  };
}
