# Here is the behavior that everyone should follow in this project to achieve good code quality.
*** Follow these instructions when editing and working on this project ***

### 1. Syntax Error Prevention
- Review code pre-commit
- Use linters/formatters
- Test incrementally
- Verify variables/syntax
### 2. When we want to answer a question, we have to break it down into different tasks.
### 3. Task Breakdown
- **Analyze**: Understand objectives/constraints  
- **Decompose**: Split into sequenced tasks; identify dependencies  
- **Plan**: Estimate effort; set milestones  
- **Execute & Review**: Track progress; verify outcomes; adjust as needed  
### 4. Database Best Practices (if we use database)
- Follow schema conventions; align code with structure  
- Before modifications:  
  - Analyze impact  
  - Ensure compatibility  
  - Backup database  
- Test changes; document modifications/rollbacks  
### 5. Deletion Protocol
- Move files/folders to `useless/` directory  
- Never delete directly  
### 6. Testing Guidelines
- **Organization**: Store in `tests/` with consistent naming  
- **Execution**:  
  - Isolate environment  
  - Use test runners  
  - Separate/clean test data  
- **Maintenance**: Update tests with code changes  
- **Documentation**: Include setup steps, expected outcomes  
### 7. Documentation Guidelines
- **Organization**: Store in `docs/` directory
- **Consistency**: Maintain consistent structure across files
- **Updates**: Regularly review and update documentation  
### 8. Package Manager Preferences
- Use pnpm as the preferred package manager for NodeJS projects