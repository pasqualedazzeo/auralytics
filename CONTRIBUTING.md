# Contributing to Auralytics

Thank you for your interest in contributing to the Auralytics! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Environment](#development-environment)
4. [Project Structure](#project-structure)
5. [Coding Standards](#coding-standards)
6. [Git Workflow](#git-workflow)
7. [Pull Request Process](#pull-request-process)
8. [Testing](#testing)
9. [Documentation](#documentation)
10. [Issue Reporting](#issue-reporting)
11. [Feature Requests](#feature-requests)

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to foster an inclusive and respectful community.

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/transcription-app.git
   cd transcription-app
   ```
3. Add the original repository as a remote:
   ```bash
   git remote add upstream https://github.com/originalowner/transcription-app.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm start
   ```

## Development Environment

### Recommended Tools

- **Editor**: Visual Studio Code with the following extensions:
  - ESLint
  - Prettier
  - TypeScript React code snippets
  - Tailwind CSS IntelliSense
- **Browser**: Chrome with React Developer Tools extension

### Environment Configuration

The project uses environment variables for configuration. Create a `.env.local` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_DEBUG=true
```

## Project Structure

```
transcription-app/
├── public/                  # Static files
├── src/                     # Source code
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components
│   │   ├── shared/          # Shared UI components
│   │   └── transcription/   # Transcription-related components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── services/            # Service modules
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main App component
│   └── index.tsx            # Application entry point
└── package.json             # Project dependencies and scripts
```

### Key Directories

- **components/**: Reusable UI components
- **contexts/**: React context providers for state management
- **hooks/**: Custom React hooks for shared logic
- **pages/**: Top-level page components
- **services/**: Service modules for API calls and business logic
- **types/**: TypeScript type definitions
- **utils/**: Utility functions and helpers

## Coding Standards

### General Guidelines

- Write clean, readable, and maintainable code
- Follow the principle of single responsibility
- Keep components small and focused
- Use meaningful variable and function names
- Add comments for complex logic
- Write unit tests for your code

### TypeScript

- Use TypeScript for all new code
- Define interfaces for props, state, and data structures
- Use proper type annotations
- Avoid using `any` type
- Use type guards when necessary

### React

- Use functional components with hooks
- Keep components pure when possible
- Use React Context for global state
- Split large components into smaller ones
- Use React.memo for performance optimization when appropriate
- Follow the React hooks rules

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow the mobile-first approach
- Keep styling consistent across components
- Use semantic class names when custom CSS is necessary

### Naming Conventions

- **Files**: Use PascalCase for component files (e.g., `LoginForm.tsx`)
- **Components**: Use PascalCase for component names (e.g., `LoginForm`)
- **Functions**: Use camelCase for function names (e.g., `handleSubmit`)
- **Variables**: Use camelCase for variable names (e.g., `userEmail`)
- **Interfaces**: Use PascalCase with a prefix of `I` (e.g., `IUser`)
- **Types**: Use PascalCase (e.g., `UserType`)
- **Constants**: Use UPPER_SNAKE_CASE for constants (e.g., `MAX_RETRY_COUNT`)

### Code Formatting

The project uses ESLint and Prettier for code formatting. Run the following commands before committing:

```bash
npm run lint     # Check for linting errors
npm run format   # Format code with Prettier
```

## Git Workflow

### Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `hotfix/*`: Urgent fixes for production

### Branch Naming

- Feature branches: `feature/add-export-functionality`
- Bug fix branches: `bugfix/fix-login-validation`
- Hotfix branches: `hotfix/fix-critical-security-issue`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to the build process or auxiliary tools

Example:
```
feat(auth): add Google authentication

Implement Google OAuth authentication flow.

Closes #123
```

## Pull Request Process

1. Create a new branch from `develop` for your changes
2. Make your changes and commit them with descriptive commit messages
3. Push your branch to your fork
4. Create a pull request to the `develop` branch of the original repository
5. Fill out the pull request template with details about your changes
6. Request a review from a maintainer
7. Address any feedback from the review
8. Once approved, your pull request will be merged

### Pull Request Template

```markdown
## Description
[Describe the changes you've made]

## Related Issue
[Link to the related issue]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
[Describe the tests you ran]

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have added tests that prove my fix is effective or my feature works
- [ ] I have updated the documentation accordingly
- [ ] My changes generate no new warnings
- [ ] I have checked that there aren't other open pull requests for the same update/change
```

## Testing

### Testing Framework

The project uses Jest and React Testing Library for testing.

### Types of Tests

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test interactions between components
- **End-to-End Tests**: Test complete user flows

### Writing Tests

- Create test files with the `.test.tsx` or `.test.ts` extension
- Place test files next to the files they test
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies

### Running Tests

```bash
npm test           # Run all tests
npm test -- --watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions and components
- Document complex logic with inline comments
- Keep comments up-to-date with code changes

### Project Documentation

- Update README.md with new features and changes
- Update API_DOCUMENTATION.md when changing APIs
- Update USER_GUIDE.md when changing user-facing features
- Update DOCUMENTATION.md when changing architecture or implementation details

## Issue Reporting

### Bug Reports

When reporting a bug, please include:

- A clear and descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser and operating system information
- Any additional context

### Security Issues

For security issues, please email security@example.com instead of creating a public issue.

## Feature Requests

When requesting a feature, please include:

- A clear and descriptive title
- A detailed description of the feature
- The problem it solves
- Potential implementation ideas
- Any alternatives you've considered
- Additional context or screenshots

Thank you for contributing to the Auralytics!
