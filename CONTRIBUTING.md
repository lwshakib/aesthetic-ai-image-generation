# Contributing to Aesthetic AI

First off, thank you for considering contributing to Aesthetic AI! It's people like you that make Aesthetic AI such a great tool.

## 🚀 Getting Started

### 1. Fork the Repository
- Navigate to the [Aesthetic AI GitHub repository](https://github.com/your-username/aesthetic-ai-image-generation).
- Click the **Fork** button in the top right corner.

### 2. Clone Your Fork
```bash
git clone https://github.com/your-username/aesthetic-ai-image-generation.git
cd aesthetic-ai-image-generation
```

### 3. Add Upstream Remote
Keep your fork in sync with the main repository by adding an `upstream` remote.
```bash
git remote add upstream https://github.com/original-username/aesthetic-ai-image-generation.git
```

### 4. Set Up Development Environment
- **Install Dependencies**:
  ```bash
  bun install
  ```
- **Configure Local Environment**:
  Create a `.env` file from the [README](README.md#getting-started) guide.
- **Initialize Database**:
  ```bash
  bun x prisma db push
  bun x prisma generate
  ```

### 5. Create a Feature Branch
Always create a new branch for your work. Don't work directly on `main`.
```bash
git checkout -b feature/your-awesome-feature
# or
git checkout -b fix/issue-number-description
```

## 🛠️ Contribution Workflow

### 1. Make Your Changes
Write your code, add tests, and ensure everything follows the project's aesthetic guidelines (rich UI, smooth transitions).

### 2. Commit Your Changes
Use clear and descriptive commit messages.
```bash
git commit -m "feat: add support for local image refinement"
```

### 3. Sync with Upstream
Before pushing, ensure your branch is up to date with the latest changes from `main`.
```bash
git fetch upstream
git rebase upstream/main
```

### 4. Push to Your Fork
```bash
git push origin feature/your-awesome-feature
```

### 5. Create a Pull Request (PR)
- Go to your fork on GitHub.
- Click **Compare & pull request**.
- Provide a clear description of your changes and link any related issues.

## 📋 Code Standards

- **TypeScript**: Ensure your code is type-safe.
- **Components**: Use existing UI components from `@/components/ui` where possible.
- **Linting**: Run `bun run lint` before committing.
- **Documentation**: Update the README if you add new features or change setup steps.

## 🐛 Reporting Bugs
- Use the **Bug Report** issue template.
- Include a clear description, reproduction steps, and screenshots if applicable.

## ✨ Requesting Features
- Use the **Feature Request** template.
- Explain the problem, the proposed solution, and any alternatives you've considered.

---

Thank you for contributing to the future of AI creativity!
