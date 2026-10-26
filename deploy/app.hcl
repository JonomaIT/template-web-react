runtime    = "cloudfront"
name       = "template-web-react" # = the repo name (ADR-005): change it in the new repo
source_dir = "dist"               # what `npm run build` writes (the pipeline builds every web-* with package.json)
spa        = true                 # client-side routes: unknown paths return index.html
