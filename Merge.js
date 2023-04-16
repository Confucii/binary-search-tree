export default function merge(arr) {
  if (arr.length === 1) {
    return arr
  } 

  let middle = Math.floor(arr.length / 2)

  let left = merge(arr.slice(0, middle))
  let right = merge(arr.slice(middle))
  let sorted = []
  
  while (left[0] && right[0]) {
    if (left[0] < right[0]) {
      sorted.push(left.shift())
    } else {
      sorted.push(right.shift())
    }
  }

  if (left[0]) {
    left.forEach(element => {
      sorted.push(element)
    });
  } else {
    right.forEach(element => {
      sorted.push(element)
    });
  }

  return sorted
}