# Week 9 – Introduction to Process Automation

## CI/CD Project: TaskFlow To-Do List

This is a simple task management website developed to demonstrate a real **Continuous Integration / Continuous Deployment (CI/CD)** pipeline using **GitHub Actions**.

### Features
- Create, complete, and delete tasks
- Filter by All, Active, and Completed
- Save tasks in the browser using localStorage
- Responsive and accessible interface
- No external JavaScript dependencies

### Automated pipeline
The workflow is defined in `.github/workflows/cicd.yml`:

1. **Build:** Run `npm run build` to validate and package the website into `dist/`.
2. **Test:** Run `npm test` to execute automated Node.js unit tests.
3. **Deploy:** After Build and Test pass, publish the built website through GitHub Pages.

The pipeline runs on pushes to `main`, pull requests to `main`, and manual workflow dispatch. Deployment runs only for the `main` branch, not pull requests.

### Run locally
Requires Node.js 20 or newer. No `npm install` is required.

```bash
npm test
npm run build
```

Open `index.html` in a modern browser or serve the project with a local web server.

### Enable deployment
In the repository settings, go to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**. This may be required before the first successful deployment.

### Submission evidence
Take screenshots of the successful Build, Test, and Deploy jobs, their logs, and the published website. For a privacy-friendly report, crop out the account avatar, real name, email, and repository-owner URL while retaining the visible run results.

### Report outline
Introduction · CI/CD Tool Comparison · Implementation · Build and Test Results · Deployment · Benefits and Challenges · Conclusion
