import PropTypes from 'prop-types';
import cn from 'classnames';
import { getPageTableOfContents } from 'notion-utils';

export default function TableOfContents({ blockMap, className, style }) {
  // Assuming blockMap has the necessary structure for getPageTableOfContents to work
  if (!blockMap || !blockMap.collection || !blockMap.block) {
    console.error('TableOfContents received undefined or incomplete blockMap');
    return null;
  }

  const collectionId = Object.keys(blockMap.collection)[0];
  const pageBlock = Object.values(blockMap.block).find(block => block.value.parent_id === collectionId);

  if (!pageBlock) {
    console.error('TableOfContents could not find the page block');
    return null;
  }

  const page = pageBlock.value;
  const nodes = getPageTableOfContents(page, blockMap);

  if (!nodes.length) {
    return null; // Return null if there are no nodes to display in the table of contents
  }

  function scrollTo(id) {
    id = id.replaceAll('-', '');
    const target = document.querySelector(`.notion-block-${id}`);
    if (!target) return;
    const top = document.documentElement.scrollTop + target.getBoundingClientRect().top - 65; // Adjust based on your page's layout
    document.documentElement.scrollTo({
      top,
      behavior: 'smooth'
    });
  }

  return (
    <aside
      className={cn(className, 'pl-4 text-sm text-zinc-700/70 dark:text-neutral-400')}
      style={style}
    >
      {nodes.map(node => (
        <div key={node.id}>
          <a
            data-target-id={node.id}
            className="block py-1 hover:text-black dark:hover:text-white cursor-pointer transition duration-100"
            style={{ paddingLeft: `${node.indentLevel * 24}px` }}
            onClick={() => scrollTo(node.id)}
          >
            {node.text}
          </a>
        </div>
      ))}
    </aside>
  );
}

TableOfContents.propTypes = {
  blockMap: PropTypes.object.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};
