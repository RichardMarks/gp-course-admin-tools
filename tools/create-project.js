const fs = require('fs')
const path = require('path')
const stream = require('stream')
const exec = require('child_process').execSync

if (process.argv.length > 2) {
  const authorName = process.env.AUTHOR_NAME || 'anonymous'
  const screenWidth = process.env.SCREEN_WIDTH || 640
  const screenHeight = process.env.SCREEN_HEIGHT || 400

  const projectName = process.argv[2]
  const projectPath = path.resolve('./projects', projectName)
  const htmlPath = path.resolve(projectPath, 'index.html')
  const jsPath = path.resolve(projectPath, 'main.js')
  const cssPath = path.resolve(projectPath, 'style.css')
  exec(`mkdir -p ${projectPath}`)

  const templateOptions = {
    authorName,
    screenWidth,
    screenHeight,
    projectName
  }

  const applyTemplates = code => {
    Object.keys(templateOptions)
      .forEach(key => {
        console.log(`replacing {{${key}}} with ${templateOptions[key]}`)
        code = code.replace(
          new RegExp(`\\{\\{${key}\\}\\}`, 'gm'),
          `${templateOptions[key]}`
        )
      })
    return code
  }

  const tr = (src, dest) => new Promise(resolve => {
    const templateTransform = new stream.Transform({
      transform (chunk, encoding, callback) {
        const codeIn = chunk.toString()
        const codeOut = applyTemplates(codeIn)
        this.push(codeOut)
        callback()
      }
    })

    fs.createReadStream(src)
      .pipe(templateTransform)
      .pipe(fs.createWriteStream(dest))
      .on('finish', () => {
        console.log(`Finished processing ${src} into ${dest}`)
        resolve()
      })
  })


  Promise.all([
    tr(path.resolve('./src/template.html'), htmlPath),
    tr(path.resolve('./src/template.css'), cssPath),
    tr(path.resolve('./src/template.js'), jsPath)
  ]).then(() => {
    console.log('Finished')
  })
} else {
  console.log('missing project name')
}
