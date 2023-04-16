import merge from "./Merge.js";
import { Node } from "./Node.js";

const Tree = (array) => {
  //sort and remove duplicates
  let newArr = [...new Set(merge(array))]

  const buildTree = (arr) => {
    if (arr.length === 0) {
      return null
    }

    let middle = Math.floor(arr.length / 2)
    let node = Node(arr[middle], buildTree(arr.slice(0, middle)), buildTree(arr.slice(middle + 1)))

    return node
  }

  let root = buildTree(newArr)

  const insert = (val, node = root) => {
    if (val > node.data) {
      if (node.right) {
        insert(val, node.right)
      } else {
        node.right = Node(val)
      }
    } else {
      if (node.left) {
        insert(val, node.left)
      } else {
        node.left = Node(val)
      }
    }
  }

  const remove = (val, node = root, parent = null) => {
    if (!node) {
      return
    }

    if (val > node.data) {
      remove(val, node.right, node)
    } else if (val < node.data) {
      remove(val, node.left, node)
    } else {
      if (node.left === null && node.right === null) {
        if (node.data === parent.left?.data) {
          parent.left = null
        } else {
          parent.right = null
        }
      } else if (node.left && node.right) {
        let tmpNode = node.left
        while (tmpNode.right) {
          tmpNode = tmpNode.right
        }

        remove(tmpNode.data)

        tmpNode.left = node.left
        tmpNode.right = node.right

        if (!parent) {
          root.data = tmpNode.data
        } else if (node.data === parent.left?.data) {
          parent.left = tmpNode
        } else {
          parent.right = tmpNode
        }
      } else {
        if (node.data === parent.left?.data) {
          parent.left = node.left ?? node.right
        } else {
          parent.right = node.left ?? node.right
        }
      }
    }
  }

  const find = (val, node = root) => {
    if (val === node.data) {
      return node
    } else if (node.data > val && node.left) {
      return find(val, node.left)
    } else if (node.data < val && node.right) {
      return find(val, node.right)
    } else {
      return null
    }
  }

  const levelOrder = (callback) => {
    let queue = [root]
    let levelOrderArr = []

    while (queue[0]) {
      queue[0].left ? queue.push(queue[0].left) : null
      queue[0].right ? queue.push(queue[0].right) : null
      if (callback) {
        callback(queue[0])
      } else {
        levelOrderArr.push(queue[0].data)
      }
      queue.shift()
    }

    if (levelOrderArr.length > 0) { 
      return levelOrderArr
    }
  }

  const inorder = (callback, node = root) => {
    let arr = []

    if (callback) {
      node.left ? inorder(callback, node.left) : null
      callback(node)
      node.right ? inorder(callback, node.right) : null

    } else {
      arr = node.left ? arr.concat(inorder(null, node.left)) : arr
      arr = arr.concat(node.data)
      arr = node.right ? arr.concat(inorder(null, node.right)) : arr
    }

    if (arr.length > 0) {
      return arr
    }
  }

  const preorder = (callback, node = root) => {
    let arr = []

    if (callback) {
      callback(node)
      node.left ? preorder(callback, node.left) : null
      node.right ? preorder(callback, node.right) : null

    } else {
      arr = arr.concat(node.data)
      arr = node.left ? arr.concat(preorder(null, node.left)) : arr
      arr = node.right ? arr.concat(preorder(null, node.right)) : arr
    }

    if (arr.length > 0) {
      return arr
    }
  }

  const postorder = (callback, node = root) => {
    let arr = []

    if (callback) {
      node.left ? postorder(callback, node.left) : null
      node.right ? postorder(callback, node.right) : null
      callback(node)
    } else {
      arr = node.left ? arr.concat(postorder(null, node.left)) : arr
      arr = node.right ? arr.concat(postorder(null, node.right)) : arr
      arr = arr.concat(node.data)
    }

    if (arr.length > 0) {
      return arr
    }
  }

  const height = (node) => {
    let heightNum;
    let heightLeft = 0;
    let heightRight = 0;
    
    if (node.left) {
      heightLeft += height(node.left) + 1
    }

    if (node.right) {
      heightRight += height(node.right) + 1
    }

    if (!node.left && !node.right) {
      return 0
    }

    heightNum = heightLeft >= heightRight ? heightLeft : heightRight

    return heightNum
  }

  const depth = (node) => {
    let tmpNode = root;
    let depthNum = 0;

    while (tmpNode.data !== node.data) {
      depthNum += 1
      if (tmpNode.data > node.data) {
        tmpNode = tmpNode.left
      } else if (tmpNode.data < node.data) {
        tmpNode = tmpNode.right
      }
    }

    return depthNum
  }

  function isBalanced () {
    let queue = [root]
    let depthsArr = []

    while (queue[0]) {
      queue[0].left ? queue.push(queue[0].left) : null
      queue[0].right ? queue.push(queue[0].right) : null

      if (!queue[0].left && !queue[0].right) {
        depthsArr.push(depth(queue[0]))
      } else if(!queue[0].left) {
        depthsArr.push(depth(queue[0]))
      } else if (!queue[0].right) {
        depthsArr.push(depth(queue[0]))
      }

      if (Math.max(...depthsArr) - Math.min(...depthsArr) > 1) {
        return false
      }
      queue.shift()
    }

    return true
  }

  const rebalance = () => {
    let newRoot = buildTree(inorder())
    root.data = newRoot.data
    root.left = newRoot.left
    root.right = newRoot.right
  }

  return {
    root,
    insert,
    remove,
    find,
    levelOrder,
    inorder,
    preorder,
    postorder,
    height,
    depth,
    isBalanced,
    rebalance
  }
}

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) {
     return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
}

const tree = Tree([87, 3, 55, 20, 46, 72, 34, 98, 12, 63])

console.log(tree.isBalanced())

console.log(tree.levelOrder())
console.log(tree.preorder())
console.log(tree.postorder())
console.log(tree.inorder())


tree.insert(150)
tree.insert(99)
tree.insert(143)
tree.insert(1)

console.log(tree.isBalanced())

tree.rebalance()

console.log(tree.isBalanced())

console.log(tree.levelOrder())
console.log(tree.preorder())
console.log(tree.postorder())
console.log(tree.inorder())