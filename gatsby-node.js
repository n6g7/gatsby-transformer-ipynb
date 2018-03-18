const crypto = require('crypto')
const nbjs = require('notebookjs')

const extensions = ['ipynb']

exports.onCreateNode = async ({
  boundActionCreators: { createNode, createParentChildLink },
  loadNodeContent,
  node
}) => {
  if (!extensions.includes(node.extension)) return

  const content = await loadNodeContent(node)
  const data = JSON.parse(content)
  const notebook = nbjs.parse(data)

  const ipynbNode = {
    id: `${node.id} >>> ipynb`,
    children: [],
    parent: node.id,
    internal: {
      content: notebook.render().outerHTML,
      type: 'ipynb'
    },
    data,
    fileAbsolutePath: node.absolutePath
  }

  ipynbNode.internal.contentDigest = crypto
    .createHash('md5')
    .update(JSON.stringify(ipynbNode))
    .digest('hex')
  createNode(ipynbNode)
  createParentChildLink({ parent: node, child: ipynbNode })
}
