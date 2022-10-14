# CV Homepage Generator

This generator takes information about your professional life and generates a German-style CV in the form of a static, responsive HTML page. It is best suited for technical/IT positions. The result can serve as your personal homepage or can be printed as a PDF file.

![resulting CV layout](docs/screenshot.png)

Special care was given to clean code, privacy (no cookies, no 3rd-party downloads of fonts for visitors) and a streamlined development/editing process. It also features [Open Graph](https://ogp.me/) tags for good-looking link previews when sharing on social media.

It all works by injecting information from a YAML file into an [EJS](https://ejs.co/) template which results in an HTML file. Styling is based on [Bootstrap 5.2](https://getbootstrap.com/).

## How to build

All processing steps are handled by [gulp](https://gulpjs.com/). It takes care of

- downloading required fonts and 3rd-party JS and (S)CSS artifacts as NPM packages,
- compiling SCSS files,
- minimizing resulting CSS and generating sourcemaps,
- rendering the EJS template, and
- serving the resulting HTML page with auto-refresh for local development.

`npm install` the external packages, then run `gulp` which by default will generate the required files and start a web server on `http://localhost:3000`.

To fill the CV with your personal details, just edit the contents of [`cv.yaml`](src/cv.yaml). Copy your photo to the [`media`](src/static/media) folder. In order to edit the structure and style of the CV, check out the [`index.ejs`](src/index.ejs) and [`cv.scss`](src/scss/cv.scss).

Serving the web page to the public can be as easy as copying the content of the `dist` folder to an [Amazon S3](https://aws.amazon.com/de/s3/) bucket and [configure public access](https://aws.amazon.com/premiumsupport/knowledge-center/read-access-objects-s3-bucket/) to it. Garnish with a custom domain on Route 53 and CloudFront distribution for a valid SSL cert and a professional look (c.f. instructions [here](https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-serve-static-website/?nc1=h_ls) and [here](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html)).

## Credits

Image and text content was created by the following AI-based generators:

- https://thispersondoesnotexist.com/
- https://www.fakepersongenerator.com/
- https://www.fakenamegenerator.com/
- https://deepai.org/machine-learning-model/text-generator
- https://app.inferkit.com/demo
