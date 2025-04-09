import fs from 'fs'
import path from 'path'

import type { DocContent } from './types'

// If there are the same function name in multiple files, we will keep only the one with the longest content.
export const dedupeReducer = (
  acc: DocContent[],
  curr: DocContent
): DocContent[] => {
  const existingFunction = acc.find(f => f.functionName === curr.functionName)
  if (existingFunction != null) {
    if (curr.contents.length > existingFunction.contents.length) {
      return acc.map(f => (f.functionName === curr.functionName ? curr : f))
    }
  } else {
    acc.push(curr)
  }
  return acc
}

// Recursively find all line numbers where the searchString occurs in the file
export function findLinesInFile(file: string, searchString: string): number[] {
  const lines: number[] = [] // Array to store line numbers of matches

  try {
    const fileContent = fs.readFileSync(file, 'utf8')
    const allLines = fileContent.split('\n')

    function recursiveSearch(linesArray: string[], currentIndex: number): void {
      if (currentIndex >= linesArray.length) return // Base case for recursion

      if (linesArray[currentIndex]?.includes(searchString)) {
        lines.push(currentIndex + 1) // Add the line number to the array, adjusting for zero-based index
      }

      recursiveSearch(linesArray, currentIndex + 1) // Recursive call with incremented index
    }

    recursiveSearch(allLines, 0) // Start the recursion from the first line
  } catch (error) {
    console.error(`Error reading file ${file}:`, error.message)
  }

  return lines
}

export const findFunctionNameInFile = (
  file: string,
  functionName: string
): string[] => {
  try {
    const fileContent = fs.readFileSync(file, 'utf8')
    const emitLines = findLinesInFile(file, 'emit ')
    const lines = fileContent.split('\n')
    // Check if the search string is found in the file
    if (emitLines == null) throw new Error('No events found in this file')
    const events: string[] = []
    emitLines.forEach(emitLineNumber => {
      let i = emitLineNumber - 1
      // Move up to the function definition:
      while (!lines[i]?.includes('function ') && i > 1) {
        i--
      }
      if (lines[i]?.includes('function ' + functionName + '(')) {
        return events.push(
          lines[emitLineNumber - 1].split('emit ')[1].split('(')[0]
        )
      }
    })
    return events.filter(event => event.split(' ').length === 1)
  } catch (error) {
    console.error(`Error reading file ${file}:`, error.message)
    return []
  }
}

// Explore a given directory recursively and return all the file paths
export const walkPath = (dir: string): string[] => {
  let results: string[] = []
  try {
    const list = fs.readdirSync(dir)
    list.forEach(function (file: string) {
      const filePath: string = path.join(dir, file)
      const stat = fs.statSync(filePath)
      if (stat?.isDirectory()) {
        results = results.concat(walkPath(filePath))
      } else {
        results.push(filePath)
      }
    })
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error)
  }

  return results
}
