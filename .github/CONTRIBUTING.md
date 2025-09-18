# Contributing Guide

## 🚀 How to Contribute

### 1. Fork and Clone

```bash
git clone https://github.com/your-username/perfumario.git
cd perfumario
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-description
```

### 3. Make Changes

- Follow the project's code conventions
- Add tests if necessary
- Update documentation if relevant

### 4. Commit

```bash
git add .
git commit -m "feat: add new feature"
# or
git commit -m "fix: fix bug in component X"
```

### 5. Push and Pull Request

```bash
git push origin feature/your-feature-name
```

## 📝 Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting changes (spaces, commas, etc.)
- `refactor:` Code refactoring
- `test:` Add or modify tests
- `chore:` Changes in tools, configuration, etc.

## 🎯 Pull Request Structure

All PRs must follow the template defined in `.github/pull_request_template.md`:

1. **Descriptive title**
2. **Clear description of the objective**
3. **List of changes made**
4. **Modified files**
5. **Testing information**
6. **Impact of changes**
7. **Review checklist**

## 🧪 Testing

- Run tests before committing
- Add tests for new features
- Ensure all tests pass

```bash
npm test
# or
yarn test
```

## 📱 Development

### Requirements

- Node.js 18+
- Expo CLI
- React Native development environment

### Installation

```bash
npm install
# or
yarn install
```

### Run in Development

```bash
npm start
# or
yarn start
```

## 🔍 Review Process

1. **Automatic**: Tests must pass
2. **Manual**: Code review by the team
3. **Approval**: At least one approval required
4. **Merge**: Only after approval

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
