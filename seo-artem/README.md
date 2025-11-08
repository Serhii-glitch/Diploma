# SEO Playwright Test by Artem Goncharov

This automated Playwright test performs a basic SEO audit of the website [https://praha.itstep.org/ru](https://praha.itstep.org/ru).  
It verifies key on-page SEO elements and technical parameters important for website optimization and visibility.

### 🔍 Checks performed:
- HTTP status and presence of meta robots
- `<title>` and `<meta name="description">` tags
- H1 and H2 headers
- canonical and hreflang attributes
- structured data (JSON-LD)
- availability of robots.txt and sitemap.xml
- ratio of images without `alt` attributes

### 🧭 How to run
1. Open the test folder:
   ```bash
   cd tests/seo-artem
